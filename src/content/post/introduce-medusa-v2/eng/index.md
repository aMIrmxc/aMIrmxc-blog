---
title: "Medusa.js v2 — The Headless Commerce Engine That Changed the Rules"
description: "Why are developers migrating from Shopify and WooCommerce to Medusa? From modular architecture and Workflows to deployment — the complete guide to Medusa v2"
post_id: "introduce-medusa-v2-en"
publishDate: "8 Jun 2026"
tags: ["Medusa.js", "Headless Commerce", "E-commerce", "TypeScript", "Next.js", "Open-Source", "Node.js"]
pinned: true
eng: true
---

# Medusa.js — The E-commerce Engine That Changed the Rules

![Medusa.js cover image](img2.png)

If you've ever burned hours fighting incompatible WooCommerce plugins, or hit Shopify's customization ceiling, this article is for you.

**Medusa.js** is an open-source headless commerce engine. It's not just a library, and it's not a limited SaaS platform — it's a complete engine that hands you the core of a store, ready for you to build on however you like.

And version 2 takes that even further.

Choosing Medusa.js as the core of an e-commerce project has become hugely popular among developers and tech companies in recent years. It's often described as **"the open-source Shopify alternative for developers."**

This post covers:

1. **What "headless" means** — decoupling the backend from the frontend, and why that matters
2. **Why Medusa** — how it compares to competitors, what open-source buys you, and why it's a great fit for markets like Iran
3. **The v2 architecture** — the four core concepts: Routes, Workflows, Subscribers, and Modules
4. **Hands-on development** — building Subscribers, custom APIs, custom Modules, Workflows, and more
5. **Admin panel extensions** — adding widgets to the admin UI without touching the core

## Why Medusa.js Is a Great Choice

**1. Headless architecture (frontend/backend separation)**
Medusa is fully headless: the backend — products, orders, customers, and so on — is completely decoupled from the frontend. That means you can build your UI in whatever framework you like (Next.js, Gatsby, Vue, or even a React Native mobile app), instead of being locked into pre-built themes.

**2. Excellent developer experience**
Medusa is built on Node.js and TypeScript, so if your team already knows JavaScript/TypeScript, picking it up is fast and pleasant. The architecture is modular, and the codebase follows clean, consistent conventions.

**3. Open source, no vendor lock-in**
Unlike SaaS platforms such as Shopify or BigCommerce, you own 100% of your code and data with Medusa. Nothing stops you from migrating, switching hosts, or changing how the system behaves — a critical point for companies worried about being locked into someone else's platform.

**4. High extensibility**
Medusa has a powerful plugin system. You can easily add local payment gateways (*such as ZarinPal or NextPay, popular providers in Iran*), custom shipping methods, or complex business rules — conditional discounts, for example — as plugins.

**5. Lower total cost of ownership at scale**
SaaS platforms tend to charge more as you grow — higher transaction fees, or enterprise plans like Shopify Plus that run into thousands of dollars a month. Medusa itself is free; you only pay for infrastructure (servers, databases) and your dev team, which is far more cost-effective at scale.

**6. High performance**
Without the bloat of legacy systems like Magento or WooCommerce, Medusa is inherently fast and handles high traffic with ease.

## The Drawbacks and Challenges of Medusa.js

**1. You need a real development team**
Medusa is not a drag-and-drop tool for non-technical users. Setting it up, customizing it, and maintaining it requires full-stack or backend developers. It's not a fit for business owners hoping to launch a store without writing code.

**2. Self-hosting means owning your infrastructure**
If you run the open-source, self-hosted version, security, backups, database administration (PostgreSQL), Redis, and server updates are entirely on your team. (Medusa now also offers a managed **Medusa Cloud** option that takes this burden off your hands — for a price.)

**3. A smaller ecosystem than the big players**
Medusa has far fewer plugins, extensions, and ready-made themes than Shopify or WooCommerce. Integrating with a niche service — say, a particular Iranian accounting package — may mean building that integration yourself from scratch.

**4. A learning curve**
Medusa's DX is great once you're up to speed, but understanding its specific architecture — Services, Repositories, Subscribers, Loaders — takes time for developers new to the framework.

## v2 Architecture: The Big Picture

Before writing any code, it helps to recalibrate your mental model around Medusa's new architecture. Medusa v2 isn't just a collection of APIs anymore — it's a modular, event-driven platform built for long-term scalability and maintainability.

