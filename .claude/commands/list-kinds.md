# List Available Kind Values

List all available `kind` discriminator values from the Copilot Studio YAML schema.

## Arguments

- `$ARGUMENTS` - Optional: filter keyword (e.g., "On" for triggers, "Card" for card types)

## Instructions

1. Run the schema lookup script to get all kinds:
   ```bash
   python scripts/schema-lookup.py kinds
   ```

2. If a filter is provided, filter the results to show only matching kinds

3. Categorize the kinds for easier understanding:

   **Triggers (begin with "On"):**
   - OnRecognizedIntent
   - OnConversationStart
   - OnUnknownIntent
   - OnEscalate
   - OnError
   - OnSystemRedirect
   - OnSelectIntent
   - OnSignIn
   - OnToolSelected

   **Actions:**
   - SendActivity
   - Question
   - SetVariable
   - SetTextVariable
   - ConditionGroup
   - BeginDialog
   - ReplaceDialog
   - EndDialog
   - CancelAllDialogs
   - ClearAllVariables
   - SearchAndSummarizeContent
   - EditTable
   - CSATQuestion
   - LogCustomTelemetryEvent
   - OAuthInput

   **Dialogs:**
   - AdaptiveDialog
   - TaskDialog
   - AgentDialog

   **Cards:**
   - AdaptiveCardTemplate
   - HeroCardTemplate
   - ImageCardTemplate
   - VideoCardTemplate
   - FileTemplate

   **Knowledge Sources:**
   - KnowledgeSourceConfiguration
   - PublicSiteSearchSource
   - SharePointSearchSource

   **Inputs:**
   - AutomaticTaskInput
   - ManualTaskInput

4. Present the categorized list to the user

## Example Output

```
Available Kind Values (Categorized)
===================================

TRIGGERS (9):
  - OnConversationStart
  - OnError
  - OnEscalate
  - OnRecognizedIntent
  - OnSelectIntent
  - OnSignIn
  - OnSystemRedirect
  - OnToolSelected
  - OnUnknownIntent

ACTIONS (15):
  - BeginDialog
  - CancelAllDialogs
  - ClearAllVariables
  - ConditionGroup
  - CSATQuestion
  - EditTable
  - EndDialog
  - LogCustomTelemetryEvent
  - OAuthInput
  - Question
  - ReplaceDialog
  - SearchAndSummarizeContent
  - SendActivity
  - SetTextVariable
  - SetVariable

...
```
