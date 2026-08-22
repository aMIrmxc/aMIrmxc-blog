---
title: "Kilo Code Agent Manager: آموزش اجرای چند Agent به‌صورت موازی"
description: "آموزش Kilo Code Agent Manager برای اجرای موازی Agentها، ساخت Worktree، بررسی تغییرات، مدیریت منابع مشترک و Merge امن در VS Code 🤖"
post_id: "kilo-code-agent-manager"
publishDate: "15 Aug 2026"
tags: ["kilo-code", "agent-manager", "ai-agents", "vscode", "git-worktree", "parallel-agents", "multi-agent"]
author: "amirmxc"
authorUrl: "https://github.com/amirmxc"
---

#  Kilo Code Agent Manager چیست؟ آموزش اجرای چند Agent به‌صورت موازی

![Cover image](img.png)

با یک AI Agent می‌توانید بخش زیادی از کارهای روزمره توسعه را سریع‌تر انجام دهید. مشکل زمانی شروع می‌شود که یک feature چند بخش مستقل دارد و می‌خواهید چند Agent را هم‌زمان به کار بگیرید.

مثلاً یک Agent روی backend کار کند، یکی frontend را بسازد و دیگری تست‌ها را آماده کند. اگر همه این Agentها روی یک working directory مشترک کار کنند، تغییرات به‌سرعت روی هم می‌افتند و مدیریت Git و context سخت می‌شود.

**Kilo Code Agent Manager** برای همین سناریو ساخته شده است: می‌توانید چند session را به‌صورت موازی مدیریت کنید و در حالت Worktree، برای هر session یک Git Worktree و branch جدا داشته باشید. در کنار آن، Agent Manager ابزارهایی برای مشاهده diff، اجرای terminal اختصاصی، setup و بررسی نتیجه در اختیار شما قرار می‌دهد.

اما نکته مهم این است که هدف، صرفاً «اجرای Agentهای بیشتر» نیست. Workflow درست این است:

decompose the work → isolate each task → let agents run → verify their changes → review the diffs → integrate the results.

در این مقاله می‌بینیم چطور این workflow را در Kilo Code اجرا کنیم، چه taskهایی برای parallelization مناسب‌اند، Worktree دقیقاً چه چیزی را جدا می‌کند، چه چیزهایی همچنان بین Agentها مشترک می‌ماند و چطور چند نتیجه را بدون تبدیل پروژه به یک آشفتگی Git ادغام کنیم.


## Kilo Code Agent Manager دقیقاً چیست؟

Agent Manager یک control panel در افزونه Kilo Code برای VS Code است که برای اجرا و مدیریت چند AI Agent طراحی شده است. هر session در حالت Worktree در یک Git Worktree جدا اجرا می‌شود و Agent Manager برای هر session یک  terminal اختصاصی، diff/review و امکانات مدیریت session را فراهم می‌کند.

این تفاوت مهمی با اجرای چند chat معمولی دارد.

### تفاوت Agent Manager با Sidebar معمولی Kilo Code

در workflow استاندارد، Sidebar معمولاً برای کارهای کوچک و تعاملی روی branch فعلی مناسب است. Agent Manager برای کارهای طولانی‌تر، side taskها و اجرای چند workstream مستقل کاربرد بیشتری دارد. خود مستندات Kilo این سه حالت را از هم جدا می‌کنند: Sidebar، Worktreeهای Agent Manager و چند session روی یک Worktree مشترک.

|روش|مناسب برای|وضعیت Git|
|---|---|---|
|Sidebar|taskهای کوچک و تعاملی|branch فعلی|
|Agent Manager + Worktree|taskهای مستقل و طولانی‌تر|Worktree و branch جدا|
|چند session روی یک Worktree|context جدا، planner/implementer یا بررسی read-only|همان branch|

یک Rule of Thumb ساده از مستندات Kilo این است: اگر برای انجام یک کار مجبور می‌شوید branch عوض کنید یا `git stash` بزنید، احتمالاً بهتر است یک Worktree جدا داشته باشید.

