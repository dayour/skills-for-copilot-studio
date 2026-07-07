---
sidebar_position: 4
title: Test Agent
---

# Test Agent

The **test** agent runs in-product evaluations against **draft** agents (no publish needed), batch
test suites via the Power CAT Copilot Studio Kit, point-tests via DirectLine or the Copilot Studio
SDK, and analyzes exported evaluation CSVs. It drives the fast edit → push → eval loop for
iterative testing without publishing.

## Invocation

```
/copilot-studio:copilot-studio-test <your request>
```

## Testing Approaches

| Approach | Skill | How It Works | Requires | Draft or Published |
|----------|-------|---------------|----------|---------------------|
| **In-product evaluation** | `run-eval` | Runs PPAPI evaluations against the agent directly -- the fast iteration loop | `test-auth` | **Draft** (pushed, not published) |
| **Create a test set** | `create-eval-set` | Reads the agent's YAML and writes a CSV for import into the Copilot Studio Evaluate tab | Agent YAML present | N/A |
| **Point-test (DirectLine)** | `chat-directline` | Sends a single utterance via the DirectLine v3 REST API | No auth or manual auth agents | Published |
| **Point-test (SDK)** | `chat-sdk` | Sends a single utterance via the Copilot Studio Client SDK (M365) | `test-auth` + App Registration | Published |
| **Detect auth mode** | `detect-mode` | Queries Dataverse to determine DirectLine vs M365 SDK mode | Agent YAML present | N/A |
| **Batch test suite** | `run-tests-kit` | Runs pre-defined test sets via the [Power CAT Copilot Studio Kit](https://github.com/microsoft/Power-CAT-Copilot-Studio-Kit) | Kit installed + Dataverse permissions | Published |
| **Analyze evaluations** | `analyze-evals` | Analyzes evaluation results exported as CSV from the Copilot Studio UI | Evaluations run in Copilot Studio UI | Published |

## The Fast Iteration Loop

The biggest win here: **in-product evaluation tests the draft, not just the published agent.**

```
edit YAML → push → run-eval → analyze → fix → repeat
```

No publishing needed between iterations -- publish only when you're ready to make the agent live.
Point-testing and Kit batch tests still require a **published** agent.

## How Requests Are Routed

- **"run evals" / "test my agent"** → `test-auth` (authenticates, asking only for
  the App Registration client ID and presenting the full configuration checklist) → then
  `run-eval` (lists test sets, runs the chosen one, reports results)
- **"create a test set"** → `create-eval-set`
- **"test this utterance" (point testing)** → `detect-mode` first, then routes to
  `chat-directline` (no auth) or `test-auth` +
  `chat-sdk` (M365 SSO)
- **"run the test suite"** → `run-tests-kit`
- **"analyze these results"** (CSV shared) → `analyze-evals`

## Examples

### Run in-product evaluations (fast loop)

```
/copilot-studio:copilot-studio-test Run evals against my agent
```

### Send a point-test

```
/copilot-studio:copilot-studio-test Send "What products do you offer?" to the published agent
```

### Run a batch Kit suite

```
/copilot-studio:copilot-studio-test Run my test suite
```

### Analyze evaluation results

```
/copilot-studio:copilot-studio-test Analyze my evaluation results from ~/Downloads/Evaluate MyAgent.csv
```

## Execution Rules

- Never runs eval or chat commands in the background -- results are always awaited.
- When testing multiple utterances, detects the auth mode once, then runs chat calls in parallel.
- Never asks about authentication state directly -- always delegates to `test-auth`, which reuses
  cached tokens silently.

## Agent Lifecycle

1. **Clone** the agent with the [Manage agent](./manage.md)
2. **Author** changes in YAML with the [Author agent](./author.md)
3. **Push** changes with the Manage agent (creates a draft)
4. Run **in-product evaluations** against the draft -- no publish needed
5. **Publish** with the Manage agent when ready (agent is now live)
6. Point-test or run Kit batch suites against the **published** agent

Only in-product evaluation reaches the draft; every other testing approach requires a published agent.