Here's how the pieces fit together:

```
┌─────────────────────────────────────────────────────┐
│                   Your Application                   │
│                                                       │
│   Next.js Storefront    Mobile App    Admin Panel    │
└──────────────┬──────────────┬──────────────┬────────┘
               │              │              │
               └──────────────┼──────────────┘
                              │ REST API
┌─────────────────────────────▼───────────────────────┐
│                    Medusa Server                     │
│                                                       │
│  ┌──────────┐  ┌──────────┐  ┌──────────────────┐    │
│  │  Routes  │  │Workflows │  │   Subscribers    │    │
│  └──────────┘  └──────────┘  └──────────────────┘    │
│                                                       │
│  ┌──────────┐  ┌──────────┐  ┌──────────────────┐    │
│  │ Products │  │  Orders  │  │  Custom Modules  │    │
│  │  Module  │  │  Module  │  │   (Your Code)    │    │
│  └──────────┘  └──────────┘  └──────────────────┘    │
│                                                       │
│              PostgreSQL + Redis                      │
└───────────────────────────────────────────────────────┘
```

Four concepts sit at the center of everything:

- **Routes** — API entry points. Every file under `src/api` becomes an endpoint.
- **Workflows** — Multi-step business logic with automatic rollback. If step 8 of a 10-step order process fails, the workflow knows how to undo steps 1–7.
- **Subscribers** — Event listeners. When `order.placed` fires, a subscriber can send an email, fire off an SMS, or update inventory.
- **Modules** — Self-contained units of code. Anything you build lives in its own module, so it never collides with a Medusa update.

Each of these gets its own deep dive later in this post, with real code. For now, here's why each one matters:

- **Routes** stay deliberately thin. Their only job is to receive a request, validate it, hand it to a workflow, and return the response — keeping middleware (auth, validation, logging) cleanly separated from business logic.
- **Workflows** are Medusa's biggest leap in v2. They implement the **Saga pattern** — *a way of breaking a multi-step process into individual steps, each with an optional "compensation" function that undoes it if a later step fails.* If charging a customer's card fails after inventory has already been reserved, the workflow automatically calls the inventory step's compensation function to release that reservation. No half-finished "zombie orders."
- **Subscribers** decouple side effects from the main flow. The order-placement logic doesn't have to wait for a confirmation email to send — that happens asynchronously in the background, keeping API response times fast.
- **Modules** are Medusa's take on **Domain-Driven Design (DDD)** — *an approach where code is organized around business domains (products, orders, pricing, etc.) rather than technical layers.* Each module owns its own data, services, and logic, so you can build custom modules (a loyalty-points system, say) or even swap out a built-in module entirely, without breaking anything else.

## Getting Started: Local Development Setup

### Prerequisites

Before you start, make sure you have these installed:

```bash
node --version   # should be 20 or higher
psql --version   # PostgreSQL 15+
git --version
```

### Creating the Project

One command sets up everything:

```bash
npx create-medusa-app@latest my-shop
```

This launches an interactive wizard:

```
? What's the name of your project? › my-shop
? Would you like to create the project in a different directory? › No
? Would you like to seed the database with demo data? › Yes
```

> 💡 **Tip:** Say yes to seeding the database — it adds a handful of sample products that make testing much easier.

### Connecting the Database

If you just installed PostgreSQL, create a database first:

```bash
sudo -u postgres psql
CREATE DATABASE my_shop_db;
CREATE USER medusa_user WITH ENCRYPTED PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE my_shop_db TO medusa_user;
\q
```

After installation, a `.env` file is generated at the project root. Open it and fill it in like this:

```bash
# .env
DATABASE_URL=postgres://postgres:your_password@localhost:5432/my_shop_db
REDIS_URL=redis://localhost:6379

JWT_SECRET=your_super_secret_jwt_key_change_this
COOKIE_SECRET=your_super_secret_cookie_key_change_this

STORE_CORS=http://localhost:8000
ADMIN_CORS=http://localhost:9000
AUTH_CORS=http://localhost:9000,http://localhost:8000
```

### Running the Server

```bash
cd my-shop
npx medusa develop
```

If everything's set up correctly, you'll see:

```
info:    Server is ready on port: 9000
info:    Admin UI served on: http://localhost:9000/app
```

🎉 Congratulations — your Medusa server is running on port 9000.

