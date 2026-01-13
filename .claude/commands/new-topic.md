# Create New Topic

Generate a new Copilot Studio topic YAML file based on user requirements.

## Arguments

- `$ARGUMENTS` - Description of the topic to create (e.g., "greeting topic that welcomes users", "FAQ topic for product questions")

## Instructions

1. First, look up the AdaptiveDialog schema to ensure correct structure:
   ```bash
   python scripts/schema-lookup.py resolve AdaptiveDialog
   ```

2. Determine the appropriate trigger type based on the user's description:
   - `OnRecognizedIntent` - For topics triggered by user phrases
   - `OnConversationStart` - For welcome/greeting topics
   - `OnUnknownIntent` - For fallback topics
   - `OnEscalate` - For escalation to human agent
   - `OnError` - For error handling

3. Look up the trigger schema:
   ```bash
   python scripts/schema-lookup.py resolve <TriggerType>
   ```

4. Generate the topic YAML with:
   - A descriptive comment at the top with the topic name
   - `kind: AdaptiveDialog`
   - Appropriate `beginDialog` with the correct trigger type
   - Unique IDs for all nodes (use random 6-8 character alphanumeric suffixes)
   - Relevant actions based on the topic purpose

5. Save the file to `src/botcomponents/<agent-name>/topics/<topic-name>.topic.mcs.yml`

## Template Structure

```yaml
# Name: <Topic Name>
kind: AdaptiveDialog
beginDialog:
  kind: <TriggerType>
  id: main
  intent:  # Only for OnRecognizedIntent
    displayName: <Topic Name>
    triggerQueries:
      - <phrase 1>
      - <phrase 2>
  actions:
    - kind: SendActivity
      id: sendMessage_<random>
      activity:
        text:
          - <message>
```

## Important Notes

- **Replace `_REPLACE` IDs**: Templates use placeholder IDs like `sendMessage_REPLACE1`. You MUST replace ALL `_REPLACE` occurrences with unique random IDs (e.g., `sendMessage_k7xPm2`). This is critical - duplicate IDs across topics will cause Copilot Studio errors.
- Generate unique IDs for each node (6-8 random alphanumeric characters)
- Use Power Fx expressions with `=` prefix where needed
- Include appropriate conversation outcomes if the topic ends the conversation
- Consider adding a fallback path for error handling
