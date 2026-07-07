---
sidebar_position: 1
title: Project Structure
---

# Project Structure

Overview of the repository layout and how the components fit together.

```
skills-for-copilot-studio/
  .claude-plugin/          Plugin manifest and marketplace config
  agents/                  Sub-agent definitions
    copilot-studio-advisor.md   Design guidance, review, troubleshooting
    copilot-studio-author.md    YAML authoring (topics, actions, knowledge, variables)
    copilot-studio-manage.md    ALM: clone, push, pull, publish
    copilot-studio-test.md      Evaluations, point-tests, batch suites
  hooks/                   Session hooks and routing
    system-prompt.md       Intent → sub-agent routing rules
  skills/                  Skill definitions (entry points + internal skills)
    new-topic, add-node, add-action, edit-action,
    add-knowledge, add-generative-answers,
    add-other-agents, add-global-variable,
    edit-agent, edit-triggers, add-adaptive-card    Authoring skills
    clone-agent, manage-agent                       Deployment / ALM skills
    test-auth, run-eval, create-eval-set,
    analyze-evals, detect-mode, chat-directline,
    chat-sdk, run-tests-kit                          Testing & evaluation skills
    validate, lookup-schema, list-kinds, list-topics Utility skills
    int-project-context, int-reference, int-patterns Internal (not user-invocable)
  patterns/                Pattern library (design recipes with YAML examples)
    *.md                    One file per pattern (status: proven/recommended/experimental)
  evals/                   Plugin development eval scenarios (not Copilot Studio in-product evals)
    scenarios/              JSON scenario definitions
    fixtures/               Sample agent workspaces for eval runs
    evaluate.py, run.js     Eval harness
  scripts/                 Bundled Node.js tools
    src/                    Source code for bundled scripts
    schema-lookup.bundle.js     Schema lookup tool
    connector-lookup.bundle.js  Connector definition lookup tool
    chat-with-agent.bundle.js   Point-test chat tool (DirectLine + SDK)
    manage-agent.bundle.js      ALM tool (clone/push/pull/publish)
    eval-api.bundle.js          In-product evaluation API tool
    package.json
  reference/               Copilot Studio YAML schema files
    bot.schema.yaml-authoring.json   Main authoring schema (744 definitions, 447 kind values)
    adaptive-card.schema.json        Adaptive card schema
    connectors/                      Connector definitions (Office 365, SharePoint, etc.)
  templates/               YAML templates for common patterns
    topics/                Topic templates
    actions/               Action templates
    agents/                Agent templates
    knowledge/             Knowledge source templates
    variables/             Variable templates
  tests/                   Test runner for Copilot Studio Kit integration
  docs/                    Documentation site (Docusaurus)
    src/                    Markdown documentation content
    scripts/                Build-time generators (e.g. pattern pages from patterns/)
    site/                   Docusaurus site project
```

## Key Components

### Plugin Manifest (`.claude-plugin/`)

The `plugin.json` file defines the plugin metadata (name, version, description).

### Agents (`agents/`)

Each agent is defined as a Markdown file with YAML frontmatter specifying the agent name,
description, and skill bindings. The agent body contains the system prompt. There are four:
Advisor, Author, Manage, and Test -- see the [Agents](../agents/advisor.md) section.

### Skills (`skills/`)

Each skill is a directory containing a `SKILL.md` definition. Skills are the atomic units of
functionality -- they handle one specific task (create a topic, validate YAML, run an evaluation,
etc.) and are never bypassed by agents when a matching skill exists.

### Patterns (`patterns/`)

Design recipes with YAML examples and a `status` maturity label (`proven`, `recommended`,
`experimental`). Consumed directly by the `int-patterns` skill at runtime, and mirrored onto the
docs site's [Pattern Library](../patterns/overview.md) page on every build.

### Scripts (`scripts/`)

Bundled Node.js scripts built with [esbuild](https://esbuild.github.io/). These provide runtime
functionality like schema lookups, connector lookups, ALM operations, and evaluation APIs -- all
designed to query large reference files without loading them wholesale into context.

To rebuild:

```bash
cd scripts
npm install
npm run build
```

### Reference (`reference/`)

The Copilot Studio YAML authoring schema files. These are the source of truth for validation and
schema lookups. The authoring schema alone defines 744 definitions and 447 valid `kind` values --
too large to load in full, so `schema-lookup.bundle.js` resolves lookups, keyword search, and
`$ref` chains on demand.

## Contributing

See [CONTRIBUTING.md](https://github.com/microsoft/skills-for-copilot-studio/blob/main/CONTRIBUTING.md) for development setup and contribution guidelines.
