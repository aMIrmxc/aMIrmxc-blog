---
title: "Kilo Code Custom Subagents: How to Build and Manage Custom AI Subagents"  
description: "Learn how to build custom subagents in Kilo Code, configure agent permissions and models, delegate tasks, and design a practical multi-agent workflow for AI-powered development. 🤖"  
post_id: "kilo-code-custom-subagents"  
publishDate: "4 Aug 2026"  
tags: ["kilo-code", "subagents", "ai-agents", "multi-agent"]  
author: "amirmxc"  
authorUrl: "https://github.com/amirmxc"  
eng: true
---


# Kilo Code Custom Subagents: Build Your Own AI Development Team

![Cover image](img.png)

A coding agent can investigate a repository, write code, run tests, review a diff, and explain the result. But asking one agent to do all of those jobs is not always the best way to structure the work.

Research and code review need a different scope from implementation. A security audit may need to read everything but modify nothing. A test-writing agent may need edit access, while a repository explorer should remain read-only.

Kilo Code custom subagents let you separate those responsibilities. You can define specialized agents with their own prompts, models, tool access, and permissions, then invoke them manually or let a primary agent delegate focused tasks to them. Each subagent runs in its own isolated session, and its result is returned to the parent agent.

The useful way to think about the feature is not “more AI agents.” It is **better separation of engineering responsibilities**.

This guide shows how to build that separation, from your first custom subagent to a small development team—and how to decide when a subagent is the right abstraction versus Kilo Code Agent Manager.

## What Are Kilo Code Custom Subagents?

Kilo Code defines subagents as agents that operate as delegates of primary agents. Primary agents such as Code, Plan, and Debug are the assistants you interact with directly; subagents handle more focused tasks in isolated contexts.

A useful mental model is:

```text
Primary Agent
     │
     ├── Task → Explorer
     │
     ├── Task → Implementer
     │
     └── Task → Reviewer
                │
                └── Result → Primary Agent
```

A custom subagent can have:

- a focused description;
- a custom system prompt;
- a specific model;
- tool permissions;
- a `subagent`, `primary`, or `all` mode;
- an iteration limit through `steps`;
- optional display or lifecycle settings such as `hidden` or `disable`.

Kilo currently ships with two built-in subagents:

- `general`, for broader research and multi-step work;
- `explore`, a fast read-only agent for codebase exploration.

Custom subagents are useful when those built-in roles are not specific enough for your workflow.

### Subagents are not just extra chat tabs

The main distinction is context and responsibility.

A primary agent may be working on:

> “Add refresh-token rotation to this application.”

It can delegate a narrower question:

> “Inspect the existing authentication flow and identify where refresh tokens are created, stored, and validated.”

The delegated worker focuses on that question in its own session. Its result is then returned to the parent.

That makes subagents especially useful for tasks that have a clear scope and a useful result that can be handed back.

### When should a task stay in the primary agent?

Not every task deserves a separate worker.

Stay with the primary agent when:

- the task is small;
- the steps are tightly coupled;
- there is little context to isolate;
- delegation would add more coordination than value.

Create a subagent when the task benefits from a distinct responsibility, prompt, permission boundary, model, or isolated context.

That rule will prevent your “AI team” from turning into an orchestration problem of its own.

## How Kilo Code Delegates Work

Kilo's current architecture does not require a separate Orchestrator mode for normal delegation. The Code, Plan, and Debug agents have native subagent support and can use the `task` tool to launch delegated work. Kilo's documentation marks the dedicated Orchestrator mode as deprecated.

The current flow is:

```text
Primary agent analyzes the task
        ↓
Identifies a focused subtask
        ↓
Launches a subagent with Task
        ↓
Subagent works in isolated context
        ↓
Subagent returns a result summary
        ↓
Primary agent continues
```

Primary agents can also launch multiple subagent sessions concurrently.

### Automatic delegation

The `description` field matters more than it might seem.

Kilo's documentation says descriptions help primary agents decide which subagent to invoke.

Compare:

