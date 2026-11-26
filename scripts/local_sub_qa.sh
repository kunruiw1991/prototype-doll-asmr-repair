#!/usr/bin/env bash
# ==============================================================================
# scripts/local_sub_qa.sh — Subscription-Only Multi-Agent QA Runner (Zero API Keys!)
# Runs real external `claude` (Claude Pro/Max) and `codex` (ChatGPT Plus/Pro)
# CLIs logged in on your machine, then uploads both reports to a GitHub Issue
# so Antigravity can read them and auto-fix every confirmed P0/P1/P2 bug!
# ==============================================================================
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"
mkdir -p qa-reports

echo "=== 1. Running local automated unit tests + Playwright E2E ==="
node --test --experimental-test-coverage tests/unit.test.js | tee qa-reports/unit_test.log
python3 tests/e2e_verify.py | tee qa-reports/e2e_test.log

if command -v claude >/dev/null 2>&1; then
  echo "=== 2. Running Claude CLI (Subscription) Audit ==="
  claude -p "$(cat .qa/claude_prompt.md)" > qa-reports/qa_report_claude.md
  echo "Saved qa-reports/qa_report_claude.md"
else
  echo "SKIP: 'claude' CLI not found. Install Claude Code or open claude.ai/code with .qa/claude_prompt.md"
fi

if command -v codex >/dev/null 2>&1; then
  echo "=== 3. Running Codex CLI (Subscription) Audit ==="
  codex exec "$(cat .qa/gpt_prompt.md)" -o qa-reports/qa_report_gpt.md || \
    codex "$(cat .qa/gpt_prompt.md)" > qa-reports/qa_report_gpt.md
  echo "Saved qa-reports/qa_report_gpt.md"
else
  echo "SKIP: 'codex' CLI not found. Install OpenAI Codex CLI or open chatgpt.com/codex with .qa/gpt_prompt.md"
fi

if command -v gh >/dev/null 2>&1 && { [ -s qa-reports/qa_report_claude.md ] || [ -s qa-reports/qa_report_gpt.md ]; }; then
  echo "=== 4. Uploading Claude & Codex Audit Reports to GitHub Issue ==="
  BODY="# Cross-Model Claude & Codex Audit Report ($(git rev-parse --short HEAD))\n\n"
  [ -s qa-reports/qa_report_claude.md ] && BODY+="## Claude Audit Report\n\n$(cat qa-reports/qa_report_claude.md)\n\n---\n\n"
  [ -s qa-reports/qa_report_gpt.md ] && BODY+="## Codex / GPT Audit Report\n\n$(cat qa-reports/qa_report_gpt.md)\n"
  printf "%b" "$BODY" | gh issue create --title "Claude & Codex Audit: $(git rev-parse --short HEAD)" --body-file -
fi
