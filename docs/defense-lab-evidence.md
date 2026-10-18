# Defense Lab presentation evidence

Reviewed October 18, 2026 against the local product checkout at `164e0c8917bb89add7d1ce9fe8602dcef6476ed5`. This review read existing outputs. It did not train or rerun an agent.

Primary artifact: [protocol-v1 evaluation table](https://github.com/adamissac/hackatl-agentic-security/blob/main/rl-defense/results/protocol-v1/eval_table.md). Related methodology: `rl-defense/README.md`, `rl-defense/results/protocol-v1/COMPARISON.md` and `rl-defense/rl_defense/evaluate.py`.

## Reported simulation results

Five training seeds × 100 episodes × three held-out configurations = 1,500 evaluation episodes for the learned policy. These reuse three scenario configurations and 100 evaluation seeds across trained policies. They are not 1,500 distinct real-world attack techniques. The evaluation configurations and seeds are held out from training/selection.

| Metric | Learned defender | Comparison |
| --- | --- | --- |
| Compromise | 7.1%, 95% CI 4.1–11.2% | No defense: 100%; simple rules: 83% |
| Service uptime | 94.4%, 95% CI 93.5–95.4% | Simple rules: 93.3% |
| Time to containment | 25.6 steps, 95% CI 20.9–32.6 | Simple rules: 158.3 steps |
| False disruption | 75%, 95% CI 69.6–79.8% | Simple rules: 28.7% |

Confidence intervals are across five training seeds. Steps are simulation steps, not seconds. Time to containment starts at first foothold, requires all nodes clear for ten consecutive steps, is censored at the horizon, and excludes episodes with no foothold. Do not call this stopping every attack in 25.6 steps. The uptime comparison with rules is not statistically significant in the supplied table.

False disruption means disruptive interventions aimed at services that are not yet compromised. This limitation is visible on slide 11 and spoken in its narration. The simulator uses an abstract adversary and five-node topology; results do not establish production effectiveness. The inference adapter recommends actions and has no execution path onto a real system.

## Product wording boundaries

- Continuous code-change monitoring requests fresh checks when configured workers operate. “Monitor 24/7” describes the operating aim, not measured service uptime. The 94.4% result describes simulated services, not Ari's hosting availability.
- Code review retrieves codebase context and learns confirmed intent from documentation, docstrings/comments and tests. Unconfirmed intent remains a hypothesis. A bounded reproducible test supports a finding; not every change is guaranteed exhaustively checked.
- The reviewer drafts a minimal, approval-gated repair. Independent Verify supplies verification. Model prose is not proof.
- Each security agent has a bounded role and permission-controlled tools. Docker sandbox mode disables network; local development drivers do not provide the same network isolation. The deck's isolated-copy wording describes the sandbox workflow, not a claim that every deployment has Docker configured.
- The product screenshots are unmodified static interface captures. Displayed statuses are not newly executed assessments by this presentation editor.

The supplied video description informs slide content, not an independent evidence source. Its chapter timestamps and social hashtags are not pitch-slide content.
