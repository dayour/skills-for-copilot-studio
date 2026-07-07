---
sidebar_position: 4
title: Testing Skills
---

# Testing Skills

Testing skills interact with draft and published Copilot Studio agents and test infrastructure.
They are the primary tools used by the [test agent](../agents/test.md).

## test-auth

Authenticates for evaluation and chat operations. Asks for the App Registration client ID and
presents the full configuration checklist (redirect URI, public client flow, permissions, admin
consent). All other testing skills delegate to this rather than handling auth themselves.

**Usage:**
```
/copilot-studio:copilot-studio-test Authenticate for testing
```

## run-eval

Runs **in-product PPAPI evaluations** directly against the agent -- the fast iteration loop, since
it works against the **draft** (pushed, not published). Lists available test sets and runs the one
you choose.

**Usage:**
```
/copilot-studio:copilot-studio-test Run evals against my agent
```

## create-eval-set

Reads the agent's YAML and writes a CSV test set for import into the Copilot Studio Evaluate tab.

**Usage:**
```
/copilot-studio:copilot-studio-test Create a test set from my current topics
```

## analyze-evals

Analyzes evaluation results exported as CSV from the Copilot Studio UI, producing failure analysis
and proposed YAML fixes.

**Usage:**
```
/copilot-studio:copilot-studio-test Analyze my evaluation results from ~/Downloads/Evaluate MyAgent.csv
```

## detect-mode

Queries the Dataverse `bots` entity to determine whether the agent uses DirectLine (no auth /
manual auth) or the Copilot Studio SDK (integrated auth / Entra ID SSO). Used automatically before
point-testing to route to the correct chat skill.

## chat-sdk

Sends a single utterance to a published agent via the Copilot Studio Client SDK and returns the full response.

**Usage:**
```
/copilot-studio:copilot-studio-test Send "What's the PTO policy?" to the published agent
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

## run-tests-kit

Runs pre-defined batch test sets via the [Power CAT Copilot Studio Kit](https://github.com/microsoft/Power-CAT-Copilot-Studio-Kit).

**Usage:**
```
/copilot-studio:copilot-studio-test Run my test suite
```

**Requirements:**
- Copilot Studio Kit installed in the environment
- Azure App Registration with Dataverse permissions
- `tests/settings.json` with connection details (the skill walks through setup on first use)

**What it produces:**
- Pass/fail results per test case
- Response latency measurements
- Summary statistics

## chat-directline

Sends a single utterance to a bot via the DirectLine v3 REST API and returns the full response. Works with any bot reachable via DirectLine -- no Azure App Registration required when using a token endpoint.

**Usage:**
```
/copilot-studio:copilot-studio-test Send "Hello" using my token endpoint
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
