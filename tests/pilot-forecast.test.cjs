const { test } = require('node:test');
const assert = require('node:assert/strict');
const { forecast, defaults } = require('../public/pilot-forecast.js');
const near = (actual, expected) => assert.ok(Math.abs(actual - expected) < 1e-8, `${actual} != ${expected}`);

test('five free pilots cost money but generate no revenue or payment fees', () => {
  const model = forecast();
  const first = model.rows[0];
  assert.equal(first.freeAccounts, 5);
  assert.equal(first.paidAccounts, 0);
  assert.equal(first.revenue, 0);
  assert.equal(first.costs.payments, 0);
  assert.equal(first.cost, 705);
  assert.equal(first.costs.api, 95);
  assert.equal(first.costs.sandbox, 50);
  assert.equal(first.costs.aws, 35);
  assert.equal(first.costs.supportStorage, 25);
});

test('the first free cohort converts once, with paid intake beginning in Month 2', () => {
  const { rows, expectedConversions } = forecast();
  near(expectedConversions, 0.91);
  near(rows[1].paidAccounts, 2.91);
  near(rows[1].revenue, 145.4709);
  near(rows[2].paidAccounts, 4.8518);
  assert.equal(rows[1].freeAccounts, 0);
  assert.equal(rows[2].converted, 0);
  assert.equal(rows[0].newPaid, 0);
  assert.equal(rows[1].newPaid, 2);
});

test('all paying accounts stay on Founder pricing and consume its full allowance', () => {
  const model = forecast();
  near(model.freeUnitCost, 41);
  near(model.paidUnitCost, 42.74971);
  near(model.contribution, 7.24029);
  assert.equal(model.coverageAccounts, 70);
  for (const row of model.rows) {
    near(row.revenue, row.paidAccounts * 49.99);
    near(row.cost, 500 + row.paidAccounts * 42.74971 + row.freeAccounts * 41);
  }
});

test('no intake after the initial cohort cannot falsely reach cash coverage', () => {
  const model = forecast({ newPaidPerMonth: 0, monthlyChurn: 0, conversionRate: 1 });
  assert.equal(model.rows[1].paidAccounts, 5);
  assert.equal(model.monthlyBreakEven, null);
  assert.equal(model.cumulativeBreakEven, null);
});

test('zero conversions and zero acquisition leave no paying customers', () => {
  const model = forecast({ conversionRate: 0, newPaidPerMonth: 0 });
  assert.ok(model.rows.every(row => row.revenue === 0));
  assert.equal(model.rows[11].cumulativeCost, 6205);
  assert.equal(model.fundingNeeded, 6205);
});

test('monthly coverage and recovery of earlier losses are different milestones', () => {
  const model = forecast({ newPaidPerMonth: 10, monthlyChurn: 0 });
  assert.equal(model.monthlyBreakEven, 8);
  assert.equal(model.cumulativeBreakEven, null);
  assert.ok(model.rows[7].net > 0);
  assert.ok(model.rows[7].cumulativeNet < 0);
  const extended = forecast({ months: 24, newPaidPerMonth: 10, monthlyChurn: 0 });
  assert.equal(extended.cumulativeBreakEven, 16);
  near(model.fundingNeeded, -model.rows[6].cumulativeNet);
});

test('base forecast does not promise a break-even date outside its horizon', () => {
  const model = forecast();
  assert.equal(model.rows.length, 12);
  assert.equal(model.monthlyBreakEven, null);
  assert.equal(model.cumulativeBreakEven, null);
  assert.ok(model.rows[11].net < 0);
  assert.ok(model.rows[11].cumulativeNet < 0);
});

test('conversion and paid retention are independent assumptions', () => {
  const lowChurn = forecast({ monthlyChurn: 0 });
  const highChurn = forecast({ monthlyChurn: 1 });
  near(lowChurn.rows[1].paidAccounts, highChurn.rows[1].paidAccounts);
  near(highChurn.rows[2].paidAccounts, 2);
  assert.ok(lowChurn.rows[11].paidAccounts > highChurn.rows[11].paidAccounts);
});

test('higher conversion and intake cannot reduce forecast revenue', () => {
  const slow = forecast({ conversionRate: 0.05, newPaidPerMonth: 1 });
  const fast = forecast({ conversionRate: 0.219, newPaidPerMonth: 3 });
  assert.ok(fast.rows.slice(1).every((row, i) => row.revenue > slow.rows[i + 1].revenue));
  assert.ok(fast.fundingNeeded < slow.fundingNeeded);
});

test('every row reconciles cash costs and cumulative totals without display rounding', () => {
  const model = forecast();
  near(model.rows.at(-1).cumulativeRevenue, model.rows.reduce((total, row) => total + row.revenue, 0));
  near(model.rows.at(-1).cumulativeCost, model.rows.reduce((total, row) => total + row.cost, 0));
  for (const row of model.rows) {
    near(row.cost, Object.values(row.costs).reduce((a, b) => a + b, 0));
    near(row.net, row.revenue - row.cost);
    near(row.cumulativeNet, row.cumulativeRevenue - row.cumulativeCost);
  }
});

test('an unprofitable unit model has no finite coverage threshold', () => {
  const model = forecast({ monthlyPrice: 1 });
  assert.equal(model.coverageAccounts, null);
  assert.equal(model.monthlyBreakEven, null);
});

test('invalid rates, amounts, and horizons fail instead of plotting nonsense', () => {
  for (const override of [{ conversionRate: 1.1 }, { monthlyChurn: -0.01 },
    { fixedMonthly: NaN }, { months: 0 }, { months: 2.5 }, { months: 121 }, { monthlyPrice: Infinity }]) {
    assert.throws(() => forecast(override), RangeError);
  }
  forecast({ monthlyChurn: 1, conversionRate: 1 });
  assert.equal(defaults.conversionRate, 0.182);
});