### Agent Manager با Subagent یکی نیست

Kilo ابزارهای متفاوتی برای delegation دارد. ابزار `task` یک child session یا Subagent ایجاد می‌کند، در حالی که `agent_manager` برای ایجاد sessionهای Agent Manager در VS Code استفاده می‌شود. بنابراین نباید هر session موازی را صرفاً «Subagent» بنامیم.

مدل ذهنی بهتر این است:

> **Agent Manager به شما چند محیط کاری مستقل و قابل Review می‌دهد تا بتوانید چند stream از توسعه را هم‌زمان مدیریت کنید.**

### Worktree دقیقاً چه چیزی را جدا می‌کند؟

در حالت Worktree، branch، directory و terminal هر session جدا هستند. این یعنی یک Agent مستقیماً فایل‌های checkout‌شده Agent دیگر را تغییر نمی‌دهد.

اما این جداسازی کامل نیست.

Providerها، BYOK، مدل‌ها، MCP serverها و برخی تنظیمات extension بین sessionها مشترک می‌مانند. همچنین resourceهایی که بیرون از Worktree قرار دارند، مثل database، container، emulator، cache و port، ممکن است همچنان بین Agentها مشترک باشند.

به زبان ساده:

> **Worktree، محیط Git و فایل‌ها را جدا می‌کند؛ نه کل سیستم توسعه شما را.**


## چه زمانی اجرای چند Agent در Kilo Code منطقی است؟

Parallelization زمانی بیشترین فایده را دارد که taskها واقعاً مستقل باشند؛ یعنی خروجی یکی وابستگی شدیدی به دیگری نداشته باشد و احتمال ویرایش فایل‌های یکسان پایین باشد. مستندات Kilo به‌طور مشخص independent featureها، refactorهای module-scoped و bug fixهای مستقل و اجرای چند approach برای یک مسئله را گزینه‌های مناسب می‌دانند.

### Taskهای مناسب برای اجرای موازی

فرض کنید می‌خواهید یک سیستم Preference به یک web application اضافه کنید. می‌توانید کار را به چند بخش تقسیم کنید:

- Agent اول: API و backend
    
- Agent دوم: صفحه Settings در frontend
    
- Agent سوم: تست‌های خودکار
    
- Agent چهارم: مستندات
    

در این مدل هر Agent یک boundary مشخص دارد.

### Taskهایی که بهتر است ترتیبی انجام شوند

مثلاً این workflow را در نظر بگیرید:

```text
طراحی API
   ↓
پیاده‌سازی backend
   ↓
ساخت frontend بر اساس API
   ↓
تکمیل integration test
```

اگر همه این مرحله‌ها به‌شدت به یکدیگر وابسته باشند، اجرای آن‌ها به‌صورت موازی لزوماً چیزی را سریع‌تر نمی‌کند.

در چنین شرایطی، روش بهتر این است که ابتدا یک skeleton یا contract مشترک ایجاد کنید، آن را تثبیت کنید و بعد بخش‌های مستقل را به Worktreeهای جدا تقسیم کنید. Kilo همین الگو را به‌عنوان یکی از workflowهای پیشنهادی Agent Manager معرفی می‌کند.

### کارهای read-only ساده‌ترین گزینه هستند

کارهایی مثل:

- بررسی ساختار کد
    
- code tour
    
- تحلیل log
    
- اجرای تست
    
- investigation
    

ریسک بسیار کمتری دارند، چون چیزی روی filesystem تغییر نمی‌دهند. Kilo این نوع استفاده را برای sessionهای موازی روی branch مشترک نیز مناسب می‌داند.


## قبل از ساخت چند Session چه چیزهایی لازم دارید؟

برای استفاده از Worktreeهای Agent Manager، باید یک workspace در VS Code داشته باشید و پروژه باید در یک Git repository قرار داشته باشد. برای ایجاد Worktree جدید، Kilo از branch فعلی شما به‌عنوان مبنا استفاده می‌کند.

قبل از شروع بهتر است:

1. وضعیت Git پروژه را بشناسید.
    
