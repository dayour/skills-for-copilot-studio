---
sidebar_position: 5
title: Utility Skills
---

# Utility Skills

Utility skills validate, inspect, and provide reference information. They are used by all four agents.

## validate

Validates a YAML file against the official Copilot Studio authoring schema.

**Usage:**
```
/copilot-studio:copilot-studio-advisor Validate all topics in my agent
```

**What it checks:**
- YAML syntax correctness
- Required fields present
- Valid kind values
- Proper node structure
- ID uniqueness

## lookup-schema

Looks up a specific definition in the Copilot Studio YAML authoring schema (744 definitions, 447
`kind` values) without loading the whole schema file into context. Supports lookup, keyword search,
and `$ref` chain resolution.

**Usage:**
```
/copilot-studio:copilot-studio-advisor Look up the schema for SendActivity
```

**Returns:** The full schema definition including properties, required fields, and valid values.

## list-kinds

Lists all valid `kind` discriminator values in the schema. These are the concrete node types that can appear in YAML topic files.

**Usage:**
```
/copilot-studio:copilot-studio-author What node kinds are available?
```

**Returns:** A complete list of valid kind values with descriptions.

## list-topics

Lists all topics currently defined in the agent.

**Usage:**
```
/copilot-studio:copilot-studio-author What topics does this agent have?
```

**Returns:** A list of all topic files with their names and trigger phrases.

## Internal Skills

The following skills are used internally by agents and are not typically invoked directly:

| Skill | Purpose |
|-------|---------|
| `int-project-context` | Auto-discovers agent files and loads project context |
| `int-reference` | Loads YAML reference tables (kinds, triggers, actions, variables, Power Fx, templates) |
| `int-patterns` | Loads the [pattern library](../patterns/overview.md) index for design guidance and YAML reference |

