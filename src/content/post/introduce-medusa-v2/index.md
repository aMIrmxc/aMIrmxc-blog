
---
title: "Medusa.js v2 — موتور Headless Commerce که قوانین بازی را عوض کرد"
description: "چرا توسعه‌دهنده‌ها دارند از Shopify و WooCommerce به Medusa مهاجرت می‌کنند؟ از معماری ماژولار و Workflows تا دیپلوی  — راهنمای کامل Medusa v2"
post_id: "introduce-medusa-v2"
publishDate: "8 Jun 2026"
pinned: true
tags: ["Medusa.js", "Headless Commerce", "E-commerce", "TypeScript", "Next.js", "Open-Source", "Node.js"]

---
# Medusa.js  — موتور تجارت الکترونیک که قوانین بازی را عوض کرد

![alt text](img.png)



اگر تا به حال با WooCommerce و پلاگین‌های ناسازگار وقت از دست داده‌اید، یا با Shopify به سقف سفارشی‌سازی رسیده اید، این مقاله برای شماست.

**Medusa.js** یک Headless Commerce Engine متن‌باز است. نه فقط یک کتابخانه، نه یک SaaS محدود — بلکه یک موتور کامل که هسته فروشگاه را به شما می‌دهد تا هر طور که می‌خواهید روی آن بسازید.

و نسخه ۲ آن، اوضاع را جدی‌تر کرده.

انتخاب **Medusa.js** به عنوان هسته (Core) یک پروژه تجارت الکترونیک (E-commerce)، در سال‌های اخیر به شدت در میان توسعه‌دهندگان و شرکت‌های فناوری محبوب شده است. مدوسا اغلب به عنوان «جایگزین متن باز شاپیفای (Shopify) برای توسعه‌دهندگان» شناخته می‌شود.

در این بلاگ پست شش موضوع اصلی  پوشش داده میشود:

1. **Headless چیست** — جداسازی بک‌اند از فرانت‌اند و مزیت آن
2. **چرا Medusa** — مقایسه با رقبا، متن‌باز بودن، مزیت برای بازار ایران
3. **معماری v2** — چهار مفهوم Routes، Workflows، Subscribers، Modules
4. **توسعه عملی** —  Subscribers , API، Custom Module،Workflow,  ... 
5. **Admin Extension** — اضافه کردن ویجت به پنل ادمین بدون دستکاری هسته


## چرا Medusa.js انتخاب خوبی است؟ 

#### ۱. معماری Headless (جداسازی فرانت‌اند و بک‌اند)
مدوسا یک پلتفرم کاملاً Headless است. این یعنی بک‌اند (مدیریت محصولات، سفارشات، مشتریان و...) کاملاً از فرانت‌اند (ظاهر سایت) جداست. این به شما اجازه می‌دهد تا رابط کاربری (UI) را با هر فریم‌ورکی که دوست دارید (مثل Next.js, Gatsby, Vue, یا حتی اپلیکیشن موبایل با React Native) بسازید، بدون اینکه محدود به تم‌های از پیش ساخته شده باشید.

#### ۲. تجربه توسعه‌دهنده (DX) فوق‌العاده
مدوسا با **Node.js** و **TypeScript** نوشته شده است. اگر تیم شما با جاوااسکریپت/تایپ‌اسکریپت آشنا باشد، یادگیری و کار با مدوسا بسیار سریع و لذت‌بخش خواهد بود. معماری آن ماژولار است و کدنویسی در آن تمیز و استاندارد انجام می‌شود.

#### ۳. متن‌باز (Open-Source) و بدون وابستگی به فروشنده (No Vendor Lock-in)
برخلاف پلتفرم‌های SaaS مثل Shopify یا BigCommerce، در مدوسا شما مالک ۱۰۰٪ کد و داده‌های خود هستید. هیچ محدودیتی برای مهاجرت، تغییر هاست یا تغییر نحوه عملکرد سیستم ندارید. این موضوع برای شرکت‌هایی که نگران انحصار داده‌ها هستند، حیاتی است.

#### ۴. قابلیت توسعه‌پذیری بالا (Extensibility)
مدوسا یک سیستم پلاگین‌نویسی بسیار قدرتمند دارد. شما می‌توانید به راحتی درگاه‌های پرداخت محلی (مثل زرین‌پال یا نکست‌پی در ایران)، روش‌های حمل‌ونقل خاص، یا منطق‌های تجاری پیچیده (مثلاً تخفیف‌های شرطی خاص) را به عنوان پلاگین به سیستم اضافه کنید.

#### ۵. هزینه کمتر در مقیاس بزرگ (Lower TCO)
پلتفرم‌های SaaS با افزایش فروش، کارمزد تراکنش یا هزینه پلن‌های سازمانی (مثل Shopify Plus که ماهانه هزاران دلار هزینه دارد) را افزایش می‌دهند. مدوسا رایگان است و شما فقط هزینه زیرساخت (سرور، دیتابیس) و تیم توسعه خود را می‌پردازید که در مقیاس بزرگ بسیار به‌صرفه‌تر است.

