import { readFile, writeFile } from "node:fs/promises";
import { pathToFileURL } from "node:url";

const REDACTED = "[REDACTED]";

export function sanitizeNewmanHtml(html) {
  return html
    .replace(
      /("(?:newPassword|password)"\s*:\s*")[^"]*(")/gi,
      `$1${REDACTED}$2`,
    )
    .replace(
      /(&quot;(?:newPassword|password)&quot;\s*:\s*&quot;)[\s\S]*?(&quot;)/gi,
      `$1${REDACTED}$2`,
    )
    .replace(/eyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+/g, REDACTED)
    .replace(/Admin123!|Test1234!|Wrong123!/g, REDACTED)
    .replace(/[ \t]+$/gm, "");
}

async function main() {
  const [inputPath, outputPath] = process.argv.slice(2);
  if (!inputPath || !outputPath) {
    throw new Error("Usage: node scripts/sanitize-newman-html.mjs <input> <output>");
  }
  const html = await readFile(inputPath, "utf8");
  await writeFile(outputPath, sanitizeNewmanHtml(html));
}

if (import.meta.url === pathToFileURL(process.argv[1] || "").href) {
  await main();
}
