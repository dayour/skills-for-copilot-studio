# Copilot Studio YAML Reference

This file contains reference tables for Copilot Studio YAML authoring. For workflow instructions, see [CLAUDE.md](./CLAUDE.md).

## Core File Types

| File | Purpose |
|------|---------|
| `agent.mcs.yml` | Main agent metadata (kind: GptComponentMetadata) |
| `settings.mcs.yml` | Agent settings and configuration |
| `connectionreferences.mcs.yml` | Connector references |
| `topics/*.mcs.yml` | Conversation topics (kind: AdaptiveDialog) |
| `actions/*.mcs.yml` | Connector-based actions (kind: TaskDialog) |
| `knowledge/*.mcs.yml` | Knowledge sources (kind: KnowledgeSourceConfiguration) |
| `variables/*.mcs.yml` | Global variables (kind: GlobalVariableComponent) |
| `agents/*.mcs.yml` | Child agents (kind: AgentDialog) |

## Trigger Types

| Kind | Purpose |
|------|---------|
| `OnRecognizedIntent` | Trigger phrases matched |
| `OnConversationStart` | Conversation begins |
| `OnUnknownIntent` | No topic matched (fallback) |
| `OnEscalate` | User requests human agent |
| `OnError` | Error handling |
| `OnSystemRedirect` | Triggered by redirect only |
| `OnSelectIntent` | Multiple topics matched (disambiguation) |
| `OnSignIn` | Authentication required |
| `OnToolSelected` | Child agent invocation |
| `OnKnowledgeRequested` | Custom knowledge source search triggered (YAML-only, no UI) |
| `OnGeneratedResponse` | Intercept AI-generated response before sending |

## Action Types

| Kind | Purpose |
|------|---------|
| `SendActivity` | Send a message |
| `Question` | Ask user for input |
| `SetVariable` | Set/compute a variable |
| `SetTextVariable` | Set text directly |
| `ConditionGroup` | Branching logic |
| `BeginDialog` | Call another topic |
| `ReplaceDialog` | Replace current topic |
| `EndDialog` | End current topic |
| `CancelAllDialogs` | Cancel all topics |
| `ClearAllVariables` | Clear variables |
| `SearchAndSummarizeContent` | Generative answers (grounded in knowledge) |
| `AnswerQuestionWithAI` | AI answer (conversation history + general knowledge only) |
| `EditTable` | Modify a collection |
| `CSATQuestion` | Customer satisfaction |
| `LogCustomTelemetryEvent` | Logging |
| `OAuthInput` | Sign-in prompt |
| `SearchKnowledgeSources` | Search knowledge sources (returns raw results, no AI summary) |
| `CreateSearchQuery` | AI-generated search query from user input |

## System Variables

| Variable | Description |
|----------|-------------|
| `System.Bot.Name` | Agent's name |
| `System.Activity.Text` | User's current message |
| `System.Conversation.Id` | Conversation identifier |
| `System.Conversation.InTestMode` | True if in test chat |
| `System.FallbackCount` | Number of consecutive fallbacks |
| `System.Error.Message` | Error message |
| `System.Error.Code` | Error code |
| `System.SignInReason` | Why sign-in was triggered |
| `System.Recognizer.IntentOptions` | Matched intents for disambiguation |
| `System.Recognizer.SelectedIntent` | User's selected intent |
| `System.SearchQuery` | AI-rewritten search query (available in `OnKnowledgeRequested`) |
| `System.KeywordSearchQuery` | Keyword version of search query (available in `OnKnowledgeRequested`) |
| `System.SearchResults` | Table to populate with custom search results — schema: Content, ContentLocation, Title (available in `OnKnowledgeRequested`) |
| `System.ContinueResponse` | Set to `false` in `OnGeneratedResponse` to suppress auto-send |
| `System.Response.FormattedText` | The AI-generated response text (available in `OnGeneratedResponse`) |

### Variable Scopes

| Prefix | Scope | Lifetime |
|--------|-------|----------|
| `Topic.<name>` | Topic variable | Current topic only |
| `Global.<name>` | Global variable | Entire conversation (defined in `variables/` folder) |
| `System.<name>` | System variable | Built-in, read-only |

Global variables are defined as YAML files in `variables/<Name>.mcs.yml` (kind: `GlobalVariableComponent`). Set `aIVisibility: UseInAIContext` to make them visible to the AI orchestrator.

## Prebuilt Entities

| Entity | Use Case |
|--------|----------|
| `BooleanPrebuiltEntity` | Yes/No questions |
| `NumberPrebuiltEntity` | Numeric inputs |
| `StringPrebuiltEntity` | Free text |
| `DateTimePrebuiltEntity` | Date/time |
| `EMailPrebuiltEntity` | Email addresses |

