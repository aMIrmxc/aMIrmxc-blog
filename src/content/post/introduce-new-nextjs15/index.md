---
title: "Next.js 15 برسی "
description: "هر آنچه برای ارتقاء به Next.js 15 نیاز دارید؛ از Codemod خودکار تا breaking changeهای caching و async APIها"
publishDate: "14 Aug 2024"
updatedDate: "03 Mar 2025"
tags: ["Nextjs", "Migration", "React"]
---



# Next.js 15 — راهنمای جامع و کامل برای آموزش

Next.js 15 منتشر شده و مانند هر نسخه اصلی دیگر، شامل **قابلیت‌های مهم جدید** و **breaking change‌ های تأثیرگذار** است. این نسخه روی عملکرد، DX (Developer Experience)، و مدل رندرینگ تغییرات بنیادی ایجاد کرده که دانستن آن‌ها برای هر توسعه‌دهنده ضروری است.

در این آموزش، موارد زیر را به‌صورت کامل پوشش می‌دهیم:

* سازوکار upgrade کردن پروژه‌ها
* ابزار رسمی Next.js برای مهاجرت
* لیست کامل breaking change‌ها
* مثال‌های توضیحی برای درک بهتر
* دلیل ایجاد هر تغییر و تأثیر آن روی workflow توسعه










## Breaking Change‌ های مهم Next.js 15

در ادامه مهم‌ترین breaking change این نسخه را کاملاً بررسی می‌کنیم.


### تغییرات Caching — بزرگترین اصلاح در Next.js 15

یکی از جدی‌ترین شکایت‌ها از Next.js 14، **caching بیش از حد تهاجمی (aggressive caching)** بود. این موضوع باعث رفتارهای غیرقابل پیش‌بینی، باگ‌های پنهان و مشکلات در زمان توسعه می‌شد.

Next.js 15 این مشکل را **به‌صورت بنیادی اصلاح کرده** و کنترل کامل را دوباره به توسعه‌دهنده برگردانده است.

برای همین بسیاری این تغییر را **بزرگ‌ترین پیروزی نسخه 15** می‌دانند.



  رفتار جدید Fetch — بدون Cache پیش‌فرض

در Next.js 14، `fetch()` در Server Components در حالت **cache-first** عمل می‌کرد.
یعنی حتی اگر شما چنین قصدی نداشتید، Next.js داده را cache می‌کرد و همان داده را برای تمام رندرهای بعدی برمی‌گرداند.


 مشکل نسخه 14:

* آپدیت‌های API دیده نمی‌شدند
* دیتا stale می‌شد
* رفتار پروژه غیرقابل پیش‌بینی بود
* توسعه‌دهندگان مجبور بودند دائماً `cache: 'no-store'` اضافه کنند

 Next.js 15 این رفتار را اصلاح کرد:

**دیگر fetch به‌صورت پیش‌فرض cache نمی‌شود.**



 قبل (Next.js 14):

```javascript
// این درخواست به صورت خودکار cache می‌شد
const data = await fetch('https://api.example.com/data');
```

 بعد (Next.js 15):

```javascript
// دیگر به‌صورت پیش‌فرض cache نمی‌شود
const data = await fetch('https://api.example.com/data');
```

 اگر همچنان بخواهید cache کنید:

```javascript
const cachedData = await fetch('https://api.example.com/data', {
  cache: 'force-cache'
});
```

* حالا caching اختیاری شده، نه اجباری
* شما کاملاً کنترل دارید که چه چیزی cache شود
* رفتار fetch اکنون بسیار شفاف‌تر و قابل‌پیش‌بینی است



#### API Route و Route Handler ها — دیگر Cache نمی‌شوند

در نسخه قبلی، بسیاری از توسعه‌دهندگان گزارش می‌دادند که API Route ها (مثل `/api/...`) به‌طور ناخواسته cache می‌شدند.
این رفتار غیرمعمول و مشکل‌ساز بود، مخصوصاً زمانی که API قرار بود داده جدید را برگرداند.

در Next.js 15 این مشکل حل شده:




 نسخه 14:

```javascript
// app/api/users/route.js
export async function GET() {
  // این response ناخواسته cache می‌شد
  return Response.json({ users: await getUsers() });
}
```

 نسخه 15 (رفتار صحیح):

```javascript
// app/api/users/route.js
export async function GET() {
  // دیگر cache نمی‌شود
  return Response.json({ users: await getUsers() });
}
```

 اگر بخواهید cache را فعال کنید:

```javascript
export async function GET() {
  return Response.json(
    { users: await getUsers() },
    {
      headers: {
        'Cache-Control': 'max-age=60' // 60 ثانیه cache
      }
    }
  );
}
```


* رفتار API Routes حالا کاملاً استاندارد است
* هیچ caching ناخواسته یا پنهان وجود ندارد
* شما تصمیم می‌گیرید، نه فریم‌ورک


### کاهش Cache در Client Router

در Next.js 14، وقتی کاربر در کلاینت بین صفحات جابه‌جا می‌شد، Router caching برای route های dynamic تا **30 ثانیه** فعال بود.
این رفتار باعث می‌شد صفحه دیر به‌روزرسانی شود یا داده جدید نمایش داده نشود.

 Next.js 15 این مقدار را به 0 ثانیه کاهش داد.

یعنی:

* همه navigation‌های dynamic همیشه fresh هستند
* صفحه از داده‌های جدید استفاده می‌کند
* تجربه کاربری قابل‌پیش‌بینی‌تر است


 اگر بخواهید رفتار قبلی را برگردانید:

```javascript
// next.config.js
module.exports = {
  experimental: {
    staleTimes: {
      dynamic: 30 // seconds
    }
  }
}
```

 نکات مهم:

