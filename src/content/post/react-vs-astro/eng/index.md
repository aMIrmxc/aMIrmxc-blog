---
title: "Learning Astro for React Developers"
description: "A comprehensive guide to migrating from React to Astro with practical examples and side-by-side code comparisons"
post_id: "react-vs-astro"
publishDate: "17 Aug 2025"
tags: ["astro", "react"]
pinned: true
eng: true
---

# Learning Astro for React Developers

![alt text](img.png)

**A comprehensive guide for migrating from React to Astro with practical examples and code-to-code comparisons**

In today's web development world, there are many frameworks, each built for specific purposes - from **React** and **Vue** to **Next.js** and **SvelteKit**. But among these, a new and powerful framework called **Astro** has quickly captured developers' attention.

Why? 🤔
Because Astro entered the field with a different philosophy:

> **"Build fast websites with the minimum amount of JavaScript possible."**

## What We'll Cover

This step-by-step tutorial covers these topics from basics to advanced:

**1. Getting Started with Astro**

- Installation and project setup
- Creating your first page (`index.astro`)
- Building simple components
- Comparison with React and JSX

**2. Advanced Features**

- Using **Layouts** to create reusable templates
- Static and dynamic **Routing** with `[slug].astro`
- Understanding **Islands Architecture** and selective hydration
- Server-side **Data Fetching**
- Creating **API Endpoints** within your project
- Enabling **SSR** for dynamic pages

**3. Working with Content**

- Using **Markdown** for blog posts
- Understanding **Slots** (similar to `children` in React)
- Direct JSON imports for data

**4. Small Practical Projects**

- Simple **blog** with Markdown + Layout
- **ToDo App** with React islands inside Astro
- **Portfolio** with Routing and Layouts

## What is Astro?

Astro is both a **Static Site Builder** and an **SSR Framework**. This means:

- It can build completely **static** pages (ideal for blogs, documentation, portfolios)
- It can work with **Server-Side Rendering (SSR)** (suitable for dynamic applications)
- It can use **Islands Architecture** and hydrate only parts of the page with React/Vue/Svelte

In simple terms: With Astro, you can build the fastest websites without filling the entire page with JavaScript.

### Why is Astro Better?

- **Extremely high speed** (most output is static HTML)
- **Excellent SEO** (real content is rendered server-side)
- **Mix multiple frameworks** (React, Vue, Svelte, Solid, and even Vanilla JS)
- **Built-in support for Markdown and MDX** for blogging
- **Simple structure with file-based routing**

### Main Difference Between Astro and React

