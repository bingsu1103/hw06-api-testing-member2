import { readFileSync, writeFileSync } from "node:fs";

const cases = JSON.parse(readFileSync("data/test-cases.json"));
const [input = "reports/newman/run.json", output = "reports/member2-results.json"] = process.argv.slice(2);
const { run } = JSON.parse(readFileSync(input));
const caseId = (name) => /^\[([^\]]+)\]/.exec(name ?? "")?.[1];
const result = new Map(run.executions.map((execution) => [caseId(execution.item?.name), execution]));
const failed = new Map();
for (const failure of run.failures) {
  const id = caseId(failure.source?.name);
  if (!id) throw new Error("Unattributed Newman failure");
  const checks = failed.get(id) ?? [];
  checks.push(failure.error.test ?? failure.error.name);
  failed.set(id, checks);
}
const rows = cases.map(({id, api}) => {
  const execution = result.get(id);
  if (!execution?.response || !execution.assertions?.length) throw new Error(`Missing assertions for ${id}`);
  return { id, api, actualStatus: execution.response.code, result: failed.has(id) ? "FAIL" : "PASS", failedChecks: failed.get(id) ?? [] };
});
if (rows.length !== run.stats.items.total) throw new Error("Run does not match case inventory");
const stats = {
  requests: run.stats.requests.total,
  transportFailures: run.stats.requests.failed,
  assertions: run.stats.assertions.total,
  failedAssertions: run.stats.assertions.failed,
};
writeFileSync(output, JSON.stringify({stats, rows}, null, 2) + "\n");
for (const api of new Set(rows.map((row) => row.api))) {
  const group = rows.filter((row) => row.api === api);
  console.log(api, group.length, group.filter((row) => row.result === "PASS").length);
}
console.log(stats);