### The Admin Panel — Create a Product and a Region

Open your browser and go to `http://localhost:9000/app`.

#### Logging In

If you chose to seed the database, the default credentials are:

```
Email:    admin@medusa-test.com
Password: supersecret
```

#### Creating a Product

Now let's add a couple of products:

1. Click **Products** in the left-hand menu
2. Click **New Product**

Behind the scenes, a product's data looks roughly like this:

```json
{
  "title": "Classic Gray Hoodie",
  "variants": [
    {
      "title": "S",
      "prices": [
        { "amount": 85, "currency_code": "usd" }
      ],
      "inventory_quantity": 50
    }
  ],
  "status": "published"
}
```

### The Frontend — Next.js Starter

Medusa provides a ready-made Next.js starter that works with Medusa v2. Install it in a separate terminal:

```bash
# in a directory separate from the backend
npx create-next-app -e https://github.com/medusajs/nextjs-starter-medusa my-shop-storefront
cd my-shop-storefront
```

#### Setting Environment Variables

Create a `.env.local` file:

```bash
# .env.local
NEXT_PUBLIC_MEDUSA_BACKEND_URL=http://localhost:9000
NEXT_PUBLIC_BASE_URL=http://localhost:8000
NEXT_PUBLIC_DEFAULT_REGION=ir
REVALIDATE_WINDOW=600
```

*(`NEXT_PUBLIC_DEFAULT_REGION` should match a region you've set up in the admin panel — `ir` is used here for Iran, but you'd set this to whatever region code fits your own store.)*

#### Running the Frontend

```bash
npm install
npm run dev
```

The storefront comes up at `http://localhost:8000`.

### How Does the Frontend Fetch Products?

The starter ships with a ready-to-use **Medusa JS Client**. Here's the product-fetching logic:

```typescript
// lib/data/products.ts
import { sdk } from "@lib/config"

export const listProducts = async ({
  pageParam = 1,
  queryParams,
  regionId,
}: {
  pageParam?: number
  queryParams?: Record<string, string>
  regionId: string
}) => {
  const { products, count, nextPage } = await sdk.store.product.list(
    {
      limit: 12,
      offset: (pageParam - 1) * 12,
      region_id: regionId,
      ...queryParams,
    },
    { next: { tags: ["products"] } }
  )

  return {
    response: { products, count },
    nextPage,
  }
}
```

This code:

1. Calls the `/store/products` API on the backend
2. Returns prices in whatever currency the given `region_id` is configured for (Iranian Rial, in this example)
3. Uses Next.js cache `tags` for revalidation

You can call this function from the products page (`app/[countryCode]/(main)/store/page.tsx`) to render your catalog.

## 1. Routes — The Entry Gateway

Routes are the entry point for every request in Medusa v2. A route's only job is to receive the request, validate the input, and hand it off to a Workflow or Service. Each route is a single file, and each file exports a set of HTTP methods.

This design means:

- APIs go live instantly, with no manual route registration
- The project structure stays clean and predictable
- Developers can focus purely on business logic

### Folder Structure: Files Become Endpoints Automatically

Any `route.ts` or `route.js` file located at:

```
src/api/<path>/route.ts
```

is automatically turned into an endpoint. For example:

```
src/api/products/route.ts    →  /products
src/api/brands/[id]/route.ts →  /brands/:id
```

### A Minimal Route

```ts
import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

export const GET = (req: MedusaRequest, res: MedusaResponse) => {
  res.json({ message: "Hello from Medusa v2!" })
}
```

Placed at `src/api/hello/route.ts`, this file automatically creates the `/hello` endpoint.

### Folder Structure in Practice

```
src/
  api/
    store/
      products/
        route.ts    → GET /store/products
    admin/
      custom/
        route.ts    → GET /admin/custom  (requires admin authentication)
    custom/
      hello/
        route.ts    → GET /custom/hello  (public)
```

### Example: A Product Stats Endpoint

Let's build an endpoint that returns some basic product statistics:

```typescript
// src/api/store/stats/route.ts
import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"

export const GET = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  // get the query tool from the container
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)

  const { data: products } = await query.graph({
    entity: "product",
    fields: ["id", "title", "status"],
    filters: { status: "published" },
  })

  return res.json({
    message: "Store statistics",
    total_published_products: products.length,
    products: products.map((p) => ({
      id: p.id,
      title: p.title,
    })),
  })
}
```

