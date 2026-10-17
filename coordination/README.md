# Shared channel for four AI editors

Use `ai-1`, `ai-2`, `ai-3`, and `ai-4` as your identities. `ai-1` is the assistant that added this protocol; the other identities are available for the other three sessions. They are identities, not claims that those editors have connected.

## Shared state

- [Messages](https://github.com/SaiC123/ari-ai-presentation/tree/coordination/messages/messages): immutable BEFORE, NOTE, AFTER, and ABORT records.
- [Current lock](https://github.com/SaiC123/ari-ai-presentation/tree/coordination/write-lock): present only while an editor holds the lock. A missing branch means it is free.
- [Presentation source](../public/index.html): edit this version after synchronizing with GitHub.

The deck lives in a single HTML file. A whole-presentation lock prevents changes to shared CSS, JavaScript, and slide markup from colliding. Other AIs may review and plan while one edits, but must wait to edit or deploy. The lock is claimed using an independent Git commit and a normal Git push: two simultaneous claims cannot both win. No automatic expiry and no automatic lock stealing.

## Commands

Run from the repository root. All commands use the configured `origin` and the current GitHub credentials.

```sh
rtk proxy python3 scripts/ai_coordination.py setup
rtk proxy python3 scripts/ai_coordination.py status
rtk git pull --ff-only origin main
rtk proxy python3 scripts/ai_coordination.py claim --agent ai-2 --summary "Slide 6: improve node highlighting; touch node CSS and build logic only"
```

If the claim succeeds, edit and validate. Inspect the diff, commit, push, and deploy if necessary. Then:

```sh
rtk proxy python3 scripts/ai_coordination.py finish --agent ai-2 --summary "Changed slide 6 node sizes and connection layering" --verification "Describe the checks actually run" --deployment-url https://ari-ai-presentation.vercel.app
```

To communicate while waiting or changing scope:

```sh
rtk proxy python3 scripts/ai_coordination.py message --agent ai-3 --summary "Planning slide 11 changes; waiting for ai-2 to finish"
```

To stop intentionally without deleting your unfinished work:

```sh
rtk proxy python3 scripts/ai_coordination.py abort --agent ai-2 --summary "Stopped before publishing; unfinished work is in branch ..."
```

`finish` refuses dirty worktrees and refuses release if the exact local commit is not the latest `origin/main`. Messages are appended on a separate branch with retry-on-conflict, so simultaneous NOTES cannot replace one another. Each message includes identity, UTC timestamp, text, and relevant commit IDs.

## Push guard

`setup` installs the tracked `.githooks/pre-push` through local Git configuration. It rejects a push to `main` unless the clone has the matching local claim token and the remote lock is still owned by that claim. It does not overwrite an existing custom hooks configuration. Run setup in every clone. A normal push still rejects stale history even if someone bypasses the local guard.

## Give this to the other three AIs

> We share https://github.com/SaiC123/ari-ai-presentation. Pull the latest main, read AGENTS.md and coordination/README.md, and choose a distinct identity from ai-2, ai-3, ai-4. Run the setup and status commands. Before editing or deploying, acquire the shared lock with a BEFORE message. Read all newer changes, preserve other edits, and post AFTER with your commit, verification, and deployment before releasing the lock. Never overwrite public/index.html from a stale local copy. If the lock is held, plan/review only and post a NOTE.
