---
title: "مرور شب امتحانی دستورات Git"
description: "راهنمای جامع و فشرده برای مرور سریع دستورات Git از مقدماتی تا پیشرفته"
publishDate: "14 Mar 2023"
updatedDate: "27 Apr 2025"
tags: ["git", "cheatsheet"]
---



# مرور شب امتحانی دستورات Git

## شروع کار با Git

### نصب و راه‌اندازی اولیه


```bash
# تنظیم نام و ایمیل (فقط یه بار)
git config --global user.name "اسم شما"
git config --global user.email "email@example.com"

# مشاهده تنظیمات فعلی
git config --list
```

### شروع یه پروژه جدید

دو حالت داریم:

#### حالت ۱: شروع از صفر
```bash
# رفتن به پوشه پروژه
cd /path/to/your/project

# راه‌اندازی Git
git init

# اضافه کردن ریموت (GitHub, GitLab و...)
git remote add origin https://github.com/username/project-name.git
```

#### حالت ۲: کلون کردن پروژه موجود
```bash
git clone https://github.com/username/project-name.git
cd project-name
```

## دستورات روتین Git

### چک کردن وضعیت پروژه

```bash
# ببینید چه فایل‌هایی تغییر کرده
git status
```

خروجی `git status` چیزی شبیه این می‌شه:

```
On branch main
Your branch is up to date with 'origin/main'.

Changes to be committed:
  (use "git restore --staged <file>..." to unstage)
        modified:   README.md
        modified:   package.json

Changes not staged for commit:
  (use "git add <file>..." to update what will be committed)
        modified:   src/App.tsx
        modified:   vite.config.ts
```

### اضافه کردن فایل‌ها به stage

```bash
# همه فایل‌های تغییر یافته
git add .

# یه فایل خاص
git add filename.js

# چندین فایل خاص
git add file1.js file2.css file3.html
```

### کامیت کردن تغییرات

```bash
# کامیت با پیام
git commit -m "توضیح تغییرات"

# کامیت همه تغییرات (بدون نیاز به git add)
git commit -am "پیام کامیت"
```

### ارسال به سرور

```bash
# ارسال به شاخه main
git push origin main

# ارسال به شاخه دیگه (مثلاً dev)
git push origin dev
```

## مفهوم Origin چیه؟

`origin` یه نام مستعار (alias) برای آدرس ریموت repository شماست. به جای اینکه هر بار آدرس کامل رو تایپ کنید:

```bash
git push https://github.com/myuser/myproject.git main
```

می‌تونید بنویسید:

```bash
git push origin main
```

### مشاهده ریموت‌های تعریف شده

```bash
git remote -v
```

خروجی:
```
origin  https://github.com/myuser/myproject.git (fetch)
origin  https://github.com/myuser/myproject.git (push)
```

## نکات مهم قبل از کامیت

### ۱. همیشه git status بزنید
قبل از `git add .` حتماً `git status` بزنید تا ببینید چه فایل‌هایی تغییر کرده.

### ۲. فایل .gitignore رو فراموش نکنید
فایل‌های حساس (پسورد، توکن، فایل‌های کانفیگ) رو حتماً تو `.gitignore` بذارید:

```
# مثال .gitignore
node_modules/
.env
*.log
.DS_Store
dist/
```

### ۳. پیام‌های کامیت معنادار بنویسید
```bash
# بد ❌
git commit -m "fix"

# خوب ✅
git commit -m "رفع باگ لاگین در صفحه اصلی"
```



## کار با Branch ها


### ایجاد و استفاده از Branch

```bash
# رفتن به شاخه اصلی
git checkout main

# مطمئن شدن از آخرین نسخه
git pull origin main

# ایجاد branch جدید
git branch feature/login-page

# رفتن به branch جدید
git checkout feature/login-page

# یا هر دو کار با یه دستور
git checkout -b feature/login-page
```

### ارسال Branch به ریموت

**نکته مهم**: branch های محلی خودکار به ریموت نمی‌رن! باید دستی بفرستیدشون:

```bash
# ارسال branch جدید به ریموت
git push origin feature/login-page
```

### ادغام (Merge) Branch ها

```bash
# برگشت به main
git checkout main

# دریافت آخرین تغییرات
git pull origin main

# ادغام branch
git merge feature/login-page

# ارسال تغییرات
git push origin main
```

### حذف Branch ها

```bash
# حذف محلی
git branch -d feature/login-page

# حذف از ریموت
git push origin --delete feature/login-page
```

## Reset و بازگشت به عقب

### انواع git reset

#### ۱. git reset --soft
```bash
git reset --soft HEAD~1
```
- کامیت حذف می‌شه اما تغییرات staged باقی می‌مونن
- برای ویرایش پیام کامیت آخر مفیده

#### ۲. git reset --mixed (پیش‌فرض)
```bash
git reset HEAD~1
# یا
git reset --mixed HEAD~1
```
- کامیت حذف می‌شه، تغییرات unstaged می‌شن
- فایل‌ها تو working directory باقی می‌مونن

#### ۳. git reset --hard (خطرناک!)
```bash
git reset --hard HEAD~1
```
- همه چیز حذف می‌شه! کامیت، stage، و تغییرات فایل‌ها
- غیرقابل بازگشت (مگر با git reflog)

### مفهوم HEAD

`HEAD` اشاره‌گر به موقعیت فعلی شماست تو Git. معمولاً به آخرین کامیت اشاره می‌کنه.

#### حالت‌های HEAD

**۱. Attached (متصل)**: به یه branch اشاره می‌کنه
```bash
git checkout main  # HEAD متصل به main
```

**۲. Detached (جدا)**: مستقیماً به یه کامیت اشاره می‌کنه
```bash
git checkout a1b2c3d  # HEAD جدا شده
```

**هشدار**: تو حالت detached اگه کامیت کنید، ممکنه تغییراتتون گم شه!

## تگ‌گذاری (Tagging)

تگ‌ها برای علامت‌گذاری نسخه‌های مهم استفاده می‌شن:

```bash
# ایجاد تگ با توضیح
git tag -a v1.0.0 -m "نسخه اول محصول"

# ارسال تگ به ریموت
git push origin v1.0.0

# ارسال همه تگ‌ها
git push origin --tags

# مشاهده تگ‌ها
git tag

# مشاهده جزئیات تگ
git show v1.0.0

# حذف تگ محلی
git tag -d v1.0.0

# حذف تگ از ریموت
git push origin --delete v1.0.0
```

**نکته**: تگ‌ها قابل حرکت نیستند! همیشه به همون کامیت اشاره می‌کنن.

## استراتژی‌های Branching

### ۱. GitHub Flow (ساده و محبوب)

مناسب برای پروژه‌های کوچک تا متوسط:

```
main ─────────────────►
  │
  └── feature/login ──┘
```

- همه کار از `main` شروع می‌شه
- هر ویژگی تو branch جدا
- Pull Request برای بررسی
- Merge و Deploy

### ۲. Git Flow (پیچیده‌تر)

مناسب برای پروژه‌های بزرگ:

```
main ─────────────────►
develop ──────────────►
  │
  ├── feature/login ──┘
  ├── release/v1.0 ───┘
  └── hotfix/bug ─────┘
```

