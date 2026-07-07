---
sidebar_position: 1
title: Advisor Agent
---

# Advisor Agent

The **advisor** agent recommends design patterns before authoring begins, reviews existing agent
YAML against the pattern library and known pitfalls, and troubleshoots validation errors and
unexpected behavior. It never writes YAML itself -- it hands approved work to the
[Author agent](./author.md).

## Invocation

```
/copilot-studio:copilot-studio-advisor <your request>
```

## Three Modes

### Design Mode

When you describe what you want to build, the advisor consults the [pattern library](../patterns/overview.md)
before implementation begins, explains the challenge each relevant pattern solves, and calibrates
your expectations using its maturity status (`proven`, `recommended`, `experimental`). You accept,
reject, or modify -- the advisor never silently applies a pattern.

```
/copilot-studio:copilot-studio-advisor I want my agent to handle HR and IT queries with
  country-specific answers
```

→ Suggests **Orchestrator-Generated Variables** (category routing) + **JIT User Context**
(country detection), explains why, and hands off to Author once you agree.

### Review Mode

After authoring is complete (or any time), the advisor audits your agent for missed pattern
opportunities, known pitfalls (e.g. child agents without no-messaging instructions), and structural
issues, then validates the YAML.

```
/copilot-studio:copilot-studio-advisor Review my agent
```

### Troubleshoot Mode

For validation errors, wrong topic routing, or unexpected behavior -- checks patterns for known
pitfalls, validates YAML, looks up schema definitions, checks trigger phrases, and proposes
specific fixes.

```
/copilot-studio:copilot-studio-advisor The agent keeps triggering the wrong topic when I ask about billing
```

## Skills Used

| Task | Skill |
|------|-------|
| Validate a YAML file | `validate` |
| Look up a schema definition | `lookup-schema` |
| List valid kind values | `list-kinds` |
| List all topics | `list-topics` |
| Read the pattern library | `int-patterns` (internal) |
| Read YAML reference tables | `int-reference` (internal) |

## Agent Discovery

The agent name is dynamic -- you clone your own agent. The advisor never hardcodes an agent name
or path; it auto-discovers via `**/agent.mcs.yml`. If multiple agents are found, it asks which one.

## Agent Lifecycle Summary

| State | Visible to |
|-------|-----------|
| **Local** | The AI agent and you only |
| **Pushed (Draft)** | Copilot Studio UI (authoring canvas, Test tab) |
| **Published** | External clients (point-tests, Kit batch suites, DirectLine, Teams) |

Pushing creates a **draft**. External testing tools only reach **published** content -- always push
AND publish (via the [Manage agent](./manage.md)) before testing.

If the advisor can't resolve an issue, it suggests opening a new issue at
[microsoft/skills-for-copilot-studio](https://github.com/microsoft/skills-for-copilot-studio/issues/new/choose)
with the prompt used, expected result, and actual result.
