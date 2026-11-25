import assert from "node:assert/strict";
import test from "node:test";

import { sanitizeNewmanHtml } from "../scripts/sanitize-newman-html.mjs";

test("redacts passwords and JWT values while preserving report structure", () => {
  const jwt = "eyJhbGciOiJIUzI1NiJ9.eyJpZCI6MSwicm9sZSI6ImFkbWluIn0.signature";
  const html = `<html><body>{&quot;password&quot;:&quot;Admin123!&quot;} ${jwt}</body></html>`;

  const sanitized = sanitizeNewmanHtml(html);

  assert.match(sanitized, /<html><body>/);
  assert.doesNotMatch(sanitized, /Admin123!/);
  assert.doesNotMatch(sanitized, /eyJhbGci/);
  assert.match(sanitized, /\[REDACTED\]/);
});

test("redacts JSON and HTML-encoded password fields", () => {
  const html = '{"password":"Test1234!"} {&quot;newPassword&quot;:&quot;New123!&quot;}';

  const sanitized = sanitizeNewmanHtml(html);

  assert.equal(sanitized.includes("Test1234!"), false);
  assert.equal(sanitized.includes("New123!"), false);
});

test("removes generated trailing whitespace so the report is Git clean", () => {
  assert.equal(sanitizeNewmanHtml("<p>value</p>   \n"), "<p>value</p>\n");
});
