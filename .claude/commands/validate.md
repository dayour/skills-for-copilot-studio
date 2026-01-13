# Validate YAML Structure

Validate a Copilot Studio YAML file against the schema and best practices.

## Arguments

- `$ARGUMENTS` - Path to the YAML file to validate (relative to project root)

## Instructions

1. Read the specified YAML file

2. Identify the file type by checking the `kind` property:
   - `AdaptiveDialog` - Topic file
   - `GptComponentMetadata` - Agent metadata
   - `TaskDialog` - Connector action
   - `AgentDialog` - Child agent
   - `KnowledgeSourceConfiguration` - Knowledge source

3. Look up the schema for that kind:
   ```bash
   python scripts/schema-lookup.py resolve <kind>
   ```

4. Perform validation checks:

   **Structure Validation:**
   - [ ] `kind` property is present and valid
   - [ ] All required properties are present
   - [ ] Property types match schema expectations
   - [ ] No unknown properties (warning only)

   **ID Validation:**
   - [ ] All nodes have unique IDs
   - [ ] IDs follow naming convention (e.g., `sendMessage_abc123`)
   - [ ] No duplicate IDs within the file

   **Reference Validation:**
   - [ ] All `$ref` references point to valid definitions
   - [ ] Dialog references use correct format
   - [ ] Variable names use correct scope prefix (Topic., System., etc.)

   **Power Fx Validation:**
   - [ ] Expressions start with `=` prefix
   - [ ] Common functions are spelled correctly
   - [ ] Parentheses are balanced

5. Report findings in a structured format:

   ```
   Validation Results for: <filename>

   [PASS] <check description>
   [WARN] <check description>
   [FAIL] <check description>

   Summary: X passed, Y warnings, Z failures
   ```

## Common Issues to Check

1. **Missing required properties** - Check against schema
2. **Duplicate IDs** - Each node must have a unique ID
3. **Invalid Power Fx** - Missing `=` prefix or syntax errors
4. **Broken dialog references** - Topic paths must be fully qualified
5. **Invalid entity types** - Must use valid prebuilt or custom entities

## Example Usage

```
/project:validate src/botcomponents/MyAgent/topics/greeting.topic.mcs.yml
```
