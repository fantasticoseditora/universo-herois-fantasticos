#!/usr/bin/env bash
set -euo pipefail

script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

if [[ "${SITES_ENV_READY:-}" != "1" ]]; then
  exec "${script_dir}/sites-env.sh" -- "$0" "$@"
fi

worker="${SITES_PROJECT_ROOT}/dist/server/index.js"
hosting="${SITES_PROJECT_ROOT}/dist/.openai/hosting.json"

[[ -f "${worker}" ]] || {
  echo "Missing Sites Worker entry: dist/server/index.js" >&2
  exit 66
}
[[ -f "${hosting}" ]] || {
  echo "Missing packaged Sites manifest: dist/.openai/hosting.json" >&2
  exit 66
}

node --check "${worker}"

node --input-type=module - "${worker}" "${hosting}" <<'NODE'
import { readFile } from "node:fs/promises";

const [workerPath, hostingPath] = process.argv.slice(2);
JSON.parse(await readFile(hostingPath, "utf8"));

const workerSource = await readFile(workerPath, "utf8");
const hasDefaultExport =
  /\bexport\s+default\b/.test(workerSource) ||
  /\bexport\s*\{[^}]*\bas\s+default\b[^}]*\}/s.test(workerSource);
const hasFetchHandler = /\bfetch\s*\(\s*request\b/.test(workerSource);

if (!hasDefaultExport || !hasFetchHandler) {
  throw new Error(
    "dist/server/index.js must contain an ESM default export with fetch(request, env, ctx)",
  );
}
NODE

echo "Validated Sites artifact: Worker syntax, default fetch export, and hosting manifest are present."
