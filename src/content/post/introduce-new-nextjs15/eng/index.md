---
title: "Next.js 15 Review"
description: "Everything you need to upgrade to Next.js 15: from the automatic Codemod to caching breaking changes and async APIs"
post_id: "introduce-new-nextjs15"
publishDate: "04 Apr 2024"
updatedDate: "13 Mar 2025"
tags: ["Nextjs", "Migration", "React"]
eng: true
---

# Next.js 15 — Complete Comprehensive Guide

![alt text](img.png)

Next.js 15 has been released with **significant new features** and **impactful breaking changes**. This version introduces fundamental changes to performance, Developer Experience (DX), and the rendering model that are essential for every developer to understand.

## Major Breaking Changes in Next.js 15

### Caching Changes — The Biggest Fix in Next.js 15

One of the most serious complaints about Next.js 14 was **overly aggressive caching**. This caused unpredictable behavior, hidden bugs, and development-time issues.

Next.js 15 has **fundamentally fixed this problem** and returned full control to developers. Many consider this **the biggest win of version 15**.

#### New Fetch Behavior — No Default Caching

In Next.js 14, `fetch()` in Server Components operated in **cache-first** mode. This meant Next.js cached data even when you didn't intend it to, returning the same data for all subsequent renders.

**Problems in version 14:**

- API updates weren't visible
- Data became stale
- Project behavior was unpredictable
- Developers had to constantly add `cache: 'no-store'`

**Next.js 15 fixed this: fetch is no longer cached by default.**

**Before (Next.js 14):**

```javascript
// This request was automatically cached
const data = await fetch("https://api.example.com/data");
```

**After (Next.js 15):**

```javascript
// No longer cached by default
const data = await fetch("https://api.example.com/data");
```

**If you still want to cache:**

```javascript
const cachedData = await fetch("https://api.example.com/data", {
	cache: "force-cache",
});
```

**Key points:**

- Caching is now optional, not mandatory
- You have complete control over what gets cached
- Fetch behavior is now much more transparent and predictable

#### API Routes and Route Handlers — No Longer Cached

In the previous version, many developers reported that API Routes (like `/api/...`) were unintentionally cached. This unusual and problematic behavior was especially troublesome when APIs were supposed to return fresh data.

Next.js 15 has solved this problem.

**Version 14:**

```javascript
// app/api/users/route.js
export async function GET() {
	// This response was unintentionally cached
	return Response.json({ users: await getUsers() });
}
```

**Version 15 (correct behavior):**

```javascript
// app/api/users/route.js
export async function GET() {
	// No longer cached
	return Response.json({ users: await getUsers() });
}
```

**To enable caching if desired:**

```javascript
export async function GET() {
	return Response.json(
		{ users: await getUsers() },
		{
			headers: {
				"Cache-Control": "max-age=60", // Cache for 60 seconds
			},
		},
	);
}
```

**Benefits:**

- API Routes behavior is now completely standard
- No unwanted or hidden caching
- You decide, not the framework

### Reduced Client Router Cache

In Next.js 14, when users navigated between pages on the client side, router caching for dynamic routes was active for **up to 30 seconds**. This caused pages to update slowly or not display new data.

**Next.js 15 reduced this to 0 seconds.**

This means:

- All dynamic navigations are always fresh
- Pages use new data
- User experience is more predictable

**To restore previous behavior if needed:**

```javascript
// next.config.js
module.exports = {
	experimental: {
		staleTimes: {
			dynamic: 30, // seconds
		},
	},
};
```

**Important notes:**

- Default value is now 0
- Only increase if necessary
- Increasing stale time is suitable for static-like pages

### Async Request APIs

In Next.js 15, all Request APIs have become **async**:

- `headers()`
- `cookies()`
- `params`
- `searchParams`

**Goal: More and Smarter Static Rendering**

When these APIs are async, Next.js can:

- Understand which pages truly need dynamic data
- Identify which pages are completely static and can be cached
- Defer computations for better performance

This change is also important for future **Partial Rendering** and **better Streaming**.

**Before (Next.js 14):**

```javascript
import { headers } from "next/headers";

export default function Page() {
	const headerValues = headers();
	return <div>...</div>;
}
```

**After (Next.js 15):**

