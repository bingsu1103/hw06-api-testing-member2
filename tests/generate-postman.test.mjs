import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import { buildCollection, selectVerifiedCases } from "../scripts/generate-postman.mjs";

const canonicalCases = JSON.parse(
  await readFile(new URL("../data/test-cases.json", import.meta.url), "utf8"),
);
const {rows} = JSON.parse(await readFile(new URL("../reports/member2-results.json", import.meta.url), "utf8"));

test("regression selection preserves the specification assertions for 54 verified cases", () => {
  const selected = selectVerifiedCases(canonicalCases, rows);
  assert.equal(selected.length, 54);
  assert.deepEqual(buildCollection(selected).item.map((folder) => folder.item.length), [13, 2, 39]);
  assert.ok(!selected.some(({id}) => id === "ORD-G-024"));
  assert.throws(() => selectVerifiedCases(canonicalCases, rows.slice(1)), /one result per canonical case/);
});

test("generates one deterministic Postman item for every canonical case", () => {
  const first = buildCollection(canonicalCases);
  const second = buildCollection(canonicalCases);
  const items = first.item.flatMap((folder) => folder.item);

  assert.equal(items.length, canonicalCases.length);
  assert.equal(JSON.stringify(first), JSON.stringify(second));
  assert.deepEqual(
    first.item.map((folder) => folder.name),
    ["Pool A - Registration", "Pool B - Checkout", "Pool C - Admin Order Status"],
  );
});

test("generated requests use the configured base URL and expose case IDs", () => {
  const collection = buildCollection(canonicalCases);
  const items = collection.item.flatMap((folder) => folder.item);
  const targets = new Set(items.map(({request}) => request.method + " " + request.url.raw));
  assert.deepEqual([...targets], [
    "POST {{baseUrl}}/api/register",
    "POST {{baseUrl}}/api/checkout",
    "PUT {{baseUrl}}/api/admin/orders/{{orderId}}/status",
  ]);
  assert.ok(collection.event[0].script.exec.join("\n").includes("X-Student-Id"));

  assert.ok(items.every((item) => item.name.startsWith("[")));
  assert.ok(
    items.every((item) => item.request.url.raw.startsWith("{{baseUrl}}/api/")),
  );
});
