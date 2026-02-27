---
description: Add generative answer nodes (SearchAndSummarizeContent or AnswerQuestionWithAI) to a Copilot Studio topic. Use this instead of /add-node when the user asks to add grounded answers, knowledge search, generative answers, or AI-powered responses — these nodes require specific patterns (ConditionGroup follow-up, knowledge source references, autoSend, responseCaptureType) that /add-node does not cover.
argument-hint: <topic-name or "new">
allowed-tools: Bash(python *), Read, Write, Edit, Glob
---

# Add Generative Answers

Add `SearchAndSummarizeContent` nodes to generate responses grounded in the agent's knowledge sources.

## Important: Do You Even Need a Topic?

When knowledge sources are added to the agent (via `/add-knowledge`), the AI can **directly search them without any topic** if it recognizes a QnA-style query. A dedicated topic with `SearchAndSummarizeContent` is useful when:
- You want to **restrict the search to a subset of knowledge sources** (not all of them)
- You want to **control the flow** around the answer (e.g., follow-up questions, formatting, adaptive cards)
- You want to **process the response** before showing it (e.g., extract content, combine with other data)
- You want to **use a specific input** other than the user's last message

If the user just wants the agent to answer questions from its knowledge, adding the knowledge source may be enough.

## Instructions

1. **Auto-discover the agent directory**:
   ```
   Glob: src/**/agent.mcs.yml
   ```
   NEVER hardcode an agent name.

2. **Determine the approach** based on what the user needs:
   - **Add to existing topic**: Read the target topic and insert a SearchAndSummarizeContent node
   - **Create new search topic**: Generate a complete topic with the search pattern

3. **Look up the schema**:
   ```bash
   python scripts/schema-lookup.py resolve SearchAndSummarizeContent
   ```

4. **Read `settings.mcs.yml`** to check if `GenerativeActionsEnabled: true`. This determines the best pattern:
   - **`GenerativeActionsEnabled: true`** → prefer **Pattern 2 (Orchestrator)**: use topic inputs/outputs and let the orchestrator handle the response. This is the best approach for generative-orchestrated agents.
   - **`GenerativeActionsEnabled: false`** (or not set) → use **Pattern 1 (Direct Response)**: `autoSend: false` + manual SendActivity, or **Pattern 3 (Fallback Search)** for a simple all-knowledge fallback.

5. **Ask the user** to clarify the behavior (if not already clear from their request):
   - Should it search **all knowledge sources** or only **specific ones**?
   - Should **general model knowledge** also be used, or only the configured knowledge sources?
   - Should the response be **sent automatically** to chat, or **processed first** (e.g., custom formatting, adaptive card, combined with other data)?

6. **Generate unique IDs** for all nodes (format: `<nodeType>_<6-8 random alphanumeric>`).

## SearchAndSummarizeContent Properties

```yaml
- kind: SearchAndSummarizeContent
  id: searchContent_<random>
  autoSend: false
  variable: Topic.Answer
  userInput: =System.Activity.Text
  fileSearchDataSource:
    searchFilesMode:
      kind: DoNotSearchFiles
  knowledgeSources:
    kind: SearchSpecificKnowledgeSources
    knowledgeSources:
      - <schemaName>.topic.<KnowledgeSourceFileName>
  applyModelKnowledgeSetting: false
  responseCaptureType: FullResponse
```

### Property Reference