> Helps with coding.

with:

> Reviews TypeScript API changes for authentication, authorization, input validation, and edge cases without modifying files.

The second description establishes a clear job. That makes both manual use and automatic delegation easier to reason about.

### Manual invocation

You can invoke a custom subagent directly with `@agent-name`:

```text
@code-reviewer review the authentication changes for security issues
```

Kilo creates a subtask that runs with the subagent's configured prompt and permissions.

Manual invocation is useful while developing your configuration because it lets you validate a specialist before relying on automatic delegation.


## Create Your First Custom Subagent

Kilo currently documents three ways to create custom subagents:

1. define them in `kilo.jsonc`;
2. define them as Markdown agent files;
3. use `kilo agent create` interactively or non-interactively.

The dedicated Custom Subagents documentation currently describes configuration through files or the CLI; UI-based custom-subagent configuration is not currently documented as available.

### Step 1 — Create a reviewer

Start with a read-only reviewer because it has a clear responsibility and a useful permission boundary.

The current CLI supports:

```bash
kilo agent create \
  --path .kilo \
  --description "Reviews code for security vulnerabilities" \
  --mode subagent \
  --tools "read,grep,glob"
```

Kilo's documentation shows this non-interactive form and explains that the interactive command can also ask where to save the agent, what it should do, which tools it may use, and which mode it should have.

**Why start here?**

A reviewer can often do its job without editing files or executing arbitrary shell commands.

After creation, check the available agents:

```bash
kilo agent list
```

The current CLI documentation says this lists available agents and their configuration.

Then test the new agent manually:

```text
@code-reviewer review the latest authentication changes
```

### Step 2 — Define a subagent in `kilo.jsonc`

Kilo supports custom agents under the `agent` section of `kilo.jsonc`.

A minimal reviewer looks like this:

```jsonc
{
  "$schema": "https://app.kilo.ai/config.json",
  "agent": {
    "code-reviewer": {
      "description": "Reviews code for security, performance, maintainability, and edge cases",
      "mode": "subagent",
      "prompt": "You are a code reviewer. Analyze changes without modifying files.",
      "permission": {
        "edit": "deny",
        "bash": "deny"
      }
    }
  }
}
```

This follows the current Custom Subagents configuration model. The `description` explains what the agent does, `mode: "subagent"` restricts it to subagent use, and the permissions remove edit and Bash access.

### Step 3 — Define longer prompts in Markdown

For larger roles, Markdown files are often easier to maintain.

Kilo currently documents:

```text
Global:
~/.config/kilo/agents/

Project-specific:
.kilo/agents/
```

The filename without `.md` becomes the agent name.

For example:

```markdown
description: Reviews API changes for security, correctness, and edge cases
mode: subagent
permission:
  edit: deny
  bash: deny

You are a focused API code reviewer.

Check for:

- authentication and authorization flaws
- input validation problems
- edge cases
- error handling
- missing tests
- risky changes to security-sensitive code

Do not modify files.

Return findings with file paths, severity, and remediation suggestions.
```

The Markdown body becomes the agent's system prompt, which makes this format particularly useful for detailed role instructions.

### Verify before you scale

Before creating a team of specialists:

1. create one;
2. list it;
3. invoke it manually;
4. give it a representative task;
5. check its output;
6. verify that its permissions behave as intended.

That small validation loop is much easier to debug than a five-agent configuration that fails somewhere in the middle.


## Design Subagents Around Real Engineering Jobs

A useful subagent should sound like a real engineering role.

For example:

| Agent | Responsibility | Typical access | Output |
|---|---|---|---|
| Explorer | Understand the repository | Read-only | Findings and file references |
| Implementer | Make scoped code changes | Read/write | Code changes |
| Reviewer | Inspect changes | Read-only | Findings and recommendations |
| Test Writer | Add or improve tests | Read/write | Tests and validation |
| Security Reviewer | Audit security-sensitive changes | Read-only | Risk findings |

The key is not the number of agents. It is the clarity of the boundaries.

