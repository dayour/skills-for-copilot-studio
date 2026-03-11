---
sidebar_position: 98
title: CAT Resources
---

# CAT Resources

Curated links from the Customer Acceleration Team (CAT) for Copilot Studio practitioners -- blog posts, official docs, best practices, and community tools.

---

## MCS CAT Blog

The [MCS CAT Blog](https://microsoft.github.io/mcscatblog) publishes field-tested guidance, tutorials, and architecture patterns from the Microsoft Customer Acceleration Team.

### Tutorials and Guides

| Title | Topics |
|-------|--------|
| [Skills for Copilot Studio: Build agents from YAML code, up to 20x Faster](https://microsoft.github.io/mcscatblog/posts/skills-for-copilot-studio/) | copilot-studio, tutorial, open-source |
| [Every Path to Integrating Your Copilot Studio Agent](https://microsoft.github.io/mcscatblog/posts/copilot-studio-api-decision-guide/) | copilot-studio, integration patterns |
| [Dynamic Knowledge URLs in Copilot Studio](https://microsoft.github.io/mcscatblog/posts/dynamic-knowledge-urls-copilot-studio/) | copilot-studio, knowledge |
| [MCP Servers or Connectors in Copilot Studio? A Maker's Guide](https://microsoft.github.io/mcscatblog/posts/compare-mcp-servers-pp-connectors/) | copilot-studio, mcp, connectors |

### Architecture and Integration

| Title | Topics |
|-------|--------|
| [Connecting Copilot Studio to a Dataverse MCP Endpoint Across Environments](https://microsoft.github.io/mcscatblog/posts/connecting-copilot-studio-dataverse-mcp-endpoint-across-environments/) | copilot-studio, mcp, cross-environment |
| [Embedding Copilot Studio Directly in ServiceNow](https://microsoft.github.io/mcscatblog/posts/servicenow-copilot-studio-widget/) | copilot-studio, webchat, ServiceNow |
| [The Conversation History Gap in the M365 Agents SDK](https://microsoft.github.io/mcscatblog/posts/webchat-conversation-history-m365-sdk/) | copilot-studio, webchat, M365 SDK |

### Testing and Quality

| Title | Topics |
|-------|--------|
| [Copilot Studio Kit: Beyond Test Automation](https://microsoft.github.io/mcscatblog/posts/copilot-studio-kit/) | copilot-studio-kit, testing, governance |

### Videos

| Title | Topics |
|-------|--------|
| [Mastering WebChat Middleware for Copilot Studio Agents](https://microsoft.github.io/mcscatblog/posts/webchat-middlewares/) | copilot-studio, webchat, middleware |
| [Retrieve Meeting Transcripts in Copilot Studio and Block Focus Time](https://microsoft.github.io/mcscatblog/posts/meeting-transcript-analyzer/) | copilot-studio, autonomous-agents |

---

## Copilot Studio Documentation

### Getting Started

- [Copilot Studio Overview](https://aka.ms/CopilotStudio) -- product landing page
- [Copilot Studio Documentation](https://learn.microsoft.com/en-us/microsoft-copilot-studio/) -- official docs
- [Create Your First Agent](https://learn.microsoft.com/en-us/microsoft-copilot-studio/fundamentals-get-started) -- quickstart
- [Copilot Studio Agent Academy](https://microsoft.github.io/agent-academy/) -- hands-on exercises for MCP, extensibility, and agent design

### Agent Design and Authoring

- [Topic Design Best Practices](https://learn.microsoft.com/en-us/microsoft-copilot-studio/guidance/topic-design) -- structuring topics for clarity and maintainability
- [Generative Orchestration](https://learn.microsoft.com/en-us/microsoft-copilot-studio/advanced-generative-actions) -- AI-driven intent routing and tool selection
- [Add Tools to Custom Agents](https://learn.microsoft.com/en-us/microsoft-copilot-studio/add-tools-custom-agent) -- REST, connectors, MCP, Agent Flows
- [Knowledge Sources](https://learn.microsoft.com/en-us/microsoft-copilot-studio/knowledge-copilot-studio) -- grounding agents with SharePoint, Dataverse, web, and files

### Testing and Evaluation

- [Power CAT Copilot Studio Kit](https://github.com/microsoft/Power-CAT-Copilot-Studio-Kit) -- batch testing, rubric evaluation, agent inventory, and compliance governance
- [Agent Evaluation in Copilot Studio](https://learn.microsoft.com/en-us/microsoft-copilot-studio/advanced-ai-evaluation) -- built-in evaluation framework

### Extensibility

- [MCP in Copilot Studio](https://www.microsoft.com/en-us/microsoft-copilot/blog/copilot-studio/introducing-model-context-protocol-mcp-in-copilot-studio-simplified-integration-with-ai-apps-and-agents/) -- architecture deep dive on Model Context Protocol integration
- [MCP Server Lab (mcsmcp)](https://github.com/microsoft/mcsmcp) -- official MCP Server lab for Copilot Studio
- [VS Code Copilot Studio Extension](https://github.com/microsoft/vscode-copilotstudio) -- clone, push, and manage agents from VS Code
- [Power Platform Connectors](https://learn.microsoft.com/en-us/connectors/connector-reference/) -- connector catalog for actions and integrations

### ALM and DevOps

- [Power Platform CLI (pac)](https://learn.microsoft.com/en-us/power-platform/developer/cli/introduction) -- command-line tooling for solution management
- [GitHub Actions for Power Platform](https://learn.microsoft.com/en-us/power-platform/alm/devops-github-actions) -- CI/CD pipeline integration
- [Power Platform Build Tools](https://github.com/microsoft/powerplatform-build-tools) -- Azure DevOps tasks for Power Platform ALM

---

## Best Practices

### Agent Design

1. **Use generative orchestration** for intent routing unless compliance requires deterministic paths. Generative achieves higher routing accuracy at lower maintenance cost.
2. **Keep topics focused** -- one topic per user intent. Avoid monolithic topics that try to handle multiple scenarios.
3. **Write clear model descriptions** on every topic. The orchestrator uses these to decide which topic to route to.
4. **Use conversation starters** to guide users toward supported scenarios.
5. **Test with real user utterances**, not just the trigger phrases you authored.

### Knowledge Grounding

1. **Prefer SharePoint and Dataverse** over public web sources for enterprise data. They offer better security, freshness, and governance.
2. **Use dynamic knowledge URLs** (variable-based) for multi-market or multi-product agents to reduce noise and improve relevance.
3. **Chunk documents intentionally** -- short, self-contained sections ground better than long narrative pages.

### Testing

1. **Automate regression testing** with the Copilot Studio Kit. Manual spot-checks do not scale.
2. **Test after every publish**, not just after major changes. Small edits can break routing.
3. **Use evaluation CSV exports** to systematically identify failure patterns and track quality over time.

### Security and Governance

1. **Enable Entra ID authentication** (Integrated mode) for internal agents. Never ship "No Auth" to production.
2. **Scope access control** to specific security groups rather than "Any user" for sensitive agents.
3. **Audit DLP policies** per channel to ensure agents comply with data loss prevention rules.

---

## Community and Open Source

- [Skills for Copilot Studio Plugin](https://github.com/microsoft/skills-for-copilot-studio) -- this project
- [Power CAT Tools](https://github.com/microsoft/Power-CAT-Tools) -- additional CAT accelerators
- [Copilot Studio Issues](https://github.com/microsoft/skills-for-copilot-studio/issues) -- report bugs and request features
- [Copilot Studio Samples](https://github.com/microsoft/CopilotStudioSamples) -- official sample agents and patterns