| Property | Description |
|----------|-------------|
| `autoSend` | If `true`, the node automatically sends the response to the chat. If `false`, the response is saved into `variable` for manual handling (send a message, build an adaptive card, pass to orchestrator, etc.). |
| `variable` | Where the response is stored. With `responseCaptureType: FullResponse`, access it via `Variable.Text.Content`, `Variable.Text.MarkdownContent`, and `Variable.Text.CitationSources`. |
| `userInput` | The input from which the response is generated. Common options: `=System.Activity.Text` (user's last message), `=Topic.SomeInput` (a topic input variable), or a crafted expression combining strings and variables. |
| `responseCaptureType` | Set to `FullResponse` to capture the full structured response (content, markdown, citations). |
| `knowledgeSources` | Restrict the search to specific knowledge sources. Use `kind: SearchSpecificKnowledgeSources` with a list of knowledge source references. Omit this property to search all agent knowledge. **The knowledge source must already exist** (added via `/add-knowledge`). Reference format: filename without `.mcs.yml`. |
| `applyModelKnowledgeSetting` | If `true`, also uses general model knowledge in addition to the specified knowledge sources. If `false`, only searches the configured knowledge sources. |
| `fileSearchDataSource` | Controls file search behavior. `kind: DoNotSearchFiles` disables file search. |

### `userInput` Options

`System.Activity.Text` is the last message sent by the user. But other options exist:

- **User's last message**: `userInput: =System.Activity.Text` — most common for direct Q&A
- **Topic input variable**: `userInput: =Topic.QuestionToBeAnswered` — when the orchestrator or a previous node provides the question
- **Crafted expression**: You can combine strings with variables to build a specific query, e.g., ask the user for a topic and then search for "Give me information about " & that topic

## SearchAndSummarizeContent vs AnswerQuestionWithAI

| Node | Use When | Data Source |
|------|----------|-------------|
| `SearchAndSummarizeContent` | You want answers grounded in the agent's knowledge sources (websites, SharePoint, Dataverse) | Agent's configured knowledge |
| `AnswerQuestionWithAI` | You want a response based only on conversation history and general model knowledge | No external data |

**Use `SearchAndSummarizeContent`** for the vast majority of cases (what people call "generative answers"). Use `AnswerQuestionWithAI` only when you explicitly want the model to respond without consulting knowledge sources.

## Pattern 1: Direct Response (autoSend: false + manual send)

Use when you want to control how the response is displayed (custom formatting, adaptive cards, or processing the result before showing it).

```yaml
actions:
  - kind: SearchAndSummarizeContent
    id: searchContent_<random>
    autoSend: false
    variable: Topic.Answer
    userInput: =System.Activity.Text
    fileSearchDataSource:
      searchFilesMode:
        kind: DoNotSearchFiles
    knowledgeSources:
      kind: SearchSpecificKnowledgeSources
      knowledgeSources:
        - <schemaName>.topic.<KnowledgeSourceName>
    applyModelKnowledgeSetting: false
    responseCaptureType: FullResponse

  - kind: ConditionGroup
    id: conditionGroup_<random>
    conditions:
      - id: conditionItem_<random>
        condition: =!IsBlank(Topic.Answer)
        actions:
          - kind: SendActivity
            id: sendActivity_<random>
            activity: "{Topic.Answer.Text.MarkdownContent}"
```

Since `autoSend: false`, the response is stored in `Topic.Answer`. The ConditionGroup checks if an answer was found, then SendActivity displays it using `{Topic.Answer.Text.MarkdownContent}`.

## Pattern 2: Orchestrator Pattern (inputs/outputs)

Use when the agent has `GenerativeActionsEnabled: true` and you want the orchestrator to incorporate the search result into its response. The topic takes an input question, searches knowledge, and returns the result as an output — the orchestrator then formulates the final user-facing message.

```yaml
kind: AdaptiveDialog
inputs:
  - kind: AutomaticTaskInput
    propertyName: QuestionToBeAnswered
    description: Your question about <topic subject>
    shouldPromptUser: true

modelDescription: This topic provides information about <topic subject>
beginDialog:
  kind: OnRecognizedIntent
  id: main
  intent: {}
  actions:
    - kind: SearchAndSummarizeContent
      id: searchContent_<random>
      autoSend: false
      variable: Topic.SearchResult
      userInput: =Topic.QuestionToBeAnswered
      fileSearchDataSource:
        searchFilesMode:
          kind: DoNotSearchFiles
      knowledgeSources:
        kind: SearchSpecificKnowledgeSources
        knowledgeSources:
          - <schemaName>.topic.<KnowledgeSourceName>
      applyModelKnowledgeSetting: false
      responseCaptureType: FullResponse

    - kind: SetVariable
      id: setVariable_<random>
      variable: Topic.Response
      value: =Topic.SearchResult.Text.Content

inputType:
  properties:
    QuestionToBeAnswered:
      displayName: QuestionToBeAnswered
      description: Your question about <topic subject>
      type: String

outputType:
  properties:
    Response:
      displayName: Response
      description: The answer to the provided question
      type: String
```

This works because the orchestrator collects `QuestionToBeAnswered` from the user, the topic searches knowledge and extracts the content into `Topic.Response`, and the orchestrator uses that output to formulate a response. No explicit SendActivity needed — the orchestrator handles it.

## Pattern 3: Fallback Search (all knowledge, autoSend default)

The simplest pattern — a fallback topic that searches all agent knowledge when no other topic matches. This is the pattern used in the agent's default Search topic.

```yaml
# Name: Knowledge Search
kind: AdaptiveDialog
beginDialog:
  kind: OnUnknownIntent
  id: main
  priority: -1
  actions:
    - kind: SearchAndSummarizeContent
      id: searchContent_<random>
      variable: Topic.Answer
      userInput: =System.Activity.Text

    - kind: ConditionGroup
      id: conditionGroup_<random>
      conditions:
        - id: conditionItem_<random>
          condition: =!IsBlank(Topic.Answer)
          actions:
            - kind: EndDialog
              id: endDialog_<random>
              clearTopicQueue: true
```

The `priority: -1` ensures this runs before the standard fallback, giving knowledge sources a chance to answer before the "I don't understand" message. This pattern searches **all** agent knowledge sources (no `knowledgeSources` restriction).

## Knowledge Source References

When using `knowledgeSources` to restrict the search to specific sources:

1. The knowledge source **must already exist** in the agent (add it first with `/add-knowledge`)
2. Find the knowledge source filename in `src/<agent-name>/knowledge/`
3. Reference it **without the `.mcs.yml` extension**

Example: if the file is `cre3c_agent.topic.MyDocs_abc123.mcs.yml`, the reference is:
```yaml
knowledgeSources:
  kind: SearchSpecificKnowledgeSources
  knowledgeSources:
    - cre3c_agent.topic.MyDocs_abc123
```
