# Claude Code CLI Setup for Copilot Studio YAML Development

## Complete Step-by-Step Configuration and Testing Guide

This guide walks you through setting up Claude Code CLI to work with Microsoft Copilot Studio YAML files. The setup enables Claude Code to generate and update agent YAML while using a schema lookup tool to validate syntax without loading the large schema file into context memory.

---

## Prerequisites

Before starting, ensure you have the following installed and configured:

| Requirement | Version | Verification Command |
|-------------|---------|---------------------|
| Node.js | 18+ | `node --version` |
| Python | 3.8+ | `python --version` |
| Claude Code CLI | Latest | `claude --version` |
| Copilot Studio VS Code Extension | Latest | `install via VS Code marketplace` |
| Visual Studio Code | Latest | `code --version` |

You also need access to a Power Platform environment with Copilot Studio and an existing agent to test with.

---

## Part 1: Initial Setup

### Step 1.1: Create Project Directory

Create a new directory for your Copilot Studio development project. This will be your working directory for all Claude Code operations.

**Windows (PowerShell):**
```powershell
mkdir C:\Projects\copilot-studio-dev
cd C:\Projects\copilot-studio-dev
```

**Mac/Linux:**
```bash
mkdir -p ~/Projects/copilot-studio-dev
cd ~/Projects/copilot-studio-dev
```

### Step 1.2: Copy the Claude Code Setup Files

Copy the provided setup files into your project directory. The folder structure should look like this:

```
copilot-studio-dev/
├── CLAUDE.md                           # Project instructions for Claude Code
├── .claude/
│   └── commands/                       # Custom slash commands
│       ├── add-action.md
│       ├── add-knowledge.md
│       ├── list-kinds.md
│       ├── list-topics.md
│       ├── lookup-schema.md
│       ├── new-topic.md
│       └── validate.md
├── reference/
│   └── bot.schema.yaml-authoring.json  # YOUR schema file goes here
├── scripts/
│   └── schema-lookup.py                # Schema lookup helper
└── templates/                          # YAML templates
    ├── actions/
    ├── agents/
    ├── knowledge/
    └── topics/
```

**Checkpoint 1:** Verify the structure is correct:

**Windows:**
```powershell
Get-ChildItem -Recurse -Name
```

**Mac/Linux:**
```bash
find . -type f -name "*.md" -o -name "*.py" -o -name "*.yml" | head -20
```

### Step 1.3: Place Your Schema File

Copy your `bot.schema.yaml-authoring.json` file into the `reference/` directory.

**Windows:**
```powershell
Copy-Item "C:\Path\To\bot.schema.yaml-authoring.json" -Destination ".\reference\"
```

**Mac/Linux:**
```bash
cp /path/to/bot.schema.yaml-authoring.json ./reference/
```

**Checkpoint 2:** Verify the schema file is in place and readable:

```bash
python scripts/schema-lookup.py list | head -20
```

Expected output: A list of definition names from your schema file.

---

## Part 2: Install the VS Code Copilot Studio Extension

Follo these steps: https://github.com/microsoft/vscode-copilotstudio

---

## Part 3: Clone an Existing Agent

### Step 3.1: Clone the Agent

Clone the agent via the VS Code Extension.

The guideline is to put the agent folder into the `src/` directory with the unpacked yamls files.

**Checkpoint 4:** Verify the clone was successful:

**Windows:**
```powershell
Get-ChildItem -Path .\src -Recurse -Filter "*.mcs.yml" | Select-Object -First 10
```

**Mac/Linux:**
```bash
find ./src -name "*.mcs.yml" | head -10
```

You should see YAML files for your agent's topics, actions, and configuration.

### Step 3.2: Understand the Solution Structure

After cloning, your project structure should look like this:

```
copilot-studio-dev/
├── CLAUDE.md
├── .claude/commands/
├── reference/
│   └── bot.schema.yaml-authoring.json
├── scripts/
│   └── schema-lookup.py
├── templates/
└── src/
    └── <your-agent-name>/
        ├── agent.mcs.yml           # Agent metadata
        ├── settings.mcs.yml        # Agent settings
        ├── connectionreferences.mcs.yml
        ├── topics/                 # Topic YAML files
        │   ├── greeting.topic.mcs.yml
        │   ├── fallback.topic.mcs.yml
        │   └── ...
        ├── actions/                # Connector actions
        ├── knowledge/              # Knowledge sources
        └── agents/                 # Child agents
```

---

## Part 4: Initialize Claude Code

### Step 4.1: Open in VS Code

Open your project directory in Visual Studio Code:

```bash
code .
```

### Step 4.2: Start Claude Code

In the VS Code terminal, start Claude Code:

```bash
claude
```

Claude Code will automatically read the `CLAUDE.md` file and understand the project context.

**Checkpoint 5:** Verify Claude Code loaded the project instructions:

In Claude Code, type:
```
What custom commands are available in this project?
```

Claude should list the available `/project:` commands.

---

## Part 5: Test the Schema Lookup

### Step 5.1: Test Basic Lookup

Test that the schema lookup script works with your actual schema file:

```bash
python scripts/schema-lookup.py lookup SendActivity
```

Expected output: The JSON schema definition for `SendActivity`.

### Step 5.2: Test Search

```bash
python scripts/schema-lookup.py search trigger
```

Expected output: A list of definitions containing "trigger" in their name.

### Step 5.3: Test Resolve (with $ref expansion)

```bash
python scripts/schema-lookup.py resolve Question
```

Expected output: The fully resolved schema for `Question` with all `$ref` references expanded.

### Step 5.4: Test Kinds List

```bash
python scripts/schema-lookup.py kinds
```

Expected output: All available `kind` discriminator values from your schema.

**Checkpoint 6:** All four commands should execute without errors and return meaningful data from your schema file.

---

## Part 6: Test Claude Code Custom Commands

### Step 6.1: Test Lookup Schema Command

In Claude Code, type:
```
/lookup-schema SendActivity
```

Claude should run the schema lookup script and explain the `SendActivity` definition.

### Step 6.2: Test List Topics Command

```
/list-topics
```

Claude should find and list all topics in your cloned solution.

### Step 6.3: Test List Kinds Command

```
/list-kinds
```

Claude should display all available `kind` values from the schema.

**Checkpoint 7:** All custom commands should work and Claude should use the schema lookup script instead of loading the schema into context.

---

## Part 7: Test YAML Generation

### Step 7.1: Create a New Topic

Ask Claude to create a new topic:

```
Create a new topic called "Product Information" that responds to questions about our products. 
It should ask the user which product they're interested in and then provide information.
```

Claude should:
1. Use the schema lookup to verify the correct structure
2. Generate a valid YAML file with unique IDs
3. Save it to the appropriate location in `src/botcomponents/`

### Step 7.2: Validate the Generated Topic

```
/validate src/botcomponents/<agent-name>/topics/product-information.topic.mcs.yml
```

Claude should validate the generated YAML against the schema.

**Checkpoint 8:** The generated YAML should pass validation with no errors.

---

## Part 8: Test YAML Modification

### Step 8.1: Add an Action to an Existing Topic

Ask Claude to modify an existing topic:

```
Add a Question action to the greeting topic that asks for the user's name and stores it in Topic.UserName
```

Claude should:
1. Read the existing topic file
2. Look up the Question schema
3. Generate a new Question node with a unique ID
4. Insert it at the appropriate location

### Step 8.2: Verify the Modification

Open the modified file and verify:
- The new action has a unique ID
- All required properties are present
- The file still has valid YAML syntax

**Checkpoint 9:** The modified topic should be valid and include the new action.

---

## Part 9: Pack and Import the Solution

### Step 9.1: Pack the Modified Solution

After making changes, pack the solution:

```bash
pac solution pack --zipfile ./output/MyAgent_modified.zip --folder ./src --allowWrite --allowDelete
```

### Step 9.2: Import to Development Environment

Import the modified solution to your development environment:

```bash
pac solution import --path ./output/MyAgent_modified.zip --environment https://YOUR-DEV-ORG.crm.dynamics.com --publish-changes
```

### Step 9.3: Verify in Copilot Studio

Open Copilot Studio in your browser and verify:
1. The agent loads without errors
2. New topics appear in the topic list
3. Modified topics render correctly in the canvas
4. Test the conversation flow in the test panel

**Checkpoint 10:** The agent should work correctly in Copilot Studio with all your changes visible.

---

## Part 10: Troubleshooting

### Common Issues and Solutions

| Issue | Possible Cause | Solution |
|-------|---------------|----------|
| Schema lookup returns "not found" | Definition name case mismatch | Use `search` to find the correct name |
| YAML parse error on import | Invalid YAML syntax | Check for indentation issues, missing colons |
| Topic doesn't render in canvas | Complex YAML not supported | Simplify the structure, use portal for complex edits |
| Duplicate ID error | Non-unique node IDs | Regenerate IDs for copied nodes |
| Power Fx error | Missing `=` prefix | Ensure expressions start with `=` |

### Viewing Import Errors

If the import fails, check the error details:

```bash
pac solution import --path ./output/MyAgent_modified.zip --environment <url> --publish-changes --verbose
```

### Reverting Changes

If something goes wrong, you can re-clone the original solution:

```bash
rm -rf ./src
pac solution clone --name "YOUR_SOLUTION_NAME" --outputDirectory ./src
```

---

## Quick Reference: Available Commands

### Schema Lookup Script

| Command | Description |
|---------|-------------|
| `python scripts/schema-lookup.py lookup <name>` | Look up a specific definition |
| `python scripts/schema-lookup.py search <keyword>` | Search for definitions |
| `python scripts/schema-lookup.py resolve <name>` | Resolve with $ref expansion |
| `python scripts/schema-lookup.py list` | List all definitions |
| `python scripts/schema-lookup.py kinds` | List all kind values |
| `python scripts/schema-lookup.py summary <name>` | Get a compact summary |

### Claude Code Custom Commands

| Command | Description |
|---------|-------------|
| `/project:lookup-schema <name>` | Look up and explain a schema definition |
| `/project:new-topic <description>` | Create a new topic |
| `/project:add-action <type> to <topic>` | Add an action to a topic |
| `/project:validate <path>` | Validate a YAML file |
| `/project:list-topics` | List all topics in the solution |
| `/project:list-kinds` | List all available kind values |
| `/project:add-knowledge <url>` | Add a public website knowledge source |

### PAC CLI Commands

| Command | Description |
|---------|-------------|
| `pac auth create --url <url>` | Authenticate with environment |
| `pac solution clone --name <name> --outputDirectory ./src` | Clone solution |
| `pac solution pack --zipfile <path> --folder ./src` | Pack solution |
| `pac solution import --path <path> --environment <url>` | Import solution |
| `pac copilot list --environment <url>` | List copilots |
| `pac copilot publish --bot <id> --environment <url>` | Publish agent |

---

## Summary Checklist

Use this checklist to verify your setup is complete:

- [ ] Project directory created with correct structure
- [ ] `bot.schema.yaml-authoring.json` placed in `reference/`
- [ ] Schema lookup script tested and working
- [ ] PAC CLI authenticated with Power Platform
- [ ] Existing agent solution cloned to `src/`
- [ ] Claude Code initialized and reading `CLAUDE.md`
- [ ] Custom commands tested and working
- [ ] YAML generation tested
- [ ] YAML modification tested
- [ ] Solution pack and import tested
- [ ] Agent verified in Copilot Studio portal

---

## Next Steps

After completing this setup:

1. **Explore the templates** in the `templates/` directory for common patterns
2. **Review the CLAUDE.md** file to understand the limitations and guidelines
3. **Practice with low-risk changes** like trigger phrases and knowledge URLs first
4. **Always test in a development environment** before production
5. **Use version control** (Git) to track your changes

For more information on Copilot Studio YAML syntax, refer to your research reports and the official Microsoft documentation.
