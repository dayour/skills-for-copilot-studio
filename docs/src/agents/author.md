---
sidebar_position: 2
title: Author Agent
---

# Author Agent

The **author** agent is a specialized YAML authoring agent for Microsoft Copilot Studio. It creates and edits topics, actions, knowledge sources, child agents, and global variables.

## Invocation

```
/copilot-studio:copilot-studio-author <your request>
```

## What It Does

The author agent:

- Creates new topics with valid YAML structure, unique node IDs, and proper schema compliance
- Adds and edits connector actions (Teams, Outlook, etc.)
- Configures knowledge sources for grounded responses
- Manages global variables, triggers, and agent settings
- Generates adaptive cards
- Validates all output against the Copilot Studio YAML authoring schema

## Skills Used

The author agent delegates to purpose-built skills for every task. It never writes YAML manually when a skill exists.

| Task | Skill |
|------|-------|
| Create a new topic | `new-topic` |
| Add/modify a node in a topic | `add-node` |
| Add a connector action | `add-action` |
| Edit an existing action | `edit-action` |
| Add a knowledge source | `add-knowledge` |
| Add generative answers | `add-generative-answers` |
| Add child/connected agents | `add-other-agents` |
| Add a global variable | `add-global-variable` |
| Edit agent settings | `edit-agent` |
| Modify trigger phrases | `edit-triggers` |
| Add an adaptive card | `add-adaptive-card` |
| Reference a pattern's YAML structure | `int-patterns` (internal — read-only, never suggests) |
| Validate YAML | `validate` |
| Look up schema | `lookup-schema` |

## Examples

### Create a new topic

```
/copilot-studio:copilot-studio-author Create a topic that handles IT service requests
```

### Add a knowledge source

```
/copilot-studio:copilot-studio-author Add a knowledge source pointing to https://contoso.com/hr-policies
```

### Edit trigger phrases

```
/copilot-studio:copilot-studio-author Update the greeting topic triggers to include "hello", "hey", and "good morning"
```

### Add an adaptive card

```
/copilot-studio:copilot-studio-author Add an adaptive card to the booking confirmation topic that shows date, time, and location
```

## Rules

- Always validates YAML after creation or editing
- Verifies kind values against the schema before writing
- When `GenerativeActionsEnabled: true`, uses topic inputs/outputs via `AutomaticTaskInput` instead of hardcoded question nodes
- For grounded answers, relies on knowledge sources' native lookup. Uses `SearchAndSummarizeContent` only when explicit query manipulation is needed.
- Never hardcodes agent names or paths -- auto-discovers via `**/agent.mcs.yml`

## Limitations

The author agent refuses to create from scratch:

1. **Full agent projects** -- it cannot create `agent.mcs.yml` or `settings.mcs.yml`, or scaffold a
   project. Agents must first be cloned from a Copilot Studio environment using the
   [Manage agent](./manage.md). If no `agent.mcs.yml` is found in the workspace, the author agent
   stops immediately and directs you to clone one first.
2. **Autonomous Triggers** -- require Power Platform configuration beyond YAML
3. **AI Prompt nodes** -- involve Power Platform components beyond YAML

Autonomous Triggers and AI Prompt nodes should be configured through the Copilot Studio UI.
However, the agent CAN modify existing components or reference them in new topics.

If you hit a validation error or issue the author agent can't resolve after multiple attempts, it
suggests escalating to the [Advisor agent](./advisor.md) for troubleshooting.