شاخه‌ها:
- **main**: کد آماده انتشار
- **develop**: کد در حال توسعه
- **feature/***: ویژگی‌های جدید
- **release/***: آماده‌سازی نسخه جدید
- **hotfix/***: رفع باگ‌های فوری

### انتخاب استراتژی

| اندازه تیم | سرعت انتشار | توصیه |
|---|---|---|
| ۱-۵ نفر | روزانه/هفتگی | GitHub Flow |
| ۵-۲۰ نفر | دوهفته‌ای | GitHub Flow + سازماندهی |
| ۲۰+ نفر | ماهانه | Git Flow |

## Merge vs Rebase

### Merge
```bash
git checkout main
git merge feature/login
```

ویژگی‌ها:
- تاریخچه حفظ می‌شه
- یه کامیت merge ایجاد می‌شه
- ایمن برای کار تیمی

### Rebase
```bash
git checkout feature/login
git rebase main
```

ویژگی‌ها:
- تاریخچه خطی و تمیز
- کامیت‌ها بازنویسی می‌شن
- **فقط برای branch های محلی!**

** هشدار**: هرگز از rebase روی branch هایی که دیگران روی اون کار می‌کنن استفاده نکنید!

## git push -f (Force Push)

گاهی اوقات نیاز دارید تغییرات رو به‌صورت اجباری بفرستید:

```bash
git push -f origin main
# یا
git push --force origin main
```

** خطرناک**: این دستور تاریخچه ریموت رو بازنویسی می‌کنه و ممکنه کار دیگران رو خراب کنه!

### استفاده ایمن‌تر:
```bash
git push --force-with-lease origin main
```

این دستور اگه کسی دیگه تغییری کرده باشه، اجازه push نمی‌ده.

## نکات و ترفندهای مفید

### ۱. مشاهده لاگ تغییرات
```bash
# لاگ ساده
git log

# لاگ خلاصه
git log --oneline

# لاگ گرافیکی
git log --graph --oneline
```

### ۲. مقایسه تغییرات
```bash
# مقایسه working directory با stage
git diff

# مقایسه staged با آخرین کامیت
git diff --staged

# مقایسه دو کامیت
git diff commit1 commit2
```

### ۳. Stash (نگهداری موقت)
```bash
# ذخیره موقت تغییرات
git stash

# مشاهده stash ها
git stash list

# بازگشت آخرین stash
git stash pop

# بازگشت stash خاص
git stash apply stash@{2}
```

### ۴. Alias ها (میانبرها)
```bash
# تعریف میانبرها
git config --global alias.st status
git config --global alias.co checkout
git config --global alias.br branch

# حالا می‌تونید بنویسید:
git st  # بجای git status
git co main  # بجای git checkout main
```

## مشکلات رایج و راه حل

### ۱. فراموشی .gitignore
```bash
# حذف فایل از tracking (اما نگه‌داری محلی)
git rm --cached filename

# حذف پوشه از tracking
git rm -r --cached foldername/
```

### ۲. کامیت‌های اضافی
اگه کامیت‌های زیاد و بیخود دارید:

```bash
# ایجاد branch جدید
git checkout -b cleanup-branch

# کار روی اون
# بعداً merge با main
```

### ۳. Conflict در Merge
```bash
# مشاهده فایل‌های conflict
git status

# ویرایش دستی فایل‌ها
# حذف علامت‌های <<<<<<< ======= >>>>>>>

# اضافه کردن فایل‌های حل شده
git add conflicted-file.js

# تکمیل merge
git commit
```

### ۴. بازیابی کامیت حذف شده
```bash
# مشاهده تاریخچه کامل
git reflog

# بازگشت به کامیت خاص
git checkout commit-hash

# ایجاد branch جدید از آن نقطه
git checkout -b recovered-branch
```

## بهترین عادت‌ها

### ۱. نام‌گذاری Branch ها
```bash
# خوب ✅
feature/user-authentication
bugfix/login-error
hotfix/critical-security-patch

# بد ❌
my-branch
test
fix
```

### ۲. پیام‌های کامیت
```bash
# خوب ✅
"Add user authentication system"
"Fix responsive design on mobile devices"
"Update dependencies to latest versions"

# بد ❌
"fix"
"update"
"changes"
```

### ۳. کامیت‌های منظم
- هر ویژگی کامل = یک کامیت
- تغییرات مرتبط رو با هم کامیت کنید
- کامیت‌های کوچک بهتر از کامیت‌های بزرگ

### ۴. Branch های کوتاه‌مدت
- برای هر task یا feature یک branch
- بعد از merge سریعاً حذف کنید
- بیش از چند روز branch رو باز نذارید
