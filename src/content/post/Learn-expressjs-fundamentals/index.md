---
title: "آموزش پایه ای  Express.js "
description: "راهنمای کامل Express.js شامل routing، middleware، view engine ها و تکنیک‌های پیشرفته برای ساخت backend های قدرتمند"
publishDate: "17 Sep 2024"
updatedDate: "03 Apr 2025"
tags: ["expressjs", "nodejs", "backend", "javascript"]
---



# آموزش پایه ای Express.js

اگه داری با JavaScript بک اند می‌سازی، احتمالاً  از Express.js استفاده می کنی. تو این راهنمای کامل، همه چیزی که باید در مورد Express بدونی رو دوره می کنیم، و حتی چند تا فیچر پیشرفته‌ای که کم تو آموزش‌های دیگه دیده میشه.



## شروع کار با Express.js

### پیش نیازها
ابتدا باید Node.js رو روی سیستمت نصب کنی. اگه هنوز نصبش نکردی، از سایت رسمی Node.js دانلودش کن.

### راه‌اندازی پروژه
اول یه پروژه جدید بساز و dependency های لازم رو نصب کن:

```bash
# یه پروژه npm جدید درست کن
npm init -y

# Express رو نصب کن
npm install express

# nodemon رو برای development نصب کن (خودکار server رو restart می‌کنه)
npm install --save-dev nodemon
```

### تنظیمات package.json
یه script برای development به `package.json`ت اضافه کن:

```json
{
  "scripts": {
    "dev": "nodemon server.js"
  }
}
```

حالا می‌تونی `npm run dev` رو اجرا کنی تا server ات با restart خودکار شروع شه.

## ساخت اولین سرور

یه فایل `server.js` تو root پروژه‌ت بساز:

```javascript
const express = require('express');
const app = express();

// server رو روی port 3000 شروع کن
app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
```

این کد یه server پایه Express می‌سازه که روی port 3000 گوش می‌ده. اما هنوز هیچ route ای نداره.



## Route ها

**Route** ها در Express مشخص می‌کنند که برنامه‌ی ما چگونه به درخواست‌های مختلف **کاربر (client)** پاسخ بدهد. به زبان ساده، Route ها مثل تابلوهای راهنمایی هستند که به برنامه می‌گویند وقتی کاربر به آدرس مشخصی مراجعه کرد، چه کاری انجام بدهد.

Express از تمام **HTTP method** های رایج پشتیبانی می‌کند:

* **GET:** دریافت اطلاعات از سرور
* **POST:** ارسال اطلاعات به سرور برای ایجاد چیزی جدید
* **PUT:** بروزرسانی اطلاعات موجود
* **DELETE:** حذف اطلاعات

مثال:

```javascript
// GET route
app.get('/', (req, res) => {
  console.log('Home page accessed');
  res.send('Hello World!');
});
```

> این مسیر وقتی کاربر وارد صفحه اصلی سایت (`/`) می‌شود، یک پیام "Hello World!" به او می‌فرستد.

```javascript
// POST route
app.post('/users', (req, res) => {
  res.send('Create a new user');
});
```

> وقتی کاربر اطلاعاتی برای ایجاد کاربر جدید ارسال کند، سرور این پیام را برمی‌گرداند.

```javascript
// PUT route
app.put('/users/:id', (req, res) => {
  res.send('Update user');
});
```

> مسیرهای PUT معمولا برای بروزرسانی اطلاعات هستند. `:id` یعنی سرور انتظار دارد یک **شناسه کاربر** دریافت کند.

```javascript
// DELETE route
app.delete('/users/:id', (req, res) => {
  res.send('Delete user');
});
```

> مسیر DELETE برای حذف اطلاعات کاربر با شناسه مشخص استفاده می‌شود.

### Route Parameter ها

در route ها، پارامترهای مهم وجود دارند:

* `req`: **request object**، شامل اطلاعاتی است که کاربر ارسال کرده است (مثلا فرم‌ها یا URL params)
* `res`: **response object**، برای پاسخ دادن به کاربر استفاده می‌شود
* `next`: معمولاً برای **middleware** استفاده می‌شود و در اکثر route ها لازم نیست


## کار با Response Methods

Express چندین روش برای ارسال پاسخ به کاربر دارد. به طور خلاصه:

### Response Method های پایه

```javascript
app.get('/basic', (req, res) => {
  res.send('Hello World'); // ارسال متن ساده
});
```

```javascript
app.get('/status', (req, res) => {
  res.status(500).send('Server Error'); // ارسال کد وضعیت به همراه پیام
});
```

```javascript
app.get('/json', (req, res) => {
  res.json({ message: 'Hello World', status: 'success' }); // ارسال JSON
});
```

