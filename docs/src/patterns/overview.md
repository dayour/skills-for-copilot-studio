---
sidebar_position: 1
title: Pattern Library
---

# Pattern Library

15 proven and recommended implementation patterns for Copilot Studio agents,
generated directly from the [`patterns/`](https://github.com/microsoft/skills-for-copilot-studio/tree/main/patterns)
folder consumed by the `int-patterns` skill at runtime. This page always reflects the current
pattern library -- it is regenerated on every site build.

Patterns are **recommendations, not requirements**. The Advisor agent surfaces the relevant ones
during design and review; the Author agent implements them once you approve.

| Pattern | Status | Challenge it solves |
|---------|--------|----------------------|
| [Conversation History Variable](./conversation-history-variable.md) | <span class="pattern-status-badge status-proven">Proven</span> | Agents often need the current conversation context for handoff or logging, but rebuilding the transcript turn by turn is cumbersome and fragile. |
| [Date Context](./date-context.md) | <span class="pattern-status-badge status-proven">Proven</span> | The orchestrator has no awareness of the current date, causing misinterpretation of relative date references ("next week", "upcoming", "recent") and time-sensitive knowledge retrieval. |
| [Dynamic Topic Redirect](./dynamic-topic-redirect.md) | <span class="pattern-status-badge status-proven">Proven</span> | Complex if/then/else condition chains in the UI become deeply nested, hard to read, and difficult to maintain as the number of routing targets grows. |
| [JIT Glossary](./jit-glossary.md) | <span class="pattern-status-badge status-proven">Proven</span> | The agent doesn't understand internal acronyms and abbreviations, leading to poor knowledge search quality and confused answers. |
| [JIT User Context](./jit-user-context.md) | <span class="pattern-status-badge status-proven">Proven</span> | The agent cannot personalize answers by country, department, or role without asking the user — leading to generic responses or unnecessary questions. |
| [Knowledge Hold Message](./knowledge-hold-message.md) | <span class="pattern-status-badge status-proven">Proven</span> | Knowledge retrieval can leave users staring at a silent screen, causing confusion, duplicate questions, and abandonment. |
| [Line Breaks in Messages](./line-breaks-in-messages.md) | <span class="pattern-status-badge status-proven">Proven</span> | Multi-line bot messages collapse into walls of text because most channels render plain YAML newlines as spaces. |
| [Orchestrator-Generated Variables](./orchestrator-variables.md) | <span class="pattern-status-badge status-proven">Proven</span> | Extracting structured data (categories, entities, flags) from user messages requires either asking the user explicitly or using an AI Prompt action that consumes additional credits and adds latency. |
| [Prevent Child Agent Responses](./prevent-child-agent-responses.md) | <span class="pattern-status-badge status-proven">Proven</span> | Child agents (connected agents) send messages directly to the user, bypassing the parent agent's control over response formatting, filtering, and tone. |
| [Chain of Thought Logging](./chain-of-thought-logging.md) | <span class="pattern-status-badge status-recommended">Recommended</span> | Multi-tool or multi-agent flows can leave users waiting in silence with no visibility into what the agent is doing. |
| [Prevent Tool Call Leaks](./prevent-tool-call-leaks.md) | <span class="pattern-status-badge status-recommended">Recommended</span> | The agent returns raw JSON with internal fields like "explanation_of_tool_call" and "new_instruction" to users instead of a clean final answer. |
| [RAI Error Handling](./rai-error-handling.md) | <span class="pattern-status-badge status-recommended">Recommended</span> | Users see a generic failure when content filtering blocks a request, so they get no clear explanation or next step for the specific safety category that fired. Only applies to Azure OpenAI models — does not work with Anthropic or xAI models. |
| [Teams Production Hardening](./teams-production-hardening.md) | <span class="pattern-status-badge status-recommended">Recommended</span> | Teams and Microsoft 365 Copilot deployments can suffer from stale sessions, missing onboarding after reinstall, inconsistent context initialization, and unhelpful reset or error experiences. |
| [Channel-Aware Behavior](./channel-aware-behavior.md) | <span class="pattern-status-badge status-experimental">Experimental</span> | Some agent capabilities (file upload UX, Adaptive Card variants, links to internal apps, voice prompts) work in one channel but not another. Without channel awareness, the agent offers broken affordances or generic responses regardless of where it's running. |
| [Deterministic MCP Calls](./deterministic-mcp-calls.md) | <span class="pattern-status-badge status-experimental">Experimental</span> | The orchestrator may skip the intended MCP tool because MCP actions are generative and cannot be invoked deterministically from topics today. |

## Status legend

- `Proven` -- used in production, safe to adopt directly.
- `Recommended` -- works well with limited production exposure; review before relying on it at scale.
- `Experimental` -- not yet fully validated; test thoroughly before adopting.

## Combining patterns

Multiple patterns are designed to work together. See each pattern's "Read this pattern when"
guidance in the [int-patterns skill](https://github.com/microsoft/skills-for-copilot-studio/blob/main/skills/int-patterns/SKILL.md#combining-patterns)
for common combinations (e.g. JIT Glossary + JIT User Context, RAI Error Handling + Teams
Production Hardening).
