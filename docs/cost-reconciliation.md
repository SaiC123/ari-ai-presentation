# Cost reconciliation, October 17, 2026

## Evidence supplied by the team

The pasted cost sheet reports: reviewer investigation $0.27-$0.37 API; reviewer repair $0.08-$0.12; complete seven-agent run $1.41; complete assessment approximately $1.80-$1.90. Early-stopped runs are not substituted for complete runs. No invoice or raw usage trace was independently audited in this edit. Model names and rate tables in the supplied sheet are not republished as independently verified provider facts.

$10 per assessment and $3 per push-triggered re-check are reported API budget caps, not typical run prices. Observed usage on another repository or repeated investigations may differ. RL has zero Claude API usage, not zero CPU or total cost. The team's Claude subscription is separate from API billing and is not included in the business model.

The team reports Railway service usage approximately $1.60/month at low volume. Railway Hobby is a $5 minimum commitment with included usage; do not add $1.60 to $5. Vercel Pro starts at $20/month, making the stated low-volume shared hosting baseline about $25 before additional seats/usage/taxes. This is not a production-scale hosting guarantee. Sources: https://docs.railway.com/pricing/understanding-your-bill and https://vercel.com/pricing . No claim that upgrading Vercel eliminates every deployment limit is made.

## Forecast base-assessment unit economics

Prices and included assessments remain Founder $49/2, Growth $149/4, Scale $399/10. Enterprise is negotiated. Model $1.90 reported demo API plus $1 forecast infrastructure reserve per included assessment, payment assumption 2.9% + $0.30, and forecast storage/support allowances $5/$12/$30 per customer/month.

| Tier | API | Infrastructure reserve | Payments | Storage/support | Total cost | Contribution |
|---|---:|---:|---:|---:|---:|---:|
| Founder | $3.80 | $2 | $1.721 | $5 | $12.521 | $36.479 |
| Growth | $7.60 | $4 | $4.621 | $12 | $28.221 | $120.779 |
| Scale | $19 | $10 | $11.871 | $30 | $70.871 | $328.129 |

At 40%/45%/15% mix, revenue $146.50, variable cost $28.3385, contribution $118.1615, margin 80.66%. The retained future staffed fixed budget $31,250 divided by contribution gives 264.47, rounded up to 265 customers. Hosting baseline is part of the fixed-service budget, not added twice. This is not the prototype's cash break-even and does not validate staffing budgets or production margin.

Additional re-checks are excluded because expected frequency and average cost are unavailable. Add `re-checks × actual average re-check API cost` plus execution overhead to the customer model before promising continuous coverage. At the $3 cap, 10 additional re-checks could add up to $30 in API cost alone. Enforce explicit budgets, approvals or paid usage rules rather than implying unlimited protection. Enterprise and paid overages are excluded from the forecast.

Prototype illustration: $25 shared hosting + 100 × $1.90 API = $215/month, excluding re-checks, reserves, support, staff, taxes and other subscriptions. A $750K raise is a proposed development and pilot budget, not necessary merely to run this hosting setup.
