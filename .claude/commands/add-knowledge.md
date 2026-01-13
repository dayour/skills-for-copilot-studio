# Add Knowledge Source

Add a public website knowledge source to the Copilot Studio agent.

## Arguments

- `$ARGUMENTS` - The website URL and optional description (e.g., "https://docs.microsoft.com Microsoft documentation")

## Instructions

1. Parse the arguments to extract:
   - Website URL
   - Description (optional)

2. Look up the knowledge source schema:
   ```bash
   python scripts/schema-lookup.py resolve KnowledgeSourceConfiguration
   python scripts/schema-lookup.py resolve PublicSiteSearchSource
   ```

3. Generate the knowledge source YAML:

   ```yaml
   # Name: <Description or domain name>
   # <Optional description comment>
   kind: KnowledgeSourceConfiguration
   source:
     kind: PublicSiteSearchSource
     site: <URL>
   ```

4. Save to `src/botcomponents/<agent-name>/knowledge/<name>.knowledge.mcs.yml`

## Limitations

**This command can ONLY create Public Website knowledge sources.**

For other knowledge source types, inform the user:

> "The following knowledge source types must be created through the Copilot Studio UI as they require Power Platform configuration:
> - Dataverse tables
> - Graph Connectors
> - File uploads
> 
> Please create these in the portal, then export the solution to edit them here."

## Example Output

For `https://learn.microsoft.com/en-us/power-platform Microsoft Power Platform Docs`:

```yaml
# Name: Microsoft Power Platform Docs
# This knowledge source provides documentation about Microsoft Power Platform.
kind: KnowledgeSourceConfiguration
source:
  kind: PublicSiteSearchSource
  site: https://learn.microsoft.com/en-us/power-platform
```

## URL Guidelines

- URLs should be HTTPS
- Limit to 2 path segments (e.g., `https://contoso.com/docs/section`)
- Avoid query parameters
- Ensure the site is publicly accessible