A weak role description:

> Help with the project.

A stronger one:

> Inspect API authentication code for authorization mistakes, token handling issues, input validation gaps, and missing test coverage. Do not edit files.

The second version defines the domain, the expected output, and the limits of the role.

### Give each specialist one job

A subagent should have a clear answer to:

> “Why does this agent exist?”

If the answer contains several unrelated responsibilities, split the role or keep it in the primary agent.

This is especially important because the subagent's description is part of the information used for delegation.


## Control What Each Subagent Can Do

A custom subagent is only as well-designed as its permissions.

Kilo's permission system supports:

- `allow` — execute without approval;
- `ask` — ask the user first;
- `deny` — block the tool call.

Permissions can apply to entire tools or to specific files and commands using patterns.

For example:

```yaml
permission:
  read: allow
  edit: deny
  bash: deny
```

A reviewer can inspect the repository while being unable to edit or run shell commands.

For more control, Kilo supports pattern-based permissions:

```yaml
permission:
  edit:
    "*": deny
    "*.md": allow
  bash:
    "*": ask
    "git diff *": allow
```

Rules are evaluated in order, and the last matching rule wins. That means broad defaults should generally come first and narrower exceptions afterward.

### Be careful with “read-only”

Read-only does not mean “nothing sensitive can ever be exposed.”

Kilo treats `.env` and `.env.*` files as sensitive and does not let a broad read approval bypass their built-in prompt.

That is an important distinction when designing an audit or review agent:

> **Restricting write access reduces what the agent can modify; it does not automatically make everything the agent can read harmless.**

### Control which subagents can be invoked

You can also constrain delegation itself with `permission.task`.

For example:

```jsonc
{
  "agent": {
    "planner": {
      "mode": "primary",
      "permission": {
        "task": {
          "*": "deny",
          "code-reviewer": "allow",
          "docs-writer": "allow"
        }
      }
    }
  }
}
```

This allows the planner to delegate only to the two named specialists. Kilo documents this pattern directly.

That can be useful when you want a deliberate workflow rather than unrestricted agent spawning.


## Give Different Subagents Different Models

A custom subagent can override the model used for that role. If no model is specified, Kilo's current documentation says a subagent inherits the model of the invoking primary agent.

This creates another useful design dimension:

```text
Explorer
→ model chosen for fast repository analysis

Implementer
→ model chosen for complex coding work

Reviewer
→ model chosen for careful analysis
```

But avoid turning this into a universal ranking exercise.

There is no reason to assume that the strongest or most expensive model is automatically the best choice for every specialist. The right question is:

> What does this role actually need?

A repository explorer may need fast search and summarization. A difficult implementation task may justify a different model choice. A reviewer may benefit from a model that handles structured analysis well.

Treat those as workflow decisions, not product-wide truths.

Kilo also exposes model-specific parameters through agent configuration, including provider/model IDs and optional provider-specific settings.


## Build a Practical AI Development Team

Now consider a realistic feature request:

> Add refresh-token rotation to an existing web application.

Instead of asking one agent to research, implement, review, and test the entire change, split the work where the boundaries are meaningful.

```text
Feature request
      ↓
Explorer
      ↓
Primary agent builds a plan
      ↓
Implementer changes the code
      ↓
Reviewer inspects the result
      ↓
Test Writer adds or updates tests
      ↓
Primary agent verifies the final result
```

### 1. Explorer

The Explorer answers questions such as:

- Where is authentication implemented?
- Where are refresh tokens created?
- Where are they persisted?
- Where are they validated?
- Which tests cover the current flow?

Its job is to **understand**, not modify.

Its result might look like:

```text
Found refresh-token handling in:

- src/auth/token-service.ts
- src/auth/session-store.ts
- src/api/auth/refresh.ts
- tests/auth/refresh.test.ts

Current rotation is not implemented.
The refresh endpoint accepts the existing token and creates a new access token,
but the stored refresh token is not replaced.
```

