import assert from "node:assert/strict";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { Workbook, SpreadsheetFile } from "@oai/artifact-tool";

const output = "outputs/01a1e8c5-3af7-7831-8b60-3dc87eda0b3e";
const cases = JSON.parse(await readFile("data/test-cases.json", "utf8"));
const { rows } = JSON.parse(await readFile("reports/member2-results.json", "utf8"));
const results = new Map(rows.map((item) => [item.id, item]));
const workbook = Workbook.create();
const summary = workbook.worksheets.add("Summary");
const detail = workbook.worksheets.add("Cases");
const last = cases.length + 3;
const header = (sheet, range) => {
  sheet.getRange(range).format.fill = "#183153";
  sheet.getRange(range).format.font.color = "#FFFFFF";
  sheet.getRange(range).format.font.bold = true;
  sheet.getRange(range).format.rowHeight = 24;
};
for (const sheet of [summary, detail]) sheet.showGridLines = false;
detail.getRange("A1").values = [["Source: EShop FR-01, FR-08, FR-10, FR-18 and Newman run / 25 Nov 2026"]];
detail.getRange("A3:K3").values = [[
  "Case ID", "API", "Origin", "Scenario", "Requirement", "Input JSON",
  "Fixture", "Expected HTTP", "Actual HTTP", "Outcome", "Failed assertions",
]];
detail.getRange(`A4:K${last}`).values = cases.map((entry) => {
  const item = results.get(entry.id);
  const expected = entry.expected.status === 400 && entry.api !== "admin-order-status" ? "4xx" : String(entry.expected.status);
  return [
    entry.id, entry.api, entry.origin === "extension" ? "Extension candidate" : "Draft",
    entry.title, entry.requirement, JSON.stringify(entry.request.body),
    JSON.stringify(entry.request.fixture ?? {}), expected, item.actualStatus,
    item.result, item.failedChecks.join(" · "),
  ];
});
detail.tables.add(`A3:K${last}`, true, "Member2Cases").style = "TableStyleMedium2";
detail.freezePanes.freezeRows(3);
const widths = [112, 165, 147, 333, 124, 400, 155, 115, 100, 90, 363];
widths.forEach((width, i) => {
  const col = String.fromCharCode(65 + i);
  detail.getRange(`${col}3:${col}${last}`).format.columnWidthPx = width;
});
const detailBody = detail.getRange(`A4:K${last}`);
detailBody.format.wrapText = true;
detailBody.format.rowHeight = 36;
header(detail, "A3:K3");

summary.getRange("A2").values = [["HW06 API results · Member 2"]];
summary.getRange("A2").format.font.size = 16;
summary.getRange("A2").format.font.bold = true;
summary.getRange("A4:F4").values = [["API", "Drafts", "Extensions", "Executed", "Pass", "Fail"]];
summary.getRange("A5:A8").values = [["register"], ["checkout"], ["admin-order-status"], ["Total"]];
for (let row = 5; row <= 7; row++) {
  const api = `Cases!$B$4:$B$${last},$A${row}`;
  const origin = `Cases!$C$4:$C$${last}`;
  const outcome = `Cases!$J$4:$J$${last}`;
  summary.getRange(`B${row}:F${row}`).formulas = [[
    `=COUNTIFS(${api},${origin},"Draft")`, `=COUNTIFS(${api},${origin},"Extension candidate")`,
    `=SUM(E${row}:F${row})`, `=COUNTIFS(${api},${outcome},"PASS")`, `=COUNTIFS(${api},${outcome},"FAIL")`,
  ]];
}
summary.getRange("B8:F8").formulas = [["B", "C", "D", "E", "F"].map((column) => `=SUM(${column}5:${column}7)`)];
summary.getRange("A4:A8").format.columnWidthPx = 215;
summary.getRange("B4:F8").format.columnWidthPx = 90;
summary.getRange("A5:F8").format.rowHeight = 22;
summary.getRange("A8:F8").format.font.bold = true;
header(summary, "A4:F4");
workbook.recalculate();
assert.deepEqual(summary.getRange("B8:F8").values[0], [105, 15, 120, 54, 66]);
await mkdir(output, { recursive: true });
await mkdir("tmp", { recursive: true });
for (const [sheetName, range] of [["Summary", "A1:F9"], ["Cases", "A3:K8"]]) {
  const image = await workbook.render({ sheetName, range, scale: 1 });
  await writeFile(`tmp/member2-${sheetName}.png`, new Uint8Array(await image.arrayBuffer()));
}
await (await SpreadsheetFile.exportXlsx(workbook)).save(`${output}/23120205_HW06_Member2.xlsx`);
