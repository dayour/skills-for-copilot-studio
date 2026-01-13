# Lookup Schema Definition

Look up the schema definition for a Copilot Studio YAML element.

## Arguments

- `$ARGUMENTS` - The name of the definition to look up (e.g., SendActivity, Question, ConditionGroup)

## Instructions

1. Run the schema lookup script to find the definition:
   ```bash
   python scripts/schema-lookup.py lookup $ARGUMENTS
   ```

2. If the definition is not found, search for similar definitions:
   ```bash
   python scripts/schema-lookup.py search $ARGUMENTS
   ```

3. If the definition contains `$ref` references that need to be resolved, use:
   ```bash
   python scripts/schema-lookup.py resolve $ARGUMENTS
   ```

4. Present the schema definition to the user in a readable format, explaining:
   - What the element does (from the description)
   - Required properties
   - Optional properties and their types
   - Any related definitions that might be useful

## Example Usage

User: `/project:lookup-schema SendActivity`

Response should include the full schema definition and explain how to use it in YAML.