#### ۶. عملکرد بالا (Performance)
به دلیل سبک بودن و عدم وجود بار اضافی (Bloatware) که در سیستم‌های قدیمی مثل Magento یا WooCommerce وجود دارد، مدوسا به طور ذاتی سریع‌تر است و به راحتی می‌تواند ترافیک بالا را مدیریت کند.


## چالش‌ها و معایب Medusa.js

#### ۱. نیاز مبرم به تیم فنی و توسعه‌دهنده
مدوسا یک سیستم «درگ-اند-دراپ» (Drag-and-Drop) برای کاربران غیرفنی نیست. برای راه‌اندازی، شخصی‌سازی و نگهداری آن، شما **حتماً** به توسعه‌دهندگان Full-stack یا بک‌اند نیاز دارید. این پلتفرم برای صاحبان کسب‌وکاری که می‌خواهند بدون کدنویسی فروشگاه بسازند، مناسب نیست.

#### ۲. مسئولیت مدیریت زیرساخت (در نسخه Self-hosted)
اگر از نسخه متن‌باز و خودمیزبان استفاده کنید، مسئولیت امنیت، بک‌آپ‌گیری، مدیریت دیتابیس (PostgreSQL)، Redis و به‌روزرسانی سرورها کاملاً بر عهده تیم شماست. (البته مدوسا اخیراً سرویس ابری Medusa Cloud را نیز ارائه کرده که این بار را کم می‌کند، اما هزینه دارد).

#### ۳. اکوسیستم کوچک‌تر نسبت به غول‌های بازار
تعداد پلاگین‌ها، افزونه‌ها و قالب‌های آماده مدوسا در مقایسه با Shopify یا WooCommerce بسیار کمتر است. ممکن است برای اتصال به یک سرویس خاص (مثلاً یک نرم‌افزار حسابداری خاص ایرانی)، مجبور شوید خودتان آن را از صفر توسعه دهید.

#### ۴. منحنی یادگیری (Learning Curve)
اگرچه DX مدوسا عالی است، اما درک معماری خاص آن (شامل مفاهیمی مثل Services, Repositories, Subscribers, و Loaders) برای توسعه‌دهندگانی که تازه وارد این فریم‌ورک می‌شوند، زمان‌بر است.



## معماری نسخه ۲  — نقشه بزرگ

قبل از اینکه دست به کد شوید، باید ذهنیت خود را با معماری جدید مدوسا همسو کنید. مدوسا v2 دیگر فقط یک مجموعه از APIها نیست؛ بلکه یک پلتفرم ماژولار و رویداد-محور (Event-Driven) است که برای مقیاس‌پذیری (Scalability) و نگهداری آسان (Maintainability) در بلندمدت طراحی شده است.

اگر به نقشه معماری زیر نگاه کنید، می‌بینید که مدوسا چگونه لایه‌های مختلف را از هم جدا کرده است:

```
┌─────────────────────────────────────────────────────┐
│                   Your Application                  │
│                                                     │
│   Next.js Storefront    Mobile App    Admin Panel   │
└──────────────┬──────────────┬──────────────┬────────┘
               │              │              │
               └──────────────┼──────────────┘
                              │ REST API
┌─────────────────────────────▼───────────────────────┐
│                    Medusa Server                    │
│                                                     │
│  ┌──────────┐  ┌──────────┐  ┌──────────────────┐  │
│  │  Routes  │  │Workflows │  │   Subscribers    │  │
│  └──────────┘  └──────────┘  └──────────────────┘  │
│                                                     │
│  ┌──────────┐  ┌──────────┐  ┌──────────────────┐  │
│  │ Products │  │  Orders  │  │  Custom Modules  │  │
│  │  Module  │  │  Module  │  │   (Your Code)    │  │
│  └──────────┘  └──────────┘  └──────────────────┘  │
│                                                     │
│              PostgreSQL + Redis                     │
└─────────────────────────────────────────────────────┘
```


چهار مفهوم اصلی که باید بشناسید:

**Routes** — نقاط ورودی API. هر فایل در `src/api` یک endpoint می‌شود.

**Workflows** — منطق تجاری پیچیده با قابلیت rollback. وقتی ثبت سفارش شامل ده مرحله است و مرحله هشتم خراب می‌شود، workflow می‌داند چطور به عقب برگردد.

**Subscribers** — گوش‌دهنده به رویدادها. وقتی سفارش ثبت شد (`order.placed`)، ایمیل بفرست، پیامک بزن، انبار را آپدیت کن.

