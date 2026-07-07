---
sidebar_position: 99
title: Troubleshooting
---

# Troubleshooting

Common issues and solutions when working with the Skills for Copilot Studio plugin.

## Common Issues

| Issue | Possible Cause | Solution |
|-------|---------------|----------|
| Schema lookup returns "not found" | Definition name case mismatch | Use `search` to find the correct name |
| YAML parse error on import | Invalid YAML syntax | Check for indentation issues, missing colons |
| Topic doesn't render in canvas | Complex YAML not supported | Simplify the structure, use portal for complex edits |
| Duplicate ID error | Non-unique node IDs | Regenerate IDs for copied nodes |
| Power Fx error | Missing `=` prefix | Ensure expressions start with `=` |
| Plugin not found | Not installed or wrong path | Run `/plugin list` to verify |
| Test returns "not reachable" | Agent not published | Push AND publish before testing (or use in-product evals, which test the draft) |
| Authentication failure | Missing App Registration | Create an Azure App Registration with correct permissions |

## Agent Lifecycle

Understanding the agent lifecycle is critical for testing and troubleshooting.

| State | Where it lives | Who can see it |
|-------|---------------|----------------|
| **Local** | YAML files on disk | Only you (the AI agent and the user) |
| **Pushed (Draft)** | Power Platform environment | Copilot Studio UI -- authoring canvas and Test tab; also reachable by in-product evaluations (`run-eval`) |
| **Published** | Power Platform environment (live) | External clients -- point-tests, Kit batch suites, DirectLine, Teams |

**Key rule**: Pushing (with the Manage agent or the VS Code Extension) uploads changes as a
**draft**. In-product evaluations can test the draft directly -- the fastest iteration loop. Point-
tests and Kit batch suites can only interact with **published** content. Publishing is a separate
step, done via the Manage agent or the Copilot Studio UI.

## Debugging Workflow

1. Understand the symptom (wrong topic, no response, error, unexpected output)
2. Check the [pattern library](./patterns/overview.md) for known pitfalls that match the symptom
3. Validate the relevant YAML files -- use `/copilot-studio:copilot-studio-advisor`
4. Look up schema definitions if needed
5. Check trigger phrases and model descriptions
6. Propose specific YAML changes
7. Validate the fix
8. Push, publish, and re-test

## Plugin Management

```bash
# Check installed plugins
/plugin list

# Temporarily disable
/plugin disable copilot-studio

# Re-enable
/plugin enable copilot-studio

# Uninstall
/plugin uninstall copilot-studio
```

## Getting Help

If the plugin behaves unexpectedly, [open an issue](https://github.com/microsoft/skills-for-copilot-studio/issues/new/choose) with:

- The prompt you used
- Expected result
- Actual result
- Any error messages or logs
- Environment details (OS, Claude Code version, etc.)

If something goes wrong with your agent, you can always re-clone the original using the VS Code Extension.
