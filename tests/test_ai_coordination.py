"""Exercise coordination against a temporary local bare remote, not GitHub."""

from concurrent.futures import ThreadPoolExecutor
import json
from pathlib import Path
import shutil
import subprocess
import sys
import tempfile
import unittest


SOURCE = Path(__file__).resolve().parents[1]


def git(cwd, *args, check=True):
    result = subprocess.run(["rtk", "proxy", "git", *args], cwd=cwd,
                            text=True, capture_output=True, timeout=30)
    if check and result.returncode:
        raise AssertionError(result.stderr + result.stdout)
    return result


def command(cwd, *args):
    return subprocess.run([sys.executable, "scripts/ai_coordination.py", *args],
                          cwd=cwd, text=True, capture_output=True, timeout=60)


class CoordinationTest(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory(prefix="ari-coordination-test-")
        self.addCleanup(self.temp.cleanup)
        self.root = Path(self.temp.name)
        self.remote = self.root / "remote.git"
        git(self.root, "init", "--bare", str(self.remote))
        self.first = self.root / "first"
        self.first.mkdir()
        git(self.first, "init", "-b", "main")
        git(self.first, "config", "user.name", "Coordination Test")
        git(self.first, "config", "user.email", "test@example.invalid")
        for name in ("scripts/ai_coordination.py", ".githooks/pre-push"):
            target = self.first / name
            target.parent.mkdir(parents=True, exist_ok=True)
            shutil.copy2(SOURCE / name, target)
        (self.first / ".githooks/pre-push").chmod(0o755)
        (self.first / "deck.txt").write_text("original\n")
        git(self.first, "add", ".")
        git(self.first, "commit", "-m", "test: initial source")
        git(self.first, "remote", "add", "origin", str(self.remote))
        git(self.first, "push", "-u", "origin", "main")
        self.second = self.root / "second"
        git(self.root, "clone", "-b", "main", str(self.remote), str(self.second))
        git(self.second, "config", "user.name", "Second Test Editor")
        git(self.second, "config", "user.email", "second@example.invalid")
        for clone in (self.first, self.second):
            result = command(clone, "setup")
            self.assertEqual(result.returncode, 0, result.stderr)

    def test_lock_push_guard_messages_and_release(self):
        # Two independent clones race. Exactly one must acquire the remote ref.
        with ThreadPoolExecutor(max_workers=2) as pool:
            futures = [pool.submit(command, clone, "claim", "--agent", agent,
                                   "--summary", "Test before-edit claim")
                       for clone, agent in ((self.first, "ai-1"), (self.second, "ai-2"))]
            results = [future.result() for future in futures]
        self.assertEqual(sum(result.returncode == 0 for result in results), 1,
                         str([(r.stdout, r.stderr) for r in results]))
        winner_index = 0 if results[0].returncode == 0 else 1
        clones = (self.first, self.second)
        agents = ("ai-1", "ai-2")
        winner, loser = clones[winner_index], clones[1 - winner_index]
        owner = agents[winner_index]
        other = agents[1 - winner_index]

        # Both editors can communicate without dropping concurrent notes.
        with ThreadPoolExecutor(max_workers=2) as pool:
            messages = list(pool.map(lambda pair: command(pair[0], "message", "--agent", pair[1],
                                                          "--summary", "Planning while checking shared state"),
                                     ((winner, owner), (loser, other))))
        self.assertTrue(all(r.returncode == 0 for r in messages), str(messages))

        # A stale/non-owning clone cannot push main even if it has a valid commit.
        (loser / "deck.txt").write_text("unclaimed change\n")
        git(loser, "add", "deck.txt")
        git(loser, "commit", "-m", "test: unclaimed edit")
        rejected = git(loser, "push", "origin", "main", check=False)
        self.assertNotEqual(rejected.returncode, 0)
        self.assertIn("No local claim", rejected.stderr)

        # Owner push succeeds; finish records the commit and releases the lock.
        (winner / "deck.txt").write_text("owner change\n")
        git(winner, "add", "deck.txt")
        git(winner, "commit", "-m", "test: claimed edit")
        premature = command(winner, "finish", "--agent", owner, "--summary", "Too early",
                            "--verification", "Not pushed")
        self.assertNotEqual(premature.returncode, 0)
        git(winner, "push", "origin", "main")
        finished = command(winner, "finish", "--agent", owner, "--summary", "Changed deck.txt",
                           "--verification", "Temporary remote integration test")
        self.assertEqual(finished.returncode, 0, finished.stderr)
        refs = git(self.root, "--git-dir", str(self.remote), "for-each-ref", "--format=%(refname)").stdout
        self.assertNotIn("refs/heads/coordination/write-lock", refs)
        entries = git(self.root, "--git-dir", str(self.remote), "ls-tree", "-r", "--name-only",
                      "refs/heads/coordination/messages").stdout.splitlines()
        records = [json.loads(git(self.root, "--git-dir", str(self.remote), "show",
                                  f"refs/heads/coordination/messages:{path}").stdout) for path in entries]
        self.assertEqual(sorted(r["type"] for r in records), ["AFTER", "BEFORE", "NOTE", "NOTE"])
        after = next(r for r in records if r["type"] == "AFTER")
        self.assertEqual(after["changed_paths"], ["deck.txt"])
        self.assertEqual(git(self.root, "--git-dir", str(self.remote), "show", "main:deck.txt").stdout,
                         "owner change\n")


if __name__ == "__main__":
    unittest.main()
