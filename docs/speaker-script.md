# Ari non-demo speaker script

650 whitespace-separated words; 675 with compounds and decimal values split. Full demo and Q&A excluded. Not a timed rehearsal.

19slides. Team-backgrounds slide removed; graphic finale is19. Sarosh1–6 and19; Srihith7–13, including prototype13; Sai14–18. Other spoken passages unchanged.

## Slide 1 · Sarosh

Meet a hypothetical founder after AI. Four-point-two million raised. Twelve thousand customers. Thirty deployments a week. Zero security hires. All vibe-coded. Everything works.

## Slide 2 · Sarosh

Until one missing permission check lets someone read another customer’s data.

## Slide 3 · Sarosh

Then everything breaks. Customers leave. Funding disappears. Eighteen jobs are lost. The company closes with an illustrative two-point-four million owed. People’s livelihoods and customers’ trust are at stake.

## Slide 4 · Sarosh

Working code isn’t security proof. Veracode’s 2025 benchmark found 45% of generated samples failed security tests. Separately, Check Point reported roughly 70% more attack attempts from 2023 to 2025. That doesn’t establish causation.

## Slide 5 · Sarosh

Software changes daily. Small teams can build faster with AI than they can fully check. That’s the problem: security still needs proof.

## Slide 6 · Sarosh

Our customer hypothesis is small, founder-led SaaS startups using AI without dedicated security staff. Their priorities: review time, expertise, clear evidence, and code privacy.

## Slide 7 · Srihith

This is Ari.

## Slide 8 · Srihith

Ari is an AI engineering and security team built around one principle: don’t just flag problems. Show the evidence, help repair the code, and independently check the result.

## Slide 9 · Srihith

The reviewer learns intended behavior from docs, comments and tests. It checks each commit, writes a test that reproduces the bug, and drafts the smallest fix. Here, it spots a missing ownership check.

## Slide 10 · Srihith

Three teams: Red finds and proves attacks. Blue fixes and fortifies. Independent Verify checks repairs. Scout maps weaknesses. Probe tests them. Trace connects the attack path. Diagnose finds the cause. Patch proposes repairs. Fortify adds guardrails. Verify retests on a fresh checkout. Agents get only their required tools. Tests use isolated app copies; people approve changes. Our HackATL contribution connects context, orchestration and verification. No AI output counts as proof. Including ours.

## Slide 11 · Srihith

Defense Lab is the ongoing layer, designed for 24/7 monitoring: watching changes, triggering fresh checks and recommending defenses. People decide.

## Slide 12 · Srihith

GitHub, Semgrep and Snyk illustrate this crowded market. Our proposed advantage is the connected workflow, not unique individual features. Costs and human review are tradeoffs. In early pitch feedback, a Kairo founder highlighted keeping checks current; a Stanford student valued fixing and checking changes. That’s feedback, not comparative validation.

## Slide 13 · Srihith

Here’s our prototype replay: choose a repository, inspect the ownership issue, then the repair and before-and-after tests. I’ll distinguish live, recorded, scripted and simulated parts.

## Slide 14 · Sai

Five emails report billing retries, SQL injection, workspace access, error disclosure and upload-path fixes. These aren’t independently audited. Samira requested clearer permissions and code-processing explanations. That’s our next improvement. Jordan reports about twenty minutes, 78 regression tests and twelve new injection tests passing in staging.

## Slide 15 · Sai

Pilot plans: $49.99 for seven assessments, $129.99 for twenty, and $359.99 for sixty. Growth delivery costs about $81, leaving 38% before shared expenses. Month one: fifty free pilots, costing $2,115; none start afterward. Conversion and acquisition are unvalidated assumptions, using outside benchmarks. Conditional monthly coverage: month two; cumulative recovery: month four. Six founders fund $500 monthly tools, take no salaries and reinvest surplus. Paid acquisition and extra usage are excluded.

## Slide 16 · Sai

Census software-publisher proxies imply a $20.7 million annual market, narrowing to $6.6 million for smaller firms. Our 100–200-customer target represents $156,000–$312,000 annually at Growth pricing. These accounts still need qualification.

## Slide 17 · Sai

Our adoption plan: founder outreach and accelerators, authorized setup, scoped defense, then verification and a pay decision. Targets are one hundred contacts, thirty calls, ten design partners, fifty free pilot workspaces and three paid accounts. Measure outcomes, costs and support time before expanding.

## Slide 18 · Sai

Today: local prototype evidence. Month one: live-provider evidence and fifty pilot records. Months two and three: paid decisions and measured contribution. Months four to six: isolation and reliability before multi-repository expansion. Failed gates mean fixing, narrowing or repricing. Enterprise waits for controls and support.

## Slide 19 · Sarosh

AI empowered founders to build. One unchecked flaw can break that progress. Seven specialists investigate. Red, Blue and Verify turn findings into checked repairs. Affordable pilots test the business. Evidence gates guide expansion. Ari connects it all, from the first change to the next release. That’s Ari.
