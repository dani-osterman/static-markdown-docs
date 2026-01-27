---
label: Styled blocks
title: Styled Block Reference
subtitle: All available HTML components for your markdown pages
---

<p class="lead">
Every block below can be pasted directly into any <code>.md</code> file. Mix them freely with standard Markdown.
</p>

## Info grid

Use for key numbers or stats. Fits 2–4 cards per row.

<div class="info-grid">
  <div class="info-card">
    <span class="info-label">Build time</span>
    <span class="info-value">~5 sec</span>
  </div>
  <div class="info-card">
    <span class="info-label">Output</span>
    <span class="info-value">Static</span>
  </div>
  <div class="info-card">
    <span class="info-label">Pages</span>
    <span class="info-value">Unlimited</span>
  </div>
  <div class="info-card">
    <span class="info-label">Setup</span>
    <span class="info-value">2 min</span>
  </div>
</div>

## Callouts

Three variants for different message types.

<div class="callout callout-info">
  <h4>Info</h4>
  <p>Use this for tips, notes, or supplementary context that's good to know.</p>
</div>

<div class="callout callout-warning">
  <h4>Warning</h4>
  <p>Use this for caveats, known limitations, or things that may trip people up.</p>
</div>

<div class="callout callout-success">
  <h4>Success</h4>
  <p>Use this to confirm something works, highlight a positive outcome, or celebrate a milestone.</p>
</div>

## Equation

Centered, monospaced display for formulas.

<div class="equation">f(x) = x² + 2x + 1</div>

## Steps

Auto-numbered with CSS counters. Each step has a title and optional body.

<div class="steps">
  <div class="step">
    <div class="step-content">
      <strong>Clone the repository</strong>
      <p>Download or clone the template to your local machine.</p>
    </div>
  </div>
  <div class="step">
    <div class="step-content">
      <strong>Edit the content folder</strong>
      <p>Add your <code>.md</code> files, one per section. Prefix with numbers to control order.</p>
    </div>
  </div>
  <div class="step">
    <div class="step-content">
      <strong>Run the build</strong>
      <p>Run <code>npm run build</code> and grab the files from <code>/out</code>.</p>
    </div>
  </div>
</div>

## Two-column

Side-by-side layout. Stack on mobile automatically. Use `col-green`/`col-red` for contrast.

<div class="two-col">
  <div class="col col-green">
    <h4>Pros</h4>
    <ul>
      <li>No database needed</li>
      <li>Deploy anywhere for free</li>
      <li>Fast to load</li>
    </ul>
  </div>
  <div class="col col-red">
    <h4>Cons</h4>
    <ul>
      <li>No dynamic content</li>
      <li>Rebuild required for updates</li>
      <li>No server-side logic</li>
    </ul>
  </div>
</div>

Or use plain columns without color for neutral side-by-side content.

<div class="two-col">
  <div class="col">
    <h4>Option A</h4>
    <p>Good for small documents with a single author updating content occasionally.</p>
  </div>
  <div class="col">
    <h4>Option B</h4>
    <p>Better for team projects where multiple people contribute sections independently.</p>
  </div>
</div>

## Badges

Inline labels. Useful for status indicators, tags, or version numbers.

<span class="badge badge-blue">New</span> <span class="badge badge-green">Stable</span> <span class="badge badge-yellow">Beta</span> <span class="badge badge-red">Deprecated</span> <span class="badge">Default</span>

You can mix badges directly into paragraph text — for example, this feature is <span class="badge badge-green">Stable</span> while this one is <span class="badge badge-yellow">Beta</span>.

## Key-value list

Compact label/value pairs. Alternating rows for readability.

<div class="kv-list">
  <div class="kv-row">
    <span class="kv-key">Framework</span>
    <span class="kv-value">Next.js 16 (App Router)</span>
  </div>
  <div class="kv-row">
    <span class="kv-key">Styling</span>
    <span class="kv-value">Tailwind CSS v4</span>
  </div>
  <div class="kv-row">
    <span class="kv-key">Linting</span>
    <span class="kv-value">Biome</span>
  </div>
  <div class="kv-row">
    <span class="kv-key">Markdown</span>
    <span class="kv-value">react-markdown + rehype-raw + gray-matter</span>
  </div>
  <div class="kv-row">
    <span class="kv-key">Output</span>
    <span class="kv-value">Static export — deploy anywhere</span>
  </div>
</div>

## Divider with label

A labeled horizontal rule for separating content within a long section.

<div class="divider">Further reading</div>

Standard Markdown continues normally after any block. You can chain blocks, mix them with headings, lists, tables, and blockquotes — whatever the page needs.

## Table example

Simple GitHub-flavored Markdown tables are supported.

| Component | Purpose |
|----------|----------|
| `callout` | Context and messages (info/warning/success) |
| `steps` | Ordered setup instructions |
| `kv-list` | Compact label/value pairs |

## Code blocks example

Use fenced code blocks for multi-line snippets, and backticks for inline code.

Inline: `npm run build`

```sh
npm i
npm run build
```

```ts
import { z } from "zod";

const UserSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  role: z.enum(["admin", "editor", "viewer"]),
});

type User = z.infer<typeof UserSchema>;

export async function getUser(id: string): Promise<User> {
  const res = await fetch(`/api/users/${id}`);
  return UserSchema.parse(await res.json());
}
```
