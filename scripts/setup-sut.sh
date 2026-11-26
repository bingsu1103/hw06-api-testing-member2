#!/usr/bin/env bash
set -euo pipefail

project_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
sut_dir="${SUT_DIR:-${project_root}/.cache/eshop-sut}"
sut_revision="85af3ba875c88283615e22cb108f13e2fccaf0e9"

if [[ ! -d "${sut_dir}/.git" ]]; then
  mkdir -p "$(dirname "${sut_dir}")"
  git init -q "${sut_dir}"
  git -C "${sut_dir}" fetch --depth 1 https://github.com/ttbhanh/eshop-sut.git "${sut_revision}"
  git -C "${sut_dir}" checkout --detach FETCH_HEAD
fi
if [[ "$(git -C "${sut_dir}" rev-parse HEAD)" != "${sut_revision}" ]]; then
  printf '%s\n' "Unexpected SUT revision. Use a fresh disposable fixture directory." >&2
  exit 1
fi

if [[ "${HW06_REMEDIATE:-0}" == 1 ]]; then
  if [[ "${sut_dir}" != "${project_root}/.cache/eshop-sut-remediated" ]]; then
    printf '%s\n' "Remediation is restricted to its disposable SUT directory." >&2
    exit 1
  fi
  remediation="${project_root}/patches/member2-sut-remediation.patch"
  if git -C "${sut_dir}" apply --reverse --check "$remediation"; then
    printf '%s\n' "Member 2 remediation patch already present"
  else
    git -C "${sut_dir}" apply --check "$remediation"
    git -C "${sut_dir}" apply "$remediation"
  fi
fi

if [[ ! -d "${sut_dir}/backend/node_modules" ]]; then
  npm --prefix "${sut_dir}/backend" ci
fi
node "${sut_dir}/backend/database.js"
printf '%s\n' "SUT ready at ${sut_dir}"
