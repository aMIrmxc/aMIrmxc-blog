---
title: "Quick Git Commands Recap"
description: "A comprehensive, condensed cheat-sheet covering Git commands from beginner to advanced"
post_id: "git-recap"
publishDate: "14 Jan 2024"
updatedDate: "27 Feb 2025"
tags: ["git", "cheatsheet"]
eng: true
---


# Git Commands Quick Review


![alt text](img.png)


**Welcome to this comprehensive and practical Git commands guide!**

First, I should mention that you should have basic familiarity with Git, or if you don't, use AI assistance for any parts you don't understand. However, if you already have prior knowledge and want to quickly review key Git concepts, this article is exactly what you need.

Here, we cover all essential Git commands and concepts with simple language and practical examples. We start from installation and initial setup and progress to more advanced topics like branching strategies and conflict management.

**In this article you'll learn:**

- **Git Basics**: Installation, initial configuration, starting a new project or cloning an existing one, and daily commands like `add`, `commit`, and `push`
- **Key Concepts**: Deep understanding of concepts like origin, HEAD, stage, and their differences with clear examples
- **Working with Branches**: Creating, merging, and deleting branches, along with important notes about pushing local branches to remote
- **Going Backwards**: Difference between `reset --soft`, `--mixed`, and `--hard`, and when to use each
- **Tagging and Version Management**: Proper methods for marking different project versions
- **Branching Strategies**: Introduction to GitHub Flow and Git Flow and choosing the best approach for your project
- **Merge vs Rebase**: Differences, advantages, disadvantages, and when to use each
- **Solving Common Problems**: Practical solutions for conflicts, incorrect commits, files forgotten in gitignore, and recovering deleted commits

---

## Getting Started with Git

### Installation and Initial Setup

```bash
# Set name and email (only once)
git config --global user.name "Your Name"
git config --global user.email "email@example.com"

# View current settings
git config --list
```

**Explanation**: These global configurations are stored in your user profile and apply to all Git repositories on your system. The `--global` flag ensures you don't have to set this for every project.

### Starting a New Project

There are two scenarios:

#### Scenario 1: Starting from Scratch
```bash
# Navigate to project folder
cd /path/to/your/project

# Initialize Git
git init

# Add remote (GitHub, GitLab, etc.)
git remote add origin https://github.com/username/project-name.git
```

**Explanation**: `git init` creates a hidden `.git` folder in your project directory that tracks all changes. The remote connection links your local repository to a server where you can back up and collaborate.

#### Scenario 2: Cloning an Existing Project
```bash
git clone https://github.com/username/project-name.git
cd project-name
```

**Explanation**: Cloning automatically sets up the remote connection and downloads the entire project history, not just the latest files.

---

## Routine Git Commands

### Checking Project Status

```bash
# See which files have changed
git status
```

**Example output from `git status`:**

```
On branch main
Your branch is up to date with 'origin/main'.

Changes to be committed:
  (use "git restore --staged <file>..." to unstage)
        modified:   README.md
        modified:   package.json

Changes not staged for commit:
  (use "git add <file>..." to update what will be committed)
        modified:   src/App.tsx
        modified:   vite.config.ts
```

**Explanation**: This output shows three states:
- Files "to be committed" are staged (ready for commit)
- Files "not staged" are modified but not yet added to staging
- Your current branch and its sync status with remote

### Adding Files to Stage

```bash
# All changed files
git add .

# A specific file
git add filename.js

# Multiple specific files
git add file1.js file2.css file3.html
```

**Explanation**: Staging is like preparing a package before shipping. You choose exactly which changes to include in your next commit. The `.` means "all files in current directory and subdirectories."

### Committing Changes

```bash
# Commit with message
git commit -m "Description of changes"

# Commit all changes (without needing git add)
git commit -am "Commit message"
```

**Explanation**: The `-a` flag automatically stages all modified tracked files (but not new untracked files). Each commit creates a permanent snapshot in your project's history.

### Pushing to Server

