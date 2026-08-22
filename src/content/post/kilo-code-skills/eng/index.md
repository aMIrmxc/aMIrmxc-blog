---
title: "Kilo Code Skills: How to Build, Use, Test, and Debug Custom Skills"
description: "Learn how to build and debug custom Kilo Code Skills with `SKILL.md`, including Skill locations, triggering behavior, testing and debugging workflows, and security considerations for scripts and shell commands. 🛠️"
post_id: "kilo-code-skills"
publishDate: "1 Aug 2026"
tags: ["kilo-code", "skills", "skill.md", "troubleshooting"]
author: "amirmxc"
authorUrl: "https://github.com/amirmxc"
eng: true
---

# Kilo Code Skills: How to Build, Use, and Debug Custom AI Skills


![Cover image](img.png)

A custom Skill is useful when you keep giving Kilo Code the same instructions for the same kind of work.

You might have a project-specific API style, a repeatable review process, or a specialized workflow that should be available whenever a matching task comes up. Kilo Code Skills let you package that knowledge in a reusable directory centered on `SKILL.md`, with optional scripts, references, and assets.

But creating `SKILL.md` is only the first step.

A useful Skill has a lifecycle:

**Create → Discover → Invoke → Verify → Debug → Secure → Maintain**

This guide covers that lifecycle, including where Skills live, how Kilo decides when to use one, how to test a Skill without relying on guesswork, and how to troubleshoot common failures.


## What Kilo Code Skills Are—and When to Use One

Kilo Code implements the open Agent Skills format. At its core, a Skill is a directory containing a `SKILL.md` file with metadata and instructions. A Skill can also package supporting resources such as `scripts/`, `references/`, and `assets/`.

The simplest way to think about it is:

> **A Skill packages reusable expertise and workflow instructions for a class of tasks.**

That makes it different from a one-off prompt. Instead of pasting the same instructions into multiple conversations, you maintain them in one reusable artifact.

### Skills vs. Rules, Workflows, Subagents, and MCP

Kilo provides several customization mechanisms, including rules, instructions, subagents, permissions, workflows, and Skills. The following is a **practical decision framework**, not an official Kilo taxonomy.

| Need | A good starting point |
|---|---|
| Reusable knowledge for a class of tasks | **Skill** |
| Broad behavioral constraints or persistent guidance | **Rule / Instruction** |
| A defined multi-step process | **Workflow** |
| A specialized agent with its own configuration | **Subagent** |
| External tools, services, or data | **MCP** |

For example, an API design standard can make sense as a Skill because it contains knowledge that is relevant to a recognizable category of work.

A rule such as "do not commit secrets" is broader and may belong in project instructions.

A fixed release sequence is a better Workflow candidate.

A specialized security analyst with separate agent behavior may be better modeled as a Subagent.

An integration that exposes an external service to the agent belongs in MCP territory.

The goal is not to find a perfectly exclusive category. It is to choose the abstraction that best matches what you are trying to reuse.


## How Kilo Code Discovers and Uses Skills

The most important concept to understand is that these are different states:

**Available is not the same as invoked, and invoked is not the same as effective.**

Kilo's current Skills documentation describes the process roughly like this:

1. **Discovery:** Kilo scans configured Skill directories and reads metadata such as the Skill's name, description, and path.
2. **Prompt inclusion:** metadata for available Skills is exposed to the active agent context.
3. **Selection:** the agent decides whether a Skill clearly applies to the current task.
4. **On-demand loading:** the agent invokes the Skill and Kilo loads the full `SKILL.md` into context.

That gives you a better debugging model:

```text
SKILL.md exists
      ↓
Kilo discovers it
      ↓
Skill is available
      ↓
Agent decides it applies
      ↓
Skill is invoked
      ↓
Instructions affect the workflow
```

These stages matter because each one can fail independently.

A missing Skill path is a discovery problem.

A vague description can become an applicability problem.

A successful `skill` tool call proves that the Skill was invoked, but it does not prove that the resulting work followed the instructions correctly.

### How the agent decides to use a Skill

Kilo's documentation says the agent decides whether a Skill applies based on the `description` field. It specifically says there is no simple keyword-matching or semantic-search mechanism; the LLM evaluates whether a Skill "clearly and unambiguously applies" to the request.

That makes the description part of the Skill's interface.

A directory can be perfectly configured and a `SKILL.md` can be syntactically valid, yet the Skill can still be a poor candidate for automatic selection if its description is too vague.


## Where to Put Kilo Code Skills

Kilo currently documents multiple Skill locations for global, project, compatibility, and remote use.