That kind of result is valuable because the primary agent can turn it into a concrete implementation plan without carrying the entire exploration conversation.

### 2. Implementer

The Implementer receives a well-defined task:

> Add refresh-token rotation using the existing session-store abstraction. Preserve the existing API response shape and add coverage for token reuse.

This is where write access belongs.

The goal is not to make the Implementer autonomous about product design. It should receive enough context to make a scoped change.

### 3. Reviewer

The Reviewer then examines the result independently.

That separation matters.

A reviewer that cannot edit the repository can focus on:

- correctness;
- security boundaries;
- edge cases;
- error handling;
- test coverage;
- unintended behavior.

The reviewer might return:

```text
High: refresh tokens can still be reused after rotation in
src/auth/session-store.ts.

Medium: the new failure case is not covered by the refresh endpoint tests.

Low: the rotation helper name does not match the surrounding naming convention.
```

The parent can then decide which findings to address.

### 4. Test Writer

The Test Writer turns the intended behavior into executable checks.

For example:

- valid rotation;
- invalidated old token;
- repeated use of an old token;
- expired token;
- missing token;
- session-store failure.

The exact permissions should match the project, but unlike the reviewer, this role may legitimately need edit access.

### The point is the boundary

You do not need four agents for every task.

Use the separation when it makes the workflow clearer:

**Explore → implement → verify**

That is a useful architecture. Four agents for a typo fix is not.


## Custom Subagents vs Kilo Code Agent Manager

Custom subagents and Agent Manager solve related but different problems.

A custom subagent gives you a **specialized delegated worker**.

Agent Manager is a **control panel for running and coordinating multiple Kilo agent sessions**, with worktree-oriented workflows as one of its major capabilities. Kilo's current documentation supports both worktree sessions and local sessions. In `worktree` mode, each session gets its own Git worktree and branch. In `local` mode, sessions run in the current workspace without Git worktree isolation.

That distinction is critical.

| Question | Custom Subagent | Agent Manager |
|---|---|---|
| Main purpose | Focused delegated work | Manage multiple agent sessions |
| Separate conversation context | Yes | Yes |
| Git worktree isolation | Not inherent | Available in worktree mode |
| Local shared workspace | Possible through normal agent context | Explicit local mode |
| Best for | Research, review, focused subtasks | Multiple ongoing sessions |
| Separate Git branches | No automatic assumption | Yes in worktree mode |
| Diff/review workflow | Parent-oriented | Built into worktree workflow |
| Primary abstraction | Specialist worker | Session/workflow management |

A better decision rule is:

> **Use a custom subagent when you need a specialist. Use Agent Manager when you need to manage multiple agent sessions. Choose worktree mode when those sessions need Git/filesystem isolation.**

That is more precise than treating Agent Manager and subagents as interchangeable forms of “multi-agent.”

Kilo's current Agent Manager documentation says worktree sessions run in isolated Git worktrees on separate branches, while local sessions do not use that isolation.

### When Agent Manager is a better fit

Consider Agent Manager when you want several longer-running implementation sessions and need to inspect their changes independently.

For example:

```text
Worktree A → Backend implementation
Worktree B → Frontend implementation
Worktree C → Integration tests
```

Each worktree can maintain its own branch and filesystem state.

### When a subagent is simpler

Use a subagent when the worker's job is closer to:

> “Inspect this repository and tell me where authentication is implemented.”

Creating a separate Git worktree for a read-only investigation would add complexity without solving a real problem.


## Common Problems and Limitations

Multi-agent workflows introduce new failure modes.

The important point is to distinguish **documented architecture** from **specific bugs reported by users**.

### Parent sessions can be affected by child-task problems

Kilo GitHub issue #11708 reports a CLI case in which a Task-spawned subagent blocked the parent TUI and lacked an independent cancellation mechanism. The issue was filed against a particular Kilo version, so it should be treated as version-specific evidence, not as proof that all current subagent tasks behave this way. ([github.com](https://github.com/Kilo-Org/kilocode/issues/11708))

