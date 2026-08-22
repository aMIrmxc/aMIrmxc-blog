#!/usr/bin/env bash

set -euo pipefail

BASE_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

find "$BASE_DIR" -type f -name '*.md' -print0 |
while IFS= read -r -d '' FILE; do

    TMP_FILE="${FILE}.tmp"

    first_line=true
    frontmatter_started=false
    frontmatter_finished=false

    while IFS= read -r LINE || [[ -n "$LINE" ]]; do

        # ----------------------------------------
        # شروع فایل و تشخیص Frontmatter
        # ----------------------------------------
        if $first_line; then
            first_line=false

            if [[ "$LINE" =~ ^[[:space:]]*---[[:space:]]*$ ]]; then
                frontmatter_started=true
                printf '%s\n' "$LINE" >> "$TMP_FILE"
                continue
            fi

            # فایل Frontmatter ندارد
            frontmatter_started=false
        fi

        # ----------------------------------------
        # داخل Frontmatter
        # ----------------------------------------
        if $frontmatter_started && ! $frontmatter_finished; then

            # اولین --- بعد از شروع Frontmatter
            # پایان Frontmatter است
            if [[ "$LINE" =~ ^[[:space:]]*---[[:space:]]*$ ]]; then
                frontmatter_finished=true
            fi

            printf '%s\n' "$LINE" >> "$TMP_FILE"
            continue
        fi

        # ----------------------------------------
        # بعد از Frontmatter:
        # تمام خطوط --- حذف شوند
        # ----------------------------------------
        if [[ "$LINE" =~ ^[[:space:]]*---[[:space:]]*$ ]]; then
            continue
        fi

        printf '%s\n' "$LINE" >> "$TMP_FILE"

    done < "$FILE"

    mv "$TMP_FILE" "$FILE"

    echo "Processed: $FILE"

done

echo
echo "Done."
