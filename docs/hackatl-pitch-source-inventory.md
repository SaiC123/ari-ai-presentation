# Ari AI HackATL Pitch — Source Inventory

Accessed October 17, 2026. Forecasts and fictional story figures are explicitly separated from external facts below.

## Revised deck assumptions — current version

These figures supersede the initial financial and market scenarios documented below.

Slide 4 now charts cyberattack attempts, with no business-application series: **1,158 (2023), 1,673 (2024), 1,968 (2025)** average weekly attempts per organization. The roughly **70%** increase is supported by [Check Point’s 2026 report announcement](https://checkpoint.com/tw/press-releases/check-point-softwares-2026-cyber-security-report-shows-global-attacks-reach-record-levels-as-ai-accelerates-the-threat-landscape/). The middle observation comes from the [2025 Cyber Security Report](https://engage.checkpoint.com/2025-cyber-security-report/items/report--cyber-security-report-2025); the starting observation comes from [Check Point’s 2023 analysis](https://blog.checkpoint.com/research/check-point-research-2023-the-year-of-mega-ransomware-attacks-with-unprecedented-impact-on-global-organizations/amp/). These are observed attempts in vendor telemetry, not successful breaches, a global census, or evidence of causation by AI coding.

Current proposed subscriptions are **Founder $99/month (2 assessments), Growth $299/month (8), Scale $799/month (25)**. Additional assessments are proposed at **$25** with explicit usage budgets. Repository limits are 1/5/15. Prices and customer willingness to pay still need pilot validation.

The conservative $11/assessment assumption remains. Modeled monthly costs include Stripe at 2.9% + $0.30 and support/storage allocations of $5/$12/$30:

| Tier | Revenue | Cost | Contribution | Margin |
|---|---:|---:|---:|---:|
| Founder | $99 | $30.17 | $68.83 | 69.5% |
| Growth | $299 | $108.97 | $190.03 | 63.6% |
| Scale | $799 | $328.47 | $470.53 | 58.9% |

At a 40/45/15 mix, monthly revenue per customer is **$294**, modeled cost is **$110.375**, and contribution is **$183.625 (62.5%)**. With **$31,250 fixed monthly burn**, break-even is **170.18 customers**, rounded up to **171**. This deliberately replaces the earlier 46-customer scenario. The $750K/18-month funding proposal and founder-heavy compensation assumptions remain forecasts.

Using the revised Growth annual value of **$3,588**, the unchanged Census account proxies produce **$47.55M** (13,254 firms), **$15.23M** (4,246 firms), and **$179,400** (50 target customers). The earlier $11,988 ACV scenario below is historical and no longer appears in the current deck.

## Slide 1 — Fictional founder

- `$4.2M raised`, `12K customers`, `30 deploys/week`, and `0 security hires` are fictional storytelling assumptions for a composite founder. They are not interview results or claims about a real company.
- Developer interviews are still in progress; the deck labels them as a placeholder rather than inventing quotes.

## Slides 2–3 — Fictional breach scenario

- The missing resource-ownership check is an IDOR/BOLA-style scenario chosen because Ari is designed to reason about authorization paths.
- `$2.4M owed` and every consequence attached to the founder are fictional scenario assumptions, not a real case study.

## Slide 4 — Evidence of need

| Claim | Value used | Source | Notes |
|---|---:|---|---|
| Average global breach cost | `$4.44M` | [IBM, 2025 Cost of a Data Breach announcement](https://newsroom.ibm.com/2025-07-30-ibm-report-13-of-organizations-reported-breaches-of-ai-models-or-applications%2C-97-of-which-reported-lacking-proper-ai-access-controls) | Global average reported by IBM for 2025. |
| Developers using or planning to use AI tools | `84%` | [Stack Overflow 2025 Developer Survey](https://survey.stackoverflow.co/2025/) and [survey announcement](https://stackoverflow.co/company/press/archive/stack-overflow-2025-developer-survey/) | Developer population; not a percentage of startup founders. |
| U.S. business applications | `5.637M` in 2025 | [FRED series BABATOTALSAUS](https://fred.stlouisfed.org/series/BABATOTALSAUS), sourced from U.S. Census Business Formation Statistics | Applications for an EIN are a formation-attempt proxy, not a count of software startups. |

Annual values plotted: 2019 `3.518M`; 2020 `4.380M`; 2021 `5.409M`; 2022 `5.084M`; 2023 `5.489M`; 2024 `5.247M`; 2025 `5.637M`. That is a `60.2%` increase from 2019 to 2025, with real dips preserved rather than drawing a false monotonic line.

## Slides 6–9 — Product and prototype truth

Repository inspected: `work/hackatl-agentic-security`.

- Seven roles — Scout, Probe, Trace, Diagnose, Patch, Fortify, Verify: `docs/07_SEVEN_AGENT_CYBERTEAM.md`, `security-agents/security_agents/agents/__init__.py`, and `security-agents/README.md`.
- Red Team — Scout, Probe, Trace. Blue Team — Diagnose, Patch, Fortify. Verify is intentionally independent and reruns evidence in a fresh environment.
- Current proof — local M7 flow with a signed push, reassessment, pinned commit, seven-role review, human approvals, patches, independent Verify, regression records, and an event-log/audit chain: `docs/devin_qa/m7/DEMO_EXECUTION_REPORT.md` and `coordination/MILESTONES.md`.
- Usability — guided next action, live timeline, budget meter, approval inbox, evidence chain, exact SHA links, hash-checked diff, and reload persistence: `frontend/README.md`.
- Accessibility implemented — skip link, visible keyboard focus, reduced-motion support, semantic labels, and glyph-plus-text status badges: `frontend/app/layout.tsx`, `frontend/app/globals.css`, `frontend/components/ui/index.tsx`, `frontend/tests/unit/brand-ui.test.tsx`, and `frontend/tests/e2e/brand.spec.ts`.
- Limitations — the complete M7 model turns use scripted/fake transport; there is no complete live-provider seven-role trace, production deployment, or public URL yet. Real GitHub App installation-token flow and real-user pilot validation remain future work. The deck does not claim formal WCAG certification.

## Slide 10 — Pricing, costs, sustainability, and funding

### External pricing anchors

- [Semgrep pricing](https://semgrep.dev/pricing/): Teams Code listed at `$30/contributor/month` when researched.
- [GitHub Advanced Security / Code Security](https://github.com/security/advanced-security): Code Security listed at `$30/active committer/month` when researched.
- [Snyk plans](https://snyk.io/plans/): Team listed at `$25/month`; AI Pentesting uses assessment credits, with 4,000 credits per assessment and a stated `$1` per credit when researched.

Ari’s Founder `$299`, Growth `$999`, and Scale `$2,499` monthly plans are management forecasts to test in pilots—not published prices or booked revenue.

### Model, sandbox, storage, and payments

- [Anthropic pricing](https://platform.claude.com/docs/en/about-claude/pricing): current list prices include Claude Sonnet 5.5 at `$2/MTok` input and `$10/MTok` output, and Claude Opus 5.5 at `$4/MTok` input and `$20/MTok` output. The repository’s `.env.example` caps an assessment at 400K tokens and `$10`; the deck treats `$10` as a conservative cap, not a measured production average.
- [AWS Fargate pricing](https://aws.amazon.com/fargate/pricing/): a 2 vCPU / 4 GB / 30-minute Linux task is approximately `$0.05` in raw compute before other services. The model reserves a full `$1` per run for sandbox, storage, integration, and telemetry overhead.
- [Amazon S3 pricing](https://aws.amazon.com/s3/pricing/): S3 Standard begins around `$0.023/GB-month` in common U.S. regions, before request and transfer charges.
- [Stripe pricing](https://stripe.com/pricing/): `2.9% + $0.30` per successful domestic card transaction was used.

Conservative variable-cost assumption: `$11/assessment` (`$10` model cap + `$1` infrastructure buffer).

| Forecast tier | Assessments/month | Monthly price | Modeled variable + payment + support cost | Contribution | Contribution margin |
|---|---:|---:|---:|---:|---:|
| Founder | 4 | `$299` | `$58.95` | `$240.05` | `80.3%` |
| Growth | 20 | `$999` | `$269.25` | `$729.75` | `73.0%` |
| Scale | 60 | `$2,499` | `$782.75` | `$1,716.25` | `68.7%` |

Blended forecast assumes a 40% Founder / 45% Growth / 15% Scale mix: `$944` average monthly revenue, `$262` modeled customer cost, `$682` contribution, and a `72.2%` contribution margin.

Break-even forecast: `$31,250` fixed monthly burn divided by `$682` blended contribution equals `45.8`, rounded to **46 customers**. At 46 customers, modeled monthly revenue is about `$43.4K` and modeled total monthly cost is about `$43.3K`.

### Funding benchmark

- [Carta pre-seed guidance](https://carta.com/learn/startups/fundraising/pre-seed-funding/): commonly cited pre-seed range of `$150K–$1M` and `12–24 months` of runway.
- [Carta State of Seed 2025](https://carta.com/data/resources/state-of-seed-2025/): SAFEs remain the dominant pre-seed instrument in Carta’s data.

The `$750K` pre-seed, 18-month runway, and 45/25/20/10 allocation are Ari management forecasts. An 18-month bridge implies roughly `$41.7K/month` total burn. It assumes founder-heavy compensation and roughly two to three market-rate full-time equivalents—not six market salaries.

## Slide 11 — Bottom-up market opportunity

Source: [U.S. Census 2022 Statistics of U.S. Businesses](https://www.census.gov/data/tables/2022/econ/susb/2022-susb-annual.html) and the [detailed firm-size file](https://www2.census.gov/programs-surveys/susb/tables/2022/us_state_naics_detailedsizes_2022.txt), NAICS `511210` Software Publishers.

| View | Account proxy | Annual value assumption | Revenue opportunity |
|---|---:|---:|---:|
| Full U.S. opportunity | 13,254 employer firms under 500 employees | `$11,988` | `$158.9M` |
| Starting cohort | 4,246 firms with 5–49 employees | `$11,988` | `$50.9M` |
| First beachhead | 50 customers | `$11,988` | `$599.4K` |

The Census category includes non-SaaS software publishers and misses some SaaS companies classified elsewhere. It does not identify AI-tool adoption or dedicated security staffing. The first 50 customers are a target, not achieved traction.

## Slides 12–13 — Adoption and roadmap forecasts

- `100 → 30 → 10 → 5 → 3` is an initial 90-day acquisition forecast, not an achieved funnel.
- Pilot success metrics are targets: confirmed attack paths, false-positive rate, time to verified fix, developer time saved, cost per assessment, fix acceptance, and zero out-of-scope actions.
- All future dates, customer counts, and revenue milestones on the roadmap are management targets.
- Repository-grounded next technical gates: complete a live-provider seven-role trace, publish/rehearse the sandbox image, run the browser flow, implement the real GitHub App/webhook path, host staging, strengthen isolation, measure precision/time/cost on authorized pilot repositories, then expand languages and SCM integrations.

## Slide 14 — Team

Names were supplied by the user. Ownership lanes come from `coordination/OWNERSHIP.md`:

- Saicharan Chowdarapu — AI Review & Repair
- Vihaan Krishna — Product Frontend & E2E
- Alan Mozhoor — Security Agents & Sandboxing
- Adam Isaac — RL Defense & Evaluation
- Srihith Yandra — Backend, Monitoring & Contracts
- Sarosh Doddaka — Code Intelligence & Retrieval

Photo circles remain intentional placeholders pending team headshots.
