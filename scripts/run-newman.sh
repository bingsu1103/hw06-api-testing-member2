#!/usr/bin/env bash
set -euo pipefail

project_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
sut_dir="${SUT_DIR:-${project_root}/.cache/eshop-sut}"
report_dir="${project_root}/reports/newman"

health_headers=(-H 'X-Student-Id: 23120205')
if curl --silent --max-time 2 "${health_headers[@]}" "http://127.0.0.1:3000/" >/dev/null; then
  printf '%s\n' "Port 3000 is already serving HTTP. Stop that server before running HW06." >&2
  exit 1
fi
"${project_root}/scripts/setup-sut.sh"
mkdir -p "${report_dir}"

node "${sut_dir}/backend/server.js" >"${report_dir}/sut.log" 2>&1 &
server_pid=$!
cleanup() {
  kill "${server_pid}" 2>/dev/null || true
  wait "${server_pid}" 2>/dev/null || true
}
trap cleanup EXIT

for _ in {1..30}; do
  if curl --silent --fail "${health_headers[@]}" "http://127.0.0.1:3000/api/products" >/dev/null; then
    break
  fi
  sleep 1
done
curl --silent --fail "${health_headers[@]}" "http://127.0.0.1:3000/api/products" >/dev/null

if [[ "${1:-}" == "--smoke" ]]; then
  npx newman run "${project_root}/postman/smoke.postman_collection.json" \
    --environment "${project_root}/postman/local.postman_environment.json" \
    --reporters cli
elif [[ "${1:-}" == "baseline" || "${1:-}" == "demonstrate-failure" ]]; then
  collection="$(mktemp)"
  trap 'cleanup; unlink "$collection"' EXIT
  node "${project_root}/scripts/generate-postman.mjs" "$1" "$collection"
  npx newman run "$collection" --environment "${project_root}/postman/local.postman_environment.json" --reporters cli
else
  result=0
  npx newman run "${project_root}/postman/23120205_HW06.postman_collection.json" \
    --environment "${project_root}/postman/local.postman_environment.json" \
    --reporters cli,json,htmlextra \
    --reporter-json-export "${report_dir}/run.json" \
    --reporter-htmlextra-export "${report_dir}/report.raw.html" \
    --reporter-htmlextra-omitRequestBodies --reporter-htmlextra-omitResponseBodies \
    --reporter-htmlextra-skipHeaders 'Authorization' || result=$?
  if [[ -f "${report_dir}/report.raw.html" ]]; then
    node "${project_root}/scripts/sanitize-newman-html.mjs" \
      "${report_dir}/report.raw.html" "${report_dir}/report.html"
  fi
  exit "$result"
fi