## Power Fx Expression Reference

**Only use functions from the supported list below.** Copilot Studio supports a subset of Power Fx — using unsupported functions will cause errors.

```yaml
# Arithmetic
value: =Text(Topic.number1 + Topic.number2)

# Date formatting
value: =Text(Now(), DateTimeFormat.UTC)

# Conditions
condition: =System.FallbackCount < 3
condition: =Topic.EndConversation = true
condition: =!IsBlank(Topic.Answer)
condition: =System.Conversation.InTestMode = true
condition: =System.SignInReason = SignInReason.SignInRequired
condition: =System.Recognizer.SelectedIntent.TopicId = "NoTopic"

# String interpolation in activity (uses {} without =)
activity: "Error: {System.Error.Message}"
activity: "Error code: {System.Error.Code}, Time (UTC): {Topic.CurrentTime}"

# Record creation
value: "={ DisplayName: Topic.NoneOfTheseDisplayName, TopicId: \"NoTopic\", TriggerId: \"NoTrigger\", Score: 1.0 }"

# Variable initialization (first assignment uses init: prefix)
variable: init:Topic.UserEmail
variable: init:Topic.CurrentTime
# Subsequent assignments omit init:
variable: Topic.UserEmail
```

### Supported Power Fx Functions

These are **all** the Power Fx functions available in Copilot Studio. Do NOT use any function not on this list.

**Math**: `Abs`, `Acos`, `Acot`, `Asin`, `Atan`, `Atan2`, `Cos`, `Cot`, `Degrees`, `Exp`, `Int`, `Ln`, `Log`, `Mod`, `Pi`, `Power`, `Radians`, `Rand`, `RandBetween`, `Round`, `RoundDown`, `RoundUp`, `Sin`, `Sqrt`, `Sum`, `Tan`, `Trunc`

**Text**: `Char`, `Concat`, `Concatenate`, `EncodeHTML`, `EncodeUrl`, `EndsWith`, `Find`, `Left`, `Len`, `Lower`, `Match`, `MatchAll`, `Mid`, `PlainText`, `Proper`, `Replace`, `Right`, `Search`, `Split`, `StartsWith`, `Substitute`, `Text`, `Trim`, `TrimEnds`, `UniChar`, `Upper`, `Value`

**Date/Time**: `Date`, `DateAdd`, `DateDiff`, `DateTime`, `DateTimeValue`, `DateValue`, `Day`, `EDate`, `EOMonth`, `Hour`, `IsToday`, `Minute`, `Month`, `Now`, `Second`, `Time`, `TimeValue`, `TimeZoneOffset`, `Today`, `Weekday`, `WeekNum`, `Year`

**Logical**: `And`, `Coalesce`, `If`, `IfError`, `IsBlank`, `IsBlankOrError`, `IsEmpty`, `IsError`, `IsMatch`, `IsNumeric`, `IsType`, `Not`, `Or`, `Switch`

**Table**: `AddColumns`, `Column`, `ColumnNames`, `Count`, `CountA`, `CountIf`, `CountRows`, `Distinct`, `DropColumns`, `Filter`, `First`, `FirstN`, `ForAll`, `Index`, `Last`, `LastN`, `LookUp`, `Patch`, `Refresh`, `RenameColumns`, `Sequence`, `ShowColumns`, `Shuffle`, `Sort`, `SortByColumns`, `Summarize`, `Table`

**Aggregate**: `Average`, `Max`, `Min`, `StdevP`, `VarP`

**Type conversion**: `AsType`, `Boolean`, `Dec2Hex`, `Decimal`, `Float`, `GUID`, `Hex2Dec`, `JSON`, `ParseJSON`

**Other**: `Blank`, `ColorFade`, `ColorValue`, `Error`, `Language`, `OptionSetInfo`, `RGBA`, `Trace`, `With`

## Generative Orchestration Patterns

When `GenerativeActionsEnabled: true` in `settings.mcs.yml`:

### Topic Inputs (AutomaticTaskInput)

Auto-collect user info — the orchestrator prompts the user based on the description. No explicit Question node needed.

```yaml
inputs:
  - kind: AutomaticTaskInput
    propertyName: userName
    description: "The user's name"
    entity: StringPrebuiltEntity
    shouldPromptUser: true

  - kind: AutomaticTaskInput
    propertyName: orderNumber
    description: "The order number to look up"
    entity: NumberPrebuiltEntity
    shouldPromptUser: true
```

