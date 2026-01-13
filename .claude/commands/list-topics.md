# List Topics in Solution

List all topics in the current Copilot Studio solution with their trigger types.

## Arguments

- `$ARGUMENTS` - Optional: path to the botcomponents directory (defaults to `src\agent-1`)

## Instructions

1. Find all topic files in the solution using the Glob tool:
   - Pattern: `src/agent-1/**/*.topic.mcs.yml`
   - Or use bash: `dir /s /b src\agent-1\*.topic.mcs.yml` (Windows)
   - Or use bash: `find src/agent-1 -name "*.topic.mcs.yml" -type f` (Linux/Mac)

2. For each topic file, extract:
   - Topic name (from the `# Name:` comment or filename)
   - Trigger type (from `beginDialog.kind`)
   - Trigger phrases (if `OnRecognizedIntent`)

3. Present the results in a table format:

   ```
   Topics in Solution
   ==================
   
   | Topic Name | Trigger Type | Trigger Phrases |
   |------------|--------------|-----------------|
   | Greeting   | OnConversationStart | - |
   | FAQ        | OnRecognizedIntent | "help", "faq", "questions" |
   | Fallback   | OnUnknownIntent | - |
   ```

4. Also list any system topics that should not be modified

## Additional Information to Extract

- Number of actions in each topic
- Variables used
- Dialog references (calls to other topics)
- Knowledge sources referenced

## Example Output

```
Found 5 topics in src/agent-1/MyAgent/topics/

| # | Topic Name | Trigger | Actions | Calls |
|---|------------|---------|---------|-------|
| 1 | Greeting | OnConversationStart | 3 | - |
| 2 | FAQ | OnRecognizedIntent | 7 | Escalate |
| 3 | Escalate | OnEscalate | 2 | - |
| 4 | Fallback | OnUnknownIntent | 4 | FAQ |
| 5 | Error | OnError | 2 | - |

System Topics (do not modify):
- Conversation Start
- End of Conversation
```
