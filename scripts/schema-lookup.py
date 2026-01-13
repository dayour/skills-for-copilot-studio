#!/usr/bin/env python3
"""
Copilot Studio YAML Schema Lookup Tool

This script provides utilities to query the Copilot Studio YAML schema
without loading the entire file into memory. It supports:
- Looking up specific definitions
- Searching for definitions by keyword
- Resolving $ref chains to get complete definitions
- Listing all available definitions

Usage:
    python schema-lookup.py lookup <definition-name>
    python schema-lookup.py search <keyword>
    python schema-lookup.py list
    python schema-lookup.py resolve <definition-name>
    python schema-lookup.py kinds
    python schema-lookup.py summary <definition-name>
"""

import json
import sys
import os
import re
from pathlib import Path
from typing import Dict, Any, Optional, List, Set


def get_schema_path() -> Path:
    """Get the path to the schema file."""
    script_dir = Path(__file__).parent
    project_root = script_dir.parent
    schema_path = project_root / "reference" / "bot.schema.yaml-authoring.json"
    
    if not schema_path.exists():
        print(f"Error: Schema file not found at {schema_path}")
        print("Please place 'bot.schema.yaml-authoring.json' in the 'reference/' directory.")
        sys.exit(1)
    
    return schema_path


def load_schema() -> Dict[str, Any]:
    """Load the schema file."""
    schema_path = get_schema_path()
    with open(schema_path, 'r', encoding='utf-8') as f:
        return json.load(f)


def get_definitions(schema: Dict[str, Any]) -> Dict[str, Any]:
    """Extract definitions from schema."""
    return schema.get("definitions", {})


def lookup_definition(name: str, definitions: Dict[str, Any]) -> Optional[Dict[str, Any]]:
    """Look up a specific definition by name (case-insensitive)."""
    # Try exact match first
    if name in definitions:
        return definitions[name]
    
    # Try case-insensitive match
    name_lower = name.lower()
    for key, value in definitions.items():
        if key.lower() == name_lower:
            return value
    
    return None


def search_definitions(keyword: str, definitions: Dict[str, Any]) -> List[str]:
    """Search for definitions containing the keyword (case-insensitive)."""
    keyword_lower = keyword.lower()
    matches = []
    
    for key in definitions.keys():
        if keyword_lower in key.lower():
            matches.append(key)
    
    return sorted(matches)


def resolve_ref(ref: str, definitions: Dict[str, Any]) -> Optional[Dict[str, Any]]:
    """Resolve a $ref to its definition."""
    if ref.startswith("#/definitions/"):
        def_name = ref[len("#/definitions/"):]
        return definitions.get(def_name)
    return None


def resolve_definition(name: str, definitions: Dict[str, Any], 
                       visited: Optional[Set[str]] = None, 
                       depth: int = 0, 
                       max_depth: int = 5) -> Dict[str, Any]:
    """
    Recursively resolve a definition, following $ref chains.
    Returns a fully resolved definition with all references expanded.
    """
    if visited is None:
        visited = set()
    
    if depth > max_depth:
        return {"_note": f"Max depth ({max_depth}) reached, stopping recursion"}
    
    if name in visited:
        return {"_ref": name, "_note": "Circular reference detected"}
    
    visited.add(name)
    
    definition = lookup_definition(name, definitions)
    if definition is None:
        return {"_error": f"Definition '{name}' not found"}
    
    return _resolve_object(definition, definitions, visited.copy(), depth, max_depth)


def _resolve_object(obj: Any, definitions: Dict[str, Any], 
                    visited: Set[str], depth: int, max_depth: int) -> Any:
    """Recursively resolve an object, expanding $ref references."""
    if not isinstance(obj, dict):
        if isinstance(obj, list):
            return [_resolve_object(item, definitions, visited, depth, max_depth) for item in obj]
        return obj
    
    # Handle $ref
    if "$ref" in obj and len(obj) == 1:
        ref = obj["$ref"]
        if ref.startswith("#/definitions/"):
            def_name = ref[len("#/definitions/"):]
            if def_name in visited:
                return {"_ref": def_name, "_note": "Circular reference"}
            return resolve_definition(def_name, definitions, visited, depth + 1, max_depth)
        return obj
    
    # Recursively resolve all properties
    resolved = {}
    for key, value in obj.items():
        if key == "$ref":
            resolved[key] = value
        else:
            resolved[key] = _resolve_object(value, definitions, visited, depth, max_depth)
    
    return resolved