```javascript
app.get('/download', (req, res) => {
  res.download('./server.js'); // دانلود فایل از سرور
});
```


## سازماندهی کد با Router ها

وقتی پروژه Express بزرگ می‌شود، **همه route ها را در یک فایل نگه داشتن سخت و شلوغ می‌شود**.
**Router ها** به ما کمک می‌کنند تا route ها را **ماژولار و جداگانه** کنیم، یعنی هر گروه route در فایل مخصوص خودش باشد.

### ساخت فایل Router

ابتدا یک پوشه به نام `routes` بساز و فایل `users.js` را داخل آن اضافه کن:

```javascript
const express = require('express');
const router = express.Router();

// Route ها نسبت به mounted path هستند
router.get('/', (req, res) => {
  res.send('User list');
});

router.get('/new', (req, res) => {
  res.send('New user form');
});

router.post('/', (req, res) => {
  res.send('Create user');
});

// router را export کن
module.exports = router;
```

> این فایل فقط route های مربوط به کاربران را نگه می‌دارد. هر route نسبت به **مسیر نصب شده** (`/users`) است.


### استفاده از Router تو Main Server

در `server.js`:

```javascript
const express = require('express');
const userRouter = require('./routes/users');
const app = express();

// router را روی /users mount کن
app.use('/users', userRouter);

app.listen(3000);
```

> با این کار، مسیرهای زیر ساخته می‌شوند:

* GET `/users/` → نمایش لیست کاربران
* GET `/users/new` → نمایش فرم ایجاد کاربر جدید
* POST `/users/` → ایجاد کاربر جدید

به زبان ساده: هر route داخل فایل Router به `/users` اضافه می‌شود.


## Route های پویا و Parameter ها

**Dynamic route** ها به شما اجازه می‌دهند بخش‌هایی از URL را متغیر تعریف کنید و آن‌ها را دریافت کنید.

```javascript
// Dynamic parameter با دونقطه
router.get('/:id', (req, res) => {
  const userId = req.params.id;
  res.send(`Get user with ID: ${userId}`);
});

// چند parameter
router.get('/:id/posts/:postId', (req, res) => {
  const { id, postId } = req.params;
  res.send(`User ${id}, Post ${postId}`);
});
```

> مثال ساده: اگر URL `/5/posts/10` باشد، `id = 5` و `postId = 10` است.

### مهم: ترتیب Route ها مهمه

Route های **static** باید قبل از dynamic route ها نوشته شوند، چون dynamic route می‌تواند مسیرهای static را هم بگیرد.

```javascript
// ✅ ترتیب درست
router.get('/new', (req, res) => {
  res.send('New user form');
});

router.get('/:id', (req, res) => {
  res.send(`User ${req.params.id}`);
});
```

```javascript
// ❌ ترتیب اشتباه
router.get('/:id', (req, res) => { ... }); // ممکن است مسیر /new را بگیرد
router.get('/new', (req, res) => { ... });
```



## تکنیک‌های پیشرفته Routing

### Route Chaining

اگر چند method برای یک مسیر مشابه داریم، می‌توانیم آن‌ها را با هم **زنجیره کنیم**:

```javascript
router.route('/:id')
  .get((req, res) => {
    res.send(`Get user ${req.params.id}`);
  })
  .put((req, res) => {
    res.send(`Update user ${req.params.id}`);
  })
  .delete((req, res) => {
    res.send(`Delete user ${req.params.id}`);
  });
```

> به جای تعریف جداگانه هر method، همه آن‌ها را یک جا تعریف می‌کنیم.




## Middleware

**Middleware** در Express مثل یک **میانجی بین درخواست کاربر و پاسخ سرور** عمل می‌کند. این function ها در طول چرخه **request-response** اجرا می‌شوند و به سه چیز دسترسی دارند:

* `req` → اطلاعات درخواست کاربر
* `res` → پاسخ به کاربر
* `next` → برای رفتن به middleware بعدی

به زبان ساده، Middleware می‌تواند:

* درخواست‌ها را بررسی کند
* داده‌ها را آماده کند
* یا محدودیت‌های دسترسی اعمال کند



### ساخت Custom Middleware

مثال: یک middleware برای **ثبت لاگ** درخواست‌ها:

```javascript
function logger(req, res, next) {
  console.log(`${req.method} ${req.originalUrl}`);
  next(); // برای ادامه به middleware بعدی
}

// استفاده global
app.use(logger);

// استفاده روی route خاص
app.get('/', logger, (req, res) => {
  res.send('Home page');
});

// چند middleware پشت سر هم
app.get('/protected', auth, logger, (req, res) => {
  res.send('Protected route');
});
```

