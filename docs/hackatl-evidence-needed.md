# Ari AI — Evidence needed to finish the pitch

The problem definition, explicit AI-theme connection, target-user hypothesis, core action, and intended value are now in the deck. Slides 5 and 9 contain clearly marked slots for the evidence below. Existing interview notes, observations, or feedback can be used; there is no need to collect every type of evidence listed in the rubric.

## 1. Customer conversations — highest priority

Aim for 3–5 relevant founder-developers or engineers at small SaaS teams. Report the actual sample, even if it is smaller. Avoid interviewing only teammates building Ari.

Ask about their experience before showing the solution:

1. Walk me through the last change you shipped. Where did AI help?
2. How did you check that change for security issues? Who did the checking?
3. Tell me about the last security concern or warning you investigated. What happened next?
4. What takes the most effort, and what do you do when there is not enough time?
5. Which tools do you currently use and pay for? What would make you change that workflow?

Capture this for each person:

```text
Participant name or anonymous label:
Role / team size / product type:
AI coding tools and release frequency:
Who handles security today:
Specific recent example:
Current workaround:
Exact quote:
Date and notes source:
Can we use the quote in the pitch, and with what attribution?:
What contradicted our assumptions?:
```

Use the actual denominator for patterns: “2 of 3 people interviewed,” rather than turning a small convenience sample into a population claim. The founder story remains a fictional composite unless it is rebuilt around an actual participant.

## 2. Observe one person using the prototype

Give a relevant user a task: inspect the authorization finding, locate its evidence, explain the proposed fix, and find the approval action. If the live workflow is unavailable, use a clearly labeled local replay and record that condition.

Observe without coaching first. Record:

```text
Participant / date:
Build or commit used:
Live, scripted, or replayed conditions:
Task attempted:
Task completed independently? / assistance required:
Time taken:
Where they hesitated or misunderstood:
What evidence they trusted or questioned:
Exact feedback quote:
Product change made because of that feedback:
```

Ask afterward: “What happened here?”, “What would you do next?”, and “What evidence would you need before approving this?” A teammate walkthrough is internal testing; label it accordingly.

## 3. One reproducible technical result

Supply the existing run log, test output, screenshot, or recording if available. Capture:

```text
Authorized repository / commit:
Bug and scope:
Evidence that the attack path works before the patch:
Proposed change / approval:
Independent verification result after the patch:
Regression tests passed / failed:
Elapsed time / model cost:
Live-model, scripted-model, or replayed transport:
Known limitations:
Artifact path or link:
```

For time saved, compare a documented baseline with Ari on comparable work and disclose the conditions and sample. Without a baseline, report measured run time only. Do not claim that a passing test prevents every breach.

## 4. Mentor feedback — useful supporting evidence

Send the mentor's role or relevant expertise, what they reviewed, the date, exact feedback, and what changed because of it. A mentor assessment supports a specific claim; it is not customer adoption or proof of willingness to pay.

## 5. Optional pricing and survey evidence

Ask about current spending and buying decisions before suggesting Ari prices. Record whether a participant expressed interest, agreed to a pilot, or paid; these are different outcomes. Survey results need the actual wording, respondent count, recruitment method, and dates.

## What to send first

The smallest useful package is three conversation summaries, one observed prototype session, and one documented before/after technical run. Partial evidence is still useful: send what exists and the deck will reflect its exact strength. Quotes, times, customer counts, and outcomes stay pending until supported.

## Rubric mapping

| Criterion | Deck location | Evidence still needed |
|---|---|---|
| Problem definition | Slide 5 opening | Customer examples that validate the proposed workflow gap |
| User understanding | Slide 5 persona + research stage | Actual words, behavior, constraints, and workarounds |
| Evidence of need | Slide 4 sources + slide 5 research stage | Target-user findings and, if available, mentor feedback |
| Theme relevance | Slide 5 AI-to-unmet-need comparison | Examples of how AI changed participants' work |
| Meaningful user impact | Slide 9 action + before/after stages | Task success, measured time, and feedback on trust |
