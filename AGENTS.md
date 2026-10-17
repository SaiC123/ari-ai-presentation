# Four-AI presentation editing protocol

These instructions apply to every AI working in this repository. Read them before editing. The shared source of truth is `public/index.html` in this repository, not an old Downloads or Codex output copy.

## Required workflow

1. Pick a distinct identity: `ai-1`, `ai-2`, `ai-3`, or `ai-4`. Reuse your identity throughout your task. This chat uses `ai-1`; other editors use the remaining identities.
2. Run `rtk proxy python3 scripts/ai_coordination.py setup` to install the local push guard. Read `coordination/README.md`.
3. Run `rtk proxy python3 scripts/ai_coordination.py status`. Read the current lock and recent messages. Fetch and integrate the latest `origin/main` while your worktree is clean. Never discard another editor's work.
4. Before editing, run `rtk proxy python3 scripts/ai_coordination.py claim --agent ai-1 --summary "Describe the requested change, slides, CSS/JS, and intended result"`. Substitute your identity. Proceed only if it succeeds. It atomically claims the GitHub lock and posts your BEFORE message.
5. If another AI owns the lock, do not edit shared files or deploy. Read/review, plan in your own scratch space, or post a NOTE with the `message` command. Check status before resuming. Do not steal a lock or assume it expired.
6. Edit only the requested scope. The presentation source is `public/index.html`; its local assets are in `public/`. Do not replace this file from an older copy. Preserve unrelated changes. Do not modify another AI's branch, force-push, or reset shared history.
7. Validate the change and inspect your diff. Commit and push to `main` while holding the lock. A rejected push means someone else updated the remote; stop and inspect rather than overwriting. Update your change against the new version before retrying.
8. Deploy the exact pushed commit to the existing Vercel project `ari-ai-presentation` while still holding the lock, if the task changes the live presentation. Verify the production result. Do not create another Vercel project.
9. Finish with `rtk proxy python3 scripts/ai_coordination.py finish --agent ai-1 --summary "What changed, including files and slide/build states" --verification "What you actually checked; disclose anything unverified" --deployment-url https://ari-ai-presentation.vercel.app`. It checks that the working tree is clean and the exact current commit is on `origin/main`, posts AFTER with the commit and changed paths, then releases only your lock.
10. If you cannot finish, post a NOTE explaining the blocker. Use `abort --agent ai-1 --summary "Reason and location of any unfinished work"` only when you are intentionally stopping and leaving the shared presentation safe for another editor. It releases your lock without deleting files or commits.

## Communication rules

- BEFORE: specify the intended scope before touching the shared deck.
- NOTE: announce a scope change, overlap, blocker, or finding as soon as you notice it.
- AFTER: state exact changes, commit, checks, and deployment status. Do not invent verification.
- The shared message stream is the GitHub branch `coordination/messages`; inspect it with the helper or GitHub. Coordination lock records are on `coordination/write-lock` while claimed.
- Do not send messages to unrelated chats or people. Repository messages are the communication channel for this workflow.
- An interrupted session keeps its lock. The owning AI should finish or abort when resumed; another AI must ask the user to resolve an abandoned lock.

## Presentation conventions

- 1280 × 720, 15 slides unless the user changes that requirement.
- Preserve click-forward and rewind behavior, source notes, and explicit forecast/research labels.
- No em dashes. Do not fabricate interviews, user feedback, results, or capabilities.
- The production address is https://ari-ai-presentation.vercel.app.
- Never publish using an older local output file after another AI has edited the repository source.

The GitHub lock and local push guard coordinate participating editors. All four sessions must follow this protocol; it does not change GitHub branch-protection settings or restrict the human owner.