| Scope / source | Current location or configuration | Typical use |
|---|---|---|
| Global | `~/.kilo/skills/` on macOS/Linux | Personal Skills |
| Global | `\Users\<yourUser>\.kilo\skills\` on Windows | Personal Skills |
| Project | `.kilo/skills/` | Repository-specific Skills |
| Agent Skills compatibility | `.agents/skills/` | Portable Skills |
| Claude Code compatibility | `.claude/skills/` | Claude-compatible layout when compatibility is enabled |
| Additional local paths | `skills.paths` in `kilo.jsonc` | Shared/local Skill directories |
| Remote Skills | `skills.urls` in `kilo.jsonc` | Skills served from remote locations |

Kilo's current documentation also says that when multiple Skills share the same name, project-level Skills take precedence over global Skills. Compatibility directories and additional configured paths are loaded alongside them.

### Project vs. global Skills

A practical rule is:

> **Put project conventions in the repository; put genuinely personal and reusable Skills in your global directory.**

That keeps project behavior reproducible instead of depending on one developer's machine.

### Additional Skill paths

Kilo documents `skills.paths` for adding additional local Skill directories:

```jsonc
{
  "skills": {
    "paths": [
      "/path/to/shared/skills",
      "~/my-skills",
      "relative/skills"
    ]
  }
}
```

The same configuration area can define remote Skill sources with `skills.urls`. Kilo's current documentation says a remote Skill directory must expose an `index.json` manifest describing the Skills and the files to fetch.

If you use these settings, keep the exact configuration aligned with the current Kilo version you are running.

### A note about old `.kilocode` examples

Older material may still refer to `.kilocode/skills/`. The current Skills documentation uses `.kilo/skills/` as the documented global and project location, so current articles should lead with `.kilo/` rather than presenting legacy paths as the default.


## Build Your First Kilo Code Skill

For a project-level Skill, the basic structure is:

```text
your-project/
└── .kilo/
    └── skills/
        └── api-design/
            └── SKILL.md
```

Kilo's official example uses the following Unix-style command:

```bash
mkdir -p ~/.kilo/skills/api-design
```

That command is appropriate for macOS/Linux or a compatible shell. On Windows, create the equivalent directory under your user `.kilo\skills` location instead.

Now create:

```text
~/.kilo/skills/api-design/SKILL.md
```

A practical version might look like this:

```markdown
name: api-design
description: Use when designing or reviewing REST APIs, including endpoint naming, HTTP methods, response codes, pagination, request validation, and API error handling.

# API Design Guidelines

When designing or reviewing REST APIs:

## Resource naming

- Use plural nouns for resources.
- Use kebab-case for multi-word resources.
- Avoid unnecessary nesting.

## HTTP methods

- Use GET for retrieval.
- Use POST for creation.
- Use PUT for complete replacement.
- Use PATCH for partial updates.
- Use DELETE for removal.

## Review checklist

When reviewing an API:

1. Check resource naming.
2. Check HTTP method semantics.
3. Check response codes.
4. Check validation and error handling.
5. Check pagination for collection endpoints.
6. Check consistency with existing project conventions.
```

This structure follows the current Kilo Skill format: required YAML frontmatter followed by Markdown instructions. Kilo documents `name` and `description` as required fields and specifies limits and allowed characters for the `name` field.

### Keep the name aligned with the directory

Kilo's current Skills page explicitly documents a Name Matching Rule: the `name` field should match the parent directory exactly. It also contains a contradictory troubleshooting sentence saying the opposite. Because the explicit rule and the documented common-error fix both require a match, the safest current practice is to make them identical.

For example:

```text
skills/
└── api-design/
    └── SKILL.md
```

with:

```yaml
name: api-design
```

### Reload after editing

Kilo says Skills are discovered when a session starts. It also documents `/reload` as the way to rescan Skills without starting a new session. In the CLI, a new session or `kilo run` triggers loading; in the VS Code extension, Skills load when the extension connects to the CLI server.

After changing a Skill:

```text
1. Save SKILL.md
2. Run /reload
3. Check that the Skill is available
4. Test the intended task
```


## Write a Skill Description That Matches Real Tasks

A Skill can be structurally correct and still be hard for the agent to select.

Compare these descriptions:

```yaml
description: API design best practices
```

and:

```yaml
description: Use when designing or reviewing REST APIs, including endpoint naming, HTTP methods, response codes, pagination, request validation, and API error handling.
```

The second description gives the agent clearer information about **what the Skill does and when it should be considered**.

Kilo's current documentation explicitly recommends specific descriptions and says that vague descriptions lead to uncertain matching.

### Describe tasks, not just subjects

This:

> "Frontend development guidelines"

describes a topic.

This:

> "Use when building or reviewing React components, especially accessibility, state handling, component structure, and reusable UI patterns."

describes recognizable work.

That distinction makes your Skill easier to reason about and easier to test.

### Avoid overlapping Skills

Imagine you have:

```text
api-design
backend-review
rest-guidelines
```

If all three describe broad API-related work, you have created an ambiguity problem.

A cleaner division might be:

```text
api-design
→ API contracts, resources, HTTP semantics

