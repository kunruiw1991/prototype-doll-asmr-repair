#!/usr/bin/env bash
# ==============================================================================
# scripts/local_sub_qa.sh — Subscription-Only Multi-Agent Reproducibility Audit
# Passes the ORIGINAL VIDEO reference pack (.qa/reference/thumb_maxres.jpg +
# sb0_00..06.jpg) AND the auto-generated side-by-side .qa/comparison_grid.png
# directly to BOTH real external `claude` and `codex` CLIs (zero API keys!),
# then posts both audit reports to GitHub Issue #1 for Antigravity to fix!
# ==============================================================================
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"
mkdir -p qa-reports

echo "=== 1. Running unit tests + Playwright E2E + rebuilding .qa/comparison_grid.png ==="
node --test --experimental-test-coverage tests/unit.test.js | tee qa-reports/unit_test.log
python3 tests/e2e_verify.py | tee qa-reports/e2e_test.log

if command -v claude >/dev/null 2>&1; then
  echo "=== 2. Running Claude CLI (Subscription) Video Reproducibility Audit ==="
  claude -p "$(cat .qa/claude_prompt.md)" > qa-reports/qa_report_claude.md
  echo "Saved qa-reports/qa_report_claude.md"
else
  echo "SKIP: 'claude' CLI not found. Open claude.ai/code on this repo and run .qa/claude_prompt.md (it reads .qa/comparison_grid.png & .qa/reference/*)."
fi

if command -v codex >/dev/null 2>&1; then
  echo "=== 3. Running Codex CLI (Subscription) Video Reproducibility Audit ==="
  codex exec \
    -i .qa/comparison_grid.png \
    -i .qa/reference/thumb_maxres.jpg \
    "$(cat .qa/gpt_prompt.md)" \
    -o qa-reports/qa_report_gpt.md || \
    codex "$(cat .qa/gpt_prompt.md)" > qa-reports/qa_report_gpt.md
  echo "Saved qa-reports/qa_report_gpt.md"
else
  echo "SKIP: 'codex' CLI not found. Open chatgpt.com/codex on this repo and run .qa/gpt_prompt.md (with .qa/comparison_grid.png & .qa/reference/*)."
fi

if command -v gh >/dev/null 2>&1 && { [ -s qa-reports/qa_report_claude.md ] || [ -s qa-reports/qa_report_gpt.md ]; }; then
  echo "=== 4. Uploading Claude & Codex Reproducibility Audit Reports to GitHub Issue #1 ==="
  BODY="# Cross-Model Original-Video Reproducibility Audit ($(git rev-parse --short HEAD))\n\n"
  [ -s qa-reports/qa_report_claude.md ] && BODY+="## Claude Reproducibility Audit\n\n$(cat qa-reports/qa_report_claude.md)\n\n---\n\n"
  [ -s qa-reports/qa_report_gpt.md ] && BODY+="## Codex / GPT Reproducibility Audit\n\n$(cat qa-reports/qa_report_gpt.md)\n"
  printf "%b" "$BODY" | gh issue comment 1 --body-file -
fi
