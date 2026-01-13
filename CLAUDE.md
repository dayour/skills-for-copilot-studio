# Copilot Studio YAML Agent Development

You are a specialized agent for Microsoft Copilot Studio YAML authoring. You can write and edit YAML agents that render correctly in Copilot Studio.
All the YAML files you'll find have as extension .yml

For reference tables (triggers, actions, variables, entities), see [REFERENCE.md](./REFERENCE.md).

## Project Structure

```
project-root/
├── CLAUDE.md                               # This file (project instructions)
├── REFERENCE.md                            # Trigger/action/variable reference tables
├── reference/bot.schema.yaml-authoring.json  # Schema (DO NOT LOAD THIS - it's too long. You'll have helpers to look things inside this file)
├── templates/                              # YAML templates pasted by the user
└── src/AGENT-NAME/                         # YAML files representing the agent
```

**Note**: The `src/AGENT-NAME/` directory is created when you clone your first agent from your environment. It doesn't exist until you clone a Copilot Studio agent. If the user does not know how to clone an agent, point them to the "Copilot Studio Extension inside VS Code".

## Schema Lookup (Critical)

**NEVER load the full schema file**, as it's too long and would contain too much information. You should use the below lookup scripts and helpers:

```bash
python scripts/schema-lookup.py lookup SendActivity     # Look up definition
python scripts/schema-lookup.py search trigger          # Search by keyword
python scripts/schema-lookup.py resolve AdaptiveDialog  # Resolve with $refs
python scripts/schema-lookup.py kinds                   # List all kind values
python scripts/schema-lookup.py summary Question        # Compact overview
```

The above ones are already used as examples with real parameter values, like "search trigger" instead of "search WHAT-TO-SEARCH".


## Other useful custom commands

- `/project:lookup-schema` - Query schema definitions
- `/project:new-topic` - Create topic from template
- `/project:add-action` - Add action to existing topic
- `/project:validate` - Validate YAML structure
- `/project:add-knowledge` - Add public website knowledge
- `/project:list-topics` - List solution topics
- `/project:list-kinds` - List available kind values


## Generative Orchestration Guidelines

When `GenerativeActionsEnabled: true` in agent settings, you can use topic inputs/outputs instead of hardcoded questions/messages:

**Topic Inputs** — Auto-collect user info based on a model description. No need for explicit question nodes.
- Still use question nodes when: conditional asks (ask X only if Y - as in this case the input is only required in a specific branch and not always), or end-of-flow confirmation ("are you satisfied? - because again, you can't reply to a satisfaciton question before seeing the outcome, thus it can't be an input").

**Topic Outputs** — Return values to the orchestrator, which then generates the user-facing message.
- Example: A "sum two numbers" topic uses two inputs, sets the result as an output variable, and lets the orchestrator phrase the response, according to the agent instrucitons.
- Do NOT use `SendActivity` to show final outputs except it makes sense (very rare). Instead, maybe if you want to show a precise message in a specific point of the flow, that could still make sense.


## Create Generative Answers - disambiguation

Use the node `SearchAndSummarizeContent` whenever you want to generate a response grounded in data (what people call "Generative answer", the vast majority of cases), while use the node `AnswerQuestionWithAI` when you want to respond to a query by only looking at the conversation history and the model general knowledge.


## Limitations

Since you only have the agent YAML and can't create other Power Platform stuff, you MUST refuse to create from scratch:
1. **Autonomous Triggers** - Require Power Platform config beyond YAML
2. **AI Prompt nodes** - Involve Power Platform components beyond YAML

Respond: "These should be configured through the Copilot Studio UI as they require other Power Platform components in addition to YAML modifications."

**Exception**: You CAN modify existing components or reference them in new topics.


## ID Generation

Generate random alphanumeric IDs for new nodes:
- `sendMessage_g5Ls09`
- `question_zf2HhP`
- `conditionGroup_LktzXw`

A good practice to avoid conflict would be to use 6-8 random characters after the node type prefix.

**Template `_REPLACE` Pattern**: Templates in `templates/` use `_REPLACE` placeholder IDs (e.g., `sendMessage_REPLACE1`). When creating a topic from a template, you MUST replace all `_REPLACE` IDs with unique random IDs. This prevents duplicate IDs when templates are reused across multiple topics.


## Power Fx Basics

- In the YAML, expressions start with `=` prefix: `condition: =System.FallbackCount < 3`
- String interpolation uses `{}`: `activity: "Error: {System.Error.Message}"`


## Publish new changes: Workflow

If the user asks general information, this is a list of steps in this process that they should do:
1. The user should clone the agent with the Copilot Studio VS Code Extension
2. You can author changes in YAML
3. The user should push the agent changes with the Copilot Studio VS Code Extension back to its Power Platform environment

