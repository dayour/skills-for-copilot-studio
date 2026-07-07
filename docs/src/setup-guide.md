---
sidebar_position: 2
title: Setup Guide
---

# Setup Guide

This guide walks you through setting up the plugin and using it end-to-end: install, clone an
agent, get design advice, author changes, push, publish, test, and troubleshoot.

## 1. Install the Plugin

### Option A: Install from marketplace (recommended)

```bash
/plugin marketplace add microsoft/skills-for-copilot-studio
/plugin install copilot-studio@skills-for-copilot-studio
```

Once installed, the plugin is available globally.

:::tip Enable automatic updates
After installing, open your plugin/marketplace settings and turn on auto-updates for this plugin. The skills and schema references are updated frequently with new Copilot Studio features, patterns, and bug fixes. With auto-updates enabled, you always get the latest improvements without reinstalling. In Claude Code, type `/plugin`, navigate to "Skills for Copilot Studio", and enable the auto-update toggle.
:::

### Option B: Run locally from a clone

```bash
git clone https://github.com/microsoft/skills-for-copilot-studio.git

# Load for a single session:
claude --plugin-dir /path/to/skills-for-copilot-studio

# Or install persistently from the clone:
claude plugin install /path/to/skills-for-copilot-studio --scope user
```

To verify, type `/` in the input -- you should see `copilot-studio:copilot-studio-manage`,
`copilot-studio:copilot-studio-author`, `copilot-studio:copilot-studio-test`, and
`copilot-studio:copilot-studio-advisor` in the autocomplete menu.

## 2. Clone an Agent

Use the **Manage agent** for a guided, in-chat clone -- no VS Code extension required. It opens a
browser window for sign-in, lets you pick an environment and agent (or accepts a Copilot Studio URL
directly), and writes the files locally.

```
/copilot-studio:copilot-studio-manage clone
```

After cloning, you should see `agent.mcs.yml`, `settings.mcs.yml`, and directories like `topics/`,
`actions/`, and `knowledge/`. (The VS Code Copilot Studio Extension's clone wizard is still
available as an alternative if you prefer a UI flow.)

## 3. Get Design Guidance (optional but recommended)

Before building, ask the **Advisor agent** for pattern recommendations relevant to your scenario:

```
/copilot-studio:copilot-studio-advisor I want my agent to handle HR and IT queries with
  country-specific answers
```

The Advisor consults the [pattern library](./patterns/overview.md), explains the trade-offs of
each relevant pattern, and lets you decide what to adopt before handing off to Author.

## 4. Author Changes

Open Claude Code (or your preferred tool) in the cloned agent's directory.

### Explore the agent

```
/copilot-studio:copilot-studio-author What topics does this agent have? Give me an overview.
```

### Create a new topic

```
/copilot-studio:copilot-studio-author Create a new topic called "Product Information" that responds
  to questions about our products with a message listing our top 3 products.
```

The agent generates a valid YAML file with unique IDs and saves it to the `topics/` directory.

### Validate your changes

```
/copilot-studio:copilot-studio-advisor Validate all topics in my agent
```

## 5. Push and Publish

Use the **Manage agent** for the full pull → push → publish sequence, in-chat:

```
/copilot-studio:copilot-studio-manage Pull the latest, then push and publish my changes
```

> **Important**: Pushing creates a **draft**. You must also **publish** to make changes live and
> testable outside the Copilot Studio Test tab. The Manage agent always warns before publishing,
> since it makes the draft live for all end users.

(Pushing via the VS Code Extension's Command Palette -- "Copilot Studio: Push" -- and publishing
in the [Copilot Studio UI](https://copilotstudio.microsoft.com) both still work as alternatives.)

## 6. Test the Agent

The **Test agent** supports several approaches -- including a fast loop that tests the **draft**
without publishing:

### Fast loop: in-product evaluation (draft, no publish needed)

```
/copilot-studio:copilot-studio-test Run evals against my agent
```

Authenticates via `test-auth` (Azure App Registration Client ID, prompted on first use), lists your
test sets, runs the one you choose, and reports pass/fail with proposed fixes for failures.

### Point-test (published agent)

```
/copilot-studio:copilot-studio-test Send "What products do you offer?" to the published agent
```

Detects DirectLine vs M365 SDK auth mode automatically and routes to the right chat skill.
Multi-turn is supported -- the agent reuses the conversation automatically.

### Batch test suite (Copilot Studio Kit, published agent)

If you have the [Power CAT Copilot Studio Kit](https://github.com/microsoft/Power-CAT-Copilot-Studio-Kit)
installed in your environment:

```
/copilot-studio:copilot-studio-test Run my test suite
```

### Analyze evaluation results

Run evaluations in the Copilot Studio UI, export the results as CSV, and have the agent analyze
failures and propose fixes:

```
/copilot-studio:copilot-studio-test Analyze my evaluation results from ~/Downloads/Evaluate MyAgent.csv
```

## 7. Troubleshoot and Fix

If the agent responds with incorrect or outdated information:

```
/copilot-studio:copilot-studio-advisor The agent is making up product details that aren't accurate.
  It seems to be hallucinating instead of using real data.
```

The Advisor diagnoses the issue -- in this case, the agent is generating ungrounded responses
because it has no knowledge source to draw from. Fix it by adding one:

```
/copilot-studio:copilot-studio-author Add a knowledge source pointing to our product catalog at
  https://contoso.com/products
```

Then push, publish, and test again to verify the agent now responds with grounded information.

## Summary Checklist

- Plugin installed from marketplace or loaded locally
- Agent cloned with `/copilot-studio:copilot-studio-manage clone`
- `copilot-studio-manage`, `-author`, `-test`, `-advisor` visible in `/` autocomplete
- (Optional) Got design guidance from `-advisor` before building
- Created a topic with `-author`
- Validated with `-advisor`
- Pushed and published with `-manage`
- Tested with `-test` (fast loop: in-product eval against the draft; full loop: point-test or Kit
  suite against the published agent)