2. baseline تست‌ها و build را بررسی کنید.
    
3. Provider و Model موردنظر را در Kilo تنظیم کنید.
    
4. مطمئن شوید repository در وضعیت مناسبی برای branching قرار دارد.
    

Agent Manager از همان providerها، BYOK، custom providerها، modelها و امکانات extension استفاده می‌کند که در workflow معمول Kilo در دسترس هستند.


## چطور چند Kilo Code Agent را هم‌زمان اجرا کنیم؟

### Step 1 — یک Worktree جدید بسازید

در Agent Manager می‌توانید از گزینه **New Worktree** استفاده کنید یا shortcut فعلی `Cmd+N` در macOS و `Ctrl+N` در Windows/Linux را به‌کار ببرید. سپس branch name و پیام اولیه Agent را وارد کنید.

مثلاً:

```text
Implement the user preferences API.
Add validation and tests.
Do not modify the frontend.
```

هدف این prompt این است که Agent دقیقاً بداند مالک کدام بخش از کار است.

### Step 2 — یک Worktree مستقل دیگر بسازید

برای frontend مثلاً:

```text
Build the settings page for user preferences.
Follow the existing frontend patterns.
Do not modify the backend API implementation.
```

اگر task سوم تست است، همان منطق را ادامه دهید.

هر task باید یک scope روشن داشته باشد.

> هرچه scope کوچک‌تر و diff محدودتر باشد، review و merge نیز ساده‌تر می‌شود.

Kilo نیز روی کوچک نگه‌داشتن scope هر Worktree تأکید می‌کند.

### Step 3 — Agentها را هم‌زمان اجرا کنید

### Step 3 — هم‌زمان  Agentها را اجرا کنید


حالا می‌توانید بین Worktreeها جابه‌جا شوید و اجازه دهید Agentها مستقل از هم کار کنند. هر session یک integrated terminal اختصاصی دارد که در همان Worktree اجرا می‌شود.

همچنین می‌توانید Agent Manager sessionها را از chat و با ابزار `agent_manager` شروع کنید. مستندات فعلی Kilo می‌گویند هر درخواست می‌تواند بین **۱ تا ۲۰ task** داشته باشد و برای هر task نیز می‌توان در صورت نیاز model متفاوتی تعیین کرد.

اما این عدد را نباید با «تعداد پیشنهادی Agentها» اشتباه بگیرید. پایین‌تر به این موضوع می‌رسیم.




## یک Workflow واقعی برای اجرای چند Agent

یک workflow عملی می‌تواند این‌طور باشد:

```text
Feature request
      ↓
تعریف contract مشترک
      ↓
تقسیم taskها
      ↓
ساخت Worktree
      ↓
اجرای موازی Agentها
      ↓
تست و Verification
      ↓
Review diff
      ↓
ادغام تغییر پایه
      ↓
به‌روزرسانی Worktreeهای باقی‌مانده
      ↓
Merge یا PR
```

فرض کنید می‌خواهید یک سیستم User Preferences به یک اپلیکیشن اضافه کنید.

### Agent A — Backend

مالک API، validation و persistence.

### Agent B — Frontend

مالک Settings UI و state مربوط به آن.

### Agent C — Tests

مالک تست‌های مربوط به feature.

### Agent D — Documentation

مستندات کاربر یا developer documentation.

این تقسیم بهتر از آن است که به چهار Agent یک prompt یکسان بدهید:

> Implement user preferences.

در حالت دوم، چهار Agent ممکن است همگی یک معماری را از صفر طراحی کنند و بعد مجبور شوید نتیجه آن‌ها را با یکدیگر تطبیق دهید.

### برای taskهای وابسته، اول contract را مشخص کنید

اگر frontend به schema جدید API وابسته است، بهتر است اول interface یا contract آن را تثبیت کنید.

مثلاً:

```text
API contract
   ↓
merge
   ↓
frontend + backend slices
```

Kilo در workflow رسمی خود نیز توصیه می‌کند برای featureهای چندبخشی ابتدا walking skeleton یا contract مشترک ساخته شود و بعد feature sliceها از آن منشعب شوند.