**When to still use Question nodes instead of inputs:**
- Conditional asks: ask X only if condition Y is met (input is only needed in a specific branch)
- End-of-flow confirmations: "Are you satisfied?" (can't answer before seeing the outcome)

### Topic Outputs

Return values to the orchestrator, which generates the user-facing message.

```yaml
outputType:
  properties:
    result:
      displayName: result
      description: The computed result
      type: String
```

- Do NOT use `SendActivity` to show final outputs (rare exception: precise mid-flow messages).
- The orchestrator phrases the response based on the agent instructions.

### inputType/outputType Schema

Always define schemas that match your inputs/outputs:

```yaml
inputType:
  properties:
    userName:
      displayName: userName
      description: "The user's name"
      type: String
    orderNumber:
      displayName: orderNumber
      type: Number

outputType:
  properties:
    result:
      displayName: result
      description: The lookup result
      type: String
```

## Generative Answers Pattern

### SearchAndSummarizeContent (grounded in knowledge)

```yaml
- kind: SearchAndSummarizeContent
  id: search-content_abc123
  variable: Topic.Answer
  userInput: =System.Activity.Text

- kind: ConditionGroup
  id: conditionGroup_def456
  conditions:
    - id: conditionItem_ghi789
      condition: =!IsBlank(Topic.Answer)
      actions:
        - kind: EndDialog
          id: endDialog_jkl012
          clearTopicQueue: true
```

Always follow `SearchAndSummarizeContent` with a `ConditionGroup` to check if an answer was found.

### AnswerQuestionWithAI (no knowledge sources)

Use only when you want the model to respond from conversation history and general knowledge — no external data.

### Dynamic Knowledge URLs

Knowledge source URLs support `{VariableName}` placeholders for dynamic routing based on user context. For example:

```yaml
source:
  kind: PublicSiteSearchSource
  site: "https://docs.example.com/{Global.Region}/api"
```

Use global variables combined with Power Fx `LookUp()` to set region or context-based values, then reference them in knowledge source URLs.

## Response Post-Processing Patterns

### Citation Removal via OnGeneratedResponse

Use the `OnGeneratedResponse` trigger to intercept AI responses and strip citation markers (`[1]`, `[2]`, etc.) before sending to the user.

**Pattern: Suppress auto-send and clean up**

```yaml
kind: AdaptiveDialog
beginDialog:
  kind: OnGeneratedResponse
  id: main
  actions:
    - kind: SetVariable
      id: setVariable_<random>
      variable: System.ContinueResponse
      value: =false

    - kind: SetVariable
      id: setVariable_<random>
      variable: Topic.CleanedText
      value: "=Substitute(Substitute(Substitute(Substitute(Substitute(System.Response.FormattedText, \"[1]\", \"\"), \"[2]\", \"\"), \"[3]\", \"\"), \"[4]\", \"\"), \"[5]\", \"\")"

    - kind: SendActivity
      id: sendActivity_<random>
      activity: "{Topic.CleanedText}"
```

This sets `System.ContinueResponse = false` to prevent the original response from being sent, then uses nested `Substitute()` calls to strip citation markers and sends the cleaned text manually.

See also: the **Remove Citations** template in Available Templates.

## Available Templates

| Template | File | Pattern |
|----------|------|---------|
| Greeting | `templates/topics/greeting.topic.mcs.yml` | OnConversationStart welcome |
| Fallback | `templates/topics/fallback.topic.mcs.yml` | OnUnknownIntent with escalation |
| Arithmetic | `templates/topics/arithmeticsum.topic.mcs.yml` | Inputs/outputs with computation |
| Question + Branching | `templates/topics/question-topic.topic.mcs.yml` | Question with ConditionGroup |
| Knowledge Search | `templates/topics/search-topic.topic.mcs.yml` | SearchAndSummarizeContent fallback |
| Custom Knowledge Source | `templates/topics/custom-knowledge-source.topic.mcs.yml` | OnKnowledgeRequested with custom API (YAML-only) |
| Remove Citations | `templates/topics/remove-citations.topic.mcs.yml` | OnGeneratedResponse citation stripping |
| Authentication | `templates/topics/auth-topic.topic.mcs.yml` | OnSignIn with OAuthInput |
| Error Handler | `templates/topics/error-handler.topic.mcs.yml` | OnError with telemetry |
| Disambiguation | `templates/topics/disambiguation.topic.mcs.yml` | OnSelectIntent flow |
| Agent | `templates/agents/agent.mcs.yml` | GptComponentMetadata |
| Connector Action | `templates/actions/connector-action.mcs.yml` | TaskDialog with connector |
| Knowledge (Public Website) | `templates/knowledge/public-website.knowledge.mcs.yml` | PublicSiteSearchSource |
| Knowledge (SharePoint) | `templates/knowledge/sharepoint.knowledge.mcs.yml` | SharePointSearchSource |
| Global Variable | `templates/variables/global-variable.variable.mcs.yml` | GlobalVariableComponent |