```javascript
import { headers } from "next/headers";

export default async function Page() {
	const headerValues = await headers();
	return <div>...</div>;
}
```

### Dynamic Routes

In Next.js 15, even `params` is no longer a plain object and must be `await`ed.

```javascript
// app/blog/[id]/page.js
export default async function BlogPost({ params }) {
	const { id } = await params;

	return (
		<div>
			<h1>Blog Post ID: {id}</h1>
		</div>
	);
}
```

**Critical impact:**

- This change affects nearly all dynamic pages
- All pages with route parameters must become async
- Without await, you'll encounter type errors or undefined values

## New Features and Improvements

### React 19 Support

React 19 RC is now fully supported in Next.js 15.

**Example of the new `use` hook for promises:**

```javascript
import { use } from "react";

function UserProfile({ userPromise }) {
	const user = use(userPromise);
	return <div>{user.name}</div>;
}
```

### Turbopack for Development

```bash
npm run dev -- --turbo
```

**Benefits:**

- Up to 10x faster startup
- Up to 99.8% faster code updates

### Static Route Indicator

A tool to display whether pages are static/dynamic during development:

```javascript
// next.config.js
module.exports = {
	devIndicators: {
		buildActivity: true,
		buildActivityPosition: "bottom-right",
	},
};
```

### New `after()` API

Execute code after sending the response to the client:

```javascript
import { unstable_after as after } from "next/server";

export async function saveUser(userData) {
	const user = await createUser(userData);

	after(async () => {
		await sendWelcomeEmail(user.email);
		await logUserCreation(user.id);
		await updateAnalytics(user);
	});

	return user;
}
```

**Activation:**

```javascript
module.exports = { experimental: { after: true } };
```

The `after()` function allows you to perform non-blocking tasks like sending emails, logging, or analytics after the main response has been sent to the user. This improves perceived performance since users don't wait for these secondary operations.

### Enhanced `<Form>` Component

```javascript
import Form from "next/form";

export default function SearchForm() {
	return (
		<Form action="/search">
			<input name="query" placeholder="Search..." />
			<button type="submit">Search</button>
		</Form>
	);
}
```

**Features:**

- Internal navigation without refresh
- Prefetches destination page
- Progressive enhancement

**Note:** Don't use for complex API calls or file uploads.

### TypeScript Support in Config

```typescript
import type { NextConfig } from "next";

const config: NextConfig = {
	experimental: {
		turbo: { rules: { "*.svg": { loaders: ["@svgr/webpack"], as: "*.js" } } },
	},
};

export default config;
```

### Server Actions Security

```javascript
"use server";

export async function createUser(formData) {
	const name = formData.get("name");
	const email = formData.get("email");

	if (!name || !email) throw new Error("Missing required fields");
	return await saveUser({ name, email });
}
```

**Recommendation:** Always validate and sanitize inputs.

### Better Hydration Error Messages

```javascript
function ProblematicComponent() {
	const [mounted, setMounted] = useState(false);

	useEffect(() => setMounted(true), []);

	return <div>{mounted ? "Client" : "Server"}</div>;
}
```

Next.js 15 provides clearer error messages when hydration mismatches occur (when server-rendered HTML doesn't match client-rendered output), making debugging easier.

### Other Improvements

- ESLint 9 support
- Automatic addition of `.env*` to `.gitignore`
- Improved Docker and standalone builds

## Easy Migration with Codemod

Next.js provides an official automated tool that makes the upgrade process very simple.

**Command:**

```bash
npx @next/codemod@canary upgrade latest
```

### What does this command do?

**1. Updates core versions:**

- Next.js
- React
- React DOM

**2. Automatically applies code changes:**
Codemod modifies parts of your project code for Next.js 15 compatibility without requiring you to manually fix files one by one.

**3. Updates ESLint and essential dependencies:**

- New rules
- Full compatibility with version 15

**4. Configures and fixes config files:**

- `next.config.js`
- `tsconfig.json` (for TypeScript projects)
- Removes unnecessary settings

The codemod tool is a code transformation utility that automatically refactors your codebase to match Next.js 15's requirements. It's the recommended approach for upgrading as it handles most breaking changes automatically, reducing manual work and potential errors.