**Modules** — واحدهای مستقل کد. هر چیزی که اضافه می‌کنید، به صورت ماژول است تا با آپدیت‌های مدوسا تداخلی پیدا نکند.](<برای تسلط بر این معماری، باید **چهار مفهوم کلیدی** زیر را عمیقاً درک کنید:

### ۱. Routes (مسیرهای API) — دروازه‌های ورودی
در مدوسا v2، سیستم مسیریابی (Routing) بازطراحی شده و الهام‌گرفته از مدرن‌ترین فریم‌ورک‌ها (مانند Next.js App Router) است. هر فایل در پوشه `src/api` به طور خودکار به یک Endpoint تبدیل می‌شود.
* **چرا مهم است؟** شما می‌توانید به راحتی Middlewareهای اختصاصی (برای احراز هویت، اعتبارسنجی داده‌ها با Zod، یا لاگ‌گیری) را به این مسیرها متصل کنید. Routes باید سبک باشند و وظیفه اصلی آن‌ها فقط دریافت درخواست، ارسال آن به یک Workflow و بازگرداندن پاسخ است.

### ۲. Workflows (گردش کارها) — قلب تپنده و هوشمند v2
این بزرگترین جهش مدوسا در نسخه ۲ است. Workflows برای مدیریت منطق تجاری پیچیده و چندمرحله‌ای طراحی شده‌اند و از الگوی **Saga Pattern** پشتیبانی می‌کنند. 
* **مثال واقعی:** فرض کنید فرآیند ثبت سفارش ۳ مرحله دارد: ۱. رزرو کالا در انبار، ۲. کسر مبلغ از کارت مشتری، ۳. صدور فاکتور. اگر مرحله ۲ (پرداخت) به دلیل موجودی ناکافی شکست بخورد، Workflow به طور خودکار تابع `compensate` (جبران) مرحله ۱ را صدا می‌زند تا کالای رزرو شده را دوباره به انبار برگرداند!
* **چرا مهم است؟** این ویژگی باعث می‌شود سیستم شما در برابر خطا (Fault-tolerant) باشد و دیگر نگران داده‌های نیمه‌کاره یا "Zombie Orders" نباشید.

### ۳. Subscribers (مشترکین) — شنودگرهای رویداد (Event-Driven)
همه چیز نباید همزمان (Synchronous) اتفاق بیفتد. Subscribers به شما اجازه می‌دهند تا به رویدادهای (Events) خاصی که در سیستم رخ می‌دهند، واکنش نشان دهید.
* **مثال واقعی:** وقتی رویداد `order.placed` صادر می‌شود، یک Subscriber می‌تواند همزمان چند کار را به صورت غیرهمگام (Asynchronous) انجام دهد: ارسال ایمیل تأیید به مشتری، ارسال نوتیفیکیشن به کانال Slack تیم فروش، و به‌روزرسانی سیستم CRM.
* **چرا مهم است؟** این کار باعث **Decoupling** (جداسازی) می‌شود. منطق اصلی ثبت سفارش معطل ارسال ایمیل نمی‌ماند و سرعت پاسخ‌دهی API برای کاربر نهایی در بالاترین حد باقی می‌ماند.

### ۴. Modules (ماژول‌ها) — انقلاب طراحی مبتنی بر دامنه (DDD)
در نسخه‌های قدیمی، کدها تا حدی در هم تنیده بودند. اما در v2، مدوسا بر اساس **Domain-Driven Design** بازنویسی شده است. هر قابلیت (مثل محصولات، سفارشات، کاربران یا قیمت‌گذاری) یک "ماژول" مستقل با دیتابیس، سرویس‌ها و منطق مخصوص به خود است.
* **چرا مهم است؟** 
  1. **توسعه امن:** شما می‌توانید ماژول‌های سفارشی (Custom Modules) خود را (مثلاً یک ماژول برای "سیستم وفاداری مشتریان") بسازید بدون اینکه نگران باشید که با آپدیت‌های آینده مدوسا تداخل پیدا کند.
  2. **قابلیت جایگزینی:** اگر منطق پیش‌فرض ماژول "محصولات" مدوسا نیازهای شما را برآورده نمی‌کند، می‌توانید کل ماژول Product را با ماژول اختصاصی خودتان جایگزین کنید، در حالی که بقیه سیستم بدون هیچ تغییری به کار خود ادامه می‌دهد!>


##  نصب و راه‌اندازی در فاز develope

### پیش‌نیازها

قبل از شروع، مطمئن شوید این‌ها روی سیستمتان نصب است:

```bash
node --version   # باید 20 یا بالاتر باشد
psql --version   # PostgreSQL 15+
git --version
```
### ساخت پروژه

یک دستور، همه چیز را می‌سازد:

```bash
npx create-medusa-app@latest my-shop
```

بعد از اجرا، یک wizard تعاملی شروع می‌شود:

```
? What's the name of your project? › my-shop
? Would you like to create the project in a different directory? › No
? Would you like to seed the database with demo data? › Yes
```

> 💡 **نکته:** گزینه seed داده را انتخاب کنید — چند محصول نمونه  به دیتابیس اضافه میشود که برای تست خیلی کمک می‌کنه.

### وصل کردن دیتابیس


اگر PostgreSQL را تازه نصب کردید، ابتدا یک database بسازید:

```bash
sudo -u postgres psql
CREATE DATABASE my_shop_db;
CREATE USER medusa_user WITH ENCRYPTED PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE my_shop_db TO medusa_user;
\q
```


بعد از نصب، فایل `.env` در ریشه پروژه ساخته می‌شود. آن را باز کنید و مانند نمونه ی زیر پر کنید:

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



### اجرای سرور

```bash
cd my-shop
npx medusa develop
```

اگر همه چیز درست باشد، خروجی زیر را می‌بینید:

```
info:    Server is ready on port: 9000
info:    Admin UI served on: http://localhost:9000/app
```

🎉 تبریک! سرور Medusa روی پورت ۹۰۰۰ در حال اجراست.


###  پنل ادمین — محصول و Region بسازید

مرورگر را باز کنید و به `http://localhost:9000/app` بروید.

#### ورود به پنل

اگر گزینه seed را انتخاب کردید، اطلاعات ورود پیش‌فرض این است:

```
Email:    admin@medusa-test.com
Password: supersecret
```

#### ساخت محصول

حالا چند محصول می‌سازیم:

1. از منوی سمت چپ **Products** را انتخاب کنید
2. روی **New Product** کلیک کنید


ساختار داده محصول در پشت صحنه این‌گونه است:

```json
{
  "title": "هودی خاکستری کلاسیک",
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



### فرانت‌اند — Next.js Starter

Medusa یک Next.js starter آماده دارد که با Medusa v2 کار می‌کند. آن را در یک terminal جداگانه نصب کنید:

```bash
# در دایرکتوری جدا از بک‌اند
npx create-next-app -e https://github.com/medusajs/nextjs-starter-medusa my-shop-storefront
cd my-shop-storefront
```

#### تنظیم متغیرهای محیطی

فایل `.env.local` را بسازید:

```bash
# .env.local
NEXT_PUBLIC_MEDUSA_BACKEND_URL=http://localhost:9000
NEXT_PUBLIC_BASE_URL=http://localhost:8000
NEXT_PUBLIC_DEFAULT_REGION=ir
REVALIDATE_WINDOW=600
```

#### اجرای فرانت‌اند

```bash
npm install
npm run dev
```

فرانت‌اند روی `http://localhost:8000` بالا می‌آید.

### چطور محصولات از بک‌اند می‌آیند؟

در استارتر، یک **Medusa JS Client** آماده است. نگاهی به ساختار fetch محصولات بیندازید:

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

این کد:
1. به `/store/products` API در بک‌اند درخواست می‌زند
2. با `region_id` ایران، قیمت‌ها به ریال برمی‌گردند
3. از Next.js `tags` برای cache revalidation استفاده می‌کند

در صفحه محصولات (`app/[countryCode]/(main)/store/page.tsx`) می‌توانید این تابع را صدا بزنید و محصولاتتان را ببینید.



## ۱. Routes (مسیرهای API) — دروازه‌های ورودی



Routes در مدوسا v2 **دروازه ورودی درخواست‌ها** هستند. وظیفه Route فقط دریافت درخواست، اعتبارسنجی ورودی و ارسال آن به Workflow یا Service است.هر مسیر یک فایل است و هر فایل مجموعه‌ای از متدهای HTTP را صادر می‌کند.  
این معماری باعث می‌شود:

- ساخت API بسیار سریع و بدون نیاز به ثبت دستی مسیرها باشد
- ساختار پروژه تمیز و قابل پیش‌بینی بماند
- توسعه‌دهنده فقط روی منطق تجاری تمرکز کند

### ساختار پوشه و تبدیل خودکار فایل‌ها به Endpoint

هر فایل `route.ts` یا `route.js` در مسیر زیر:

```
src/api/<path>/route.ts
```

به‌طور خودکار تبدیل به یک Endpoint می‌شود.  
مثلاً:

```
src/api/products/route.ts   →   /products
src/api/brands/[id]/route.ts → /brands/:id
```

###  مثال  از یک Route ساده

```ts
import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

export const GET = (req: MedusaRequest, res: MedusaResponse) => {
  res.json({ message: "Hello from Medusa v2!" })
}
```

این فایل به‌طور خودکار مسیر `/hello` را ایجاد می‌کند.

### ساختار پوشه‌ها

```
src/
  api/
    store/
      products/
        route.ts    → GET /store/products
    admin/
      custom/
        route.ts    → GET /admin/custom  (فقط با احراز هویت ادمین)
    custom/
      hello/
        route.ts    → GET /custom/hello  (عمومی)
```

### مثال یک endpoint ساده

بیایید یک API endpoint بسازیم که آمار محصولات را برمی‌گرداند:

```typescript
// src/api/store/stats/route.ts
import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"

export const GET = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  // query از container گرفته می‌شود
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)

  const { data: products } = await query.graph({
    entity: "product",
    fields: ["id", "title", "status"],
    filters: { status: "published" },
  })

  return res.json({
    message: "آمار فروشگاه",
    total_published_products: products.length,
    products: products.map((p) => ({
      id: p.id,
      title: p.title,
    })),
  })
}
```

#### تست با curl

```bash
curl http://localhost:9000/store/stats
```

#### خروجی:

```json
{
  "message": "آمار فروشگاه",
  "total_published_products": 3,
  "products": [
    { "id": "prod_01J...", "title": "هودی خاکستری کلاسیک" },
    { "id": "prod_01K...", "title": "تی‌شرت سفید ساده" }
  ]
}
```

### مثال یک POST endpoint با validation

```typescript
// src/api/store/newsletter/route.ts
import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { z } from "zod"

// تعریف schema برای validation
const NewsletterSchema = z.object({
  email: z.string().email("ایمیل معتبر نیست"),
  name: z.string().min(2, "نام باید حداقل ۲ کاراکتر باشد"),
})

export const POST = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  const parsed = NewsletterSchema.safeParse(req.body)

  if (!parsed.success) {
    return res.status(400).json({
      error: "اطلاعات نادرست است",
      details: parsed.error.flatten().fieldErrors,
    })
  }

  const { email, name } = parsed.data

  // اینجا می‌توانید به سرویس email marketing وصل شوید
  console.log(`عضو جدید خبرنامه: ${name} — ${email}`)

  return res.status(201).json({
    success: true,
    message: `${name} عزیز، با موفقیت عضو خبرنامه شدید!`,
  })
}
```



###  اتصال Route به Workflow — معماری تمیز و قابل تست

در Medusa v2، هرگز  **Route نباید منطق تجاری داشته باشد**.  
تمام منطق باید در Workflow یا Service قرار گیرد.

Route فقط:
1. ورودی را می‌گیرد
2. آن را اعتبارسنجی می‌کند
3. Workflow را اجرا می‌کند
4. پاسخ را برمی‌گرداند

این تفکیک باعث می‌شود:
- تست‌نویسی ساده‌تر شود
- مسیرها سبک و قابل نگهداری بمانند
- منطق تجاری قابل reuse باشد



### ۷Middlewareها — احراز هویت، لاگ، Rate Limit

شما می‌توانید برای هر مسیر Middleware اضافه کنید:
- احراز هویت Admin
- احراز هویت Customer
- لاگ‌گیری
- محدودیت درخواست‌ها

Middlewareها باید **سبک** باشند و فقط نقش محافظ یا فیلتر را داشته باشند.





## ۲. Workflows (گردش کارها) — قلب تپنده و هوشمند v2


Workflows یک **موتور اورکستراسیون (Orchestration Engine)** داخلی در Medusa v2 هستند که برای مدیریت عملیات چندمرحله‌ای، پیچیده و حساس طراحی شده‌اند.

در عمل، Workflowها:
- عملیات را به **گام‌های کوچک و مستقل** تقسیم می‌کنند
- هر گام را **ردیابی** می‌کنند
- در صورت شکست، به‌صورت خودکار **جبران (compensate)** انجام می‌دهند
- اجرای عملیات را **قابل مشاهده، قابل تست و قابل مانیتور** می‌کنند


فرض کنید وقتی سفارش ثبت می‌شود، باید:

1. موجودی کالا کاهش یابد
2. پرداخت تایید شود
3. ایمیل تاییدیه ارسال شود
4. انبار اطلاع‌رسانی شود

اگر مرحله ۳ خراب شد، مراحل ۱ و ۲ باید برگردند. در کد معمولی، این را با try/catch پیچیده و پر از باگ پیاده می‌کنید.




مدوسا با **Workflows** این مشکل را حل کرده:

```typescript
// src/workflows/process-order.ts
import {
  createStep,
  createWorkflow,
  StepResponse,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk";

// هر مرحله یک Step مجزاست
const decreaseInventoryStep = createStep(
  "decrease-inventory",
  async (input: { productId: string; quantity: number }, { container }) => {
    // منطق کاهش موجودی...
    
    // برای Rollback، مقدار قبلی را برمی‌گردانیم
    return new StepResponse("done", { productId: input.productId, quantity: input.quantity });
  },
  // تابع Compensate — اگر مرحله‌ای بعد از این خراب شد، اینجا اجرا می‌شود
  async (previousData, { container }) => {
    // موجودی را به حالت قبل برگردان
  }
);

// ورک‌فلو همه Step ها را هماهنگ می‌کند
export const processOrderWorkflow = createWorkflow(
  "process-order",
  (input: { orderId: string }) => {
    decreaseInventoryStep({ productId: "...", quantity: 1 });
    // ... بقیه مراحل
    
    return new WorkflowResponse("Order processed");
  }
);
```

این دقیقاً همان چیزی است که سیستم‌های enterprise‌ level برای امنیت داده‌های مالی نیاز دارند.


  

### **مثال واقعی: Checkout Workflow**

**سناریو:** ۱. رزرو موجودی ۲. پرداخت ۳. صدور فاکتور

  اما اگر پرداخت شکست بخورد: رزرو موجودی باید آزاد شود و هیچ داده نیمه‌کاره‌ای نباید بماند


#### **کد کامل Workflow**


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

  
**تحلیل دقیق Workflow بالا:**
**۱. گام رزرو موجودی:** موجودی رزرو می‌شود سپس  شناسه رزرو ذخیره می‌شود و اگر پرداخت شکست بخورد → `compensate` رزرو را آزاد می‌کند
**۲. گام پرداخت:** پرداخت انجام می‌شود و شناسه تراکنش ذخیره می‌شو. اگر صدور فاکتور شکست بخورد → پرداخت برگشت می‌خورد
**۳. گام صدور فاکتور:** فاکتور صادر می‌شود( این گام جبران ندارد چون آخرین مرحله است)



#### **چرا این معماری فوق‌العاده است؟**

**۱. Fault-tolerant**
سیستم در برابر خطا مقاوم است.

**۲. Atomic-like Behavior**
رفتار شبیه تراکنش‌های دیتابیس، اما در سطح سرویس‌های مختلف.

**۳. قابل تست**
هر Step را می‌توان جداگانه تست کرد.

**۴. قابل مشاهده**
می‌توان وضعیت هر Workflow را در DB دید.

**۵. قابل توسعه**
به‌راحتی می‌توان گام‌های جدید اضافه کرد:
- ارسال ایمیل
- ثبت در CRM
- اتصال به ERP


## ۳. Subscribers (مشترکین) — شنودگرهای رویداد (Event-Driven)

Subscribers  توابعی **غیرهمگام** هستند که هنگام انتشار یک رویداد (Event) اجرا می‌شوند و به شما اجازه می‌دهند کارهای جانبی مثل ارسال ایمیل، نوتیفیکیشن، یا همگام‌سازی با سرویس‌های خارجی را **خارج از جریان اصلی** انجام دهید. این معماری باعث **Decoupling**، **افزایش سرعت API** و **مقیاس‌پذیری** می‌شود.
Subscribers  نقش **شنودگر رویدادها** را دارند. هر زمان یک Event منتشر شود—مثل `order.placed`—تمام Subscriberهایی که به آن گوش می‌دهند، به‌صورت **Async** اجرا می‌شوند.
  
### ساخت Subscriber — ساختار استاندارد

Medusa v2 انتظار دارد Subscriberها در مسیر زیر قرار بگیرند:

```
src/subscribers/
```

هر Subscriber شامل دو بخش است:

1. **تابع اصلی** (async) که هنگام وقوع رویداد اجرا می‌شود
    
2. **شیء config** که مشخص می‌کند این Subscriber به کدام Event گوش می‌دهد

 هر اتفاق مهم در مدوسا یک event منتشر می‌کند. شما می‌توانید روی هر event مشترک شوید:

```typescript
// src/subscribers/order-notification.ts
import { SubscriberArgs, type SubscriberConfig } from "@medusajs/framework";

export default async function handleOrderPlaced({
  event: { data },
  container,
}: SubscriberArgs<{ id: string }>) {
  // ارسال SMS به مشتری
  // ارسال پیام به کانال Slack مدیریت
  // ثبت در سیستم CRM
  console.log("سفارش جدید با شناسه:", data.id);
}

export const config: SubscriberConfig = {
  event: "order.placed",
};
```

هیچ تغییری در کد اصلی نیست. فقط یک فایل اضافه کردید و الان به هر سفارش جدید واکنش نشان می‌دهید.

### مثال: Subscriber برای رویداد `order.placed`

ts

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

  


### Event Bus — قلب سیستم Event‑Driven
Medusa از Event Bus برای مدیریت انتشار و اجرای رویدادها استفاده می‌کند.
- **Local Event Module** به‌صورت پیش‌فرض فعال است (مناسب توسعه).
- برای Production، **Redis Event Module** توصیه می‌شود.

#### متدهای مهم Event Bus
Event Bus از طریق `container.resolve(Modules.EVENT_BUS)` قابل دسترسی است.


| متد | کاربرد |

|-----|--------|

| `emit()` | انتشار یک یا چند Event |

| `subscribe()` | ثبت Subscriber جدید |

| `unsubscribe()` | حذف Subscriber |

| `releaseGroupedEvents()` | انتشار گروهی رویدادها (برای تراکنش‌های توزیع‌شده) |

  

#### مثال: انتشار Event سفارشی

```ts

const eventModuleService = container.resolve(Modules.EVENT_BUS)

  

await eventModuleService.emit({

name: "user.created",

data: { user_id: "user_123" },

})

```

این رویداد تمام Subscriberهایی که به `user.created` گوش می‌دهند را فعال می‌کند.


###  Best Practices:

1) Subscriberها باید **Idempotent** باشند
چون Event Bus ممکن است یک Event را بیش از یک‌بار تحویل دهد.
(این رفتار در معماری Pub/Sub رایج است — استنتاج از مستندات Event Bus)

