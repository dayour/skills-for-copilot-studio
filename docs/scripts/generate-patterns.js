#!/usr/bin/env node
/**
 * Generates Docusaurus pattern pages from the canonical pattern library in `patterns/`.
 *
 * The `patterns/` folder at the repo root is the single source of truth (consumed
 * directly by the int-patterns skill at runtime). This script mirrors that content
 * into `docs/src/patterns/` with Docusaurus frontmatter so the site never drifts
 * from the actual pattern library. Re-run on every doc build (see deploy-docs.yml).
 *
 * Usage: node docs/scripts/generate-patterns.js
 */

const fs = require('fs');
const path = require('path');

const REPO_ROOT = path.resolve(__dirname, '..', '..');
const PATTERNS_DIR = path.join(REPO_ROOT, 'patterns');
const OUT_DIR = path.join(REPO_ROOT, 'docs', 'src', 'patterns');

const STATUS_LABEL = {
  proven: 'Proven',
  recommended: 'Recommended',
  experimental: 'Experimental',
};

// Minimal frontmatter parser -- pattern files only use flat string fields plus one
// bracketed `tags: [a, b, c]` array, so a full YAML parser isn't needed here.
function parseFrontmatter(raw) {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) return { data: {}, body: raw };
  const [, fmBlock, body] = match;
  const data = {};
  for (const line of fmBlock.split(/\r?\n/)) {
    const kv = line.match(/^(\w+):\s*(.*)$/);
    if (!kv) continue;
    const [, key, rawValue] = kv;
    if (rawValue.startsWith('[') && rawValue.endsWith(']')) {
      data[key] = rawValue
        .slice(1, -1)
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
    } else {
      data[key] = rawValue.trim();
    }
  }
  return { data, body: body.trim() };
}

function slugify(filename) {
  return filename.replace(/\.md$/, '');
}

function escapeYamlString(str) {
  return str.replace(/"/g, '\\"');
}

function main() {
  if (!fs.existsSync(PATTERNS_DIR)) {
    console.error(`Patterns directory not found at ${PATTERNS_DIR}`);
    process.exit(1);
  }
  fs.mkdirSync(OUT_DIR, { recursive: true });

  const files = fs
    .readdirSync(PATTERNS_DIR)
    .filter((f) => f.endsWith('.md'))
    .sort();

  const entries = [];

  files.forEach((file, i) => {
    const raw = fs.readFileSync(path.join(PATTERNS_DIR, file), 'utf-8');
    const { data, body } = parseFrontmatter(raw);
    const slug = slugify(file);
    const status = (data.status || 'recommended').toLowerCase();
    const statusLabel = STATUS_LABEL[status] || 'Recommended';
    const tags = data.tags || [];

    entries.push({
      slug,
      name: data.name || slug,
      description: data.description || '',
      challenge: data.challenge || '',
      status,
      statusLabel,
      tags,
    });

    const frontmatter = [
      '---',
      `sidebar_position: ${i + 2}`,
      `title: "${escapeYamlString(data.name || slug)}"`,
      '---',
      '',
    ].join('\n');

    const statusNote = `<span class="pattern-status-badge status-${status}">${statusLabel}</span>\n\n${data.description || ''}\n`;

    const challengeBlock = data.challenge
      ? `**Challenge:** ${data.challenge}\n`
      : '';

    const tagsLine = tags.length
      ? `\n_Tags: ${tags.map((t) => `\`${t}\``).join(', ')}_\n`
      : '';

    const sourceLink = `\n---\n\n[View source / edit on GitHub](https://github.com/microsoft/skills-for-copilot-studio/blob/main/patterns/${file})\n`;

    const content = `${frontmatter}# ${data.name || slug}\n\n${statusNote}\n${challengeBlock}${body}\n${tagsLine}${sourceLink}`;

    fs.writeFileSync(path.join(OUT_DIR, `${slug}.md`), content, 'utf-8');
  });

  // Overview / index page
  const statusOrder = { proven: 0, recommended: 1, experimental: 2 };
  const sorted = [...entries].sort(
    (a, b) => (statusOrder[a.status] ?? 9) - (statusOrder[b.status] ?? 9)
  );

  const rows = sorted
    .map(
      (e) =>
        `| [${e.name}](./${e.slug}.md) | <span class="pattern-status-badge status-${e.status}">${e.statusLabel}</span> | ${e.challenge.replace(/\|/g, '\\|')} |`
    )
    .join('\n');

  const overview = `---
sidebar_position: 1
title: Pattern Library
---

# Pattern Library

${entries.length} proven and recommended implementation patterns for Copilot Studio agents,
generated directly from the [\`patterns/\`](https://github.com/microsoft/skills-for-copilot-studio/tree/main/patterns)
folder consumed by the \`int-patterns\` skill at runtime. This page always reflects the current
pattern library -- it is regenerated on every site build.

Patterns are **recommendations, not requirements**. The Advisor agent surfaces the relevant ones
during design and review; the Author agent implements them once you approve.

| Pattern | Status | Challenge it solves |
|---------|--------|----------------------|
${rows}

## Status legend

- \`Proven\` -- used in production, safe to adopt directly.
- \`Recommended\` -- works well with limited production exposure; review before relying on it at scale.
- \`Experimental\` -- not yet fully validated; test thoroughly before adopting.

## Combining patterns

Multiple patterns are designed to work together. See each pattern's "Read this pattern when"
guidance in the [int-patterns skill](https://github.com/microsoft/skills-for-copilot-studio/blob/main/skills/int-patterns/SKILL.md#combining-patterns)
for common combinations (e.g. JIT Glossary + JIT User Context, RAI Error Handling + Teams
Production Hardening).
`;

  fs.writeFileSync(path.join(OUT_DIR, 'overview.md'), overview, 'utf-8');

  console.log(`Generated ${entries.length} pattern pages + overview into ${OUT_DIR}`);
}

main();