```bash
# Push to main branch
git push origin main

# Push to another branch (e.g., dev)
git push origin dev
```

**Explanation**: This uploads your local commits to the remote repository, making them available to team members and backing them up.

---

## What is Origin?

`origin` is an alias for your remote repository address. Instead of typing the full address every time:

```bash
git push https://github.com/myuser/myproject.git main
```

You can write:

```bash
git push origin main
```

**Explanation**: You can have multiple remotes (origin, upstream, etc.), but origin is the default name created when you clone or add your first remote.

### Viewing Defined Remotes

```bash
git remote -v
```

**Output:**
```
origin  https://github.com/myuser/myproject.git (fetch)
origin  https://github.com/myuser/myproject.git (push)
```

**Explanation**: The `(fetch)` and `(push)` indicate separate URLs for downloading and uploading, though they're usually the same.

---

## Important Notes Before Committing

### 1. Always Run git status
Always run `git status` before `git add .` to see which files have changed.

**Explanation**: This prevents accidentally committing sensitive files or debugging code you forgot to remove.

### 2. Don't Forget .gitignore
Always put sensitive files (passwords, tokens, config files) in `.gitignore`:

```
# Example .gitignore
node_modules/
.env
*.log
.DS_Store
dist/
```

**Explanation**: Files listed in .gitignore are completely ignored by Git. This prevents secrets from being uploaded to public repositories and keeps your repo clean of generated files.

### 3. Write Meaningful Commit Messages
```bash
# Bad ❌
git commit -m "fix"

# Good ✅
git commit -m "Fix login bug on home page"
```

**Explanation**: Good commit messages help you and your team understand what changed and why, especially when reviewing history months later.

---

## Working with Branches

### Creating and Using Branches

```bash
# Go to main branch
git checkout main

# Ensure latest version
git pull origin main

# Create new branch
git branch feature/login-page

# Switch to new branch
git checkout feature/login-page

# Or do both with one command
git checkout -b feature/login-page
```

**Explanation**: Branches allow you to work on features independently without affecting the main codebase. The `-b` flag combines creation and switching into one step.

### Pushing Branch to Remote

**Important Note**: Local branches don't automatically go to remote! You must manually push them:

```bash
# Push new branch to remote
git push origin feature/login-page
```

**Explanation**: This creates the branch on the remote server. After this, others can see and checkout your branch. You may need to set up tracking with `git push -u origin feature/login-page` for future pushes.

### Merging Branches

```bash
# Return to main
git checkout main

# Get latest changes
git pull origin main

# Merge branch
git merge feature/login-page

# Push changes
git push origin main
```

**Explanation**: Merging combines the histories of two branches. Always pull before merging to ensure you have the latest changes and minimize conflicts.

### Deleting Branches

```bash
# Delete locally
git branch -d feature/login-page

# Delete from remote
git push origin --delete feature/login-page
```

**Explanation**: The `-d` flag only deletes if the branch has been merged. Use `-D` to force deletion of unmerged branches (be careful!).

---

## Reset and Going Backwards

### Types of git reset

#### 1. git reset --soft
```bash
git reset --soft HEAD~1
```
- Removes commit but changes remain staged
- Useful for editing the last commit message

**Explanation**: This is the safest reset. Your files are untouched and still staged, you just undo the commit itself. Perfect for fixing a typo in the commit message.

#### 2. git reset --mixed (default)
```bash
git reset HEAD~1
# or
git reset --mixed HEAD~1
```
- Removes commit, changes become unstaged
- Files remain in working directory

**Explanation**: This unstages the changes but keeps your modified files. Use this when you want to reorganize what goes into commits.

#### 3. git reset --hard (Dangerous!)
```bash
git reset --hard HEAD~1
```
- Deletes everything! Commit, stage, and file changes
- Irreversible (unless using git reflog)

**Explanation**: This is destructive - your actual file changes are lost. Only use when you're absolutely sure you want to throw away work.

### The Concept of HEAD