2) کارهای حیاتی را در Subscriber انجام ندهید
اگر عملی بخشی از جریان اصلی است، از **Workflow Hooks** استفاده کنید.

3) لاگ‌گذاری و Retry را جدی بگیرید
برای سرویس‌های خارجی (ایمیل، CRM، Slack) احتمال خطا وجود دارد.

4) از Redis Event Module در Production استفاده کنید. برای مقیاس‌پذیری و پایداری بهتر.




###  چالش‌ها و محدودیت‌ها

- **ترتیب اجرای Subscriberها تضمین‌شده نیست.**
- **تحویل چندباره** ممکن است رخ دهد → Idempotency ضروری است.
- اگر Event Payload ناقص باشد، Subscriber باید خطا را مدیریت کند.
(این موارد از معماری Pub/Sub و رفتار Event Bus استنباط شده‌اند.)


## ۴. Modules (ماژول‌ها) — انقلاب طراحی مبتنی بر دامنه (DDD)


**ماژول‌ها در Medusa v2 قلب معماری جدید هستند؛ هر قابلیت یک ماژول مستقل با مدل داده، سرویس، API و چرخه‌عمر جداگانه است و می‌تواند بدون تأثیر روی بخش‌های دیگر، توسعه، جایگزین یا سفارشی‌سازی شود.**  
 هر قابلیت تجاری پیشفرض—مثل محصولات، سفارشات، پرداخت، موجودی، مشتریان—به‌صورت یک **ماژول مستقل** پیاده‌سازی شده است. همچینیی امکان ساخت ماژول های سفارشی نیز وجود دارد.
 درواقع هر ماژول:
- مالک منطق دامنه خود است
- API و سرویس اختصاصی دارد
- دیتامدل و مایگریشن‌های خودش را مدیریت می‌کند
- بدون وابستگی مستقیم به ماژول‌های دیگر کار می‌کند
- قابل **جایگزینی کامل** با نسخه سفارشی شماست 

این استقلال باعث می‌شود توسعه‌دهندگان بتوانند روی یک حوزه خاص کار کنند بدون اینکه تغییراتشان روی سایر بخش‌ها اثر بگذارد.


### چرا Medusa v2 به سمت معماری ماژولار رفت؟

#### ۱) حذف وابستگی‌های بین‌دامنه
در نسخه‌های قدیمی‌تر، منطق دامنه‌ها در هسته سیستم در هم تنیده بود. اما در v2 تمام وابستگی‌های بین‌دامنه حذف شده و هر ماژول فقط از طریق **اینترفیس‌های مشخص** با دیگر بخش‌ها ارتباط دارد.

#### ۲) توسعه امن و پایدار
هر ماژول یک پکیج مستقل NPM است و نسخه‌بندی جداگانه دارد. این یعنی آپگرید یک ماژول، سیستم را نمی‌شکند.

#### ۳) قابلیت جایگزینی کامل
اگر منطق پیش‌فرض Product برای شما مناسب نیست، می‌توانید کل ماژول را با نسخه خودتان جایگزین کنید بدون اینکه Checkout، Inventory یا Order تحت تأثیر قرار بگیرند.