backend-review
→ broader backend code review

rest-testing
→ API test design and validation
```

Each Skill should have a recognizable job.

### Explicit invocation is useful for testing

Kilo's documentation says explicitly naming a Skill in a request triggers it because the agent sees the Skill name. That makes explicit invocation useful as a diagnostic test.

It lets you separate two questions:

> **Does Kilo know the Skill exists?**

from:

> **Will the agent decide this Skill applies automatically?**

Those are not the same test.


## Add References, Scripts, and Assets

A Skill can stay small at the top level while still carrying substantial supporting material.

Kilo documents these optional directories:

```text
api-design/
├── SKILL.md
├── scripts/
├── references/
└── assets/
```

`SKILL.md` is the only required file.

### `references/`

Use this for supporting documentation.

For example:

```text
references/
├── api-style-guide.md
├── error-format.md
└── pagination.md
```

The benefit is organizational: the core Skill can describe the workflow without becoming a giant reference manual.

### `scripts/`

Use this for repeatable helper operations:

```text
scripts/
└── validate-api-spec.sh
```

A script can make a repeated validation step reproducible rather than relying on the model to re-create the same command from memory.

### `assets/`

Use this for templates and other supporting resources:

```text
assets/
└── endpoint-template.md
```

Think of the Skill as a package:

> **instructions + optional resources**

rather than a single Markdown file with everything embedded.


## Use Shell Commands in Skills Safely

Kilo's current Skills documentation supports embedded shell commands using the form:

```text
!`command`
```

For example:

```markdown
The current working tree contains:

!`git status --short`
```

The command output can be incorporated into the Skill content before the model receives it.

This is useful for repository-aware Skills, but it also creates a security boundary.

### Trusted vs. untrusted Skills

Kilo documents restrictions around embedded command execution. Trusted Skill locations can execute embedded commands after approval, while project-local and remote Skills do not execute those commands in the same way. The current documentation also says the user must approve command execution.

There is also an environment variable for disabling Skill shell execution:

```text
KILO_DISABLE_SKILL_SHELL
```

Use it when your environment should not allow embedded Skill shell commands.

The important security distinction is:

> **Being allowed to execute a command does not make the Skill trustworthy.**

A Skill containing executable content should be reviewed like code before you put it in a trusted location.

For a tutorial, keep examples read-only and harmless:

```markdown
Current Git status:

!`git status --short`
```

Avoid examples that delete files, modify credentials, change system configuration, or perform destructive Git operations.


## Debug a Kilo Code Skill That Isn't Working

When a Skill fails, don't start by rewriting everything.

First determine **which stage failed**.

### 1. Is Kilo discovering the Skill?

Check:

- the Skill is under a supported location;
- `SKILL.md` is directly inside the Skill directory;
- `name` and `description` exist in frontmatter;
- the Skill directory and `name` are aligned;
- your `skills.paths` or `skills.urls` settings are correct, if you use them.

Kilo's troubleshooting section explicitly calls out frontmatter, file location, and configuration paths.

Expected:

```text
.kilo/
└── skills/
    └── api-design/
        └── SKILL.md
```

Not:

```text
.kilo/
└── skills/
    └── api-design/
        └── docs/
            └── SKILL.md
```

### 2. Reload it

After adding or changing a Skill:

```text
/reload
```

Kilo documents `/reload` for refreshing Skills without starting a new session.

### 3. Is the Skill available?

Kilo recommends asking the agent directly:

```text
Do you have access to skill api-design?
```

or:

```text
Is the skill called api-design loaded?
```

This checks **availability**. It does not prove that the Skill will automatically be selected for a particular task.

### 4. Was the Skill actually invoked?

Kilo documents that when the agent uses a Skill, it invokes the `skill` tool with the Skill's name.

So inspect the conversation or tool trace for a call like:

```text
skill
  name: api-design
```

That confirms invocation. It does **not** prove the instructions were followed correctly.

This distinction is important:

```text
Available
   ↓
Invoked
   ↓
