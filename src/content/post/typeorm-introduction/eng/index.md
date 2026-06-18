---
title: "Exploring TypeORM: The Most Powerful Traditional ORM in the Node.js Ecosystem"
description: "An introduction to TypeORM and its capabilities for database management in Node.js, from basic concepts to practical implementation"
post_id: "typeorm-introduction"
publishDate: "10 Feb 2026"
tags: ["TypeORM", "ORM", "Node.js", "TypeScript", "Database", "SQL"]
eng: true
---

# TypeORM: The Most Powerful Traditional ORM in the Node.js Ecosystem

 ![alt text](img.png)

Welcome! Before diving into the world of ORMs, you should have a basic familiarity with SQL and a backend framework like Express.js. In this post, we'll explore TypeORM — one of the most widely used ORMs in the Express.js ecosystem. Learning TypeORM will also give you a solid grasp of ORM concepts in general, which you can apply across different programming languages.

## What is an ORM?

**ORM** stands for **Object-Relational Mapping**. It acts as a bridge between two different worlds:

1. **The coding world** — where we work with objects and classes (like in JavaScript or Python).
2. **The database world** — where data is stored in tables (like in SQL).

Without an ORM, you'd have to write long, complex SQL queries directly inside your application code. With an ORM, you manage the database using familiar constructs from your own programming language.

### A Brief History of Database Interaction

**Era 1 — Raw SQL (1970s–1990s)**
Developers wrote SQL strings directly in their code. Problems included high risk of typos, poor security (SQL Injection attacks), and fragility — changing a single column in the database could break hundreds of lines of code.

**Era 2 — The First ORMs (Early 2000s)**
As object-oriented programming (OOP) spread, tools emerged to automatically map database tables to objects:
- **Hibernate (2001)** — for Java; a revolutionary step forward.
- **ActiveRecord (2004)** — introduced with Ruby on Rails; made database interaction elegantly simple.
- **Entity Framework (2008)** — by Microsoft for .NET.

**Era 3 — Modern, Type-Safe ORMs (2015–present)**
Modern ORMs like TypeORM and Drizzle go further by focusing on **type safety** — the developer can catch data-type mismatches *before* even running the code. This eliminates a whole class of runtime bugs.

### Why Use an ORM?

- **Faster development** — call a simple method instead of writing 5 lines of SQL.
- **Security** — ORMs automatically protect against SQL Injection attacks.
- **Database independence** — switch from MySQL to PostgreSQL without rewriting your application logic.
- **Migration management** — version-control your database schema changes just like your source code in Git.

### Code Comparison

**Without ORM (raw SQL):**
```javascript
const sql = 'SELECT * FROM users WHERE email = ?';
db.execute(sql, ['ali@gmail.com'], (err, rows) => {
  const user = rows[0];
  console.log(user.name);
});
```

**With TypeORM:**
```javascript
const user = await userRepository.findOneBy({ email: 'ali@gmail.com' });
console.log(user.name);
```

The ORM version is cleaner, safer, and reads almost like plain English.

## ORMs Across Different Programming Languages