#### ۴) ارتباط ماژول‌ها از طریق Workflows
منطق چندمرحله‌ای (مثل checkout، پرداخت، رزرو موجودی) دیگر داخل ماژول‌ها نیست؛ بلکه در **Workflows** مدیریت می‌شود.  
این باعث می‌شود ماژول‌ها تمیز و تک‌دامنه‌ای باقی بمانند.


### ساختار یک ماژول در Medusa v2

یک ماژول معمولاً شامل این بخش‌هاست:

- **models/** → تعریف مدل‌های داده
- **services/** → منطق دامنه و عملیات اصلی
- **routes/** → APIهای اختصاصی
- **migrations/** → تغییرات دیتابیس
- **index.ts** → ثبت ماژول و خروجی سرویس‌ها

Medusa به هر ماژول یک اتصال PostgreSQL تزریق می‌کند، اما شما می‌توانید دیتابیس‌های دیگر را نیز در ماژول سفارشی خود متصل کنید.



### مثال: ساخت یک ماژول Loyalty (سیستم امتیاز مشتریان)

#### ۱) تعریف مدل

```ts
import { model } from "@medusajs/framework/utils"

export const LoyaltyPoint = model.define("loyalty_point", {
  id: model.id().primaryKey(),
  customer_id: model.text().notNull(),
  balance: model.integer().default(0),
})
```

#### ۲) سرویس ماژول

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

#### ۳) route اختصاصی

```ts
export const GET = async (req, res) => {
  const service = req.scope.resolve("loyaltyService")
  const balance = await service.getBalance(req.params.id)
  res.json({ balance })
}
```

#### ۴) اتصال ماژول در medusa-config.js

```ts
modules: {
  loyalty: {
    resolve: "./src/modules/loyalty",
  },
}
```


### مثال2: ذخیره تعداد بازدید محصولات


فرض کنید می‌خواهید تعداد بازدید محصولات را نگه دارید. اشتباه: مستقیم به جدول product دست بزنید. درست: یک ماژول اختصاصی بسازید.

#### **۱. مدل داده** (`src/modules/product-stats/models/stat.ts`):

```typescript
import { model } from "@medusajs/framework/utils";

export const ProductStat = model.define("product_stat", {
  id: model.id().primaryKey(),
  product_id: model.text(),
  views: model.number().default(0),
});
```

#### **۲. سرویس** (`src/modules/product-stats/service.ts`):

```typescript
import { MedusaService } from "@medusajs/framework/utils";
import { ProductStat } from "./models/stat";

// این کلاس به طور خودکار تمام عملیات CRUD را می‌سازد
export default class ProductStatsService extends MedusaService({
  ProductStat,
}) {}
```

#### **۳. ثبت در پیکربندی** (`medusa-config.ts`):

```typescript
modules: [
  {
    resolve: "./src/modules/product-stats",
  },
]
```

#### **۴. اجرای migration:**

```bash
npx medusa db:migrate
```

حالا یک جدول مستقل در دیتابیس دارید که با آپدیت‌های مدوسا تداخل ندارد.


### Module Links — وصل کردن دنیاهای مجزا

ماژول‌ها کاملاً از هم جدا هستند. برای Join کردن آن‌ها، مدوسا مفهوم **Link** را معرفی کرده:

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

بعد از تعریف لینک، موتور `query.graph` می‌داند این دو entity به هم وصل‌اند:

```typescript
const { data: products } = await query.graph({
  entity: "product",
  fields: [
    "id",
    "title",
    "product_stat.views", // ← از ماژول دیگر، بدون یک خط SQL
  ],
  options: {
    sort: { "product_stat.views": "DESC" }, // مرتب‌سازی بر اساس بازدید
    take: 10,
  },
});
```

این **Remote Query** — ترکیب داده از ماژول‌های مختلف بدون SQL — یکی از قدرتمندترین ویژگی‌های مدوسا v2 است.





### Best Practices:

- **ماژول را تک‌دامنه‌ای نگه دارید**؛ هر ماژول فقط یک مسئولیت.
- **از سرویس‌ها به‌عنوان تنها منبع منطق  استفاده کنید**
- **API را کوچک نگه دارید**؛ فقط ورودی/خروجی را مدیریت کند.
- **برای عملیات چندمرحله‌ای Workflow بسازید** تا ماژول‌ها تمیز بمانند.
- **نسخه‌بندی مستقل** برای ماژول‌های سفارشی رعایت کنید.





## ۵. Admin panel Extension — پنل مدیریت با قابلیت توسعه


مدوسا یک پنل ادمین حرفه‌ای همراه خود دارد. اما می‌توانید بدون تغییر یک خط از کد اصلی آن، ویجت‌های اختصاصی اضافه کنید. مثلا در اینجا یک ویجت برای product views در پنل ادمین مینویسیم:

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
          <Heading level="h2">آمار بازدید</Heading>
          <Text size="small" className="text-ui-fg-subtle">
            تعداد دفعات مشاهده این محصول
          </Text>
        </div>
        <div className="text-3xl font-bold text-blue-600">
          {isLoading ? "..." : views?.toLocaleString("fa-IR")}
        </div>
      </div>
    </Container>
  );
};

// این ویجت را کجا نشان بدهیم؟
export const config = defineWidgetConfig({
  zone: "product.details.after",
});

export default ProductViewsWidget;
```

سرور را restart کنید، بروید روی صفحه یک محصول در ادمین — ویجت شما در پایین صفحه ظاهر می‌شود. با همان ظاهر و طراحی بقیه پنل.




## جمع‌بندی

در این پست، **Medusa.js v2** را از زوایای مختلف بررسی کردیم — از فلسفه Headless و معماری ماژولار گرفته تا پیاده‌سازی عملی Workflows، Custom Modules و Admin Extensions.

اگر بخواهم همه چیز را در چند جمله خلاصه کنم:

> **مدوسا یک فریم‌ورک نیست که با آن فروشگاه بسازید؛ یک موتور است که فروشگاه شما روی آن سوار می‌شود.**

این تفاوت ظریف اما بنیادین، دلیل اصلی محبوبیت مدوسا میان تیم‌های فنی است. شما دیگر مجبور نیستید منطق تجاری خود را در قالب‌های از پیش تعیین‌شده جا دهید — بلکه این پلتفرم است که خود را با نیازهای شما تطبیق می‌دهد.

### چرا الان وقت مهاجرت است؟

- 🏗️ **معماری v2** با Workflows و Saga Pattern، پیچیده‌ترین سناریوهای تجاری را بدون باگ مدیریت می‌کند
- 🔌 **ماژولار بودن** یعنی توسعه بدون ترس از شکستن هسته یا تداخل با آپدیت‌ها
- 💰 **مالکیت کامل** کد و داده‌ها، بدون وابستگی به فروشنده و کارمزدهای پلکانی

### قدم بعدی چیست؟

اگر تا اینجا همراه بودید، احتمالاً ایده‌های زیادی برای پروژه بعدی‌تان گرفته‌اید. پیشنهاد می‌کنم:

1. **همین الان شروع کنید** — دستور `npx create-medusa-app@latest` را اجرا کنید و با seed data بازی کنید
2. **مستندات رسمی** را در [docs.medusajs.com](https://docs.medusajs.com) عمیق‌تر بخوانید
3. **یک ماژول کوچک** برای پروژه خودتان بسازید — مثلاً سیستم امتیازدهی مشتریان یا مدیریت باشگاه وفاداری
4. **به جامعه مدوسا بپیوندید** — دیسکورد و گیت‌هاب پروژه پر از ایده‌های ناب و پاسخ سوالات فنی است

اگر این پست برایتان مفید بود، خوشحال می‌شوم تجربه‌تان از کار با مدوسا یا چالش‌هایی که در مسیر توسعه فروشگاه با آن‌ها روبرو شده‌اید را در کامنت‌ها بنویسید. 

**سؤالی دارید؟ در بخش نظرات بپرسید... 🚀

