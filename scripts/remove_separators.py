#!/usr/bin/env python3
"""
Script to remove extra "---" separators from markdown files while preserving frontmatter.
"""

import os
import re
from pathlib import Path

def process_markdown_file(file_path):
    """Process a single markdown file to remove extra "---" separators."""
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    lines = content.split('\n')
    
    # Find the frontmatter boundaries (first two "---")
    frontmatter_end = None
    dash_count = 0
    
    for i, line in enumerate(lines):
        if line.strip() == '---':
            dash_count += 1
            if dash_count == 2:
                frontmatter_end = i
                break
    
    # If we found the end of frontmatter, process the rest of the file
    if frontmatter_end is not None:
        # Keep everything up to and including the frontmatter end
        new_lines = lines[:frontmatter_end + 1]
        
        # Process the rest of the lines
        for line in lines[frontmatter_end + 1:]:
            # Only add the line if it's not a standalone "---"
            if line.strip() != '---':
                new_lines.append(line)
        
        # Join the lines back together
        new_content = '\n'.join(new_lines)
        
        # Write the updated content back to the file
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(new_content)
        
        print(f"Processed {file_path}")
        return True
    else:
        print(f"No frontmatter found in {file_path}")
        return False

def main():
    """Main function to process all markdown files."""
    # Define the directory containing the markdown files
    posts_dir = Path("/home/amirmxc/Code/aMIrmxc-blog/aMIrmxc-blog/src/content/post/")
    
    # Find all index.md files in subdirectories
    index_files = list(posts_dir.glob("*/index.md"))
    
    print(f"Found {len(index_files)} files to process")
    
    processed_count = 0
    
    for file_path in index_files:
        if process_markdown_file(file_path):
            processed_count += 1
    
    print(f"\nProcessed {processed_count} out of {len(index_files)} files")

if __name__ == "__main__":
    main()