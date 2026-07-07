---
sidebar_position: 3
title: Deployment & ALM Skills
---

# Deployment & ALM Skills

Deployment skills handle Application Lifecycle Management -- cloning, syncing, and publishing
agent content between local YAML files and the Power Platform cloud. They are the primary tools
used by the [Manage agent](../agents/manage.md).

## clone-agent

Guided flow to clone a Copilot Studio agent from the cloud into your local workspace. Walks
through environment selection, agent selection, and authentication.

**Usage:**
```
/copilot-studio:copilot-studio-manage clone
```

## manage-agent

The core ALM script wrapper. Supports multiple sub-operations:

| Sub-operation | What it does |
|---------------|--------------|
| `pull` | Pulls remote agent content to local YAML files |
| `push` | Pushes local changes to the cloud (creates a draft) |
| `validate` | Validates agent YAML files |
| `clone` | Clones an agent when you already have all connection details |
| `changes` | Shows the diff between local and remote content |
| `list-agents` | Lists agents in a Power Platform environment |
| `list-envs` | Lists available Power Platform environments |
| `publish` | Publishes the current draft, making it live |
| `auth` | Pre-authenticates via device code flow |

**Usage:**
```
/copilot-studio:copilot-studio-manage pull
/copilot-studio:copilot-studio-manage push
/copilot-studio:copilot-studio-manage publish
```

Also supports identifying an agent directly from a Copilot Studio URL with `--url`, so you don't
need to manually look up environment and agent IDs.

**Authentication:** Push/Pull/Clone/Changes/Publish/List-Agents use interactive browser login
(VS Code's first-party client ID, pre-authorized with the Island API gateway) -- a browser window
opens automatically. The `auth` sub-operation uses device code flow for pre-authentication. Tokens
are cached and refresh silently for ~90 days.

## Workflow Rules

1. **Always pull before push** -- avoids `ConcurrencyVersionMismatch` errors.
2. **Pushing creates a draft, not a published version** -- publish separately to go live.
3. **Push before publish** -- if you haven't pushed, push (and pull) first.
4. **Check pending changes before publishing** -- run `changes` first; skip publishing if nothing
   changed.
5. **Always warn before publishing** -- it makes the draft live for all end users.
