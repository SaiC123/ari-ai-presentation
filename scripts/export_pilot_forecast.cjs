const { writeFileSync } = require('node:fs');
const { join } = require('node:path');
const { forecast } = require('../public/pilot-forecast.js');
const model = forecast();
const columns = ['month', 'free_pilots', 'expected_paying_accounts', 'new_paid_pilots',
  'converted_from_free', 'revenue', 'shared_tools', 'api', 'sandbox', 'aws', 'payments',
  'support_storage', 'total_cost', 'monthly_net', 'cumulative_revenue', 'cumulative_cost', 'cumulative_net'];
const rows = model.rows.map(row => [row.month, row.freeAccounts, row.paidAccounts, row.newPaid,
  row.converted, row.revenue, row.costs.sharedTools, row.costs.api, row.costs.sandbox,
  row.costs.aws, row.costs.payments, row.costs.supportStorage, row.cost, row.net,
  row.cumulativeRevenue, row.cumulativeCost, row.cumulativeNet]);
const csv = [columns.join(','), ...rows.map(row => row.map(value => Number(value.toFixed(8))).join(','))].join('\n') + '\n';
writeFileSync(join(__dirname, '../docs/pilot-forecast.csv'), csv);
console.log(JSON.stringify({
  assumptions: model.inputs,
  expectedConversions: model.expectedConversions,
  coverageAccounts: model.coverageAccounts,
  monthlyBreakEven: model.monthlyBreakEven,
  cumulativeBreakEven: model.cumulativeBreakEven,
  fundingNeeded: model.fundingNeeded,
  monthlyTable: model.rows.map(row => `| M${row.month} | ${row.freeAccounts} | ${row.paidAccounts.toFixed(2)} | $${row.revenue.toFixed(2)} | $${row.cost.toFixed(2)} | $${row.net.toFixed(2)} | $${row.cumulativeNet.toFixed(2)} |`).join('\n')
}, null, 2));
