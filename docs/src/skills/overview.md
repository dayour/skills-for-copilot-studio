---
sidebar_position: 1
title: Skills Overview
---

# Skills Overview

Skills are the building blocks of the plugin. Each skill is a focused, purpose-built tool that
handles a specific task. The four agents ([Advisor](../agents/advisor.md), [Author](../agents/author.md),
[Manage](../agents/manage.md), [Test](../agents/test.md)) delegate to skills rather than performing
tasks manually -- this keeps YAML generation schema-accurate and keeps ALM operations auditable.

## All Skills

### Authoring

| Skill | Description |
|-------|-------------|
| `new-topic` | Create a new topic from scratch |
| `add-node` | Add or modify a node in an existing topic |
| `add-action` | Add a connector action (Teams, Outlook, etc.) |
| `edit-action` | Edit an existing connector action |
| `add-knowledge` | Add a knowledge source |
| `add-generative-answers` | Add SearchAndSummarize generative answers |
| `add-other-agents` | Add child or connected agents |
| `add-global-variable` | Add a global variable |
| `edit-agent` | Edit agent settings or instructions |
| `edit-triggers` | Modify trigger phrases or model description |
| `add-adaptive-card` | Add an adaptive card to a topic |

### Deployment & ALM

| Skill | Description |
|-------|-------------|
| `clone-agent` | Guided flow to clone an agent from the cloud |
| `manage-agent` | Pull, push, validate, clone, diff, publish, list environments/agents |

### Testing & Evaluation

| Skill | Description |
|-------|-------------|
| `test-auth` | Authenticate for evaluation and chat operations |
| `run-eval` | Run in-product PPAPI evaluations against the **draft** agent |
| `create-eval-set` | Generate a CSV test set from agent YAML |
| `analyze-evals` | Analyze evaluation results exported as CSV |
| `detect-mode` | Detect DirectLine vs M365 SDK auth mode |
| `chat-directline` | Send a test message via DirectLine v3 |
| `chat-sdk` | Send a test message via the Copilot Studio Client SDK |
| `run-tests-kit` | Run batch test suites via the Power CAT Copilot Studio Kit |

### Utility

| Skill | Description |
|-------|-------------|
| `validate` | Validate a YAML file against the schema |
| `lookup-schema` | Look up a specific schema definition |
| `list-kinds` | List all valid kind values |
| `list-topics` | List all topics in the agent |

### Internal (not user-invocable)

| Skill | Description |
|-------|-------------|
| `int-project-context` | Auto-discovers agent files and loads project context |
| `int-reference` | Reference tables: kinds, triggers, actions, variables, entities, Power Fx, templates |
| `int-patterns` | [Pattern library](../patterns/overview.md) index for design guidance |

## Skill Categories

### Authoring Skills

Skills that create or modify YAML content. Used primarily by the [Author agent](../agents/author.md).
See [Authoring Skills](./authoring.md) for details.

### Deployment & ALM Skills

Skills that clone, sync, and publish agent content between local files and the Power Platform
cloud. Used primarily by the [Manage agent](../agents/manage.md). See
[Deployment Skills](./deployment.md) for details.

### Testing Skills

Skills that run evaluations, point-tests, and batch suites against draft or published agents. Used
primarily by the [Test agent](../agents/test.md). See [Testing Skills](./testing.md) for details.

### Utility Skills

Skills that validate, inspect, or provide reference information. Used by all four agents. See
[Utility Skills](./utilities.md) for details.
