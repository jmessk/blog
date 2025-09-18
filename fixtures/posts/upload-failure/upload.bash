#!/usr/bin/env bash
set -euo pipefail

# Usage:
#   ./upload.bash [API_URL]
# Default API_URL: http://localhost:8787/api/posts

API_URL=${1:-${API_URL:-http://localhost:8787/api/posts}}

SCRIPT_DIR=$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)
MD_FILE="$SCRIPT_DIR/example.md"

if [[ ! -f "$MD_FILE" ]]; then
	echo "Markdown not found: $MD_FILE" >&2
	exit 1
fi

# Build curl command
cmd=(
	curl -sS -X POST "$API_URL" \
		-H 'Accept: application/json' \
		-F "content=<${MD_FILE};type=text/markdown; charset=utf-8"
)

# Attach images in the same folder (png/jpg/jpeg/gif/webp/svg)
shopt -s nullglob
for f in "$SCRIPT_DIR"/*.{png,jpg,jpeg,gif,webp,svg}; do
	[[ -f "$f" ]] || continue
	cmd+=( -F "files=@${f}" )
done
shopt -u nullglob

echo "POST $API_URL" >&2
if command -v jq >/dev/null 2>&1; then
	"${cmd[@]}" | jq
else
	"${cmd[@]}"
fi
