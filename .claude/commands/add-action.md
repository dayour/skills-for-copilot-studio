# Add Action to Topic

Add a new action node to an existing Copilot Studio topic.

## Arguments

- `$ARGUMENTS` - The action type and target topic (e.g., "Question to greeting topic", "ConditionGroup to FAQ topic")

## Instructions

1. Parse the arguments to identify:
   - The action type (SendActivity, Question, SetVariable, ConditionGroup, etc.)
   - The target topic file

2. Look up the action schema:
   ```bash
   python scripts/schema-lookup.py resolve <ActionType>
   ```

3. Read the existing topic file to understand its structure

4. Generate the new action node with:
   - A unique ID (e.g., `question_Xk9mP2`)
   - All required properties from the schema
   - Appropriate default values

5. Determine the correct insertion point in the actions array

6. Present the generated YAML snippet and ask where to insert it

## Common Action Types

| Action | Purpose | Required Properties |
|--------|---------|---------------------|
| `SendActivity` | Send message | `kind`, `id`, `activity` |
| `Question` | Ask user input | `kind`, `id`, `variable`, `prompt`, `entity` |
| `SetVariable` | Set/compute value | `kind`, `id`, `variable`, `value` |
| `ConditionGroup` | Branching logic | `kind`, `id`, `conditions` |
| `BeginDialog` | Call another topic | `kind`, `id`, `dialog` |
| `EndDialog` | End topic | `kind`, `id` |

## Example Output

For adding a Question action:

```yaml
- kind: Question
  id: question_Xk9mP2
  variable: Topic.UserName
  prompt: What is your name?
  entity: StringPrebuiltEntity
  alwaysPrompt: true
  interruptionPolicy:
    allowInterruption: false
```

## Important Notes

- **Generate unique IDs**: Use random 6-8 alphanumeric characters (e.g., `question_k7xPm2`). Duplicate IDs across topics will cause Copilot Studio errors.
- Verify the action type exists in the schema before generating
- Consider the context of where the action is being inserted
- For ConditionGroup, include at least one condition item with a unique ID
