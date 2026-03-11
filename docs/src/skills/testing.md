---
sidebar_position: 3
title: Testing Skills
---

# Testing Skills

Testing skills interact with published Copilot Studio agents and test infrastructure. They are the primary tools used by the [test agent](../agents/test.md).

## chat-with-agent

Sends a single utterance to a published agent via the Copilot Studio Client SDK and returns the full response.

**Usage:**
```
/copilot-studio:test Send "What's the PTO policy?" to the published agent
```

**How it works:**
1. Auto-discovers connection details from `.mcs/conn.json` and `settings.mcs.yml`
2. Asks for the App Registration Client ID on first use
3. Authenticates via device code flow
4. Sends the utterance to the published agent
5. Returns the agent's full response

**Requirements:**
- Published agent (not just pushed/draft)
- Azure App Registration:
  - Platform: Public client / Native (Mobile and desktop applications)
  - Redirect URI: `http://localhost` (HTTP, not HTTPS)
  - API permissions: `CopilotStudio.Copilots.Invoke` (granted by admin)

**Multi-turn support:** The skill reuses the conversation context automatically, enabling multi-turn testing without re-authentication.

## run-tests

Runs batch test suites or analyzes evaluation results. Supports two modes:

### Kit Mode (Batch Testing)

Runs pre-defined test sets via the [Power CAT Copilot Studio Kit](https://github.com/microsoft/Power-CAT-Copilot-Studio-Kit).

**Usage:**
```
/copilot-studio:test Run my test suite
```

**Requirements:**
- Copilot Studio Kit installed in the environment
- Azure App Registration with Dataverse permissions
- `tests/settings.json` with connection details (the skill walks through setup on first use)

**What it produces:**
- Pass/fail results per test case
- Response latency measurements
- Summary statistics

### Eval Mode (Evaluation Analysis)

Analyzes evaluation results exported as CSV from the Copilot Studio UI.

**Usage:**
```
/copilot-studio:test Analyze my evaluation results from ~/Downloads/Evaluate MyAgent.csv
```

**What it produces:**
- Failure analysis with root causes
- Proposed YAML fixes
- Recommendations for improving agent quality

## directline-chat

Sends a single utterance to a bot via the DirectLine v3 REST API and returns the full response. Works with any bot reachable via DirectLine -- no Azure App Registration required when using a token endpoint.

**Usage:**
```
/copilot-studio:test Send "Hello" using my token endpoint
```

**Connection Modes:**

| Mode | When to use | What you need |
|------|-------------|--------------|
| **Token endpoint** | Agent published in Copilot Studio with Direct Line channel | Copilot Studio token endpoint URL |
| **DirectLine secret** | Azure Bot Service bot with DirectLine channel enabled | DirectLine secret from Azure Portal |

**How it works:**
1. Asks which connection mode to use (token endpoint or DirectLine secret)
2. Acquires a DirectLine token
3. Starts a conversation via DirectLine v3
4. Sends the utterance as an activity
5. Polls for bot responses
6. Returns the full response text

**Auth support:** Detects OAuthCard sign-in prompts and guides the user through the authentication flow.

**Multi-turn support:** Reuses conversation context for follow-up messages within the same session.
