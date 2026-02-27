---
description: Run tests against a published Copilot Studio agent and analyze results. Use when the user asks to test the agent, run tests, validate published changes, or check if the agent works correctly. The agent must have been pushed and published in Copilot Studio first.
allowed-tools: Bash(node *), Bash(npm *), Bash(cd *), Read, Glob, Grep, Edit
---

# Run Tests

Run Copilot Studio agent tests via Dataverse API, download results, and analyze failures to propose YAML fixes.

## Prerequisites

The user must have:
1. **Pushed and published** their agent to Copilot Studio (via VS Code Extension)
2. **Created a test set** in Copilot Studio (Tests tab in the UI)
3. **Configured `tests/settings.json`** with their environment details (copy from `tests/settings-example.json`)

If `tests/settings.json` doesn't exist, tell the user to create it by copying the example:
```bash
cp tests/settings-example.json tests/settings.json
```
Then fill in their Dataverse environment URL, tenant ID, client ID, agent configuration ID, and test set ID from Copilot Studio.

If `tests/settings.json` exists but still has placeholder values (`YOUR_`), tell the user to fill in their actual values.

## Instructions

### Phase 1: Run the Tests

1. **Check that settings are configured**:
   ```
   Read: tests/settings.json
   ```
   Verify no values contain `YOUR_`. If they do, stop and ask the user to fill them in.

2. **Install dependencies** (if `tests/node_modules/` doesn't exist):
   ```bash
   cd tests && npm install
   ```

3. **Run the test script**:
   ```bash
   cd tests && node run-tests.js
   ```
   **Important**: This is a long-running command. The script:
   - Authenticates via device code flow — the **first time**, the user must open a browser URL and enter a code. Tell the user to watch the terminal output and follow the authentication prompt. After the first auth, tokens are cached.
   - Creates a test run in Dataverse
   - Polls every 20 seconds until complete (can take several minutes)
   - Downloads results as a CSV file to `tests/test-results-<id>.csv`

   Run this with a generous timeout (up to 10 minutes):
   ```bash
   cd tests && node run-tests.js
   ```

4. **Check the output** for the success rate and CSV filename.

### Phase 2: Analyze Results

5. **Find and read the results CSV**:
   ```
   Glob: tests/test-results-*.csv
   ```
   Read the most recent CSV file (newest by modification time).

6. **Parse the CSV columns**:
   | Column | Meaning |
   |--------|---------|
   | Test Utterance | The user message that was tested |
   | Expected Response | What the test expected |
   | Response | What the agent actually responded |
   | Latency (ms) | Response time |
   | Result | `Success`, `Failed`, `Unknown`, `Error`, or `Pending` |
   | Test Type | `Response Match`, `Topic Match`, `Generative Answers`, `Multi-turn`, `Plan Validation`, or `Attachments` |
   | Result Reason | Why the test passed or failed |

7. **Focus on failed tests** (Result = `Failed` or `Error`). For each failure, analyze:
   - **Test Type = Topic Match**: The wrong topic was triggered, or no topic matched. Check trigger phrases and model descriptions in the relevant topics.
   - **Test Type = Response Match**: The response didn't match the expected response. Check the topic's `SendActivity` messages, instructions, or generative answer configuration.
   - **Test Type = Generative Answers**: The generative answer was incorrect or missing. Check knowledge sources, `SearchAndSummarizeContent` configuration, and agent instructions.
   - **Test Type = Plan Validation**: The orchestrator's plan was wrong. Check topic descriptions, model descriptions, and agent-level instructions.
   - **Test Type = Multi-turn**: A multi-turn conversation failed at some step. Check topic flow, variable handling, and conditions.

### Phase 3: Propose Fixes

8. **For each failure, identify the relevant YAML file(s)**:
   - Auto-discover the agent: `Glob: src/**/agent.mcs.yml`
   - Find the relevant topic by matching the test utterance against trigger phrases and model descriptions
   - Read the topic file to understand the current flow

9. **Propose specific YAML changes** to fix each failure. Present them to the user as a summary:
   - Which test(s) failed and why
   - Which file(s) need changes
   - What the proposed change is (show the diff)

10. **Wait for user decision**. The user can:
    - **Accept all** — apply all proposed changes
    - **Accept partially** — apply only some changes (ask which ones)
    - **Reject** — discard proposed changes and discuss alternative approaches

11. **Apply accepted changes** using the Edit tool. After applying, remind the user to push and publish again before re-running tests.

## Test Result Codes Reference

```
Result: 1=Success, 2=Failed, 3=Unknown, 4=Error, 5=Pending
Test Type: 1=Response Match, 2=Topic Match, 3=Attachments, 4=Generative Answers, 5=Multi-turn, 6=Plan Validation
Run Status: 1=Not Run, 2=Running, 3=Complete, 4=Not Available, 5=Pending, 6=Error
```
