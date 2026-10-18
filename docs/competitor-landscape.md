# Slide 10 competitor landscape

Updated October 17, 2026 in response to Sai's competitor-map handoff. Nine named competitors replace the three-card comparison. The branch lines organize names by a useful product entry point; they are not integrations, performance axes, market-share data, or mutually exclusive categories. No competitive benchmark was executed. Capabilities below are vendor-reported, checked against primary sources on October 17, 2026.

## Code and PR workflows

- [GitHub Code Security](https://github.com/security/advanced-security/code-security): code scanning and Copilot Autofix.
- [Semgrep AppSec Platform](https://semgrep.dev/products/semgrep-appsec-platform/): code, dependency and secrets scanning; Assistant triage and remediation. Also see [Assistant launch](https://semgrep.dev/blog/2024/assistant-ga-launch/).
- [SonarQube](https://www.sonarsource.com/blog/ai-codefix-is-now-generally-available/): code quality/security findings and AI CodeFix suggestions. This product is not limited to security.

## Broader AppSec platforms

- [Snyk](https://snyk.io/platform/): code/dependency and other security engines, AI fixes, AI pentesting and red teaming. Its own page also describes business-logic analysis and validated mergeable fixes, so Ari cannot claim those capabilities are unique.
- [Aikido](https://www.aikido.dev/): scanning, AutoFix, AI pentesting. [AutoFix](https://www.aikido.dev/code/autofix) explicitly covers findings from AI pentesting as well as code analysis. Its connected workflow overlaps Ari's proposal.
- [Veracode](https://www.veracode.com/platform): application testing and risk management. [Veracode Fix](https://www.veracode.com/products/fix/) supplies AI remediation for first-party code and open-source dependencies.
- [Checkmarx](https://docs.checkmarx.com/en/34965-68727-checkmarx-one-ide-plugins.html): multiple scan types and developer remediation tools. [AI triage/remediation](https://docs.checkmarx.com/en/34965-717484-ai-triage---remediation.html) documents fix requests. Access varies by license and integration.

## Attack validation

- [XBOW](https://xbow.com/): autonomous offensive security and web pentesting, with exploit validation. [Attack types](https://docs.xbow.com/console/reference/attack-types/) documents supported classes.
- [Pentera](https://pentera.io/pentera-platform/): automated adversarial security validation and remediation workflows. Its scope extends beyond application source code.

## Ari positioning and limits

Ari is prominently presented as a proposed small-team workflow: business intent → attack evidence → tested repair. It is a prototype, not a proven sole end-to-end solution. Human approval and assessment costs remain tradeoffs. Comparative performance, willingness to pay and superiority are not yet validated. Product editions, target scope, supported languages, pricing and maturity differ; these groupings do not assert parity or missing features.

## Presentation behavior

Entry shows the code/PR branch. First click reveals broader AppSec and attack validation. Second click reveals Ari's workflow and tradeoffs. Rewind removes one stage at a time; next advances to prototype verification. Reduced motion uses the same content stages without transitions. No slide numbering, finance, feedback assets or global navigation changes.