## Worktreeها را برای اجرای واقعی آماده کنید

داشتن branch جدا کافی نیست. اگر هر Agent باید application را اجرا کند، باید resourceهای runtime نیز درست مدیریت شوند.

Agent Manager از setup script پشتیبانی می‌کند و در زمان ساخت Worktree، فایل‌های root-level مانند `.env` و `.env.*` را طبق قواعد مستندات خود می‌تواند copy کند. برای setupهای دیگر می‌توانید از `.kilo/setup-script` استفاده کنید. این script متغیرهای `WORKTREE_PATH` و `REPO_PATH` را نیز دریافت می‌کند.

### مشکل port مشترک

فرض کنید هر چهار Agent برنامه را روی `localhost:3000` اجرا کنند.

Worktreeها مستقل هستند، اما portها نیستند.

فقط یک process می‌تواند روی آن port listen کند.

Kilo پیشنهاد می‌کند application یا script شما port را از environment بگیرد یا برای هر Worktree یک مقدار مستقل تولید کند.

یک الگوی ساده می‌تواند این باشد:

```bash
#!/bin/sh
set -e

sum=$(cksum <<EOF | cut -d ' ' -f 1
$WORKTREE_PATH
EOF
)

export PORT=$((4000 + (sum % 1000)))

npm run dev
```

اینجا برای هر Worktree بر اساس مسیر آن یک port پایدار تولید می‌شود.

این کد بخشی از منطق نمونه‌ای مستندات Kilo است؛ بسته به framework پروژه شما ممکن است به شکل متفاوتی پیاده‌سازی شود.

### مشکل Docker و resourceهای مشترک

همین مسئله برای Docker Compose نیز وجود دارد. اگر چند Worktree با یک container name یا project name ثابت اجرا شوند، از isolation واقعی خبری نخواهد بود.

Kilo برای چنین سناریوهایی استفاده از یک `COMPOSE_PROJECT_NAME` متمایز برای هر Worktree را پیشنهاد می‌کند.

```bash
#!/bin/sh
set -e

name=$(basename "$WORKTREE_PATH" | tr -cd '[:alnum:]_-')
export COMPOSE_PROJECT_NAME="kilo_${name}"

docker compose up
```

نکته اصلی:

> Worktree باید از نظر runtime هم قابل موازی‌سازی باشد، نه فقط از نظر Git.

### فایل‌های محیطی را بیش از حد ساده فرض نکنید

Kilo در حال حاضر فقط الگوی مشخصی از فایل‌های environment را به‌صورت خودکار copy می‌کند: فایل‌های root-level با نام `.env` یا `.env.*`. فایل‌های تو در تو، certificateهای local، databaseهای محلی و بعضی configurationهای دیگر باید جداگانه مدیریت شوند.


## تغییرات هر Agent را چطور بررسی کنیم؟

یکی از خطرناک‌ترین اشتباه‌ها در workflow چند Agent این است که صرفاً به پیام:

> All tests pass.

اعتماد کنید.

Kilo برای Agent Manager یک loop مشخص پیشنهاد می‌کند:

1. Agent کار کند.
    
2. نتیجه را خودتان verify کنید.
    
3. diff را بررسی کنید.
    
4. feedback بدهید.
    
5. دوباره اجرا و review کنید تا تغییرات آماده شوند.
    

### تست را خودتان اجرا کنید

از terminal اختصاصی همان Worktree استفاده کنید. چون terminal در مسیر همان Worktree اجرا می‌شود، commandهایی مثل `git status` یا testهای پروژه روی branch همان Agent اعمال می‌شوند.



### Diff را بررسی کنید

در diff review دنبال این موارد باشید:

- فایل‌هایی که نباید تغییر می‌کردند
    
- refactorهای بدون دلیل
    
- dependencyهای جدید
    
- تغییر APIهای دیگر
    
- تست‌های ناقص
    
- تغییرات خارج از scope
    

نکته مهم این است:

> «Agent گفت تمام شد» نقطه پایان نیست؛ «diff آماده است» نقطه پایان است.

Kilo هم دقیقاً روی همین workflow تأکید می‌کند.




## چند نتیجه را چطور امن Merge کنیم؟

وقتی چند Agent تمام می‌شوند، سه مسیر اصلی دارید:

- **Apply to local**
    
- **Merge مستقیم**
    
- **ساخت Pull Request**
    

Kilo هر سه workflow را برای انتقال تغییرات از Worktree به branch اصلی پشتیبانی می‌کند.

### اول تغییرات پایه‌ای را ادغام کنید

فرض کنید Agent A قرارداد API را تغییر داده و Agent B frontend را بر اساس آن contract ساخته است.

در این وضعیت بهتر است:

```text
Merge Agent A
      ↓
Update Agent B
      ↓
Review Agent B
      ↓
Merge Agent B
```

Kilo نیز برای حالتی که چند Worktree تقریباً هم‌زمان آماده می‌شوند، ادغام تغییر پایه‌ای را در اولویت قرار می‌دهد و سپس از Worktreeهای باقی‌مانده می‌خواهد parent branch جدید را وارد کنند.

### Worktree را بیش از حد قدیمی نگه ندارید

اگر یک branch چند روز بدون sync باقی بماند، احتمالاً integration سخت‌تر می‌شود.

Kilo توصیه می‌کند تغییرات را ظرف یکی دو روز ادغام کنید یا در Worktreeهای قدیمی، parent branch را مرتباً وارد کنید.

### داخل Worktree از `git stash` استفاده نکنید

این یک نکته مهم و کمتر بدیهی است.

Kilo هشدار می‌دهد که `git stash` داخل Worktreeهای مدیریت‌شده می‌تواند مشکل‌ساز شود، چون stash در Git directory مشترک repository ذخیره می‌شود. در نتیجه stash یک Worktree ممکن است در Worktree دیگری نیز دیده شود.

برای کار نیمه‌تمام، یک WIP commit یا branch موقت گزینه امن‌تری است.

### وقتی چند Worktree هم‌زمان تمام شدند

همه را یک‌جا merge نکنید.

ترتیب بهتر:

1. foundational change را مشخص کنید.
    
2. آن را merge کنید.
    
3. parent branch جدید را به Worktreeهای باقی‌مانده وارد کنید.
    
4. conflictها را با توجه به هدف هر branch حل کنید.
    
5. diff را دوباره Review کنید.
    

در conflict فقط نگویید:

> Fix the conflicts.

بهتر است context هر دو طرف را به Agent بدهید؛ مثلاً توضیح دهید یک branch چه چیزی اضافه کرده و branch هدف در همین فاصله چه تغییری کرده است. Kilo این روش را برای conflict resolution پیشنهاد می‌کند.


## چند Agent را هم‌زمان اجرا کنیم؟

اینجا یک تفاوت مهم وجود دارد.

مستندات فعلی Agent Manager می‌گویند ابزار `agent_manager` می‌تواند در یک درخواست **۱ تا ۲۰ task** دریافت کند. اما همین مستندات در بخش workflow توصیه می‌کنند **بیش از چهار یا پنج Agent را هم‌زمان اجرا نکنید**. دلیل این محدودیت عملی، هزینه Review و integration است؛ نه این‌که Kilo الزاماً از نظر فنی نتواند sessionهای بیشتری ایجاد کند.

پس بهتر است این دو مفهوم را از هم جدا کنیم:

|وضعیت|رویکرد پیشنهادی|
|---|---|
|task کوچک و tightly coupled|یک Agent|
|دو بخش مستقل|دو Agent|
|چند slice مستقل|حدود ۳ تا ۴ Agent|
|چند Worktree با نیاز شدید به Review|حداکثر حدود ۴ تا ۵|
|بیشتر از این|فقط با دلیل مشخص و workflow قوی|

هدف این نیست که بیشترین تعداد Agent ممکن را اجرا کنید.

سؤال درست این است:

> **چند workstream مستقل دارم که واقعاً می‌توانم آن‌ها را Review و integrate کنم؟**


## Multi-Version با تقسیم task چه تفاوتی دارد؟

گاهی مسئله شما این نیست که یک feature را به چند بخش تقسیم کنید. مسئله این است که نمی‌دانید **کدام approach بهتر است**.

در این حالت Multi-Version مناسب‌تر است.

Kilo در Agent Manager امکان اجرای حداکثر **۴ پیاده‌سازی موازی از یک prompt** را در Worktreeهای جدا فراهم می‌کند و می‌توانید برای نسخه‌های مختلف modelهای متفاوت انتخاب کنید.

این دو workflow را مقایسه کنید.

### تقسیم feature

```text
Agent A → backend
Agent B → frontend
Agent C → tests
```

### Multi-Version

```text
همان task
   ↓
Approach A
Approach B
Approach C
   ↓
مقایسه
   ↓
انتخاب بهترین نتیجه
```

پس:

- **Task splitting** برای افزایش parallel throughput است.
    
- **Multi-Version** برای کاهش uncertainty و مقایسه approachهاست.
    

مثلاً اگر یک refactor پیچیده دارید و نمی‌دانید کدام مدل یا implementation strategy بهتر جواب می‌دهد، Multi-Version می‌تواند مفیدتر از تقسیم artificial کار باشد.


## خطاهای رایج در اجرای چند Agent

### Agentها روی فایل‌های مشابه کار می‌کنند

Worktree جلوی overwrite مستقیم را می‌گیرد، اما conflict معنایی را حذف نمی‌کند.

دو branch ممکن است کاملاً مستقل اجرا شوند و در زمان merge، هر دو به یک بخش از یک قرارداد وابسته باشند.

**راه‌حل:** taskها را حول module یا contractهای مشخص تقسیم کنید.

### Port مشترک باعث شکست می‌شود

Worktreeها جدا هستند، اما `localhost:3000` جدا نیست.

**راه‌حل:** port را از environment بخوانید یا برای هر Worktree مقدار متفاوتی تولید کنید.

### Database یا container مشترک است

اگر همه Agentها به یک database یا container دسترسی دارند، isolation فایل‌های Git مشکل را حل نمی‌کند.

**راه‌حل:** resourceها را per-worktree namespace کنید یا برای taskهای موردنظر resource مشترک را اصلاً موازی نکنید.

### Branchها stale شده‌اند

هرچه یک Worktree بیشتر بدون sync بماند، merge سخت‌تر می‌شود.

**راه‌حل:** parent branch را مرتباً update کنید.

### Agentهای بیش از حد

در ابتدا اضافه کردن Agent جدید جذاب به نظر می‌رسد. اما هر Agent یک diff دیگر، یک branch دیگر و یک نتیجه دیگر برای review ایجاد می‌کند.

Kilo همین coordination overhead را دلیل توصیه به حداکثر حدود چهار یا پنج Agent هم‌زمان می‌داند.

### تعداد زیاد Worktreeها می‌تواند هزینه عملیاتی داشته باشد

هر Worktree checkout جداگانه‌ای روی دیسک دارد و dependencyها، build artifactها، databaseهای محلی و cacheهایی که داخل آن ایجاد می‌شوند نیز می‌توانند مصرف دیسک را چند برابر کنند. Kilo همچنین اشاره می‌کند که بستن Worktree، checkout آن را حذف می‌کند اما resourceهای خارجی مثل container، volume، simulator و database را لزوماً پاک نمی‌کند.


## محدودیت‌های Kilo Code Agent Manager

Agent Manager اجرای موازی را ساده‌تر می‌کند، اما مشکل coordination را حذف نمی‌کند.

### هنوز باید کد را Review کنید

چند Agent مستقل به معنی حذف review انسانی نیست.

در عمل، بخشی از کاری که از «پیاده‌سازی» کم می‌شود، به «بررسی، انتخاب و ادغام» منتقل می‌شود.

### Worktree محیط کاملاً مستقل نیست