Effective
```

A tool call is evidence of the middle state, not the final one.

### 5. Does the description match the task?

If the Skill is available but the agent does not invoke it for a task that looks relevant, revisit the description.

For example:

```yaml
description: Backend API stuff
```

is broad.

This is much more specific:

```yaml
description: Use when designing or reviewing REST APIs, including endpoint naming, HTTP methods, response codes, pagination, validation, and API error handling.
```

Then test several ways of asking for the same job.

### 6. Are multiple Skills competing?

If two Skills overlap heavily, narrow their responsibilities and descriptions.

### 7. Are resource or permission problems involved?

If the Skill is invoked but fails while reading a supporting file or running a script, investigate resource paths and permission behavior instead of changing the overall Skill description.

GitHub has documented historical permission issues involving Skill resources. Those issues are useful evidence that permissions can be part of the failure surface, but an old issue should not be treated as proof that the same bug still exists today. 


## Test Whether a Skill Really Triggers

A Skill is easier to maintain when you test it deliberately instead of relying on one successful prompt.

Start with a small matrix:

| Test | Example request | What to observe |
|---|---|---|
| Explicit | "Use the `api-design` skill to review this endpoint." | Was the Skill invoked? |
| Exact task | "Review these REST endpoints for consistency." | Was the Skill selected? |
| Paraphrase | "Check this API contract and HTTP semantics." | Does behavior remain consistent? |
| Related task | "Review the backend service architecture." | Does the Skill stay within scope? |
| Negative | "Fix this CSS layout." | Does the Skill stay inactive? |
| Ambiguous | "Review the API tests and endpoint naming." | Do overlapping Skills create ambiguity? |

For each test, record:

- prompt;
- expected behavior;
- whether the `skill` tool was invoked;
- what the agent did;
- whether the result actually followed the Skill's instructions.

### Test the description, too

You can also compare two descriptions while keeping the Skill body constant.

**Version A:**

```yaml
description: API design best practices
```

**Version B:**

```yaml
description: Use when designing or reviewing REST APIs, including endpoint naming, HTTP methods, response codes, pagination, request validation, and API error handling.
```

Run the same prompt set against both.

The useful metric is not:

> "Which description is universally better?"

It is:

> "Which description produced better results under this exact Kilo version, model, environment, and prompt set?"

That makes the exercise a reproducible local test, not a universal benchmark of Kilo Skill reliability.


## Common Kilo Code Skill Failure Modes

Once you separate discovery, invocation, and effectiveness, the usual failures become easier to diagnose.

| Symptom | Likely stage | What to check |
|---|---|---|
| Skill doesn't appear | Discovery | Path, frontmatter, directory structure |
| Skill appears but isn't invoked | Selection | Description, task match, overlapping Skills |
| Skill is invoked but behavior is wrong | Effectiveness | Instructions, scope, references, examples |
| Supporting file cannot be accessed | Resource / permissions | File path, permissions, current runtime behavior |
| Duplicate names behave unexpectedly | Scope / precedence | Current project/global resolution |
| Remote Skill is not what you expect | Remote loading | URL, manifest, files, refresh behavior |

### Duplicate Skill names

Kilo's current documentation says project Skills take precedence over global Skills when names collide.

That should be treated as the documented current behavior, not a reason to casually create duplicate names everywhere.

There is also a historical GitHub issue documenting a project/global precedence bug caused by load order. The issue was closed after a fix, so the correct editorial lesson is not "Kilo currently has a precedence bug." It is:

> **Precedence is important enough to verify after significant upgrades when duplicate names matter.**


## Build Skills You Can Maintain and Share

A good Skill should look more like a small software component than a giant prompt.

### Give each Skill one clear responsibility

A Skill should answer:

> "What class of work is this package responsible for?"

If one Skill covers API design, frontend styling, deployment, Git operations, release management, and testing, its trigger conditions become harder to define.

Splitting is usually sensible when two workflows have different:

- trigger conditions;
- supporting resources;
- success criteria.

### Keep `SKILL.md` focused

Put the essential workflow in the main file.

Use:

```text
references/
```

for supporting documentation,

```text
scripts/
```

for repeatable helper operations,

and:

```text
assets/
```

for templates and other resources.

This gives you a cleaner boundary between instructions and supporting material.

### Version-control project Skills

Project Skills are naturally suited to Git because they encode repository-specific behavior.

Keeping them in the project makes them visible to the team and gives you:

- review history;
- change tracking;
- rollback;
- reproducibility.

### Test negative cases

A Skill is not well designed just because it activates on one intended prompt.

Ask:

> **What should make this Skill not run?**

Negative testing is one of the easiest ways to expose an overly broad description.

### Re-test after Kilo upgrades

Kilo is actively developed, and its release stream continues to change. The current GitHub release page lists **v7.4.20**, released August 4, 2026.

That does not mean every Skill needs a formal regression suite. For important team Skills, however, a short set of positive, negative, and ambiguous prompts is worth rerunning after major updates.


## Share and Reuse Kilo Code Skills

Kilo's official Skills repository is built around the Agent Skills format and is intended to provide reusable Skills for Kilo and compatible agents.

The current Kilo documentation says the new platform does not yet have a built-in marketplace UI. Instead, developers can find/share Skills through the Kilo Marketplace repository, the open Agent Skills specification, or remote URLs configured through `skills.urls`.

For a team-owned repository, a project layout can stay simple:

```text
project/
└── .kilo/
    └── skills/
        ├── api-design/
        │   └── SKILL.md
        └── release-review/
            └── SKILL.md
