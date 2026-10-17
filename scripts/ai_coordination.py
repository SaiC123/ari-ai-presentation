#!/usr/bin/env python3
"""Cross-clone edit lock and append-only messages using GitHub Git refs."""

import argparse
import json
import os
from pathlib import Path
import subprocess
import sys
import tempfile
from datetime import datetime, timezone
from uuid import uuid4

LOCK = "refs/heads/coordination/write-lock"
MESSAGES = "refs/heads/coordination/messages"
AGENTS = ("ai-1", "ai-2", "ai-3", "ai-4")


def git(*args, data=None, check=True, env=None):
    result = subprocess.run(
        ["rtk", "proxy", "git", *args], input=data, text=True,
        stdout=subprocess.PIPE, stderr=subprocess.PIPE,
        env=env, timeout=60,
    )
    if check and result.returncode:
        raise RuntimeError(result.stderr.strip() or result.stdout.strip())
    return result


def output(*args, **kwargs):
    return git(*args, **kwargs).stdout.strip()


def utc():
    return datetime.now(timezone.utc).isoformat(timespec="microseconds")


def local_claim_path():
    return Path(output("rev-parse", "--absolute-git-dir")) / "ai-coordination-claim.json"


def local_claim():
    path = local_claim_path()
    if not path.exists():
        raise RuntimeError("No local claim. Run claim before editing or publishing.")
    return json.loads(path.read_text())


def remote_sha(ref):
    value = output("ls-remote", "--refs", "origin", ref)
    return value.split()[0] if value else None


def fetch_object(ref):
    value = remote_sha(ref)
    if value:
        git("fetch", "--quiet", "--no-tags", "origin", ref)
    return value


def remote_lock():
    sha = fetch_object(LOCK)
    if not sha:
        return None
    record = json.loads(output("show", f"{sha}:lock.json"))
    record["lock_commit"] = sha
    return record


def tree_commit(path, record, message, parent=None):
    blob = output("hash-object", "-w", "--stdin", data=json.dumps(record, indent=2) + "\n")
    # A private index avoids changing the editor's staged files.
    with tempfile.TemporaryDirectory(prefix="ari-coordination-") as directory:
        env = dict(os.environ, GIT_INDEX_FILE=str(Path(directory) / "index"))
        git("read-tree", parent if parent else "--empty", env=env)
        git("update-index", "--add", "--cacheinfo", f"100644,{blob},{path}", env=env)
        tree = output("write-tree", env=env)
    args = ["commit-tree", tree]
    if parent:
        args.extend(["-p", parent])
    return output(*args, data=message + "\n")


def post(kind, agent, summary, **extra):
    record = {"type": kind, "agent": agent, "utc": utc(), "summary": summary, **extra}
    stamp = datetime.now(timezone.utc).strftime("%Y%m%dT%H%M%S%fZ")
    path = f"messages/{stamp}-{agent}-{uuid4().hex[:8]}.json"
    for _ in range(6):
        parent = fetch_object(MESSAGES)
        sha = tree_commit(path, record, f"coordination: {kind} from {agent}", parent)
        result = git("push", "--porcelain", "origin", f"{sha}:{MESSAGES}", check=False)
        if result.returncode == 0:
            print(f"{kind} posted: {path}")
            return
        if remote_sha(MESSAGES) == parent:
            raise RuntimeError(result.stderr.strip() or "Message push failed.")
    raise RuntimeError("Message stream kept changing. Retry; no existing messages were replaced.")


def verify_owner(agent=None):
    claim = local_claim()
    lock = remote_lock()
    if not lock or lock["lock_commit"] != claim["lock_commit"] or lock["token"] != claim["token"]:
        raise RuntimeError("This clone does not own the current GitHub write lock. Do not push or deploy.")
    if agent and lock["agent"] != agent:
        raise RuntimeError(f"Lock belongs to {lock['agent']}, not {agent}.")
    return claim


def ensure_clean():
    if output("status", "--porcelain"):
        raise RuntimeError("Working tree is not clean. Preserve and commit your changes before this step.")


def setup():
    configured = git("config", "--local", "--get", "core.hooksPath", check=False).stdout.strip()
    if configured and configured != ".githooks":
        raise RuntimeError(f"Existing hooksPath {configured!r}; integrate the push guard without replacing it.")
    existing = Path(output("rev-parse", "--absolute-git-dir")) / "hooks" / "pre-push"
    if not configured and existing.exists():
        raise RuntimeError("Existing pre-push hook found. Integrate it with .githooks/pre-push; do not overwrite it.")
    hook = Path(".githooks/pre-push")
    hook.chmod(hook.stat().st_mode | 0o111)
    git("config", "--local", "core.hooksPath", ".githooks")
    print("Push guard enabled. Read status, sync main, then claim before editing.")


