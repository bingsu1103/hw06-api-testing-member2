export const REQUIRED_APIS = ["register", "checkout", "admin-order-status"];
export const REQUIRED_COVERAGE = ["domain", "security", "schema", "state"];

export function summarizeCases(cases) {
  const summary = Object.fromEntries(
    REQUIRED_APIS.map((api) => [api, { generated: 0, extension: 0 }]),
  );
  for (const testCase of cases) {
    if (summary[testCase.api] && ["generated", "extension"].includes(testCase.origin)) {
      summary[testCase.api][testCase.origin] += 1;
    }
  }
  return summary;
}

export function validateCases(cases) {
  const errors = [];
  const seen = new Set();

  for (const [index, testCase] of cases.entries()) {
    const label = testCase?.id || `case at index ${index}`;
    if (!testCase || typeof testCase !== "object" || Array.isArray(testCase)) {
      errors.push(`Invalid case object at index ${index}`);
      continue;
    }
    if (typeof testCase.id !== "string" || testCase.id.length === 0) {
      errors.push(`Missing case ID at index ${index}`);
    } else if (seen.has(testCase.id)) {
      errors.push(`Duplicate case ID: ${testCase.id}`);
    } else {
      seen.add(testCase.id);
    }
    if (!REQUIRED_APIS.includes(testCase.api)) {
      errors.push(`${label}: unsupported API ${testCase.api}`);
    }
    if (!["generated", "extension"].includes(testCase.origin)) {
      errors.push(`${label}: invalid origin`);
    }
    if (!Array.isArray(testCase.coverage) || testCase.coverage.length === 0) {
      errors.push(`${label}: coverage must be a non-empty array`);
    }
    if (!testCase.request || typeof testCase.request.path !== "string") {
      errors.push(`${label}: request path is required`);
    }
    if (!testCase.expected || !Number.isInteger(testCase.expected.status)) {
      errors.push(`${label}: integer expected status is required`);
    }
  }

  const summary = summarizeCases(cases);
  for (const api of REQUIRED_APIS) {
    if (summary[api].generated < 35) {
      errors.push(`${api}: requires at least 35 generated cases`);
    }
    if (summary[api].extension < 5) {
      errors.push(`${api}: requires at least 5 extension cases`);
    }
  }

  return errors;
}