```

This gives the project a reproducible Skill set without relying on every developer having identical personal configuration.

### Cross-agent compatibility

Using the Agent Skills format can improve portability, but file-format compatibility does not guarantee identical runtime behavior across different agents.

A Skill should therefore be tested in each target environment where its behavior matters.


## Kilo Code Skills vs. Other Customization Options: A Practical Decision Framework

When deciding what to create, start with the responsibility of the artifact.

| If you need to... | Start with |
|---|---|
| Reuse specialized knowledge for matching tasks | **Skill** |
| Apply a broad behavioral constraint | **Rule / Instruction** |
| Run a defined sequence of steps | **Workflow** |
| Give a specialized agent a distinct role/configuration | **Subagent** |
| Expose external tools or data | **MCP** |

These choices can overlap.

For example, a release process could use a Workflow and also rely on Skills for domain-specific review instructions.

The important question is:

> **What part of the workflow are you trying to make reusable?**


## FAQ

### What is a Kilo Code Skill?

A Kilo Code Skill is a reusable package of specialized knowledge, capabilities, or workflow instructions centered on a `SKILL.md` file. Kilo also supports optional scripts, references, and assets as part of a Skill package.

### How do I create a custom Skill in Kilo Code?

Create a Skill directory in a supported location, add a `SKILL.md` with the required `name` and `description` frontmatter, add the instructions, then reload Kilo or start a new session.

### Where should `SKILL.md` be stored?

Current Kilo documentation lists global Skills under the user's `.kilo/skills` directory, project Skills under `.kilo/skills/`, compatibility directories such as `.agents/skills/` and `.claude/skills/`, plus configured local paths and remote URLs.

### Why isn't my Kilo Code Skill being used?

First determine whether the Skill is available. Then check whether the agent actually invoked the `skill` tool. If the Skill is available but not invoked for a relevant task, examine the description and look for overlapping Skills. If it was invoked but the resulting work is wrong, inspect the Skill instructions and supporting resources.

### Do I need to restart Kilo after changing a Skill?

Not necessarily. Kilo documents `/reload` for rescanning Skills without starting a new session.

### Can Kilo Code Skills run shell commands?

Yes. Kilo documents embedded shell commands inside Skills, along with trust and permission restrictions. The current documentation also provides `KILO_DISABLE_SKILL_SHELL` to disable embedded Skill shell execution.

### Can Kilo Code Skills work with other AI coding agents?

Kilo implements the open Agent Skills format, which is designed for interoperability across compatible agents. That means the Skill format can be portable, but individual agents may still behave differently.

### How can I verify that Kilo actually used my Skill?

Look for a `skill` tool call containing the Skill name. That confirms invocation. It does not, by itself, prove that the Skill's instructions were followed correctly, so inspect the resulting behavior as well.


## Build Skills Around a Lifecycle, Not a File

The first version of a Skill is often just a directory and `SKILL.md`.

A useful production Skill goes further:

```text
Create
  ↓
Discover
  ↓
Invoke
  ↓
Verify
  ↓
Debug
  ↓
Secure
  ↓
Maintain
```

Start with one focused responsibility. Make the `description` explicit about when the Skill applies. Keep the core instructions in `SKILL.md`, and move supporting material into `references/`, `scripts/`, or `assets/` when appropriate.

When the Skill does not behave as expected, don't immediately rewrite it. First ask:

1. Was it discovered?
2. Is it available?
3. Was it invoked?
4. Was it effective?
5. Did permissions or supporting resources get in the way?

That sequence turns Skill debugging from guesswork into a reproducible workflow.

And when a Skill matters to a real project, treat it like code: version-control it, test positive and negative cases, review executable content carefully, and recheck important behavior after Kilo updates.