def status():
    lock = remote_lock()
    print("CURRENT LOCK:\n" + (json.dumps(lock, indent=2) if lock else "FREE"))
    sha = fetch_object(MESSAGES)
    print("\nRECENT MESSAGES:")
    if not sha:
        print("None yet.")
        return
    paths = sorted(output("ls-tree", "-r", "--name-only", sha, "messages/").splitlines())
    for path in paths[-12:]:
        print(output("show", f"{sha}:{path}"))


def claim(args):
    ensure_clean()
    existing = remote_lock()
    if existing:
        raise RuntimeError(f"LOCKED by {existing['agent']} since {existing['utc']}: {existing['summary']}")
    main = fetch_object("refs/heads/main")
    if not main:
        raise RuntimeError("origin/main is missing.")
    if git("merge-base", "--is-ancestor", main, "HEAD", check=False).returncode:
        raise RuntimeError("Your checkout lacks newer main commits. Read and integrate them before claiming.")
    record = {"agent": args.agent, "utc": utc(), "token": uuid4().hex,
              "base_main": main, "summary": args.summary, "scope": "whole-presentation"}
    sha = tree_commit("lock.json", record, f"coordination: write claim by {args.agent}")
    result = git("push", "--porcelain", "origin", f"{sha}:{LOCK}", check=False)
    if result.returncode:
        raise RuntimeError("Lock claim rejected. Another editor may have claimed it. Run status. " + result.stderr.strip())
    record["lock_commit"] = sha
    local_claim_path().write_text(json.dumps(record, indent=2) + "\n")
    post("BEFORE", args.agent, args.summary, lock_commit=sha, base_main=main)
    print(f"CLAIMED by {args.agent}. You may now edit. Hold the lock through push, deployment, and finish.")


def release(claim):
    # A lease makes deletion conditional on this exact, still-owned lock ref.
    git("push", "--porcelain", f"--force-with-lease={LOCK}:{claim['lock_commit']}", "origin", f":{LOCK}")
    local_claim_path().unlink()
    print("Write lock released. Other editors may claim it.")


def finish(args):
    owned = verify_owner(args.agent)
    ensure_clean()
    head = output("rev-parse", "HEAD")
    if remote_sha("refs/heads/main") != head:
        raise RuntimeError("Current commit is not the latest origin/main. Push or reconcile first; lock remains held.")
    changed = output("diff", "--name-only", owned["base_main"], head).splitlines()
    post("AFTER", args.agent, args.summary, commit=head, changed_paths=changed,
         verification=args.verification, deployment_url=args.deployment_url,
         lock_commit=owned["lock_commit"])
    release(owned)


def check_push():
    for line in sys.stdin:
        parts = line.split()
        if len(parts) == 4 and parts[2] == "refs/heads/main":
            verify_owner()
            if parts[1] == "0" * 40:
                raise RuntimeError("Deleting main is forbidden by this coordination guard.")


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    sub = parser.add_subparsers(dest="command", required=True)
    for name in ("setup", "status", "check-push"):
        sub.add_parser(name)
    for name in ("claim", "message", "finish", "abort"):
        command = sub.add_parser(name)
        command.add_argument("--agent", choices=AGENTS, required=True)
        command.add_argument("--summary", required=True)
        if name == "finish":
            command.add_argument("--verification", required=True)
            command.add_argument("--deployment-url", default="")
    args = parser.parse_args()
    root = output("rev-parse", "--show-toplevel")
    os.chdir(root)
    if args.command == "setup":
        setup()
    elif args.command == "status":
        status()
    elif args.command == "claim":
        claim(args)
    elif args.command == "message":
        post("NOTE", args.agent, args.summary)
    elif args.command == "finish":
        finish(args)
    elif args.command == "abort":
        owned = verify_owner(args.agent)
        post("ABORT", args.agent, args.summary, lock_commit=owned["lock_commit"],
             working_commit=output("rev-parse", "HEAD"), dirty=bool(output("status", "--porcelain")))
        release(owned)
    else:
        check_push()


if __name__ == "__main__":
    try:
        main()
    except (RuntimeError, subprocess.TimeoutExpired, OSError, ValueError) as error:
        print(f"STOP: {error}", file=sys.stderr)
        sys.exit(1)
