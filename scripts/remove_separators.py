# #!/usr/bin/env python3
# """
# Script to remove extra "---" separators from markdown files while preserving frontmatter.
# """

# import os
# import re
# from pathlib import Path

# def process_markdown_file(file_path):
#     """Process a single markdown file to remove extra "---" separators."""
#     with open(file_path, 'r', encoding='utf-8') as f:
#         content = f.read()
    
#     lines = content.split('\n')
    
#     # Find the frontmatter boundaries (first two "---")
#     frontmatter_end = None
#     dash_count = 0
    
#     for i, line in enumerate(lines):
#         if line.strip() == '---':
#             dash_count += 1
#             if dash_count == 2:
#                 frontmatter_end = i
#                 break
    
#     # If we found the end of frontmatter, process the rest of the file
#     if frontmatter_end is not None:
#         # Keep everything up to and including the frontmatter end
#         new_lines = lines[:frontmatter_end + 1]
        
#         # Process the rest of the lines
#         for line in lines[frontmatter_end + 1:]:
#             # Only add the line if it's not a standalone "---"
#             if line.strip() != '---':
#                 new_lines.append(line)
        
#         # Join the lines back together
#         new_content = '\n'.join(new_lines)
        
#         # Write the updated content back to the file
#         with open(file_path, 'w', encoding='utf-8') as f:
#             f.write(new_content)
        
#         print(f"Processed {file_path}")
#         return True
#     else:
#         print(f"No frontmatter found in {file_path}")
#         return False

# def main():
#     """Main function to process all markdown files."""
#     # Define the directory containing the markdown files
#     posts_dir = Path("/home/amirmxc/Code/aMIrmxc-blog/aMIrmxc-blog/src/content/post/")
    
#     # Find all index.md files in subdirectories
#     index_files = list(posts_dir.glob("*/index.md"))
    
#     print(f"Found {len(index_files)} files to process")
    
#     processed_count = 0
    
#     for file_path in index_files:
#         if process_markdown_file(file_path):
#             processed_count += 1
    
#     print(f"\nProcessed {processed_count} out of {len(index_files)} files")

# if __name__ == "__main__":
#     main()





    # -------------------------------------------------------------
    # v2
    #!/usr/bin/env python3
"""
Remove extra horizontal-rule separators ("---", "***", "___" with 3+ chars)
from markdown files while preserving the YAML frontmatter block.
"""

import re
from pathlib import Path

# خط جداکننده: شروع خط، فاصله/تب اختیاری، 3 تا بیشتر از - یا * یا _ ، فاصلهٔ اختیاری، پایان خط
HR_RE = re.compile(r'^[ \t]*([-*_])\1{2,}[ \t]*$')
# فاصلهٔ نامرئی پرتکرار (no-break space) را هم به فاصلهٔ معمولی تبدیل می‌کنیم
INVISIBLE = '\u00a0\u200b\ufeff'

DRY_RUN = False  # برای اعمال واقعی روی فایل‌ها این را False کن


def is_frontmatter_fence(line: str) -> bool:
    return line.strip() == '---'


def is_hr(line: str) -> bool:
    cleaned = line
    for ch in INVISIBLE:
        cleaned = cleaned.replace(ch, ' ')
    return bool(HR_RE.match(cleaned))


def process_markdown_file(file_path: Path) -> bool:
    content = file_path.read_text(encoding='utf-8')
    newline = '\r\n' if '\r\n' in content else '\n'
    lines = content.splitlines()

    # یافتن پایان frontmatter: دومین خط دقیقاً برابر "---"
    frontmatter_end = None
    dash_count = 0
    for i, line in enumerate(lines):
        if is_frontmatter_fence(line):
            dash_count += 1
            if dash_count == 2:
                frontmatter_end = i
                break

    if frontmatter_end is None:
        print(f"[skip] frontmatter پیدا نشد: {file_path}")
        return False

    head = lines[:frontmatter_end + 1]
    removed = []
    body = []
    for line in lines[frontmatter_end + 1:]:
        if is_hr(line):
            removed.append(line)
        else:
            body.append(line)

    new_lines = head + body
    # جمع‌کردن بیش از یک خط خالی پشت‌سرهم
    collapsed = []
    for ln in new_lines:
        if ln.strip() == '' and collapsed and collapsed[-1].strip() == '':
            continue
        collapsed.append(ln)

    new_content = newline.join(collapsed)
    if content.endswith(('\n', '\r')):
        new_content += newline

    if not removed:
        print(f"[--] چیزی برای حذف نبود: {file_path}")
        return False

    if DRY_RUN:
        print(f"[dry] {len(removed)} جداکننده در {file_path} -> {removed}")
    else:
        file_path.write_text(new_content, encoding='utf-8')
        print(f"[ok] {len(removed)} جداکننده حذف شد: {file_path}")
    return True


def main():
    posts_dir = Path("/home/amirmxc/Code/aMIrmxc-blog/aMIrmxc-blog/src/content/post/")
    

    # قبل:  فقط یک سطح زیر post/
# index_files = sorted(posts_dir.glob("*/index.md"))
    # بعد:  هر عمقی
    index_files = sorted(posts_dir.rglob("index.md"))


    print(f"{len(index_files)} فایل پیدا شد. DRY_RUN={DRY_RUN}\n")

    changed = sum(1 for f in index_files if process_markdown_file(f))
    print(f"\n{changed} از {len(index_files)} فایل تغییر کرد.")


if __name__ == "__main__":
    main()