> توضیح ساده: `next()` باعث می‌شود که بعد از middleware، کدهای بعدی اجرا شوند. بدون `next()`، درخواست متوقف می‌شود.


### Router-Level Middleware

می‌توان Middleware را **فقط روی یک router خاص** اعمال کرد:

```javascript
// تو routes/users.js
function userLogger(req, res, next) {
  console.log('User route accessed');
  next();
}

// اعمال روی همه route های این router
router.use(userLogger);
```

> این یعنی هر بار که route ای از `users.js` اجرا شود، ابتدا `userLogger` اجرا می‌شود.



### ترتیب اجرای Middleware

Middleware ها **به ترتیب تعریفشان اجرا می‌شوند**:

```javascript
app.use(middleware1); // اول اجرا می‌شود
app.use(middleware2); // دوم اجرا می‌شود
app.get('/', middleware3, handler); // middleware3 سوم، بعدش handler
```

> پس ترتیب نوشتن middleware خیلی مهم است.


### Router Parameters Middleware

با `router.param()` می‌توان **middleware مخصوص یک parameter** تعریف کرد.

```javascript
const users = [
  { name: 'Kyle' },
  { name: 'Sally' }
];

// هروقت parameter :id پیدا شد اجرا می‌شود
router.param('id', (req, res, next, id) => {
  console.log(`Looking for user with ID: ${id}`);

  // user را از آرایه/دیتابیس می‌گیریم
  req.user = users[id];

  // به middleware/route بعدی برو
  next();
});

router.get('/:id', (req, res) => {
  // req.user حالا در دسترس است
  console.log(req.user);
  res.json(req.user);
});
```

> این middleware قبل از هر route که parameter `:id` دارد اجرا می‌شود و اجازه می‌دهد:



## Middleware های داخلی

Express چند middleware **داخلی و کاربردی** دارد که کارها را راحت‌تر می‌کند.

### سرو کردن Static File ها

می‌توان فایل‌های static مثل HTML، CSS، JavaScript یا عکس‌ها را از یک پوشه سرو کرد:

```javascript
app.use(express.static('public'));
```

> ساختار پوشه `public`:

```
public/
  ├── index.html
  ├── style.css
  ├── script.js
  └── images/
      └── logo.png
```

> این فایل‌ها به آدرس‌های زیر قابل دسترسی هستند:

* `http://localhost:3000/index.html`
* `http://localhost:3000/style.css`
* `http://localhost:3000/images/logo.png`



### Parse کردن Request Body ها

Middleware داخلی می‌تواند داده‌های فرم و JSON را به object قابل استفاده تبدیل کند:

```javascript
// داده‌های URL-encoded فرم‌ها
app.use(express.urlencoded({ extended: true }));

// داده‌های JSON
app.use(express.json());
```

> مثال: اگر کاربر یک فرم ارسال کند یا JSON بفرستد، با این middleware می‌توانیم آن‌ها را مستقیم از `req.body` بخوانیم.


## کار با داده‌های Form

Form ها ابزاری هستند که به کاربران اجازه می‌دهند **اطلاعات را از طریق مرورگر به سرور ارسال کنند**. در Express، می‌توانیم این داده‌ها را با middleware هایی مثل `express.urlencoded()` دریافت و پردازش کنیم.

### ساخت Form

مثال فایل `views/users/new.ejs`:

```html
<!DOCTYPE html>
<html>
<head>
    <title>New User</title>
</head>
<body>
    <form action="/users" method="POST">
        <input type="text" name="firstName" placeholder="First Name"
               value="<%= locals.firstName || '' %>" required>
        <button type="submit">Create User</button>
    </form>
</body>
</html>
```

> نکات ساده:

* `action="/users"` → آدرس ارسال داده‌ها
* `method="POST"` → از HTTP POST استفاده می‌کنیم چون داده‌ها ایجاد می‌شوند
* `<%= locals.firstName || '' %>` → اگر فرم قبلا پر شده باشد و خطایی رخ داده باشد، مقدار قبلی حفظ می‌شود


### پردازش داده‌های Form

```javascript
const users = [];

router.get('/new', (req, res) => {
  res.render('users/new');
});

router.post('/', (req, res) => {
  const isValid = true; // منطق validation اینجا قرار می‌گیرد

  if (isValid) {
    const newUser = { firstName: req.body.firstName };
    users.push(newUser);

    const userId = users.length - 1;
    res.redirect(`/users/${userId}`);
  } else {
    res.render('users/new', {
      firstName: req.body.firstName,
      error: 'Invalid input'
    });
  }
});
```

> نکات ساده:

* `req.body.firstName` → مقدار وارد شده توسط کاربر
* اگر داده معتبر باشد → **کاربر ساخته می‌شود و redirect** می‌کنیم
* اگر نامعتبر باشد → فرم دوباره نمایش داده می‌شود و input کاربر حفظ می‌شود


### مفاهیم کلیدی Form Handling

1. **حفظ Input در صورت Error** → کاربر مجبور نباشد دوباره همه فرم را پر کند
2. **Validation** → همیشه server-side validation داشته باش، حتی اگر client-side validation وجود دارد
3. **Redirect بعد از POST** → استفاده از الگوی **Post-Redirect-Get** برای جلوگیری از submit دوباره
4. **Error Handling** → به کاربر بازخورد واضح بده


## Query Parameter ها

**Query parameter** ها بخشی از URL هستند که بعد از `?` می‌آیند و معمولا برای **فیلتر، جستجو، صفحه‌بندی و مرتب‌سازی** استفاده می‌شوند.

مثال URL:

```
http://localhost:3000/users?name=Kyle&age=25
```

### دسترسی به Query Parameter ها

```javascript
router.get('/', (req, res) => {
  const name = req.query.name;
  const age = req.query.age;

  // یا با destructuring
  const { name, age } = req.query;

  console.log(`Name: ${name}, Age: ${age}`);

  res.send(`Hello ${name || 'Anonymous'}`);
});
```

> نکته ساده: `req.query` یک object است که همه query parameter ها را دارد.


### موارد استفاده Query Parameter ها

* **فیلتر کردن:**
  `GET /products?category=electronics&price_max=100`

* **Pagination:**
  `GET /users?page=2&limit=10`

* **جستجو:**
  `GET /search?q=express.js`

* **مرتب سازی:**
  `GET /posts?sort=date&order=desc`

> به زبان ساده: Query parameter ها باعث می‌شوند کاربر بتواند **اطلاعات را شخصی‌سازی یا محدود** کند بدون اینکه مسیر اصلی تغییر کند.



## مثال کامل: سیستم مدیریت کاربر

اینجا یه مثال کامل که همه چیز رو با هم ترکیب می‌کنه:

### server.js
```javascript
const express = require('express');
const userRouter = require('./routes/users');
const app = express();

// View engine
app.set('view engine', 'ejs');

// Middleware
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.render('index');
});

app.use('/users', userRouter);

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
```

### routes/users.js
```javascript
const express = require('express');
const router = express.Router();

const users = [
  { firstName: 'Kyle' },
  { firstName: 'Sally' }
];

// Middleware برای user parameter
router.param('id', (req, res, next, id) => {
  req.user = users[id];
  next();
});

// Routes
router.get('/', (req, res) => {
  res.render('users/index', { users });
});

router.get('/new', (req, res) => {
  res.render('users/new');
});

router.post('/', (req, res) => {
  const isValid = req.body.firstName && req.body.firstName.trim() !== '';

  if (isValid) {
    users.push({ firstName: req.body.firstName });
    res.redirect(`/users/${users.length - 1}`);
  } else {
    res.render('users/new', {
      firstName: req.body.firstName,
      error: 'First name is required'
    });
  }
});

router.route('/:id')
  .get((req, res) => {
    res.render('users/show', { user: req.user });
  })
  .put((req, res) => {
    req.user.firstName = req.body.firstName;
    res.redirect(`/users/${req.params.id}`);
  })
  .delete((req, res) => {
    users.splice(req.params.id, 1);
    res.redirect('/users');
  });

module.exports = router;
```


## نتیجه‌گیری

Express.js یه framework قوی و انعطاف‌پذیره که ساخت web server ها با Node.js رو ساده و لذت‌بخش می‌کنه. مفاهیم کلیدی که تو این آموزش پوشش دادیم شامل:

- راه‌اندازی Express application ها و server ها
- ساخت و سازماندهی route ها با router ها
- درک middleware و جریان اجراش
- Handle کردن انواع مختلف داده (JSON، form ها، static file ها)
- کار با route های پویا و parameter ها
- استفاده از view engine ها برای server-side rendering

با این مبانی، برای ساخت web application ها و API ها آماده‌ای. همونطور که به برسی ادامه می‌دی، موضوعاتی مثل authentication، یکپارچگی database، testing، و deployment رو بررسی کن تا application های آماده production بسازی.

یادت باشه که Express.js از طریق اکوسیستم middleware اش خیلی قابل گسترشه. npm registry هزاران package middleware داره که می‌تونن قابلیت‌هایی مثل authentication، logging، rate limiting، و خیلی چیزهای دیگه رو به application تو اضافه کنن.
