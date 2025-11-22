---
title: "چرا Astro فوق‌العاده سریعه ؟"
description: "بررسی کامل architecture، مزایای performance و اینکه چرا Astro طرز فکرمون رو نسبت به web development عوض کرده"
publishDate: "14 Aug 2025"
tags: ["astro", "performance"]
---



# چرا Astro فوق‌العاده سریعه: نگاهی عمیق به این فریم‌ورک مدرن

*بررسی کامل architecture، مزایای performance و اینکه چرا Astro طرز فکرمون رو نسبت به web development عوض کرده*

## مقدمه

تو دنیای همیشه در حال تغییر web development، یه framework جدید داره همه رو شگفت‌زده می‌کنه با رویکرد منحصر به فردش به performance و developer experience: **Astro**. این فریم‌ورک که توسط Fred Schott (بنیان‌گذار Astro و CEO شرکت HTML) ساخته شده، یه تغییر بنیادی تو طرز فکرمون نسبت به اینکه چطور JavaScript به browser بفرستیم محسوب میشه.

برخلاف framework های سنتی که همه چیز رو سمت client می‌فرستن، Astro یه اصل ساده رو دنبال می‌کنه: **فقط همون JavaScript ای رو بفرست که واقعاً بهش نیاز داری**. این رویکرد منجر به ساخت وبسایت‌های فوق‌العاده سریع با bundle size های خیلی کم میشه - اغلب به جای مگابایت‌ها، چند صد byte!

## فلسفه اصلی: Islands Architecture

سلاح مخفی Astro همین **Islands Architecture** هستش. به جای اینکه کل صفحه رو با JavaScript hydrate کنی، Astro بهت اجازه میده دقیقاً مشخص کنی کدوم component ها باید سمت client تعامل داشته باشن. این selective hydration یعنی بیشتر صفحه‌ت static HTML باقی می‌مونه و performance به شدت بهبود پیدا می‌کنه.

### رویکرد Framework های سنتی
```javascript
// همه چیز سمت client hydrate میشه
ReactDOM.render(<App />, document.getElementById('root'));
```

### رویکرد Astro
```astro
---
// اینجا روی server اجرا میشه
import Button from '../components/Button.jsx';
const serverData = await fetch('/api/data');
---

<html>
  <body>
    <h1>صفحه من</h1>
    <!-- این دکمه هیچ JavaScript نداره -->
    <Button />

    <!-- فقط این دکمه JavaScript میگیره -->
    <Button client:load />
  </body>
</html>
```

## شروع کار: ساختار فایل‌های Astro

پروژه‌های Astro یه ساختار تمیز و قابل فهم دارن:

```
src/
├── pages/           # File-based routing
│   ├── index.astro  # صفحه اصلی (/)
│   └── about.astro  # صفحه درباره ما
├── components/      # Component های قابل استفاده مجدد
└── layouts/         # Layout های صفحه
```

### ساخت اولین صفحه Astro

این شکلی هست که یه صفحه اصولی Astro به نظر میرسه:

```astro
---
// Component Script (روی server اجرا میشه)
import { Button } from '../components/Button.jsx';

// این کد موقع build روی server اجرا میشه
const greeting = "سلام، Astro!";
---

<!-- Component Template (HTML) -->
<html>
  <head>
    <title>سایت Astro من</title>
  </head>
  <body>
    <div id="foo">
      <h1>{greeting}</h1>

      <!-- دکمه static - JavaScript نمیفرسته -->
      <Button>کلیک کن (static)</Button>

      <!-- دکمه تعاملی - JavaScript داره -->
      <Button client:load>کلیک کن (interactive)</Button>
    </div>
  </body>
</html>

<style>
  /* CSS محدود به همین component */
  h1 {
    color: blue;
  }
</style>

<script>
  // JavaScript اختیاری سمت client
  document.getElementById('foo').addEventListener('click', () => {
    console.log('کلیک شد!');
  });
</script>
```

## جادوی Selective Hydration

قدرت واقعی Astro وقتی مشخص میشه که network tab رو نگاه کنی. بیا یه مثال عملی ببینیم:

### مثال: ساخت یه Component تعاملی ساده

```astro
---
// منطق سمت server
const names = ['علی', 'فاطمه', 'حسن', 'زهرا'];
---

<html>
  <body>
    <!-- محتوای static -->
    <h1>به سایت من خوش اومدی</h1>

    <!-- component تعاملی فقط وقتی لازم باشه -->
    <button id="name-button" client:load>
      اسم تصادفی بگیر
    </button>

    <div id="result"></div>
  </body>
</html>

<script>
  const names = ['علی', 'فاطمه', 'حسن', 'زهرا'];
  const button = document.getElementById('name-button');
  const result = document.getElementById('result');

  button?.addEventListener('click', () => {
    const randomName = names[Math.floor(Math.random() * names.length)];
    result.textContent = `سلام، ${randomName}!`;
  });
</script>
```

وقتی این صفحه رو build کنی، Astro:
1. HTML رو روی server render می‌کنه
2. فقط حداقل JavaScript لازم برای تعامل دکمه رو می‌فرسته
3. در نتیجه کل bundle size فقط **۶۲۸ byte** میشه (در مقابل چند صد KB با اپ‌های React سنتی)

## Framework Agnostic: هر چی دوست داری استفاده کن

یکی از جذاب‌ترین ویژگی‌های Astro اینه که framework agnostic هستش. می‌تونی استفاده کنی از:

- **React** component ها
- **Vue** component ها
- **Svelte** component ها
- **Solid.js** component ها
- **Vanilla JavaScript**
- **Web Components**

همه اینا تو یه پروژه! اینجوری:

```astro
---
import ReactButton from './ReactButton.jsx';
import VueCounter from './VueCounter.vue';
import SvelteWidget from './SvelteWidget.svelte';
---

<html>
  <body>
    <!-- framework ها رو با هم ترکیب کن -->
    <ReactButton client:load />
    <VueCounter client:idle />
    <SvelteWidget client:visible />
  </body>
</html>
```

### توضیح Client Directives

Astro چندتا client directive داره که کنترل می‌کنه component ها کی hydrate بشن:

- `client:load` - بلافاصله وقتی صفحه load شد hydrate میشه
- `client:idle` - وقتی browser idle بود hydrate میشه
- `client:visible` - وقتی component وارد viewport شد hydrate میشه
- `client:media` - وقتی media query match شد hydrate میشه

## عالی برای Content Site ها و Blog ها

Astro خیلی خوب میدرخشه برای سایت‌هایی که محتوای زیادی دارن. با پشتیبانی built-in از Markdown، می‌تونی blog های فوق‌العاده سریع بسازی:

### یکپارچه‌سازی Markdown

```astro
---
// src/pages/blog/[slug].astro
export async function getStaticPaths() {
  const posts = await Astro.glob('../content/*.md');
  return posts.map(post => ({
    params: { slug: post.frontmatter.slug },
    props: { post }
  }));
}

const { post } = Astro.props;
---

<html>
  <head>
    <title>{post.frontmatter.title}</title>
  </head>
  <body>
    <article>
      <h1>{post.frontmatter.title}</h1>
      <post.Content />
    </article>
  </body>
</html>
```

یه صفحه blog معمولی با Astro فقط **۳۶۱ byte** وزن داره، در مقابل مگابایت‌هایی که framework های پر از JavaScript معمولاً نیاز دارن.

## مزایای Performance به صورت عددی

اینجا می‌تونی ببینی با Astro چی انتظار داشته باشی:

| معیار | SPA سنتی | سایت Astro |
|--------|----------------|------------|
| Bundle Size اولیه | ۲۰۰KB - ۲MB+ | ۰.۵KB - ۵۰KB |
| Time to Interactive | ۲-۵ ثانیه | ۵۰-۲۰۰ms |
| JavaScript مورد نیاز | همیشه | فقط وقتی لازم باشه |
| عملکرد SEO | ضعیف (نیاز به SSR) | عالی (static HTML) |

## آزادی در Deploy و Hosting