Every major backend language has its own ORM ecosystem, because each language has its own data structures (classes in Java/C#, objects in JS, structs in Go), and the ORM needs to map database rows into those native structures.

| Language | Popular ORMs |
|---|---|
| **Python** 🐍 | SQLAlchemy, Django ORM |
| **PHP** 🐘 | Eloquent (Laravel), Doctrine (Symfony) |
| **C# / .NET** 🪟 | Entity Framework Core |
| **Java** ☕ | Hibernate (the grandfather of all ORMs) |
| **Go** 🐹 | GORM |
| **Node.js** | TypeORM, Prisma, Drizzle |

## TypeORM: A Deep Dive

TypeORM is a mature, feature-rich ORM that supports both **Active Record** and **Data Mapper** patterns. You define database tables as **TypeScript/JavaScript classes**, decorate them with special annotations, and TypeORM handles translating your code into SQL queries behind the scenes.

Unlike Prisma (which uses a central `schema` file), TypeORM is built around **classes and decorators** — a more object-oriented approach that will feel familiar to Java or C# developers.

Let's walk through it in **6 essential steps**.

## Step 1: Installation & Initial Setup

In your Express project, install the required packages:

```bash
npm install typeorm reflect-metadata sqlite3 --save
npm install typescript ts-node @types/node --save-dev
```

> We're using `sqlite3` here for simplicity. For PostgreSQL, install `pg` instead.
> `reflect-metadata` is required by TypeORM to make decorators work properly at runtime.

**Configure TypeScript** — open `tsconfig.json` and make sure these two options are enabled:

```json
{
  "compilerOptions": {
    "emitDecoratorMetadata": true,
    "experimentalDecorators": true
  }
}
```

These settings activate decorator support, which TypeORM relies on heavily.

**Create the Data Source file** — this is where TypeORM's connection configuration lives:

```typescript
// data-source.ts
import { DataSource } from "typeorm";

export const AppDataSource = new DataSource({
    type: "sqlite",
    database: "database.sqlite",
    synchronize: false, // NEVER set to true in production — it can cause data loss
    logging: true,
    entities: ["src/entity/*.ts"],    // path to your entity classes
    migrations: ["src/migration/*.ts"], // path to your migration files
    subscribers: [],
});
```

> **`synchronize: false`** is important. When `true`, TypeORM auto-alters your database schema on every app start to match your entities — convenient for quick demos, but dangerous in production because it can drop columns or tables without warning.

## Step 2: Data Modeling (Entities)

In TypeORM, each database **table** is represented by a **class** called an **Entity**. Create `src/entity/User.ts`:

```typescript
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from "typeorm";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    email: string;

    @Column({ nullable: true })
    name: string;

    @CreateDateColumn()
    createdAt: Date;
}
```

**Key decorators explained:**

| Decorator | Purpose |
|---|---|
| `@Entity()` | Marks the class as a database table |
| `@PrimaryGeneratedColumn()` | Auto-incrementing primary key (`id`) |
| `@Column()` | A regular table column |
| `@Column({ unique: true })` | Column with a unique constraint |
| `@Column({ nullable: true })` | Column that allows NULL values |
| `@CreateDateColumn()` | Automatically set to the current timestamp on record creation |

## Step 3: Managing Database Changes (Migrations)

Migrations are **versioned SQL change scripts** that let you evolve your database schema over time in a controlled, trackable way. They're the professional alternative to relying on `synchronize: true`.

The TypeORM migration workflow has two main phases: **generate** and **run**.

### 1. Generate a Migration

When you modify an Entity (e.g., add a new field), this command compares your current entities against the actual database state and **auto-generates a migration file** containing the necessary SQL.

```bash
npx typeorm-ts-node-commonjs migration:generate -d ./data-source.ts ./src/migration/AddUserTable
```

- `-d ./data-source.ts` — points to your DataSource configuration.
- `./src/migration/AddUserTable` — the output path and name for the generated file.

The generated file will contain an `up()` method (apply changes) and a `down()` method (revert changes).

### 2. Run Migrations

Applies all pending migration files to the database:

```bash
npx typeorm-ts-node-commonjs migration:run -d ./data-source.ts
```

Use this in both development and production. In production, you only ever run this command — never `generate`.

### 3. Check Migration Status

Lists which migrations have been applied and which are pending:

```bash
npx typeorm-ts-node-commonjs migration:show -d ./data-source.ts
```

### 4. Drop All Tables (Dev Only)

Wipes the entire database — useful when your schema gets into a broken state during development:

```bash
npx typeorm-ts-node-commonjs schema:drop -d ./data-source.ts
```

⚠️ **Warning:** This deletes all tables and data. Run `migration:run` afterwards to rebuild from scratch.

### Pro Tip: Simplify Commands with `package.json`

Typing `npx typeorm-ts-node-commonjs ...` every time is tedious. Add shortcuts to your `package.json`:

```json
"scripts": {
    "typeorm": "typeorm-ts-node-commonjs",
    "migration:generate": "npm run typeorm migration:generate -d ./data-source.ts",
    "migration:run": "npm run typeorm migration:run -d ./data-source.ts",
    "migration:revert": "npm run typeorm migration:revert -d ./data-source.ts",
    "db:reset": "npm run typeorm schema:drop -d ./data-source.ts && npm run migration:run"
}
```

Now you can simply run:
- `npm run migration:generate -- ./src/migration/NewChange`
- `npm run migration:run`

### TypeORM CLI Command Reference

| Command | Environment | Purpose | Creates a file? |
|---|---|---|---|
| `migration:generate` | Local (Dev) | Compares entities vs DB and generates SQL | ✅ Yes |
| `migration:run` | Dev & Production | Applies pending migrations to the DB | ❌ No |
| `schema:drop` | Local (Dev) | Drops all tables | ❌ No |
| `migration:show` | Anywhere | Lists applied/pending migrations | ❌ No |
| `migration:revert` | Anywhere | Undoes the last applied migration | ❌ No |

## Step 4: CRUD Operations

For database operations, TypeORM uses the **Repository pattern** — a dedicated object per entity that exposes all query methods. Initialize your DataSource first (usually in your app entry point), then use `getRepository()`.

```typescript
// index.ts
import { AppDataSource } from "./data-source";
import { User } from "./src/entity/User";

AppDataSource.initialize().then(async () => {

    const userRepository = AppDataSource.getRepository(User);

    // CREATE
    const user = userRepository.create({ email: "ali@example.com", name: "Ali" });
    await userRepository.save(user); // .create() builds the object; .save() writes to DB
    console.log("User created:", user);

    // READ — all records
    const allUsers = await userRepository.find();

    // READ — single record by condition
    const oneUser = await userRepository.findOneBy({ email: "ali@example.com" });

    // UPDATE — Method 1: fetch, modify, save (recommended — triggers lifecycle hooks)
    if (oneUser) {
        oneUser.name = "Ali Reza";
        await userRepository.save(oneUser);
    }

    // UPDATE — Method 2: direct update (faster but skips hooks)
    await userRepository.update({ email: "ali@example.com" }, { name: "Ali Reza" });

    // DELETE
    await userRepository.delete({ email: "ali@example.com" });

}).catch(error => console.log(error));
```

> **Method 1 vs Method 2 for updates:** The fetch-then-save approach is generally recommended because it fires TypeORM lifecycle hooks (like `@BeforeUpdate`) and returns the complete updated entity. The direct `update()` is more performant for bulk operations where you don't need the full entity back.

## Step 5: Relationships Between Tables

Let's model a classic **one-to-many** relationship: one `User` has many `Posts`.

**Update `User` entity:**
```typescript
// src/entity/User.ts
import { OneToMany, ... } from "typeorm";
import { Post } from "./Post";

@Entity()
export class User {
    // ... other fields

    @OneToMany(() => Post, (post) => post.author, { cascade: true })
    posts: Post[];
    // cascade: true means saving a User will also save its related Posts
}
```

**Create `Post` entity:**
```typescript
// src/entity/Post.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { User } from "./User";

@Entity()
export class Post {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @ManyToOne(() => User, (user) => user.posts)
    author: User;
    // TypeORM will automatically create an `authorId` foreign key column in this table
}
```

After modifying your entities, always run `migration:generate` followed by `migration:run` to apply the schema changes.

**Working with relational data:**

```typescript
// Create a user with posts in a single save (Cascade Insert)
const user = new User();
user.email = "sara@test.com";

const post = new Post();
post.title = "Hello TypeORM";

user.posts = [post];
await userRepository.save(user); // saves both user AND post

// Fetch a user WITH their posts (performs a JOIN under the hood)
const users = await userRepository.find({
    relations: {
        posts: true,
    },
});
```

> By default, TypeORM uses **lazy loading** — related data is NOT fetched unless you explicitly ask for it via `relations`. This is a good default for performance, but remember to include `relations` when you need nested data.

## Step 6: Integrating with Express.js

Here's a complete working example of TypeORM inside an Express server:

```typescript
import express from "express";
import { AppDataSource } from "./data-source";
import { User } from "./src/entity/User";

const app = express();
app.use(express.json());

// Always initialize the DB connection BEFORE starting the server
AppDataSource.initialize().then(() => {

    const userRepo = AppDataSource.getRepository(User);

    // GET all users (with their posts)
    app.get("/users", async (req, res) => {
        const users = await userRepo.find({ relations: { posts: true } });
        res.json(users);
    });

    // POST signup
    app.post("/signup", async (req, res) => {
        const { email, name } = req.body;
        try {
            const newUser = userRepo.create({ email, name });
            const result = await userRepo.save(newUser);
            res.json(result);
        } catch (error) {
            res.status(400).json({ error: "Error creating user" });
        }
    });

    app.listen(3000, () => console.log("Server running on port 3000"));

}).catch(error => console.log("TypeORM connection error: ", error));
```

> A key pattern here: `AppDataSource.initialize()` is async, so the Express routes are registered only *after* the database connection is confirmed. This prevents requests from coming in before the DB is ready.

## Final Thoughts

That covers everything you need to get started with TypeORM — one of the most popular and battle-tested ORMs in the JavaScript ecosystem. From entities and migrations to CRUD operations and relationships, you now have a solid foundation to build real-world applications. Now it's your turn to put it into practice — feel free to share your thoughts! 🏀