`HEAD` is a pointer to your current position in Git. It usually points to the latest commit.

#### HEAD States

**1. Attached**: Points to a branch
```bash
git checkout main  # HEAD attached to main
```

**2. Detached**: Points directly to a commit
```bash
git checkout a1b2c3d  # HEAD detached
```

**Warning**: In detached state, if you commit, your changes might be lost!

**Explanation**: In detached HEAD, you're not on any branch. Any commits you make won't be attached to a branch and could become unreachable. Create a branch if you want to keep work done in detached state.

---

## Tagging

Tags are used to mark important versions:

```bash
# Create annotated tag with description
git tag -a v1.0.0 -m "First product version"

# Push tag to remote
git push origin v1.0.0

# Push all tags
git push origin --tags

# View tags
git tag

# View tag details
git show v1.0.0

# Delete local tag
git tag -d v1.0.0

# Delete tag from remote
git push origin --delete v1.0.0
```

**Note**: Tags are immutable! They always point to the same commit.

**Explanation**: Tags are like bookmarks for important points in history (releases, milestones). Annotated tags (with `-a`) store who created them and when, making them better for releases than lightweight tags.

---

## Branching Strategies

### 1. GitHub Flow (Simple and Popular)

Suitable for small to medium projects:

```
main ─────────────────►
  │
  └── feature/login ──┘
```

**Flow:**
- All work starts from `main`
- Each feature in separate branch
- Pull Request for review
- Merge and Deploy

**Explanation**: This is the simplest professional workflow. Main is always deployable, features are developed in branches, and everything is reviewed via pull requests before merging.

### 2. Git Flow (More Complex)

Suitable for large projects:

```
main ─────────────────►
develop ──────────────►
  │
  ├── feature/login ──┘
  ├── release/v1.0 ───┘
  └── hotfix/bug ─────┘
```

