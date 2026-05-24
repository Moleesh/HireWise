#!/usr/bin/env bash
# Deploy all HireWise edge functions to Supabase.
#
# Usage:
#   PROJECT_REF=orffvgvolpfwmjxpwtgt ./supabase/deploy.sh
#   ./supabase/deploy.sh <project-ref>
#
# Requires the Supabase CLI to be installed and authenticated (`supabase login`).
# Set the API_KEY secret separately:
#   supabase secrets set API_KEY=<key> --project-ref <ref>

set -euo pipefail

PROJECT_REF="${1:-${PROJECT_REF:-orffvgvolpfwmjxpwtgt}}"
FUNCTIONS_DIR="$(pwd)/supabase/functions"

echo $FUNCTIONS_DIR

FUNCTIONS=(
  parse-jd
  parse-resume
  generate-summary
  generate-poster
  fetch-candidates
  manage-users
)

echo "▶ Deploying ${#FUNCTIONS[@]} edge functions to project: $PROJECT_REF"
echo

for fn in "${FUNCTIONS[@]}"; do
  if [[ ! -d "$FUNCTIONS_DIR/$fn" ]]; then
    echo "  ⚠ skip $fn (directory not found)"
    continue
  fi
  echo "  • deploying $fn..."
  supabase functions deploy "$fn" \
    --project-ref "$PROJECT_REF" \
    --no-verify-jwt
done

echo
echo "✓ All functions deployed."
echo
echo "Reminder: ensure the API_KEY secret is set:"
echo "  supabase secrets set API_KEY=<key> --project-ref $PROJECT_REF"
