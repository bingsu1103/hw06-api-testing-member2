import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import {
  REQUIRED_APIS,
  REQUIRED_COVERAGE,
  summarizeCases,
  validateCases,
} from "../scripts/lib/test-case-model.mjs";

const canonicalCases = JSON.parse(
  await readFile(new URL("../data/test-cases.json", import.meta.url), "utf8"),
);

test("rejects duplicate case IDs because one result could overwrite another", () => {
  const duplicate = {
    id: "REG-G-001",
    api: "register",
    origin: "generated",
    coverage: ["domain"],
    request: { body: {} },
    expected: { status: 400 },
  };

  const errors = validateCases([duplicate, { ...duplicate }]);

  assert.ok(errors.some((error) => error.includes("Duplicate case ID")));
});

test("canonical cases meet the 35 generated and 5 extension minimum for every API", () => {
  const summary = summarizeCases(canonicalCases);

  for (const api of REQUIRED_APIS) {
    assert.ok(summary[api].generated >= 35, `${api} generated count`);
    assert.ok(summary[api].extension >= 5, `${api} extension count`);
  }
});

test("canonical cases cover every required category across the suite", () => {
  const tags = new Set(canonicalCases.flatMap((testCase) => testCase.coverage));

  for (const tag of REQUIRED_COVERAGE) {
    assert.ok(tags.has(tag), `missing coverage tag: ${tag}`);
  }
});

test("canonical cases satisfy the complete schema and validation contract", () => {
  assert.deepEqual(validateCases(canonicalCases), []);
});