Providerها، modelها، MCP serverها و تنظیمات extension مشترک هستند و resourceهای خارجی نیز ممکن است بین Worktreeها مشترک بمانند.

### هزینه دیسک را در نظر بگیرید

اگر هر Worktree dependencyها، build output یا database محلی خود را داشته باشد، هزینه storage به تعداد sessionها افزایش می‌یابد.

### Agent Manager هنوز در حال توسعه است

Agent Manager بخشی نسبتاً جدید و فعال در Kilo Code است و رفتار UI و برخی جزئیات عملیاتی آن می‌تواند با releaseهای جدید تغییر کند. صفحه رسمی فعلی همچنان به‌طور فعال workflow، session management و Worktree behavior را مستند می‌کند.

بنابراین برای workflowهای مهم production، بهتر است قبل از اجرا documentation فعلی Kilo را بررسی کنید.


## چه زمانی Agent Manager ارزش استفاده دارد؟

### از Agent Manager استفاده کنید وقتی:

- taskها واقعاً مستقل هستند.
    
- branchهای جدا review را ساده‌تر می‌کنند.
    
- چند workstream مشخص دارید.
    
- coordination cost قابل کنترل است.
    
- می‌توانید نتیجه هر Worktree را جداگانه verify کنید.
    

### یک Agent کافی است وقتی:

- task کوچک است.
    
- بخش‌های مختلف به‌شدت به هم وابسته‌اند.
    
- requirements هنوز مرتب تغییر می‌کنند.
    
- تعامل نزدیک با یک Agent از parallelization ارزش بیشتری دارد.
    

### Multi-Version مناسب‌تر است وقتی:

- task سخت است.
    
- approach مشخص نیست.
    
- می‌خواهید modelها یا implementationهای مختلف را مقایسه کنید.
    

### Parallelization را محدود کنید وقتی:

- همه Agentها به یک فایل یا contract وابسته‌اند.
    
- database و service مشترک زیادی دارید.
    
- review همه diffها برایتان عملاً ممکن نیست.
    
- تعداد Worktreeها بیشتر از چیزی شده که می‌توانید مدیریت کنید.
    

برای شروع، دو Agent مستقل معمولاً آزمون بسیار بهتری از اجرای ده‌ها session است.


## چک‌لیست اجرای چند Agent در Kilo Code

قبل از شروع:

-  task را به بخش‌های مستقل تقسیم کرده‌ام.
    
-  قراردادهای مشترک را قبل از parallelization مشخص کرده‌ام.
    
-  هر Agent scope مشخص دارد.
    
-  repository و baseline تست‌ها را بررسی کرده‌ام.
    
-  portهای مشترک را مدیریت کرده‌ام.
    
-  database/containerهای مشترک را بررسی کرده‌ام.
    
-  setup script در صورت نیاز آماده است.
    

در طول اجرا:

-  هر Agent در Worktree مناسب کار می‌کند.
    
-  نتیجه را مستقل verify می‌کنم.
    
-  diff را بررسی می‌کنم.
    
-  Agentها را فقط بر اساس پیام موفقیت ارزیابی نمی‌کنم.
    

هنگام ادغام:

-  تغییر پایه‌ای را اول merge می‌کنم.
    
-  Worktreeهای باقی‌مانده را update می‌کنم.
    
-  conflictها را با context حل می‌کنم.
    
-  بعد از merge دوباره test می‌کنم.
    
-  Worktreeهای قدیمی و resourceهای خارجی را پاک‌سازی می‌کنم.
    


## سوالات متداول

### Kilo Code Agent Manager چیست؟

Agent Manager یک control panel در افزونه Kilo Code برای VS Code است که اجرای چند session و Agent را مدیریت می‌کند. در حالت Worktree، هر session می‌تواند branch و محیط کاری Git جداگانه داشته باشد و ابزارهایی مانند terminal و diff review نیز در اختیار شما قرار می‌گیرد.

### چطور چند Agent را هم‌زمان در Kilo Code اجرا کنم؟

