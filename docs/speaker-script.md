# Ari non-demo speaker script

643 whitespace-separated spoken words; 682 with compounds and decimal values split, within the 700-word cap. Includes Vihaan’s brief demo introduction. The full prototype demonstration and Q&A are excluded. This is a script budget, not a timed rehearsal.

Aligned to the current 21-slide deck. Code reviewer9, seven agents10, Defense Lab11, red/blue verification12, prototype14, reported feedback15, financials16. Defense Lab metrics are held-out simulation results, not production outcomes. Speaker notes match these passages.

## Slide 1 · Sarosh

Meet a hypothetical founder after AI. Four-point-two million raised. Twelve thousand customers. Thirty deployments a week. Zero security hires. All vibe-coded. Everything works.

## Slide 2 · Sarosh

Until one missing permission check lets someone read another customer’s data.

## Slide 3 · Sarosh

Then everything breaks. Customers leave. Jobs disappear. The company closes with an illustrative two-point-four million owed. People’s livelihoods and customers’ trust are at stake.

## Slide 4 · Sarosh

Working code isn’t security proof. Veracode’s 2025 benchmark found 45% of generated samples failed security tests. Separately, Check Point reported roughly 70% more attack attempts from 2023 to 2025. That doesn’t establish causation.

## Slide 5 · Sarosh

Software changes daily. Our problem: small teams can build faster with AI than they can fully check. Security still needs proof.

## Slide 6 · Sarosh

Our proposed customer: founder-led SaaS startups using AI without dedicated security staff. We’ll validate their review capacity, evidence needs, and code-privacy concerns.

## Slide 7 · Srihith

This is Ari.

## Slide 8 · Srihith

Ari is an AI engineering and security team, designed to check every code change: review, investigate, and keep watching. Every claim needs evidence.

## Slide 9 · Srihith

The reviewer learns intended behavior from docs, comments and tests. It checks changes, writes a test that reproduces the bug, and drafts the smallest fix. Here, it spots a missing ownership check.

## Slide 10 · Srihith

Seven agents each have one job and only its required tools. They pass proof like a relay, testing in an isolated app copy. Our HackATL contribution connects context, orchestration and independent verification using third-party models.

## Slide 11 · Srihith

Defense Lab monitors changes and trains a defender in a practice network. Across 1,500 held-out simulated episodes, 7.1% reached the attack goal, versus 100% without defense. Service uptime was 94.4%. Average containment took 25.6 steps versus 158.3 with simple rules. The tradeoff: 75% of disruptive interventions hit not-yet-compromised services. These are simulation results. It recommends; people decide.

## Slide 12 · Srihith

Nothing merges without human approval. No AI output counts as proof. Including ours.

## Slide 13 · Srihith

Nine competitors offer overlapping capabilities. Our proposed value connects intent, investigation, approved repair, and independent verification for small teams. Assessment costs and human review are tradeoffs. Comparative performance remains unvalidated.

## Slide 14 · Srihith

Here’s the demo replay: repository, ownership bug, repair, then before-and-after tests. These screenshots aren’t a new assessment. Full-chain AI responses are scripted; product usability needs testing.

## Prototype after slide 14 · Vihaan

I’ll identify which parts are live, recorded, scripted, or simulated.

## Slide 15 · Sai

Five permitted emails report outcomes we haven’t independently rerun. Jordan says the injection stopped while existing search tests passed. Samira requested clearer permissions and code-processing explanations. That’s our next planned improvement.

## Slide 16 · Sai

Pilot plans: $49.99 for seven assessments, $129.99 for twenty, and $359.99 for sixty. Growth delivery costs about $81, leaving 38% before shared expenses. Month one: fifty free pilots, costing $2,115; no new free pilots afterward. Conversion is unmeasured: 18.2% is an outside proxy. Forty-two monthly paid additions is a ChartMogul-derived target, not traction. Conditional monthly coverage: month two; cumulative recovery: month four. Founder pay, paid acquisition and extra usage are excluded.

## Slide 17 · Sai

Census software-publisher proxies at Growth pricing imply $20.7 million annually, with a $6.6 million starting segment. Accounts need qualification. Our 100–200-customer target represents $156,000–$312,000 annually, not traction.

## Slide 18 · Sai

Through founder outreach and accelerators, our first goal is one hundred targets, thirty calls, ten design partners, fifty free pilot workspaces, and three total paid accounts. Free pilots stop after month one. Each pilot records outcomes, verification, costs, support time, and willingness to pay.

## Slide 19 · Sai

Month one: live-provider evidence and fifty pilot records. Months two and three: paid decisions and measured contribution. Months four to six: isolation and reliability before multi-repository expansion. Owners review weekly. Failed gates mean narrower scope or repricing. Enterprise waits for controls and support.

## Slide 20 · Sarosh

Six founders bring Georgia House business-growth research, MIT agentic research, Georgia Tech reinforcement learning and industrial engineering, Apex146 software engineering, and 3Lines venture-capital experience.

## Slide 21 · Sarosh

AI gave a founder the power to build. Trust takes evidence. From the first line of code to the next release: investigation, approved repair, and independent verification. We’re seeking five qualified SaaS design partners for authorized, scoped pilots. That’s Ari.
