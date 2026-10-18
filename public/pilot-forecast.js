/* Ari planning scenarios. These inputs are not measured traction or invoices. */
(function (root) {
  'use strict';

  const defaults = Object.freeze({
    months: 12,
    initialFreePilots: 5,
    conversionRate: 0.182, // First Page Sage opt-in organic trial average; proxy only.
    newPaidPerMonth: 2, // Founder-led direct-paid acquisition planning target from Month 2, not a measured rate.
    monthlyChurn: 0.02, // Sensitivity assumption, not measured pilot retention.
    monthlyPrice: 49.99,
    fixedMonthly: 500,
    assessmentsPerAccount: 7,
    apiPerAssessment: 1.9,
    sandboxPerAssessment: 1,
    awsPerAccount: 7,
    supportPerAccount: 5,
    paymentRate: 0.029,
    paymentFixed: 0.3
  });

  function forecast(overrides = {}) {
    const inputs = { ...defaults, ...overrides };
    for (const [name, value] of Object.entries(inputs)) {
      if (!Number.isFinite(value) || value < 0) throw new RangeError(`${name} must be finite and nonnegative`);
    }
    if (!Number.isInteger(inputs.months) || inputs.months < 1 || inputs.months > 120) {
      throw new RangeError('months must be an integer from 1 to 120');
    }
    for (const rate of ['conversionRate', 'monthlyChurn', 'paymentRate']) {
      if (inputs[rate] > 1) throw new RangeError(`${rate} must be between 0 and 1`);
    }
    const api = inputs.assessmentsPerAccount * inputs.apiPerAssessment;
    const sandbox = inputs.assessmentsPerAccount * inputs.sandboxPerAssessment;
    const freeUnitCost = api + sandbox + inputs.awsPerAccount + inputs.supportPerAccount;
    const paymentPerPayer = inputs.monthlyPrice * inputs.paymentRate + inputs.paymentFixed;
    const paidUnitCost = freeUnitCost + paymentPerPayer;
    const contribution = inputs.monthlyPrice - paidUnitCost;
    const expectedConversions = inputs.initialFreePilots * inputs.conversionRate;
    const rows = [];
    let paidAccounts = 0;
    let cumulativeRevenue = 0;
    let cumulativeCost = 0;

    for (let month = 1; month <= inputs.months; month++) {
      const freeAccounts = month === 1 ? inputs.initialFreePilots : 0;
      const retainedPaid = paidAccounts * (1 - inputs.monthlyChurn);
      const converted = month === 2 ? expectedConversions : 0;
      const newPaid = month >= 2 ? inputs.newPaidPerMonth : 0;
      paidAccounts = retainedPaid + converted + newPaid;
      const servedAccounts = paidAccounts + freeAccounts;
      const costs = {
        sharedTools: inputs.fixedMonthly,
        api: servedAccounts * api,
        sandbox: servedAccounts * sandbox,
        aws: servedAccounts * inputs.awsPerAccount,
        payments: paidAccounts * paymentPerPayer,
        supportStorage: servedAccounts * inputs.supportPerAccount
      };
      const revenue = paidAccounts * inputs.monthlyPrice;
      const cost = Object.values(costs).reduce((sum, value) => sum + value, 0);
      cumulativeRevenue += revenue;
      cumulativeCost += cost;
      rows.push({ month, freeAccounts, retainedPaid, converted, newPaid, paidAccounts,
        costs, revenue, cost, net: revenue - cost, cumulativeRevenue, cumulativeCost,
        cumulativeNet: cumulativeRevenue - cumulativeCost });
    }

    // Report only crossings within the modeled horizon; never extrapolate a date.
    const firstMonth = predicate => rows.find(row => row.paidAccounts > 0 && predicate(row))?.month ?? null;
    const monthlyBreakEven = firstMonth(row => row.net >= -1e-9);
    const cumulativeBreakEven = firstMonth(row => row.cumulativeNet >= -1e-9);
    const fundingNeeded = Math.max(0, ...rows.map(row => -row.cumulativeNet));
    return { inputs, rows, freeUnitCost, paidUnitCost, contribution, expectedConversions,
      coverageAccounts: contribution > 0 ? Math.ceil(inputs.fixedMonthly / contribution) : null,
      monthlyBreakEven, cumulativeBreakEven, fundingNeeded };
  }

  const api = Object.freeze({ defaults, forecast });
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.AriPilotForecast = api;
})(typeof globalThis === 'object' ? globalThis : this);
