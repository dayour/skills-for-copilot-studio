---
sidebar_position: 3
title: Manage Agent
---

# Manage Agent

The **manage** agent handles Application Lifecycle Management (ALM) for Copilot Studio agents --
cloning, pushing, and pulling agent content between local YAML files and the Power Platform cloud,
publishing drafts to make them live, listing environments and agents, and showing pending changes.

## Invocation

```
/copilot-studio:copilot-studio-manage <your request>
```

## Skills Used

| Task | Skill |
|------|-------|
| Pull remote agent content to local | `manage-agent pull` |
| Push local changes to the cloud | `manage-agent push` |
| Validate agent YAML files | `manage-agent validate` |
| Clone an agent (guided flow) | `clone-agent` |
| Clone an agent (if you have all details) | `manage-agent clone` |
| Show diff between local and remote | `manage-agent changes` |
| List agents in an environment | `manage-agent list-agents` |
| List available environments | `manage-agent list-envs` |
| Publish agent (make draft live) | `manage-agent publish` |
| Pre-authenticate (device code) | `manage-agent auth` |

## Workflow Rules

1. **Always pull before push.** Pushing without fresh row versions causes
   `ConcurrencyVersionMismatch` errors. Sequence: pull → make changes → push.
2. **Pushing creates a draft, not a published version.** Publish afterward to make it live.
   Publishing is required before testing with point-tests or Kit batch suites — the fast in-product
   eval loop can test the draft, but published content is needed for full external testing.
3. **Push before publish.** If you ask to publish but haven't pushed, the agent pushes first
   (which means pulling first too). Full sequence: pull → push → publish.
4. **Check for pending changes before publishing.** The agent runs `changes` before `publish` and
   tells you if the agent is already up to date.
5. **Always warns before publishing** -- publishing makes changes live for all end users the agent
   is shared with.
6. **Improvement loop** -- when iterating (edit → push → publish → test), the agent waits for the
   publish command's API-confirmed completion before testing, never a time-based guess.

## Authentication

Two auth flows depending on the operation:

- **Push / Pull / Clone / Changes / Publish / List-Agents** -- interactive browser login with VS
  Code's first-party client ID, pre-authorized with the Island API gateway. A browser window opens
  automatically; no manual code entry needed.
- **Auth command** -- device code flow, useful for pre-authenticating before running manage
  operations.

Tokens are cached and refresh silently for ~90 days after initial login.

## Agent Discovery

The agent workspace is auto-detected by finding the subfolder with `.mcs/conn.json`. The manage
agent never hardcodes an agent name or path -- if multiple agents are found, it asks which one.

## Examples

### Clone an agent for the first time

```
/copilot-studio:copilot-studio-manage Clone my agent from https://copilotstudio.microsoft.com/environments/.../bots/...
```

### Sync and deploy a change

```
/copilot-studio:copilot-studio-manage Pull the latest, then push and publish my changes
```

### Check what's pending

```
/copilot-studio:copilot-studio-manage What changes are pending between local and remote?
```