More recently, issue #12706 reported a Kilo 7.4.17 case where foreground Task subagents retried `server_is_overloaded`, child tasks were cancelled around the parent timeout boundary, retries created duplicate child sessions, and the parent could be left with an orphaned interrupted Task tool. Again, this is an issue report for a specific environment and version, not a universal statement about Kilo.

The practical lesson is straightforward:

> Do not assume that every delegated task is perfectly cancellable, resumable, or detached from the parent.

For workflows that depend heavily on long-running delegation, test the behavior on the Kilo version you actually use.

### Interactive tools can complicate child workflows

A delegated task runs in its own context.

That matters when a worker encounters an interactive tool, MCP operation, or approval flow that expects direct user interaction. A workflow that works smoothly in the main session may require additional testing when the same action happens inside a child session.

Treat these workflows as something to verify, not as guaranteed background automation.

### Model configuration needs to be observable

If a workflow depends on one subagent using a specific model, make that explicit in configuration when necessary and verify the effective setup.

Kilo supports per-agent model overrides and inheritance, so configuration can determine whether a role follows the parent model or uses its own.

### More agents also mean more coordination

A subagent system creates another layer of state:

- task boundaries;
- prompts;
- permissions;
- model selection;
- delegation rules;
- child results;
- failure handling.

If splitting a task makes the workflow harder to understand, the architecture may be over-engineered.


## Best Practices for Reliable Custom Subagents

### 1. Define the responsibility before writing the prompt

Start with:

> This agent exists to…

Then specify:

- what it handles;
- what it returns;
- what it must not do.

### 2. Make descriptions specific

Descriptions help primary agents decide which specialist fits the task.

Prefer:

> Audits authentication and authorization code for security problems without modifying files.

over:

> Helps with security.

### 3. Start with restrictive permissions

Use the smallest permission set that lets the role complete its job.

A reviewer that never edits files should not need edit access.

A specialist that only needs `git diff` should not automatically receive unrestricted Bash access.

Kilo supports fine-grained tool and pattern rules, including command-specific Bash permissions.

### 4. Test the specialist manually first

Use:

```text
@agent-name
```

and give the worker a real task.

Check:

- Did it understand its role?
- Did it inspect the right files?
- Did it return useful evidence?
- Did it attempt an action outside its responsibility?
- Did the permissions behave as expected?

Only after that should you depend on automatic delegation.

### 5. Keep the team small

Do not create a subagent for every verb in your task description.

Four meaningful roles can be useful.

Ten overlapping roles can make delegation harder to reason about.

### 6. Use `steps` when a role should be bounded

Kilo's custom-subagent configuration supports a `steps` limit that caps agentic iterations before forcing a text-only response. The documentation specifically describes this as useful for cost control.

This is useful for jobs that should remain bounded, such as a targeted repository investigation.

### 7. Treat permissions as part of the role

The following pair should be designed together:

```text
Role:
Security reviewer

Authority:
Read code, no edits, no unrestricted shell
```

A role definition without an authority model is incomplete.


## A Reusable Kilo Code Subagent Team

A practical starter architecture is:

```text
Primary Agent
│
├── explorer
│   └── Read-only repository investigation
│
├── implementer
│   └── Scoped code changes
│
├── reviewer
│   └── Read-only quality/security review
│
└── test-writer
    └── Test changes and validation
```

A reviewer definition can look like this:

```markdown
description: Reviews API changes for correctness, security, and edge cases without modifying files
mode: subagent
permission:
  edit: deny
  bash: deny

You are a focused API code reviewer.

Inspect the requested changes and report:

1. correctness issues
2. authentication or authorization risks
3. input-validation problems
4. edge cases
5. missing tests

Do not modify files.

Return findings with file paths, severity, and actionable recommendations.
```

Kilo's official documentation shows the same general pattern: a dedicated description, `mode: subagent`, a focused system prompt, and restrictive permissions for read-only roles.

Then create project-specific variants for exploration, implementation, testing, or documentation.

The exact team should match your repository. There is no universal “four-agent” configuration you need to copy.


