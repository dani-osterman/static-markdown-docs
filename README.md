<img width="1280" height="554" alt="banner" src="https://github.com/user-attachments/assets/4f10438c-9ab9-4a42-a01f-d5c245901b35" />
<br>
<br>

> [!NOTE]  
> Made for a friend / personal use, but kept public in case it helps someone.

# Static markdown docs

Write content in Markdown, run one command, and get clean, stylized documentation to deploy anywhere. A quick, easy way to include documentation for your next PoC or project. Use pre-existing styled components like `info-grid` and `callout`.

## How to use?

Open the `/content` folder. Each `.md` file is one section in the sidebar. The files are sorted alphabetically, so prefix them with numbers to control the order

```
content/
  01-introduction.md
  02-methods.md
  03-results.md
```

Each file starts with a metadata (frontmatter) block at the top:

```md
---
label: Results          ← shown as the group category in the sidebar
title: My Results       ← shown as the page link in the sidebar & heading
subtitle: A summary     ← optional, shown below the heading
---
```

Drop image files into `/public`. Reference them in your Markdown like this:

```md
![My image description](/my-image.png)
```

## Features

### Standard Markdown works out of the box:

```md
## Heading

Normal paragraph text. **Bold** and _italic_ work too.

1. Numbered list

> A blockquote

| Column A | Column B |
|----------|----------|
| Value    | Value    |
```

### Special styled blocks

Beyond standard Markdown, you can paste HTML blocks for richer layouts. The **Components** page in the demo covers all of them with live examples — here are two to get the idea:

**Callout** — `callout-info`, `callout-warning`, or `callout-success`:
```html
<div class="callout callout-info">
  <h4>Heading</h4>
  <p>Body text.</p>
</div>
```

**Info grid** — stat cards (2–4 per row):
```html
<div class="info-grid">
  <div class="info-card">
    <span class="info-label">Label</span>
    <span class="info-value">Value</span>
  </div>
</div>
```

All blocks: `lead`, `info-grid`, `callout`, `equation`, `steps`, `two-col`, `badge`, `kv-list`, `divider`, `table` `code`

## Commands

**1. Install packages**

```sh
npm i
```

**2. Preview locally**

```sh
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

**3. Build**

```sh
npm run build
```