**Branches:**
- **main**: Production-ready code
- **develop**: Development code
- **feature/***: New features
- **release/***: Preparing new version
- **hotfix/***: Urgent bug fixes

**Explanation**: Git Flow adds more structure with separate development and release branches. It's better for projects with scheduled releases, but adds complexity that small teams don't need.

### Choosing a Strategy

| Team Size | Release Frequency | Recommendation |
|-----------|------------------|----------------|
| 1-5 people | Daily/Weekly | GitHub Flow |
| 5-20 people | Bi-weekly | GitHub Flow + Organization |
| 20+ people | Monthly | Git Flow |

**Explanation**: Simpler workflows work better for small teams that deploy frequently. Complex workflows help coordinate large teams with formal release cycles.

---

## Merge vs Rebase

### Merge
```bash
git checkout main
git merge feature/login
```

**Characteristics:**
- History is preserved
- Creates a merge commit
- Safe for team collaboration

**Explanation**: Merge creates a new commit that combines two branches. The history shows exactly when and how branches were integrated, making it easy to understand the project timeline.

### Rebase
```bash
git checkout feature/login
git rebase main
```

**Characteristics:**
- Linear and clean history
- Commits are rewritten
- **Only for local branches!**

**Warning**: Never use rebase on branches that others are working on!

**Explanation**: Rebase rewrites history by replaying your commits on top of another branch. This creates a cleaner timeline but changes commit hashes, which causes problems if others have those commits.

---

## git push -f (Force Push)

Sometimes you need to force push changes:

```bash
git push -f origin main
# or
git push --force origin main
```

**Dangerous**: This command rewrites remote history and can break others' work!

**Explanation**: Force push replaces the remote branch completely with your local version. If teammates have pulled the old version, they'll have conflicts and lost commits.

### Safer Usage:
```bash
git push --force-with-lease origin main
```

This command won't push if someone else has made changes.

**Explanation**: `--force-with-lease` checks if the remote has changed since you last fetched. It prevents you from accidentally overwriting someone else's work.

---

## Useful Tips and Tricks

### 1. Viewing Change Log
```bash
# Simple log
git log

# Condensed log
git log --oneline

# Graphical log
git log --graph --oneline
```

**Explanation**: The `--oneline` flag shows one commit per line for easier scanning. `--graph` draws ASCII art showing branch structure.

### 2. Comparing Changes
```bash
# Compare working directory with stage
git diff

# Compare staged with last commit
git diff --staged

# Compare two commits
git diff commit1 commit2
```

**Explanation**: `git diff` shows line-by-line changes. Without arguments, it shows unstaged changes. `--staged` shows what will be in your next commit.

### 3. Stash (Temporary Storage)
```bash
# Temporarily save changes
git stash

# View stashes
git stash list

# Restore last stash
git stash pop

# Apply specific stash
git stash apply stash@{2}
```

**Explanation**: Stash is like a clipboard for changes. Use it when you need to quickly switch branches but aren't ready to commit. `pop` applies and removes the stash, while `apply` keeps it in the list.

### 4. Aliases (Shortcuts)
```bash
# Define shortcuts
git config --global alias.st status
git config --global alias.co checkout
git config --global alias.br branch

# Now you can write:
git st  # instead of git status
git co main  # instead of git checkout main
```

**Explanation**: Aliases save typing for frequently used commands. You can create complex aliases for multi-step operations.

---

## Common Problems and Solutions

### 1. Forgetting .gitignore
```bash
# Remove file from tracking (but keep locally)
git rm --cached filename

# Remove folder from tracking
git rm -r --cached foldername/
```

**Explanation**: This removes files from Git's index without deleting them from your hard drive. After this, add them to .gitignore so they stay untracked.

### 2. Too Many Commits
If you have too many unnecessary commits:

```bash
# Create new branch
git checkout -b cleanup-branch

# Work on it
# Later merge with main
```

**Explanation**: You can also use `git rebase -i` (interactive rebase) to squash multiple commits into one, but only on commits you haven't pushed.

### 3. Merge Conflicts
```bash
# View conflicted files
git status

# Manually edit files
# Remove markers <<<<<<< ======= >>>>>>>

# Add resolved files
git add conflicted-file.js

# Complete merge
git commit
```

**Explanation**: Conflicts occur when the same lines are changed in both branches. Git marks the conflicts with `<<<<<<<`, `=======`, and `>>>>>>>`. You must manually choose which version to keep or combine them.

### 4. Recovering Deleted Commits
```bash
# View complete history
git reflog

# Return to specific commit
git checkout commit-hash

# Create new branch from that point
git checkout -b recovered-branch
```

**Explanation**: `reflog` records every movement of HEAD, even deleted commits. It's your safety net for recovering "lost" work, but entries expire after ~90 days by default.

---

## Best Practices:

### 1. Branch Naming
```bash
# Good ✅
feature/user-authentication
bugfix/login-error
hotfix/critical-security-patch

# Bad ❌
my-branch
test
fix
```

**Explanation**: Descriptive names help everyone understand what a branch does. Prefixes like `feature/`, `bugfix/`, `hotfix/` add organization.

### 2. Commit Messages
```bash
# Good ✅
"Add user authentication system"
"Fix responsive design on mobile devices"
"Update dependencies to latest versions"

# Bad ❌
"fix"
"update"
"changes"
```

**Explanation**: Start with a verb in imperative mood ("Add", "Fix", "Update"). Be specific about what changed and why. First line should be under 50 characters for readability.

### 3. Regular Commits
- One complete feature = one commit
- Commit related changes together
- Small commits are better than large ones

**Explanation**: Small, focused commits make it easier to review changes, identify bugs, and revert specific features without losing other work.

### 4. Short-lived Branches
- One branch per task or feature
- Delete quickly after merge
- Don't leave branches open for more than a few days

**Explanation**: Long-lived branches drift from main and create merge conflicts. Short branches stay fresh and integrate easily.

---

This guide covers essential Git workflows from beginner to intermediate level. The key is practicing these commands regularly until they become second nature.