def find_kind_values(definitions: Dict[str, Any]) -> List[str]:
    """Find all 'kind' discriminator values used in the schema."""
    kinds = set()
    
    def extract_kinds(obj: Any):
        if isinstance(obj, dict):
            # Check for kind enum
            if "kind" in obj:
                kind_def = obj["kind"]
                if isinstance(kind_def, dict):
                    if "const" in kind_def:
                        kinds.add(kind_def["const"])
                    elif "enum" in kind_def:
                        kinds.update(kind_def["enum"])
            
            # Check for properties.kind
            if "properties" in obj and isinstance(obj["properties"], dict):
                if "kind" in obj["properties"]:
                    kind_prop = obj["properties"]["kind"]
                    if isinstance(kind_prop, dict):
                        if "const" in kind_prop:
                            kinds.add(kind_prop["const"])
                        elif "enum" in kind_prop:
                            kinds.update(kind_prop["enum"])
            
            # Recurse into nested objects
            for value in obj.values():
                extract_kinds(value)
        elif isinstance(obj, list):
            for item in obj:
                extract_kinds(item)
    
    for definition in definitions.values():
        extract_kinds(definition)
    
    return sorted(kinds)


def format_definition(name: str, definition: Dict[str, Any], compact: bool = False) -> str:
    """Format a definition for display."""
    if compact:
        # Just show the structure overview
        output = [f"Definition: {name}"]
        
        if "description" in definition:
            output.append(f"Description: {definition['description']}")
        
        if "properties" in definition:
            output.append("Properties:")
            for prop_name, prop_def in definition["properties"].items():
                prop_type = prop_def.get("type", "")
                if "$ref" in prop_def:
                    prop_type = prop_def["$ref"].split("/")[-1]
                output.append(f"  - {prop_name}: {prop_type}")
        
        if "required" in definition:
            output.append(f"Required: {', '.join(definition['required'])}")
        
        if "oneOf" in definition:
            output.append("OneOf:")
            for item in definition["oneOf"]:
                if "$ref" in item:
                    output.append(f"  - {item['$ref'].split('/')[-1]}")
        
        if "allOf" in definition:
            output.append("AllOf:")
            for item in definition["allOf"]:
                if "$ref" in item:
                    output.append(f"  - {item['$ref'].split('/')[-1]}")
        
        return "\n".join(output)
    else:
        # Full JSON output
        return json.dumps({name: definition}, indent=2)


def print_help():
    """Print usage help."""
    print(__doc__)


def main():
    if len(sys.argv) < 2:
        print_help()
        sys.exit(1)
    
    command = sys.argv[1].lower()
    
    if command == "help" or command == "--help" or command == "-h":
        print_help()
        sys.exit(0)
    
    # Load schema
    schema = load_schema()
    definitions = get_definitions(schema)
    
    if command == "lookup":
        if len(sys.argv) < 3:
            print("Error: Please provide a definition name")
            print("Usage: python schema-lookup.py lookup <definition-name>")
            sys.exit(1)
        
        name = sys.argv[2]
        definition = lookup_definition(name, definitions)
        
        if definition:
            print(format_definition(name, definition, compact=False))
        else:
            # Try to find similar names
            similar = search_definitions(name, definitions)[:10]
            print(f"Definition '{name}' not found.")
            if similar:
                print(f"Did you mean one of these?")
                for s in similar:
                    print(f"  - {s}")
    
    elif command == "search":
        if len(sys.argv) < 3:
            print("Error: Please provide a search keyword")
            print("Usage: python schema-lookup.py search <keyword>")
            sys.exit(1)
        
        keyword = sys.argv[2]
        matches = search_definitions(keyword, definitions)
        
        if matches:
            print(f"Found {len(matches)} definitions matching '{keyword}':")
            for match in matches:
                print(f"  - {match}")
        else:
            print(f"No definitions found matching '{keyword}'")
    
    elif command == "list":
        all_defs = sorted(definitions.keys())
        print(f"Available definitions ({len(all_defs)} total):")
        for name in all_defs:
            print(f"  - {name}")
    
    elif command == "resolve":
        if len(sys.argv) < 3:
            print("Error: Please provide a definition name")
            print("Usage: python schema-lookup.py resolve <definition-name>")
            sys.exit(1)
        
        name = sys.argv[2]
        resolved = resolve_definition(name, definitions)
        print(json.dumps({name: resolved}, indent=2))
    
    elif command == "kinds":
        kinds = find_kind_values(definitions)
        print(f"Available 'kind' values ({len(kinds)} total):")
        for kind in kinds:
            print(f"  - {kind}")
    
    elif command == "summary":
        if len(sys.argv) < 3:
            print("Error: Please provide a definition name")
            print("Usage: python schema-lookup.py summary <definition-name>")
            sys.exit(1)
        
        name = sys.argv[2]
        definition = lookup_definition(name, definitions)
        
        if definition:
            print(format_definition(name, definition, compact=True))
        else:
            print(f"Definition '{name}' not found.")
    
    else:
        print(f"Unknown command: {command}")
        print_help()
        sys.exit(1)


if __name__ == "__main__":
    main()
