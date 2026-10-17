# Ari AI: nontechnical demo cues

Use the actual application, a documented local run, or a clearly labeled recording. The presentation illustrates the workflow; it does not execute an assessment. A full seven-agent scripted run must be labeled as scripted even if its tools execute real tests.

## What to show

1. **Connect authorized code.** Show the selected repository, commit, and allowed scope. Say: “Ari learns about this version of the software and what it is meant to do.”
2. **Review intended behavior.** Show a reviewer finding, the expectation it cites, and a behavioral test. Say: “The question is whether this change does what the business intended.” Show the actual result; do not substitute a made-up finding.
3. **Investigate a security weakness.** Follow the evidence through Scout, Probe, and Trace. Explain what an attacker could access and what was actually tested.
4. **Approve, repair, verify.** Show the approval, proposed diff, and independent Verify result. Explain which checks passed, failed, or remained inconclusive. The existing test suite is a regression check, not a guarantee that every feature is safe.
5. **Recognize the next change.** Show a code event triggering the appropriate reassessment or regression check. Monitoring requires a running worker; code-change monitoring is distinct from runtime intrusion detection.
6. **Open the Defense Lab.** Keep “simulation only” visible. Show the network, the recommendation, and the inputs behind that recommendation. Explain reinforcement learning as learning through trial and error in a simulated environment. No recommendation executes a production action.

## Three-part narration

“The reviewer checks intended behavior. The security team investigates and repairs weaknesses. Monitoring requests new checks as code changes. All three use shared, version-aware context.”

## What is still needed for an actual embedded or linked demo

- A working demo URL or recording that the presenter is authorized to share.
- The exact scenario and run artifacts to show, including commit and test results.
- A confirmed label for live-model, scripted-model, replayed, and simulated portions.
- A timed rehearsal and a recording fallback if the live workflow is unavailable.

## Closing narration

“AI has made it possible for anyone to build software. Our goal is to make sure anyone can build software they can trust.”

This is the product vision. Current user-impact measurements and production effectiveness remain separate validation work.
