---
title: "Exploring Prisma: The Most Popular ORM in the Node.js Ecosystem"
description: "Getting to know Prisma and how to connect, model, and query SQL databases securely using TypeScript"
post_id: "prisma-introduction"
publishDate: "14 Jan 2026"
tags: ["Prisma", "ORM", "Node", "TypeScript", "PostgreSQL", "MySQL", "SQL"]
eng: true
---



# Prisma: The Most Popular ORM in the Node.js Ecosystem

![alt text](img.png)


Welcome! Before diving into the world of ORMs, you should have a basic familiarity with SQL and a backend framework like Express.js. In previous posts, we covered Express.js — and now we're exploring Prisma ORM, which is widely used with it. Learning Prisma will also give you a solid grasp of ORM concepts in general, applicable across any programming language.



## What is an ORM?

ORM stands for **Object-Relational Mapping**. It's a bridge between two different worlds:

1. **The coding world** — where we work with objects (like classes in JavaScript or Python).
2. **The database world** — where data is stored in tables (like SQL).

Without an ORM, you have to write long, complex SQL queries embedded in your application code. With an ORM, you interact with your database using the same patterns and style as your regular code.

### A Brief History of Database Interaction

**1. Raw SQL Era (1970s–1990s)**
Developers wrote SQL strings directly inside code. Problems included high risk of typos, poor security (SQL Injection attacks), and fragility — changing one column in the database could break hundreds of lines of code.

**2. First-Generation ORMs (Early 2000s)**
As object-oriented programming (OOP) spread, tools emerged to automatically map database tables to objects:
- **Hibernate (2001)** — for Java, was revolutionary.
- **ActiveRecord (2004)** — introduced with Ruby on Rails, made database interaction elegantly simple.
- **Entity Framework (2008)** — by Microsoft for .NET.

**3. Modern, Type-Safe ORMs (2015–present)**
Modern ORMs like Prisma and Drizzle go beyond just mapping data. They focus on **Type Safety** — meaning you know at *compile time* (before the code even runs) whether the data you're fetching from the database is correctly typed. This drastically reduces runtime bugs.

### Why Use an ORM?

- **Development speed** — call a simple method instead of writing 5 lines of SQL.
- **Security** — ORMs automatically protect against SQL Injection attacks by parameterizing queries.
- **Database independence** — switch from MySQL to PostgreSQL without rewriting your core logic.
- **Migration management** — version-control your database schema alongside your code in Git.

### Code Comparison

**Without ORM (raw SQL):**
```javascript
const sql = "SELECT * FROM users WHERE email = ?";
db.execute(sql, ["ali@gmail.com"], (err, rows) => {
  const user = rows[0];
  console.log(user.name);
});
```

**With Prisma:**
```javascript
const user = await prisma.user.findUnique({
  where: { email: "ali@gmail.com" },
});
console.log(user.name);
```

Much cleaner — it reads almost like working with a JavaScript array.

---

## Popular ORMs Across Languages

Every major backend language has its own ORM ecosystem:

| Language | Popular ORMs |
|---|---|
| **Python** 🐍 | SQLAlchemy, Django ORM |
| **PHP** 🐘 | Eloquent (Laravel), Doctrine (Symfony) |
| **C# / .NET** 🪟 | Entity Framework Core |
| **Java** ☕ | Hibernate |
| **Go** 🐹 | GORM |

Each language needs its own ORM because each has a different data structure: Java/C# use *classes*, JavaScript uses *objects/JSON*, Go uses *structs*. An ORM must speak the native language of its environment.

---

## Prisma in 6 Steps

### Step 1: Installation & Setup

Inside your Express project:

```bash
npm install prisma --save-dev
npm install @prisma/client
```

Then initialize Prisma:

```bash
npx prisma init
```

This creates two important files:
- **`.env`** — stores your database connection string (URL).
- **`prisma/schema.prisma`** — the heart of Prisma, where you define your models (tables).

> **Why use `npx` instead of a global install?** If you have multiple projects using different Prisma versions, a globally installed version may conflict. `npx` always uses the version installed in the current project, keeping things consistent.

> **Tip for beginners:** For learning purposes, you can use **SQLite** as your database — it requires no server setup. Just set `provider = "sqlite"` in `schema.prisma`.

---

### Step 2: Data Modeling

Define your data structure in `prisma/schema.prisma`:

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite" // or "postgresql" or "mysql"
  url      = env("DATABASE_URL")
}