در Agent Manager برای taskهای مستقل Worktreeهای جدا بسازید، اجازه دهید Agentها موازی کار کنند، نتیجه هر Worktree را تست و Review کنید و در پایان branchهای مناسب را Merge یا به PR تبدیل کنید.

### آیا Kilo Code برای Agentهای موازی از Git Worktree استفاده می‌کند؟

بله. در حالت Worktree، هر session روی یک Git Worktree و branch جدا اجرا می‌شود.

### چند Agent را در یک زمان اجرا کنیم؟

مستندات Agent Manager از درخواست‌هایی با ۱ تا ۲۰ task پشتیبانی می‌کنند، اما راهنمای workflow فعلی Kilo توصیه می‌کند بیش از چهار یا پنج Agent را هم‌زمان اجرا نکنید؛ این توصیه بیشتر مربوط به هزینه Review و integration است، نه یک سقف فنی عمومی.

### آیا Worktree جلوی Merge Conflict را می‌گیرد؟

خیر. Worktree از ویرایش مستقیم checkout یکدیگر جلوگیری می‌کند، اما conflictهای منطقی یا semantic هنگام merge همچنان ممکن‌اند.

### آیا می‌توان برای Agentهای مختلف Model متفاوت انتخاب کرد؟

بله. در Agent Manager می‌توانید برای taskهای مشخص model متفاوتی تعیین کنید و در Multi-Version نیز برای نسخه‌های مختلف از modelهای متفاوت استفاده کنید.

### آیا Agent Manager بدون Git هم کار می‌کند؟

Agent Manager یک حالت `local` نیز دارد که session را بدون Worktree و بدون isolation گیت ایجاد می‌کند. برای workflow مبتنی بر Worktree، Git لازم است.

### چرا با وجود Worktree، Agentها هنوز ممکن است با هم تداخل داشته باشند؟

چون Worktree فقط filesystem و Git state را جدا می‌کند. Portها، databaseها، containerها، emulatorها، cacheها و بعضی resourceهای دیگر ممکن است همچنان مشترک باشند.

### وقتی چند Worktree هم‌زمان تمام شدند چه کنیم؟

تغییری را که بنیادی‌تر است اول merge کنید، سپس parent branch جدید را به Worktreeهای باقی‌مانده وارد کنید و بعد آن‌ها را بررسی و ادغام کنید.

### آیا اجرای Agentهای بیشتر همیشه توسعه را سریع‌تر می‌کند؟

خیر. داده عمومی و مستقلی که یک رابطه ثابت و جهانی بین تعداد Agentها و سرعت توسعه Kilo Code را اثبات کند در این مقاله نداریم. خود Kilo نیز تأکید می‌کند که با افزایش تعداد Agentها، هزینه Review و integration افزایش پیدا می‌کند.


## جمع‌بندی: هدف بیشتر کردن Agentها نیست

Kilo Code Agent Manager زمانی بیشترین ارزش را دارد که آن را یک **workflow توسعه موازی** ببینید، نه یک دکمه برای زیاد کردن تعداد Agentها.

ابتدا taskهایی را پیدا کنید که واقعاً مستقل هستند. برای هر کدام scope مشخص تعریف کنید و از Worktree جدا استفاده کنید. بعد از اجرا، نتیجه را خودتان تست کنید، diff را Review کنید و تغییرات را با ترتیب منطقی ادغام کنید.

مهم‌ترین نکته این است که:

> **Parallel execution فقط نصف ماجراست؛ نصف دیگر coordination و integration است.**

برای شروع، دو task مستقل را موازی کنید. اگر workflow قابل‌کنترل بود، آن را به سه یا چهار Agent گسترش دهید. اگر مسئله شما بیشتر «مقایسه چند approach» است تا «تقسیم یک feature»، از Multi-Version استفاده کنید.

هدف واقعی این نیست که بیشترین تعداد Agent ممکن را اجرا کنید؛ هدف این است که **بدون ایجاد هزینه هماهنگی بیشتر از سود موازی‌سازی، کد مفید، تست‌شده و قابل ادغام تولید کنید.**