برخلاف خیلی از framework های مدرن که تو platform های خاص گیرت می‌ندازن، Astro بهت آزادی کامل hosting میده:

```bash
# سایتت رو build کن
npm run build

# پوشه dist/ حاوی فایل‌های static هست که هرجا میشه serve کرد:
# - وب سرورهای سنتی (Apache, Nginx)
# - CDN ها (Cloudflare, AWS CloudFront)
# - Static host ها (Netlify, Vercel)
# - VPS provider ها (Linode, DigitalOcean)
```

vendor lock-in نداری، نیاز به server خاص نداری - فقط فایل‌های static سریع.


### آیا Astro برای مبتدیان خوبه؟

طبق حرف Fred Schott، بنیان‌گذار Astro: "این یکی از چیزهایی هست که بیشترین افتخار رو بهش می‌کنم... چون فقط HTML هستش. اگه داری برای اولین بار یه سایت می‌سازی و وب رو یاد می‌گیری، ما تو رو سراغ TypeScript، JSX، React file-based routing نمی‌بریم. ایده اینه که همه چی تا حد امکان ساده شروع بشه، بعدش می‌تونی complexity رو اضافه کنی که نیاز داشتی."

### Scaling و Performance

Astro روی Vite ساخته شده که قابلیت‌های scaling عالی داره:
- **سرور development سریع** - فقط چیزی که نیاز داری compile می‌کنه
- **Build های کارآمد** - از بهینه‌سازی Vite استفاده می‌کنه
- **پشتیبانی از سایت‌های بزرگ** - تا ۱۰,۰۰۰+ صفحه تست شده
- **عملکرد Markdown** - برای سایت‌های پر محتوا بهینه شده

### بحث Server در مقابل Client

"تو نمی‌دونی کاربرت روی چه device ای هست،" Schott توضیح میده. "هر خط JavaScript که می‌فرستی یه میلی‌ثانیه احتمالی دیگه، ده‌ها، صدها میلی‌ثانیه که کاربرت رو از انجام کاری که سایت برای انجامش وجود داره، منع می‌کنه."

## کی باید Astro رو انتخاب کنی؟

Astro برای اینها عالیه:

✅ **سایت‌های محتوایی و blog ها**
✅ **وبسایت‌های marketing**
✅ **سایت‌های مستندات**
✅ **صفحات محصولات e-commerce**
✅ **سایت‌های portfolio**
✅ **سایت‌هایی که performance حیاتی هست**

گزینه‌های دیگه رو در نظر بگیر برای:

❌ **اپلیکیشن‌های وب خیلی تعاملی**
❌ **Dashboard های real-time**
❌ **سناریوهای پیچیده state management**

## همین الان شروع کن

آماده‌ای Astro رو امتحان کنی؟ اینجوری شروع کن:

```bash
# یه پروژه Astro جدید بساز
npm create astro@latest

# template ت رو انتخاب کن
# - Just the basics
# - Blog
# - Portfolio
# - Documentation

# شروع به کد زدن کن
cd my-astro-site
npm run dev
```

## نتیجه‌گیری

Astro یه بازگشت به اصول بنیادی وب محسوب میشه در عین اینکه developer experience مدرن رو حفظ می‌کنه. با فرستادن فقط JavaScript ای که نیاز داری و استفاده از قابلیت‌های خود platform، Astro قول وبسایت‌های سریع و قابل دسترس رو بدون از دست دادن بهره‌وری developer محقق می‌کنه.

تو دورانی که web performance مستقیماً روی تجربه کاربری، رنکینگ SEO، و نرخ تبدیل تاثیر داره، رویکرد Astro یعنی "HTML اول، JavaScript وقتی لازم باشه" یه مسیر جذاب به جلو ارائه میده. چه داری یه blog شخصی می‌سازی، چه وبسایت شرکت، چه اپلیکیشن پر محتوا، Astro شایسته بررسی جدی هست.

وب داره به سمت آینده‌ای با آگاهی بیشتر نسبت به performance حرکت می‌کنه، و Astro داره این حرکت رو رهبری می‌کنه.