*(`req.scope` is Medusa's dependency-injection container — services, including the query engine above, are "resolved" from it rather than imported directly.)*

#### Testing with curl

```bash
curl http://localhost:9000/store/stats
```

#### Output:

```json
{
  "message": "Store statistics",
  "total_published_products": 3,
  "products": [
    { "id": "prod_01J...", "title": "Classic Gray Hoodie" },
    { "id": "prod_01K...", "title": "Plain White T-Shirt" }
  ]
}
```

### Example: A POST Endpoint with Validation

```typescript
// src/api/store/newsletter/route.ts
import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { z } from "zod"

// define a schema for validation
const NewsletterSchema = z.object({
  email: z.string().email("Invalid email"),
  name: z.string().min(2, "Name must be at least 2 characters"),
})

export const POST = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  const parsed = NewsletterSchema.safeParse(req.body)

  if (!parsed.success) {
    return res.status(400).json({
      error: "Invalid data",
      details: parsed.error.flatten().fieldErrors,
    })
  }

  const { email, name } = parsed.data

  // connect to your email marketing service here
  console.log(`New newsletter subscriber: ${name} — ${email}`)

  return res.status(201).json({
    success: true,
    message: `${name}, you've successfully subscribed to the newsletter!`,
  })
}
```

### Connecting Routes to Workflows: Clean, Testable Architecture

In Medusa v2, **a route should never contain business logic** — that all belongs in a Workflow or Service.

A route's job is just to:

1. Accept the input
2. Validate it
3. Run the workflow
4. Return the response

This separation makes:

- Testing simpler
- Routes lightweight and easy to maintain
- Business logic reusable across different entry points

### Middleware: Auth, Logging, Rate Limiting

You can attach middleware to any route for things like:

- Admin authentication
- Customer authentication
- Logging
- Rate limiting

Middleware should stay lightweight — its only role is to act as a guard or filter before the request reaches your route handler.

## 2. Workflows — The Smart, Resilient Heart of v2

Workflows are Medusa v2's built-in **orchestration engine**, designed to manage complex, multi-step, sensitive operations.

In practice, a workflow:

- Breaks an operation into small, independent steps
- Tracks the execution of each step
- Automatically **compensates** (rolls back) if something fails
- Makes the whole process observable, testable, and monitorable

Say placing an order needs to:

1. Decrease inventory
2. Charge the payment
3. Send a confirmation email
4. Notify the warehouse

If step 3 fails, steps 1 and 2 need to be undone. In plain code, you'd end up with a tangle of error-prone try/catch blocks trying to manage that.

Workflows solve this cleanly:

```typescript
// src/workflows/process-order.ts
import {
  createStep,
  createWorkflow,
  StepResponse,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk";

// each step is its own self-contained unit
const decreaseInventoryStep = createStep(
  "decrease-inventory",
  async (input: { productId: string; quantity: number }, { container }) => {
    // inventory-decrement logic goes here...

    // return data needed for rollback
    return new StepResponse("done", { productId: input.productId, quantity: input.quantity });
  },
  // the compensation function — runs if a later step fails
  async (previousData, { container }) => {
    // restore the inventory to its previous state
  }
);

// the workflow orchestrates all the steps
export const processOrderWorkflow = createWorkflow(
  "process-order",
  (input: { orderId: string }) => {
    decreaseInventoryStep({ productId: "...", quantity: 1 });
    // ...remaining steps

    return new WorkflowResponse("Order processed");
  }
);
```

This is exactly the kind of guarantee enterprise-grade systems need when financial data is on the line.

### A Real-World Example: Checkout Workflow

**The scenario:** 1. Reserve inventory, 2. Charge payment, 3. Issue an invoice.
**The catch:** if payment fails, the inventory reservation must be released — nothing should be left in a half-completed state.

#### The Full Workflow

```ts
// src/workflows/order-checkout.ts
import { createStep, createWorkflow, StepResponse } from "@medusajs/framework/workflows-sdk"

const reserveInventory = createStep(
  "reserve-inventory",
  async ({ lineItems }, { container }) => {
    const inventory = container.resolve("inventoryService")
    const reservation = await inventory.reserve(lineItems)

    return new StepResponse({ reservationId: reservation.id })
  },
  {
    compensate: async ({ reservationId }, { container }) => {
      const inventory = container.resolve("inventoryService")
      await inventory.release(reservationId)

      return new StepResponse({ released: true })
    }
  }
)

const chargePayment = createStep(
  "charge-payment",
  async ({ amount, paymentInfo }, { container }) => {
    const payment = container.resolve("paymentService")
    const charge = await payment.charge(amount, paymentInfo)

    return new StepResponse({ chargeId: charge.id })
  },
  {
    compensate: async ({ chargeId }, { container }) => {
      const payment = container.resolve("paymentService")
      await payment.refund(chargeId)

      return new StepResponse({ refunded: true })
    }
  }
)

const issueInvoice = createStep(
  "issue-invoice",
  async ({ orderId }, { container }) => {
    const accounting = container.resolve("accountingService")
    const invoice = await accounting.createInvoice(orderId)

    return new StepResponse({ invoiceId: invoice.id })
  }
)

export const checkoutWorkflow = createWorkflow({
  id: "checkout-workflow",
  steps: [reserveInventory, chargePayment, issueInvoice],
})
```

**Walking through it step by step:**

1. **Reserve inventory** — the items are reserved and the reservation ID is saved. If payment fails afterward, `compensate` releases that reservation.
2. **Charge payment** — the charge goes through and the transaction ID is saved. If invoicing fails afterward, the charge is refunded.
3. **Issue invoice** — the invoice is generated. This step has no compensation, since it's the last one — nothing comes after it that could fail and require undoing it.

#### Why This Pattern Is So Powerful

1. **Fault-tolerant** — the system absorbs failures gracefully.
2. **Transaction-like behavior** — similar guarantees to a database transaction, but spanning multiple independent services.
3. **Testable** — each step can be tested in isolation.
4. **Observable** — you can inspect the state of any workflow run directly in the database.
5. **Extensible** — adding new steps is easy: sending emails, logging to a CRM, connecting to an ERP, and so on.

## 3. Subscribers — Event Listeners

Subscribers are asynchronous functions that run whenever an event is emitted. They let you handle side effects — sending emails, push notifications, syncing with external services — outside the main request flow. The result is decoupling, faster API responses, and better scalability.

Whenever an event like `order.placed` fires, every subscriber listening for it runs asynchronously.

### Creating a Subscriber

Medusa v2 expects subscribers to live in:

```
src/subscribers/
```

Each subscriber has two parts:

1. An async **handler function** that runs when the event fires
2. A **config object** declaring which event it listens for

Every significant action in Medusa emits an event, and you can subscribe to any of them:

```typescript
// src/subscribers/order-notification.ts
import { SubscriberArgs, type SubscriberConfig } from "@medusajs/framework";

export default async function handleOrderPlaced({
  event: { data },
  container,
}: SubscriberArgs<{ id: string }>) {
  // send an SMS to the customer
  // post to the team's Slack channel
  // log the order in your CRM
  console.log("New order with ID:", data.id);
}

export const config: SubscriberConfig = {
  event: "order.placed",
};
```

No changes to existing code — just one new file, and now you're reacting to every new order.

### Example: A Subscriber for `order.placed`

```ts
// src/subscribers/order-placed.ts
import { SubscriberArgs, type SubscriberConfig } from "@medusajs/framework"
import { sendOrderConfirmationWorkflow } from "../workflows/send-order-confirmation"

export default async function orderPlacedHandler({
  event: { data },
  container,
}: SubscriberArgs<{ id: string }>) {
  const logger = container.resolve("logger")
  logger.info("Sending confirmation email...")

  await sendOrderConfirmationWorkflow(container).run({
    input: { id: data.id },
  })
}

export const config: SubscriberConfig = {
  event: "order.placed",
}
```

*(Notice the subscriber doesn't send the email itself — it triggers a workflow that does. That's a common pattern: subscribers react to events, while workflows handle the actual multi-step logic.)*

### The Event Bus

Medusa's Event Bus manages how events get published and delivered.

- The **Local Event Module** is enabled by default (fine for development).
- For production, the **Redis Event Module** is recommended.

#### Key Event Bus Methods

You can access the Event Bus via `container.resolve(Modules.EVENT_BUS)`.

| Method | Purpose |
|---|---|
| `emit()` | Publish one or more events |
| `subscribe()` | Register a new subscriber |
| `unsubscribe()` | Remove a subscriber |
| `releaseGroupedEvents()` | Publish a batch of grouped events together (useful for distributed transactions) |

#### Example: Emitting a Custom Event

```ts
const eventModuleService = container.resolve(Modules.EVENT_BUS)

await eventModuleService.emit({
  name: "user.created",
  data: { user_id: "user_123" },
})
```

This triggers every subscriber listening for `user.created`.

### Best Practices

1. **Make subscribers idempotent.** *(An idempotent operation produces the same end result no matter how many times it runs — important here because the Event Bus may deliver the same event more than once. This is normal for pub/sub systems generally.)*
2. **Don't put critical logic in subscribers.** If something is part of the core flow, use Workflow Hooks instead.
3. **Take logging and retries seriously** — calls to external services (email, CRM, Slack) can and will occasionally fail.
4. **Use the Redis Event Module in production** for better scalability and reliability.

### Caveats and Limitations

- Subscriber execution order isn't guaranteed.
- Duplicate delivery can happen — hence the need for idempotency.
- If an event payload is incomplete, the subscriber needs to handle that gracefully.

*(These follow from how pub/sub systems and event buses generally behave.)*

## 4. Modules — The Domain-Driven Design Revolution

Modules are at the heart of Medusa v2's architecture. Every feature is its own self-contained module — with its own data model, service, API, and lifecycle — that can be developed, replaced, or customized without touching anything else.

Every built-in business capability — products, orders, payments, inventory, customers — is implemented as its own module, and you can build custom modules the same way. Each module:

- Owns its own domain logic
- Has its own dedicated API and service layer
- Manages its own data models and migrations
- Has no direct dependency on other modules
- Can be **fully swapped out** for your own custom implementation

This independence lets a developer work on one domain without their changes rippling into anything else.

### Why Did Medusa Go Modular in v2?

**1. Eliminating cross-domain dependencies**
In older versions, domain logic was tangled together throughout the core. In v2, those cross-domain dependencies are gone — each module talks to others only through well-defined interfaces.

**2. Safe, stable upgrades**
Each module is its own versioned NPM package, so upgrading one module can't break the rest of the system.

**3. Full replaceability**
If the built-in Product module doesn't fit your needs, you can replace it entirely with your own implementation, and Checkout, Inventory, and Order keep working unaffected.

**4. Modules talk to each other through Workflows**
Multi-step logic — checkout, payment, inventory reservation — no longer lives inside the modules themselves; it lives in Workflows. That keeps each module clean and focused on a single domain.

### The Anatomy of a Module

A typical module includes:

- **models/** — data model definitions
- **services/** — domain logic and core operations
- **routes/** — module-specific APIs
- **migrations/** — database schema changes
- **index.ts** — registers the module and exposes its services

Medusa injects a PostgreSQL connection into every module, though your custom modules are free to connect to other databases too.

### Example: Building a Loyalty Module (Customer Points)

**1. Define the model**

```ts
import { model } from "@medusajs/framework/utils"

export const LoyaltyPoint = model.define("loyalty_point", {
  id: model.id().primaryKey(),
  customer_id: model.text().notNull(),
  balance: model.integer().default(0),
})
```

**2. The module's service**

```ts
export default class LoyaltyService {
  constructor({ loyaltyPointRepository }) {
    this.repo = loyaltyPointRepository
  }

  async addPoints(customerId, amount) {
    const record = await this.repo.findOne({ customer_id: customerId })
    record.balance += amount
    return this.repo.save(record)
  }
}
```

**3. A dedicated route**

```ts
export const GET = async (req, res) => {
  const service = req.scope.resolve("loyaltyService")
  const balance = await service.getBalance(req.params.id)
  res.json({ balance })
}
```

**4. Register the module in `medusa-config.js`**

```ts
modules: {
  loyalty: {
    resolve: "./src/modules/loyalty",
  },
}
```

### Example 2: Tracking Product View Counts

Say you want to track how many times each product has been viewed. The wrong way is to add a column directly to the `product` table. The right way is a dedicated module.

**1. The data model** (`src/modules/product-stats/models/stat.ts`):

```typescript
import { model } from "@medusajs/framework/utils";

export const ProductStat = model.define("product_stat", {
  id: model.id().primaryKey(),
  product_id: model.text(),
  views: model.number().default(0),
});
```

**2. The service** (`src/modules/product-stats/service.ts`):

```typescript
import { MedusaService } from "@medusajs/framework/utils";
import { ProductStat } from "./models/stat";

// this base class automatically generates standard CRUD operations
export default class ProductStatsService extends MedusaService({
  ProductStat,
}) {}
```

**3. Register it** (`medusa-config.ts`):

```typescript
modules: [
  {
    resolve: "./src/modules/product-stats",
  },
]
```

**4. Run the migration**

```bash
npx medusa db:migrate
```

You now have a standalone table in your database that will never conflict with a Medusa update.

### Module Links: Connecting Separate Worlds

Modules are completely isolated from one another by design. To join data across them, Medusa introduces **Links**:

```typescript
// src/links/product-stat.ts
import { defineLink } from "@medusajs/framework/utils";
import ProductModule from "@medusajs/medusa/product";
import ProductStatsModule from "../modules/product-stats";

export default defineLink(
  ProductModule.linkable.product,
  {
    linkable: ProductStatsModule.linkable.productStat,
    isList: false,
  }
);
```

Once a link is defined, `query.graph` knows the two entities are related:

```typescript
const { data: products } = await query.graph({
  entity: "product",
  fields: [
    "id",
    "title",
    "product_stat.views", // ← pulled from another module, no SQL required
  ],
  options: {
    sort: { "product_stat.views": "DESC" }, // sort by view count
    take: 10,
  },
});
```

This **remote query** capability — joining data across modules without writing any SQL — is one of Medusa v2's most powerful features.

### Best Practices

- Keep each module single-domain — one responsibility per module.
- Treat services as the single source of truth for logic.
- Keep APIs minimal — input and output only.
- Build a workflow for any multi-step operation, so modules stay clean.
- Version custom modules independently.

## 5. Admin Panel Extensions

Medusa ships with a full-featured admin panel — and you can add your own widgets to it without touching a single line of core code. Here's an example: a widget that shows view counts on the product page.

```tsx
// src/admin/widgets/product-views-widget.tsx
import { defineWidgetConfig } from "@medusajs/admin-sdk";
import { Container, Heading, Text } from "@medusajs/ui";
import { useQuery } from "@tanstack/react-query";

const ProductViewsWidget = ({ data: product }: any) => {
  const { data: views, isLoading } = useQuery({
    queryKey: ["product-views", product.id],
    queryFn: async () => {
      const res = await fetch(`/store/product-stats/${product.id}`);
      const json = await res.json();
      return json.views;
    },
  });

  return (
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <div>
          <Heading level="h2">View Stats</Heading>
          <Text size="small" className="text-ui-fg-subtle">
            How many times this product has been viewed
          </Text>
        </div>
        <div className="text-3xl font-bold text-blue-600">
          {isLoading ? "..." : views?.toLocaleString()}
        </div>
      </div>
    </Container>
  );
};

// where should this widget appear?
export const config = defineWidgetConfig({
  zone: "product.details.after",
});

export default ProductViewsWidget;
```

Restart the server and open any product's page in the admin — your widget shows up at the bottom, automatically styled to match the rest of the panel.

## Wrapping Up

In this post, we looked at Medusa.js v2 from every angle — from the headless philosophy and modular architecture to hands-on implementations of Workflows, custom Modules, and Admin Extensions.

If I had to boil it all down to one idea:

> Medusa isn't a framework you build a store *with* — it's an engine your store runs *on*.

That subtle but fundamental difference is the main reason Medusa has become so popular with technical teams. You no longer have to bend your business logic to fit a predefined template — the platform bends to fit you.

### Why Now Is a Good Time to Make the Switch

- 🏗️ **v2's architecture**, powered by Workflows and the Saga pattern, handles even the messiest business scenarios without falling apart
- 🔌 **Going modular** means you can build without fear of breaking the core or colliding with future updates
- 💰 **Full ownership** of your code and data, with no vendor lock-in and no escalating fees

### What's Next?

If you've made it this far, you've probably already got ideas for your next project. Here's where I'd start:

1. **Just start** — run `npx create-medusa-app@latest` and play around with the seed data
2. **Go deeper with the official docs** at [docs.medusajs.com](https://docs.medusajs.com)
3. **Build a small module** of your own — a points system or a loyalty program is a great first project
4. **Join the Medusa community** — the Discord and GitHub repo are full of great ideas and answers to technical questions

If you found this useful, I'd love to hear about your own experience with Medusa, or any challenges you've run into building your store — drop a comment below.

**Got a question? Ask away in the comments... 🚀**