model User {
  id        Int      @id @default(autoincrement()) // Primary key, auto-increments
  email     String   @unique                       // Must be unique across all records
  name      String?                                // The "?" means this field is optional (nullable)
  createdAt DateTime @default(now())               // Automatically set to current time on creation
}
```

**Key concepts:**
- `@id` — marks the primary key.
- `@unique` — prevents duplicate values in that column.
- `?` — makes a field optional (it can be `null`).
- `@default(...)` — sets a default value automatically.

---

### Step 3: Migrations

A migration is how you sync your `schema.prisma` definition with the actual database. Think of it as a versioned changelog for your database structure.

```bash
npx prisma migrate dev --name init
```

This single command does three things:
1. Generates a `.sql` file with the necessary SQL statements.
2. Executes that SQL against your database (creating the `User` table).
3. Regenerates the Prisma Client so your code gets updated autocompletion and type checking.

#### Migration Sub-commands

| Command | Environment | What it does | Creates new files? |
|---|---|---|---|
| `migrate dev` | Local development | Creates migration file + applies it to DB | ✅ Yes |
| `migrate deploy` | Production / CI/CD | Applies existing migration files only | ❌ No |
| `migrate reset` | Local development | Drops the entire DB and rebuilds from scratch | ❌ No |
| `migrate status` | Anywhere | Shows which migrations are pending | ❌ No |

**Important:** Never run `migrate dev` on a production server — it can reset your database and wipe real data. Use `migrate deploy` in production, which only applies pre-built migration files safely.

---

### Step 4: CRUD Operations

First, import and instantiate the Prisma Client:

```javascript
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
```

The general pattern is: `prisma.[modelName].[operation]`

**Create:**
```javascript
const user = await prisma.user.create({
  data: {
    email: "ali@example.com",
    name: "Ali",
  },
});
```

**Read:**
```javascript
// Get all users
const allUsers = await prisma.user.findMany();

// Get one specific user
const oneUser = await prisma.user.findUnique({
  where: { email: "ali@example.com" },
});
```

**Update:**
```javascript
const updatedUser = await prisma.user.update({
  where: { email: "ali@example.com" }, // Which record?
  data: { name: "Ali Reza" },          // What changes?
});
```

**Delete:**
```javascript
const deletedUser = await prisma.user.delete({
  where: { email: "ali@example.com" },
});
```

---

### Step 5: Relations Between Tables

In real-world apps, data is connected. For example, one `User` can have many `Post`s — a classic one-to-many relationship.

Update `schema.prisma`:

```prisma
model User {
  id    Int    @id @default(autoincrement())
  email String @unique
  posts Post[] // One user has many posts
}

model Post {
  id        Int     @id @default(autoincrement())
  title     String
  content   String?
  published Boolean @default(false)
  authorId  Int     // Foreign key — stores the User's id
  author    User    @relation(fields: [authorId], references: [id])
}
```

Then run a new migration:
```bash
npx prisma migrate dev --name add_posts
```

**Working with relational data:**

Create a user *and* their first post in one operation (Nested Write):
```javascript
const userWithPost = await prisma.user.create({
  data: {
    email: "sara@test.com",
    posts: {
      create: {
        title: "Hello World",
        content: "My first Prisma post",
      },
    },
  },
});
```

Fetch a user *along with* their posts (using `include`, which is equivalent to a SQL `JOIN`):
```javascript
const users = await prisma.user.findMany({
  include: {
    posts: true,
  },
});
// Result: each user object also contains an array of their posts
```

#### The 4 Keywords You Need to Know

Mastering these 4 options covers ~90% of Prisma usage:

| Keyword | Purpose | Used in |
|---|---|---|
| `where` | Filter records — *which ones?* | All operations |
| `data` | The payload to write — *what to save?* | `create`, `update` |
| `select` | Pick specific fields (e.g., hide passwords) | All read operations |
| `include` | Join related tables and include their data | All read operations |

**`select` example** — return only name and email, exclude sensitive fields like password:
```javascript
const user = await prisma.user.findUnique({
  where: { id: 1 },
  select: { name: true, email: true },
});
```

---

### Step 6: Integrating with Express.js

Here's a minimal but complete Express app using Prisma:

```javascript
const express = require("express");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const app = express();
app.use(express.json());

// Get all users
app.get("/users", async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
});

// Sign up a new user
app.post("/signup", async (req, res) => {
  const { email, name } = req.body;
  try {
    const newUser = await prisma.user.create({
      data: { email, name },
    });
    res.json(newUser);
  } catch (error) {
    // Prisma throws a specific error when a unique constraint is violated
    res.status(400).json({ error: "User already exists" });
  }
});

app.listen(3000, () => console.log("Server running on port 3000"));
```

---

## Summary

The Prisma workflow boils down to 4 repeating steps:

1. **Schema** — define your models in `schema.prisma`.
2. **Migrate** — run `npx prisma migrate dev` to sync the database.
3. **Client** — use `create`, `findMany`, `update`, `delete` in your Express controllers.
4. **Relations** — use `include` to join and fetch related data.

That covers everything you need to get started with Prisma in a Node.js project. It's one of the most developer-friendly ORMs available today, and once you're comfortable with it, you'll find the concepts transfer naturally to ORMs in other languages too.