- In **React**, the entire page becomes JavaScript (even parts that aren't dynamic)
- In **Astro**, only the parts that need interactivity (like a button or form) use React/Vue, while the rest remains pure HTML

This means faster, lighter websites that are better optimized for search engines.

## When to Use Astro

If you've been using **React or Next.js** for personal or work projects, it's time to try Astro. This framework is especially excellent for:

- Blogs and content-heavy sites
- Project documentation
- Portfolios and personal websites
- Applications that need a mix of static content and dynamic components

With Astro, you can experience the power of **Static HTML + Dynamic Islands** in one project.

## Starting an Astro Project

### Creating a New Project:

```bash
# Create new project
npm create astro@latest my-astro-app
cd my-astro-app

# Install packages
npm install

# Run dev server
npm run dev
```

### File Structure:

```
src/
 ┣ components/
 ┣ layouts/
 ┣ pages/
 ┗ styles/
```

- Everything in the **pages/** folder becomes a route

## Your First Astro Page

File: `src/pages/index.astro`

#### ✅ Astro:

```astro
---
const name = "Ali";
---

<html>
	<head>
		<title>My Astro App</title>
	</head>
	<body>
		<h1>Hello {name} 👋</h1>
		<p>Welcome to Astro!</p>
	</body>
</html>
```

#### 🔄 React Equivalent:

```jsx
import React from "react";

export default function App() {
	const name = "Ali";

	return (
		<html>
			<head>
				<title>My React App</title>
			</head>
			<body>
				<h1>Hello {name} 👋</h1>
				<p>Welcome to React!</p>
			</body>
		</html>
	);
}
```

**Key Difference:**

- In Astro, you write code inside the `---` block (like frontmatter in Markdown) - this is called the "component script" and runs only at build time
- In React, everything is inside JSX with a `return` statement and can run in the browser

## Creating a Simple Component

#### ✅ Astro Component (`src/components/Greeting.astro`)

```astro
---
const { name } = Astro.props;
---

<h2>Hello {name} 🌟</h2>
```

**Using it in a page:**

```astro
---
import Greeting from "../components/Greeting.astro";
---

<html>
	<body>
		<Greeting name="Sara" />
		<Greeting name="Ali" />
	</body>
</html>
```

#### 🔄 React Equivalent:

```jsx
function Greeting({ name }) {
	return <h2>Hello {name} 🌟</h2>;
}

export default function App() {
	return (
		<div>
			<Greeting name="Sara" />
			<Greeting name="Ali" />
		</div>
	);
}
```

Astro components look similar to React but are fundamentally different - they render to HTML at build time by default, with no JavaScript sent to the browser unless you explicitly need it.

## Adding React to Astro

Astro can directly render React components! This is where Astro's power shines.

### Installing React in Astro:

```bash
npm install @astrojs/react react react-dom
```

### Enable in `astro.config.mjs`

```js
import { defineConfig } from "astro/config";
import react from "@astrojs/react";

export default defineConfig({
	integrations: [react()],
});
```

#### Usage:

```astro
---
import MyButton from "../components/MyButton.jsx";
---

<html>
	<body>
		<h1>Mixing Astro + React</h1>
		<MyButton />
	</body>
</html>
```

**This is where Astro's strength becomes clear:** It builds most of the site as pure HTML (without extra JS), but brings in React wherever you need interactivity.

## Layouts in Astro

A Layout is like a master template used across multiple pages (header, footer, navigation).

#### ✅ Astro Layout (`src/layouts/BaseLayout.astro`)

```astro
---
const { title } = Astro.props;
---

<html lang="en">
	<head>
		<title>{title}</title>
	</head>
	<body>
		<header>🌐 My Website</header>
		<main>
			<slot />
			<!-- Content gets injected here -->
		</main>
		<footer>© 2025 All Rights Reserved</footer>
	</body>
</html>
```

#### Using the Layout (`src/pages/about.astro`)

```astro
---
import BaseLayout from "../layouts/BaseLayout.astro";
---

<BaseLayout title="About Page">
	<h1>About Us 📖</h1>
	<p>This is an Astro site with layouts!</p>
</BaseLayout>
```

#### 🔄 React Layout Equivalent

```jsx
function BaseLayout({ title, children }) {
	return (
		<html>
			<head>
				<title>{title}</title>
			</head>
			<body>
				<header>🌐 My Website</header>
				<main>{children}</main>
				<footer>© 2025 All Rights Reserved</footer>
			</body>
		</html>
	);
}

export default function About() {
	return (
		<BaseLayout title="About Page">
			<h1>About Us 📖</h1>
			<p>This is a React site with layouts!</p>
		</BaseLayout>
	);
}
```

The `<slot />` in Astro works exactly like `children` in React - it's where child content gets rendered.

## Routing in Astro

Astro has **file-based routing** (meaning the file name = the route path).

```
src/pages/
 ┣ index.astro   →  /
 ┣ about.astro   →  /about
 ┗ blog/
    ┗ [slug].astro →  /blog/:slug
```

### ✅ Dynamic Route (`src/pages/blog/[slug].astro`)

```astro
---
const { slug } = Astro.params;
---

<html>
	<body>
		<h1>Blog Post: {slug}</h1>
	</body>
</html>
```

👉 Visiting `/blog/hello-world` → displays: **Blog Post: hello-world**

#### 🔄 React Equivalent (with React Router)

```jsx
import { BrowserRouter, Routes, Route, useParams } from "react-router-dom";

function BlogPost() {
	const { slug } = useParams();
	return <h1>Blog Post: {slug}</h1>;
}

export default function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/blog/:slug" element={<BlogPost />} />
			</Routes>
		</BrowserRouter>
	);
}
```

Astro's routing is automatic based on file structure, while React requires a routing library like React Router. This makes Astro simpler for content-focused sites.

## Islands Architecture

The key concept in Astro is that the entire page is static HTML, and only the parts that need interactivity get **hydrated** with React/Vue/Svelte.

### ✅ Example: React Button Inside Astro

`src/components/Counter.jsx`

```jsx
import { useState } from "react";

export default function Counter() {
	const [count, setCount] = useState(0);
	return <button onClick={() => setCount(count + 1)}>Count: {count}</button>;
}
```

`src/pages/index.astro`

```astro
---
import Counter from "../components/Counter.jsx";
---

<html>
	<body>
		<h1>Astro Island Example 🏝️</h1>
		<Counter client:load />
		<!-- Only here does JS execute -->
	</body>
</html>
```

🔑 **Important Client Directives:**

- `client:load` → JavaScript loads immediately when page loads
- `client:idle` → Loads when browser is idle (better performance)
- `client:visible` → Loads when user scrolls and component becomes visible
- `client:only` → Only renders on the client (skips server rendering)

#### 🔄 React Equivalent (entire page becomes JS)

```jsx
import { useState } from "react";

export default function App() {
	const [count, setCount] = useState(0);

	return (
		<div>
			<h1>React Example 🏝️</h1>
			<button onClick={() => setCount(count + 1)}>Count: {count}</button>
		</div>
	);
}
```

📌 **The Difference:** In Astro, only the button becomes React (an "island" of interactivity), while the rest is pure HTML. In React, the entire page gets hydrated with JavaScript.

**Why This Matters:** This architecture dramatically reduces the amount of JavaScript sent to the browser, resulting in faster page loads and better performance, especially on mobile devices.

## Data Fetching in Astro

Astro can fetch data directly during **server-side build** or at request time.

### ✅ Example: Fetching from API (`src/pages/users.astro`)

```astro
---
const res = await fetch("https://jsonplaceholder.typicode.com/users");
const users = await res.json();
---

<html>
	<body>
		<h1>Users 👥</h1>
		<ul>
			{users.map((user) => <li>{user.name}</li>)}
		</ul>
	</body>
</html>
```

#### 🔄 React Equivalent (Client-side fetching)

```jsx
import { useEffect, useState } from "react";

export default function Users() {
	const [users, setUsers] = useState([]);

	useEffect(() => {
		fetch("https://jsonplaceholder.typicode.com/users")
			.then((res) => res.json())
			.then(setUsers);
	}, []);

	return (
		<div>
			<h1>Users 👥</h1>
			<ul>
				{users.map((user) => (
					<li key={user.id}>{user.name}</li>
				))}
			</ul>
		</div>
	);
}
```

📌 **The Difference:**

- In **Astro**, data is fetched during build or SSR → Faster initial load, better SEO (content is in the HTML)
- In **React**, data must be fetched in the browser → Weaker SEO (content appears after JavaScript loads), slower perceived performance

When Astro fetches data at build time, the resulting HTML already contains all the user data. Search engines see complete content immediately. With client-side React, search engines initially see an empty shell, which can hurt SEO rankings.

## API Endpoints in Astro

Astro can create its own API routes, similar to Next.js API routes.

### ✅ `src/pages/api/hello.js`

```js
export async function GET() {
	return new Response(JSON.stringify({ message: "Hello from Astro API 🚀" }), {
		status: 200,
	});
}
```

👉 Route `/api/hello` → outputs:

```json
{ "message": "Hello from Astro API 🚀" }
```

**You can also handle POST, PUT, DELETE:**

```js
export async function POST({ request }) {
	const data = await request.json();
	// Process data...
	return new Response(JSON.stringify({ success: true }), { status: 200 });
}
```

#### 🔄 React Equivalent (Express or Next.js)

```js
// Express.js
import express from "express";
const app = express();

app.get("/api/hello", (req, res) => {
	res.json({ message: "Hello from Express API 🚀" });
});

app.listen(3000);
```

Astro's API endpoints are file-based just like pages, making them easy to organize and deploy. They run server-side and can access databases, environment variables, etc.

## SSR (Server-Side Rendering) in Astro

By default, Astro builds **static sites**, but you can enable **SSR** for dynamic content.

### Enable in `astro.config.mjs`

```js
import { defineConfig } from "astro/config";

export default defineConfig({
	output: "server", // or "hybrid" for mixed static + SSR
});
```

### ✅ SSR Page (`src/pages/time.astro`)

```astro
---
const now = new Date().toLocaleTimeString();
---

<html>
	<body>
		<h1>Server Time ⏰: {now}</h1>
	</body>
</html>
```

Every time you refresh, you see a new time because it's rendered on the server for each request.

#### 🔄 Next.js SSR Equivalent

```jsx
export async function getServerSideProps() {
	return { props: { time: new Date().toLocaleTimeString() } };
}

export default function Time({ time }) {
	return <h1>Server Time ⏰: {time}</h1>;
}
```

With `output: "hybrid"`, you can mix static and SSR pages in the same project. Use `export const prerender = false` at the top of individual pages to make them SSR while keeping others static.

## Example 1: Using Markdown in Astro

One of Astro's strongest features is seamless Markdown integration.

### ✅ `src/pages/blog/first-post.md`

```md
---
title: "First Blog Post"
date: "2025-09-16"
---

## Astro + Markdown

This is my first post using Astro and Markdown!
```

### ✅ `src/pages/blog/index.astro`

```astro
---
import Post from "./first-post.md";
---

<html>
	<body>
		<h1>📝 Blog</h1>
		<article>
			<Post />
		</article>
	</body>
</html>
```

🔄 **In React**, you'd need libraries like `react-markdown` or `next-mdx-remote`:

```jsx
import ReactMarkdown from "react-markdown";

const md = `
# Hello World 🌍
This is my first post with **React + Markdown**.
`;

export default function Blog() {
	return <ReactMarkdown>{md}</ReactMarkdown>;
}
```

Astro treats Markdown as first-class components. You can import .md files directly and they render as components with full access to frontmatter data.

## Example 2: Conditionals in Astro

#### ✅ Astro (`src/pages/conditional.astro`)

```astro
---
const loggedIn = true;
const user = "Ali";
---

<html>
	<body>
		{loggedIn ? <h1>Welcome {user} 🎉</h1> : <a href="/login">Login</a>}
	</body>
</html>
```

#### 🔄 React

```jsx
export default function Conditional() {
	const loggedIn = true;
	const user = "Ali";

	return (
		<div>
			{loggedIn ? <h1>Welcome {user} 🎉</h1> : <a href="/login">Login</a>}
		</div>
	);
}
```

The syntax is nearly identical, but in Astro this runs at build time (or server-side with SSR), while in React it runs in the browser.

## Example 3: Loops in Astro

#### ✅ Astro (`src/pages/products.astro`)

```astro
---
const products = [
	{ id: 1, name: "Laptop 💻", price: 1200 },
	{ id: 2, name: "Phone 📱", price: 800 },
	{ id: 3, name: "Headphones 🎧", price: 150 },
];
---

<html>
	<body>
		<h1>Products</h1>
		<ul>
			{
				products.map((p) => (
					<li>
						{p.name} - ${p.price}
					</li>
				))
			}
		</ul>
	</body>
</html>
```

#### 🔄 React

```jsx
export default function Products() {
	const products = [
		{ id: 1, name: "Laptop 💻", price: 1200 },
		{ id: 2, name: "Phone 📱", price: 800 },
		{ id: 3, name: "Headphones 🎧", price: 150 },
	];

	return (
		<ul>
			{products.map((p) => (
				<li key={p.id}>
					{p.name} - ${p.price}
				</li>
			))}
		</ul>
	);
}
```

Notice you don't need `key` props in Astro because it's not managing a virtual DOM. The HTML is generated once at build time.

## Example 4: Combining CSS with Astro

Astro allows both **scoped CSS** (component-level) and global styles.

### ✅ `src/components/Card.astro`

```astro
---
const { title, text } = Astro.props;
---

<div class="card">
	<h2>{title}</h2>
	<p>{text}</p>
</div>

<style>
	.card {
		border: 2px solid #444;
		padding: 1rem;
		border-radius: 10px;
		background: #f9f9f9;
	}
</style>
```

#### 🔄 React (with CSS Module)

```jsx
import styles from "./Card.module.css";

export default function Card({ title, text }) {
	return (
		<div className={styles.card}>
			<h2>{title}</h2>
			<p>{text}</p>
		</div>
	);
}
```

`Card.module.css`

```css
.card {
	border: 2px solid #444;
	padding: 1rem;
	border-radius: 10px;
	background: #f9f9f9;
}
```

Astro's `<style>` tags are automatically scoped to the component (similar to Vue or Svelte). You can also add `is:global` attribute for global styles, or use regular CSS/SCSS files.

## Example 5: Using Slots in Astro (like children in React)

#### ✅ Astro (`src/components/Layout.astro`)

```astro
<html>
	<body>
		<header>🔥 Header</header>
		<main>
			<slot />
			<!-- Content goes here -->
		</main>
		<footer>⚡ Footer</footer>
	</body>
</html>
```

### Using in a page

```astro
---
import Layout from "../components/Layout.astro";
---

<Layout>
	<h1>Welcome to Slot Example 🌟</h1>
	<p>This content goes inside the layout.</p>
</Layout>
```

**Named Slots:**

```astro
<div class="container">
	<slot name="header" />
	<slot />
	<!-- default slot -->
	<slot name="footer" />
</div>
```

#### 🔄 React children equivalent

```jsx
function Layout({ children }) {
	return (
		<div>
			<header>🔥 Header</header>
			<main>{children}</main>
			<footer>⚡ Footer</footer>
		</div>
	);
}

export default function Page() {
	return (
		<Layout>
			<h1>Welcome to Children Example 🌟</h1>
			<p>This content goes inside the layout.</p>
		</Layout>
	);
}
```

Slots are more powerful than React's children - you can have named slots for more complex layouts (like header/footer/sidebar slots).

## Example 6: Partial Hydration for Optimization

#### ✅ Astro (`src/pages/counter.astro`)

```astro
---
import Counter from "../components/Counter.jsx";
---

<html>
	<body>
		<h1>Astro Counter Example ⏱️</h1>
		<Counter client:visible />
		<!-- Only loads when user sees it -->
	</body>
</html>
```

#### 🔄 React → Always hydrates (no built-in optimization)

```jsx
import { useState } from "react";

export default function Counter() {
	const [count, setCount] = useState(0);
	return <button onClick={() => setCount(count + 1)}>Count: {count}</button>;
}
```

`client:visible` uses the Intersection Observer API to only load the component's JavaScript when it enters the viewport. This is perfect for components "below the fold" - users on slow connections don't download JS for content they may never scroll to.

## Example 7: Direct JSON Import in Astro

#### ✅ Astro

```astro
---
import data from "../data/users.json";
---

<html>
	<body>
		<h1>Users List</h1>
		<ul>
			{data.map((u) => <li>{u.name}</li>)}
		</ul>
	</body>
</html>
```

#### 🔄 React

```jsx
import data from "../data/users.json";

export default function Users() {
	return (
		<ul>
			{data.map((u) => (
				<li key={u.id}>{u.name}</li>
			))}
		</ul>
	);
}
```

Both work similarly, but in Astro this data is inlined at build time, while React bundles it with the client-side JavaScript.

## Project 1: Simple Static Blog

### Astro Project Structure

```
src/
 ┣ pages/
 ┃ ┣ index.astro
 ┃ ┗ blog/
 ┃    ┣ first-post.md
 ┃    ┗ second-post.md
 ┗ layouts/
    ┗ BlogLayout.astro
```

### ✅ `src/layouts/BlogLayout.astro`

```astro
<html>
	<body>
		<header>📝 My Blog</header>
		<main><slot /></main>
		<footer>© 2025 Blog</footer>
	</body>
</html>
```

### ✅ `src/pages/blog/first-post.md`

```md
---
title: "First Post"
date: "2025-09-16"
---

# Hello World 🌍

This is my first post in Astro.
```

### ✅ `src/pages/blog/index.astro`

```astro
---
import First from "./first-post.md";
import Second from "./second-post.md";
import BlogLayout from "../../layouts/BlogLayout.astro";
---

<BlogLayout>
	<h1>All Posts</h1>
	<First />
	<Second />
</BlogLayout>
```

#### 🔄 Next.js Equivalent

```jsx
// pages/blog/[slug].js
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import ReactMarkdown from "react-markdown";

export async function getStaticProps({ params }) {
	const filePath = path.join("posts", `${params.slug}.md`);
	const file = fs.readFileSync(filePath, "utf-8");
	const { content, data } = matter(file);

	return { props: { content, data } };
}

export async function getStaticPaths() {
	return {
		paths: [{ params: { slug: "first-post" } }],
		fallback: false,
	};
}

export default function Post({ content }) {
	return <ReactMarkdown>{content}</ReactMarkdown>;
}
```

📌 **In Astro it's much simpler** - no need for `fs`, `matter`, or extra plugins. Markdown is a first-class citizen.

## Project 2: ToDo App with Interactive Islands

### ✅ `src/components/Todo.jsx`

```jsx
import { useState } from "react";

export default function Todo() {
	const [tasks, setTasks] = useState([]);
	const [input, setInput] = useState("");

	const addTask = () => {
		if (input.trim() === "") return;
		setTasks([...tasks, input]);
		setInput("");
	};

	return (
		<div>
			<input
				value={input}
				onChange={(e) => setInput(e.target.value)}
				placeholder="Add task..."
			/>
			<button onClick={addTask}>➕ Add</button>
			<ul>
				{tasks.map((t, i) => (
					<li key={i}>{t}</li>
				))}
			</ul>
		</div>
	);
}
```

### ✅ `src/pages/todo.astro`

```astro
---
import Todo from "../components/Todo.jsx";
---

<html>
	<body>
		<h1>✅ ToDo App</h1>
		<Todo client:load />
		<!-- Only this part uses React -->
	</body>
</html>
```

#### 🔄 React Equivalent

```jsx
import { useState } from "react";

export default function App() {
	const [tasks, setTasks] = useState([]);
	const [input, setInput] = useState("");

	const addTask = () => {
		if (input.trim() === "") return;
		setTasks([...tasks, input]);
		setInput("");
	};

	return (
		<div>
			<h1>✅ ToDo App</h1>
			<input
				value={input}
				onChange={(e) => setInput(e.target.value)}
				placeholder="Add task..."
			/>
			<button onClick={addTask}>➕ Add</button>
			<ul>
				{tasks.map((t, i) => (
					<li key={i}>{t}</li>
				))}
			</ul>
		</div>
	);
}
```

📌 **The major difference:**

- In **Astro**, only the ToDo island gets hydrated with React - the `<h1>` and page structure are static HTML
- In **React**, the entire page becomes JavaScript, even the static heading

**Performance Impact:** The Astro version sends significantly less JavaScript to the browser. If this was part of a larger page with multiple sections, only the interactive components would require JS.

## Project 3: Portfolio with Routing and Layouts

### Structure

```
src/
 ┣ layouts/
 ┃ ┗ PortfolioLayout.astro
 ┣ pages/
 ┃ ┣ index.astro
 ┃ ┣ about.astro
 ┃ ┗ projects.astro
```

### ✅ `src/layouts/PortfolioLayout.astro`

```astro
<html>
	<body>
		<nav>
			<a href="/">🏠 Home</a> |
			<a href="/about">ℹ️ About</a> |
			<a href="/projects">💼 Projects</a>
		</nav>
		<main><slot /></main>
	</body>
</html>
```

### ✅ `src/pages/index.astro`

```astro
---
import Layout from "../layouts/PortfolioLayout.astro";
---

<Layout>
	<h1>👋 Hi, I'm Ali</h1>
	<p>Frontend Developer</p>
</Layout>
```

### ✅ `src/pages/projects.astro`

```astro
---
import Layout from "../layouts/PortfolioLayout.astro";
const projects = ["Astro Blog", "ToDo App", "Portfolio"];
---

<Layout>
	<h1>💼 Projects</h1>
	<ul>
		{projects.map((p) => <li>{p}</li>)}
	</ul>
</Layout>
```

#### 🔄 React Equivalent (React Router)

```jsx
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

function Layout({ children }) {
	return (
		<div>
			<nav>
				<Link to="/">🏠 Home</Link> |<Link to="/about">ℹ️ About</Link> |
				<Link to="/projects">💼 Projects</Link>
			</nav>
			<main>{children}</main>
		</div>
	);
}

function Home() {
	return <h1>👋 Hi, I'm Ali</h1>;
}

function Projects() {
	const projects = ["Astro Blog", "ToDo App", "Portfolio"];
	return (
		<ul>
			{projects.map((p) => (
				<li key={p}>{p}</li>
			))}
		</ul>
	);
}

export default function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route
					path="/"
					element={
						<Layout>
							<Home />
						</Layout>
					}
				/>
				<Route
					path="/projects"
					element={
						<Layout>
							<Projects />
						</Layout>
					}
				/>
			</Routes>
		</BrowserRouter>
	);
}
```

Astro's file-based routing eliminates the need for a routing library. Each `.astro` file in `/pages` automatically becomes a route, making the structure more intuitive and easier to maintain.

## Final Thoughts

We've covered everything from basics to advanced topics in this step-by-step tutorial. Now it's your turn to share your thoughts and feedback with us.

**Key Takeaways:**

1. **Astro is optimized for speed** - it ships minimal JavaScript by default
2. **Islands Architecture** lets you add interactivity only where needed
3. **Framework agnostic** - mix React, Vue, Svelte, or use none at all
4. **Excellent for content-heavy sites** - blogs, documentation, portfolios
5. **Familiar syntax** - if you know React, you'll pick up Astro quickly
6. **SEO-friendly** - server-rendered HTML with real content
7. **Developer experience** - file-based routing, built-in Markdown support, hot module reloading

**When to choose Astro over React:**

- Content-focused websites (blogs, marketing sites, documentation)
- When SEO is critical
- When you want the fastest possible page loads
- When most of your content is static with occasional interactive elements

**When to stick with React:**

- Highly interactive applications (dashboards, social media, real-time apps)
- When you need extensive client-side state management
- When the entire application is dynamic

Astro represents a paradigm shift in how we think about web development - start with HTML and progressively enhance with JavaScript, rather than starting with a JavaScript framework and trying to optimize it.