## A Simple Decision Framework

Use this checklist before creating another subagent.

### Create a subagent when:

- the task has a clear specialist role;
- the worker benefits from separate context;
- the worker needs different permissions;
- the worker may use a different model;
- the result can be summarized back to the parent;
- the role is reusable.

### Stay with the primary agent when:

- the task is small;
- the steps are tightly coupled;
- the context is already simple;
- delegation would add overhead.

### Use Agent Manager when:

- you want to manage multiple agent sessions;
- you need longer-running parallel work;
- you want a session-oriented control surface;
- you need worktree isolation for independent implementation tasks.

### Choose Agent Manager worktree mode when:

- agents need separate branches;
- file changes must remain isolated;
- each task benefits from its own checkout;
- review and integration happen separately.

### Choose Agent Manager local mode when:

- multiple sessions need to operate in the same workspace;
- Git worktree isolation is not required;
- you still want Agent Manager's session management.

The important decision is not “single agent vs many agents.”

It is:

> **Where does isolation create a real engineering benefit?**


## FAQ

### What are Kilo Code custom subagents?

Custom subagents are specialized agents that run in isolated sessions and can be invoked by primary agents or manually. They support custom prompts, models, tool access, and permissions.

### How do I create a custom subagent in Kilo Code?

You can define one in `kilo.jsonc`, create a Markdown agent file, or use `kilo agent create`. Kilo's current documentation describes all three approaches.

### Can Kilo Code subagents use different models?

Yes. A custom subagent can specify its own model. If no model is configured, Kilo documents inheritance from the invoking primary agent.

### Can I make a Kilo subagent read-only?

Yes. Kilo permissions can deny edit access and restrict Bash or other tools. You can also scope access to particular files or commands.

### Can one Kilo agent control which subagents it can invoke?

Yes. `permission.task` can allow or deny delegation to specific subagent names.

### What is the difference between Kilo subagents and Agent Manager?

A subagent is a delegated specialist with its own isolated context. Agent Manager is a session-management interface for multiple agents. Its worktree mode gives sessions separate Git worktrees and branches; its local mode keeps sessions in the current workspace without worktree isolation.

### Do I still need Kilo's Orchestrator?

Not for ordinary native subagent delegation. Kilo documents Orchestrator as deprecated and says Code, Plan, and Debug can delegate to subagents directly.

### Why might a Kilo subagent fail or hang?

Kilo's GitHub repository contains version-specific reports involving blocked parent sessions, Task cancellation, provider overload retries, and orphaned child-task states. Those reports should be treated as evidence of particular failure modes, not as proof that every current subagent task is unreliable.

### Are Kilo subagents always background tasks?

Do not assume so. Native delegation can launch concurrent subagent sessions, but concurrency and detached background execution are different concepts. The exact lifecycle depends on the current product behavior and workflow.

### Are custom subagents the same thing as Kilo Skills?

No. They solve different problems. A subagent is a delegated agent context with its own role, prompt, tools, model, and permissions. Skills are reusable capability definitions within Kilo's broader customization system.


## Conclusion

Kilo Code custom subagents are most useful when you treat them as **specialist engineering roles**, not as a reason to create more agents for their own sake.

A repository explorer can focus on finding facts. An implementer can make scoped changes. A reviewer can inspect the result without editing it. A test writer can turn expected behavior into executable checks. The primary agent can coordinate the overall task and decide when delegation actually helps.

The strongest workflows combine three things:

**clear responsibilities, narrow permissions, and deliberate isolation.**

You also need to choose the right level of isolation. A custom subagent is the better abstraction when you need a focused delegated worker. Agent Manager is the better fit when you need to manage multiple agent sessions, with worktree mode available when Git and filesystem isolation matter.

Start small.

Create one specialist. Give it one job. Restrict what it can access. Run it manually. Check its output. Then add another role only when there is a real boundary worth creating.

That is how Kilo Code custom subagents become an engineering workflow rather than a pile of prompts.