* این مقدار در حالت پیش‌فرض 0 است
* فقط در صورت نیاز باید آن را افزایش دهید
* افزایش stale time برای static-like pages مناسب است




### Async Request APIs

در Next.js 15، تمام APIهای مرتبط با درخواست (Request APIs) **async** شده‌اند:

* headers()
* cookies()
* params
* searchParams


 هدف: **Static Rendering بیشتر و هوشمندتر**

وقتی این APIها async باشند، Next.js می‌تواند:

* بفهمد کدام صفحات واقعاً به داده‌های dynamic نیاز دارند
* کدام صفحات کاملاً static هستند و می‌توانند cache شوند
* محاسبات را deferred کند تا performance بهتر شود

این تغییر در آینده برای **Partial Rendering** و **Streaming بهتر** نیز اهمیت دارد.



 قبل (Next.js 14):

```javascript
import { headers } from 'next/headers';

export default function Page() {
  const headerValues = headers();
  return <div>...</div>;
}
```

 بعد (Next.js 15):

```javascript
import { headers } from 'next/headers';

export default async function Page() {
  const headerValues = await headers();
  return <div>...</div>;
}
```


### Dynamic Route

در Next.js 15، حتی `params` نیز دیگر یک object ساده نیست و باید `await` شود.

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


* این تغییر روی تقریبا تمام صفحات dynamic تأثیر می‌گذارد
* تمامی page‌های دارای route parameters باید async شوند
* اگر await نکنید، با type error یا undefined مواجه خواهید شد







##  Feature های جدید و بهبودها

### پشتیبانی از React 19

React 19 RC حالا کاملاً در Next.js 15 پشتیبانی میشه.
**مثال hook جدید `use` برای promiseها:**

```javascript
import { use } from 'react';

function UserProfile({ userPromise }) {
  const user = use(userPromise);
  return <div>{user.name}</div>;
}
```


### Turbopack برای Dev

```bash
npm run dev -- --turbo
```

**مزایا:**

* تا 10 برابر سریع‌تر startup
* تا 99.8٪ سریع‌تر code updateها


### Static Route Indicator

ابزاری برای نمایش static/dynamic بودن صفحات در development:

```javascript
// next.config.js
module.exports = {
  devIndicators: {
    buildActivity: true,
    buildActivityPosition: 'bottom-right',
  }
}
```


### API جدید `after()`

اجرای کد بعد از ارسال response به client:

```javascript
import { unstable_after as after } from 'next/server';

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

**فعال‌سازی:**

```javascript
module.exports = { experimental: { after: true } }
```


### Async Request APIs

Headers، cookies، params و searchParams حالا **آسنکرون هستند** و promise برمی‌گردانند.

قبل (Next.js 14):

```javascript
import { headers } from 'next/headers';

export default function Page() {
  const headerValues = headers();
  return <div>...</div>;
}
```

حالا (Next.js 15):

```javascript
import { headers } from 'next/headers';

export default async function Page() {
  const headerValues = await headers();
  return <div>...</div>;
}
```

مثال Dynamic Route:

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

این تغییر اجازه میده static rendering بهتر و بهینه‌تر انجام بشه و استفاده از dynamic API ها بدون blocking کار کنه.



### کامپوننت `<Form>` بهبود یافته

```javascript
import Form from 'next/form';

export default function SearchForm() {
  return (
    <Form action="/search">
      <input name="query" placeholder="جست‌وجو..." />
      <button type="submit">جست‌وجو</button>
    </Form>
  );
}
```

**ویژگی‌ها:**

* Navigation داخلی بدون ریفرش
* Prefetch صفحه مقصد
* Progressive enhancement

**نکته:** برای فرم‌های API call پیچیده یا آپلود فایل استفاده نکنید.


### پشتیبانی از TypeScript در Config

```typescript
import type { NextConfig } from 'next';

const config: NextConfig = {
  experimental: { turbo: { rules: { '*.svg': { loaders: ['@svgr/webpack'], as: '*.js' } } } },
};

export default config;
```


### امنیت Server Actions

```javascript
'use server';

export async function createUser(formData) {
  const name = formData.get('name');
  const email = formData.get('email');

  if (!name || !email) throw new Error('Missing required fields');
  return await saveUser({ name, email });
}
```

**توصیه:** همیشه inputها رو validate و sanitize کنید.


### پیام‌های خطای بهتر برای Hydration

```javascript
function ProblematicComponent() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  return <div>{mounted ? 'Client' : 'Server'}</div>;
}
```


### بهبودهای دیگر

* پشتیبانی از ESLint 9
* اضافه شدن خودکار `.env*` به `.gitignore`
* بهبود Docker و standalone buildها



## مهاجرت آسان با Codemod

 Next.js یک ابزار رسمی و خودکار ارائه کرده که فرآیند upgrade را بسیار ساده می‌کند.

 دستور اجرا:

```bash
npx @next/codemod@canary upgrade latest
```

### این دستور چه کار می‌کند؟

 1. به‌روزرسانی نسخه‌های اصلی

* Next.js
* React
* React DOM

 2. اعمال خودکار تغییرات در کد

Codemod بخش‌هایی از کد پروژه را برای سازگاری با Next.js 15 اصلاح می‌کند، بدون اینکه نیاز باشد خودتان فایل‌ها را یک‌به‌یک اصلاح کنید.

 3. به‌روزرسانی ESLint و وابستگی‌های ضروری

* Ruleهای جدید
* سازگاری کامل با نسخه 15

 4. تنظیم و اصلاح فایل‌های config

* next.config.js
* tsconfig.json (در پروژه‌های TypeScript)
* پاکسازی تنظیمات غیرضروری







