---
title: Write for the Blog — Share Your Knowledge
description: A step-by-step guide to publishing your own tutorial, deep dive, or cheat sheet on the blog under your name. Fork the repo, add your markdown post, and open a PR.
publishDate: "2025-10-14T01:20:00Z"
eng: true
---

# 📝 Publish Your Post on the Blog!

If you have something worth sharing — a tutorial, a deep dive, a cheat sheet, or a concept explained clearly — you're welcome to publish it here **under your own name**.

## How to Contribute

### Step 1 — Fork the Repository

Go to [https://github.com/aMIrmxc/aMIrmxc-blog](https://github.com/aMIrmxc/aMIrmxc-blog) and click **Fork** to create your own copy.

### Step 2 — Clone Your Fork

```bash
git clone https://github.com/YOUR_USERNAME/aMIrmxc-blog.git
cd aMIrmxc-blog
```

### Step 3 — Create Your Post

Create a new folder inside `src/content/post/` using your post's URL slug as the folder name, then add your markdown file and any images inside it:

```
src/content/post/
└── your-post-url/               ← folder name becomes the URL
    ├── index.md       ← your article
    └── img.png                  ← any images used in the post
```

**Real example:**

```
src/content/post/
└── javascript-closures-explained/
    ├── index.md
    └── closure-diagram.png
```

> **Naming rules for the folder:**
>
> - Lowercase letters and hyphens only — no spaces, no uppercase, no special characters
> - Keep it short and descriptive
> - It becomes the URL: `/post/your-post-url/`

### Step 4 — Write Your Post

Follow the **Post Format** section below.

### Step 5 — Commit and Push

```bash
git add .
git commit -m "Add post: Your Post Title Here"
git push origin main
```

### Step 6 — Open a Pull Request

Go to the [original repository](https://github.com/aMIrmxc/aMIrmxc-blog) on GitHub and open a Pull Request from your fork. Your post will be reviewed and merged if it meets the guidelines below.

## Post Format

Every post **must** follow this structure exactly.

### 1. Frontmatter

Every post starts with a YAML block between `---` markers. This is required.

```yaml
---
title: "Your Post Title"
description: "A one or two sentence summary of what this post covers"
post_id: "your-post-url"
publishDate: "15 Jun 2025"
tags: ["tag1", "tag2"]
author: "Your Name"
authorUrl: "https://github.com/your-username"
eng: true
---
```

| Field         | Type    | Required | Description                                                    |
| ------------- | ------- | -------- | -------------------------------------------------------------- |
| `title`       | string  | ✅       | The title shown on the blog                                    |
| `description` | string  | ✅       | 1–2 sentences for SEO and preview cards                        |
| `post_id`     | string  | ✅       | Must exactly match your folder name. Lowercase + hyphens only. |
| `publishDate` | string  | ✅       | Format: `"DD Mon YYYY"` — e.g. `"15 Jun 2025"`                 |
| `updatedDate` | string  | ❌       | Only add if you revise the post after publishing               |
| `tags`        | array   | ✅       | At least one tag. Lowercase. Relevant to the topic.            |
| `author`      | string  | ✅       | Your name as you want it to appear                             |
| `authorUrl`   | string  | ❌       | Link to your GitHub profile, personal site, or LinkedIn        |
| `eng`         | boolean | ✅       | `true` if the post is in English, `false` if in Persian        |

### 2. Article Structure

Your post body must follow this order:

#### ① H1 Title — _Required_

The first line of content must be an `# H1` heading. This is the visible title of your post.

```markdown
# Your Post Title
```

It can be the same as or slightly different from the `title` in the frontmatter.

#### ② Hero Image — _Optional, recommended_

Directly after the H1, you may add a cover or diagram image:

```markdown
![Brief description of the image](img.png)
```

Place the image file in the **same folder** as your `.md` file.

#### ③ Introduction — _Required_

Write 2–4 paragraphs that answer three things:

- What is this post about?
- Who is it for? (what prior knowledge is assumed or helpful)
- What will the reader know or be able to do after reading?

Bold your opening sentence for emphasis:

```markdown
**Welcome to this guide on [topic]!**

This post assumes you have basic familiarity with [X]. If you're starting from
scratch, it's recommended to first [suggestion]. If you already know [X] and want
to go deeper, this article is for you.
```

#### ④ "What You'll Learn" List — _Recommended for posts over 500 words_

After the intro, add a structured overview so readers know what to expect:

```markdown
**In this article you'll learn:**

- **Concept A**: What it is and why it matters
- **Concept B**: Common use cases and pitfalls
- **Practical Examples**: Hands-on code you can use immediately
- **Summary**: Key takeaways to remember
```

#### ⑤ Main Content Sections — _Required_

Use `## H2` for main sections and `### H3` for subsections. There is no limit on how many sections your post has.

````markdown
## Section Title

Introductory sentence for this section.

### Subsection Title

Explanation paragraph.

```language
// code example
```
````

**Explanation**: Describe what this code does and _why_ it works this way. Keep this grounded — don't just repeat what the code says.

````

**Section rules:**

- Every code block must include the **language identifier**: ` ```bash `, ` ```javascript `, ` ```python `, ` ```typescript `, etc.
- After every code block, add an **Explanation** paragraph. Don't leave code floating without context.
- Use `---` between major sections to create visual breathing room.
- If a section has multiple sub-scenarios, use `#### H4` headings for them.

---

#### ⑦ Conclusion / Summary — *Required*

Every post **must end** with a conclusion section:

```markdown
---

## Conclusion

[2–4 sentences summarizing what was covered.]

[Optional: mention what the reader should try next, related topics, or resources.]
````

The conclusion should leave the reader with a clear sense of what they just learned and where to go next. It should not introduce new concepts.

### 3. Ready-to-Use Template

Copy this template and fill it in:

````markdown
---
title: "Your Post Title"
description: "Short description of your post for search engines and previews"
post_id: "your-post-url"
publishDate: "01 Jan 2025"
tags: ["tag1", "tag2"]
author: "Your Name"
authorUrl: "https://github.com/your-username"
---

# Your Post Title

![Cover image description](img.png)

**Bold opening sentence that sets the tone and grabs attention.**

Introduction paragraph explaining what this post covers and who it's for.
Mention what prior knowledge is helpful.

**In this article you'll learn:**

- **First topic**: Brief description
- **Second topic**: Brief description
- **Third topic**: Brief description

---

## First Main Section

Opening sentence for this section.

### First Subsection

Explanation of the concept in plain language.

```language
// Your code example here
```

**Explanation**: What this code does and why it's written this way.

### Second Subsection

...

---

## Second Main Section

...

---

## Conclusion

Summarize the key points from the post in 2–4 sentences. Mention what the reader should now be able to do, and optionally suggest next steps.
````
