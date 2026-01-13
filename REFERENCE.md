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
| `SearchAndSummarizeContent` | Generative answers |
| `EditTable` | Modify a collection |
| `CSATQuestion` | Customer satisfaction |
| `LogCustomTelemetryEvent` | Logging |
| `OAuthInput` | Sign-in prompt |

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

## Prebuilt Entities

| Entity | Use Case |
|--------|----------|
| `BooleanPrebuiltEntity` | Yes/No questions |
| `NumberPrebuiltEntity` | Numeric inputs |
| `StringPrebuiltEntity` | Free text |
| `DateTimePrebuiltEntity` | Date/time |

## Template _REPLACE Pattern

Templates in `templates/` use `_REPLACE` placeholder IDs to signal that unique IDs must be generated when using the template.

**Why this pattern exists:**
- Templates are reused across multiple topics
- If templates had real IDs, duplicates would occur
- Duplicate IDs cause Copilot Studio import/rendering errors

**How to use:**
1. Copy the template to your target location
2. Replace ALL `_REPLACE` occurrences with unique random IDs
3. Use format: `<nodeType>_<6-8 random alphanumeric chars>`

**Example:**
```yaml
# Template has:
id: sendMessage_REPLACE1

# Replace with:
id: sendMessage_k7xPm2
```

## Power Fx Expression Examples

```yaml
# Arithmetic
value: =Text(Topic.number1 + Topic.number2)

# Date formatting
value: =Text(Now(), DateTimeFormat.UTC)

# Conditions
condition: =System.FallbackCount < 3
condition: =Topic.EndConversation = true
condition: =!IsBlank(Topic.Answer)

# String interpolation in activity
activity: "Error: {System.Error.Message}"

# Record creation
value: "={ DisplayName: Topic.Name, TopicId: \"NoTopic\", Score: 1.0 }"
```

## Error Prevention Checklist

1. **Duplicate IDs** - All node IDs must be unique within a topic
2. **Missing required properties** - Use schema lookup to verify
3. **Invalid Power Fx syntax** - Expressions must start with `=`
4. **Incorrect $ref paths** - Use schema lookup to find valid references
5. **Breaking canvas round-trip** - Complex edits may not render correctly in UI

## Testing After Editing

1. Import the solution to a development environment first
2. Open the agent in Copilot Studio to verify canvas rendering
3. Test the conversation flow in the test panel
4. Check for any error messages in the authoring canvas
