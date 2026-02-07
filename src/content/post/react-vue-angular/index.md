---
title: "React، Vue، Angular – مقایسه‌ی هم‌زمان سه غول Frontend"
description: "در این پست به‌صورت جانبی و هم‌زمان React، Vue و Angular را بررسی می‌کنیم؛ اشتراکات معماری کامپوننتی، رندرینگ واکنشی و مدیریت وضعیت را کنار هم برسی می کنیم. "
publishDate: "10 Nov 2024"
tags: ["Vue", "React" , "Angular", "Learn"]
---
# مقایسه همزمان  React ، Vue و Angular

در دنیای توسعه وب مدرن React، Vue و Angular سه ستون اصلی ساخت رابط‌های کاربری پویا و تعاملی هستند. هر کدام از این فریم‌ورک‌ها و کتابخانه‌ها با فلسفه‌ای متفاوت به دنیا آمدند، اما همگی برای حل یک مشکل بنیادین طراحی شده‌اند: مدیریت کارآمد وضعیت (State) در اپلیکیشن‌های وب.

### چرا این سه شبیه هستند؟

در نگاه اول، ممکن است این سه ابزار کاملاً متفاوت به نظر برسند، اما در عمق، اشتراکات چشمگیری دارند:

معماری کامپوننت‌محور: هر سه از مفهوم کامپوننت‌های قابل استفاده مجدد استفاده می‌کنند. شما UI را به قطعات کوچک و مستقل تقسیم می‌کنید که هر کدام مسئولیت خاص خود را دارند.

رندرینگ واکنشی (Reactive Rendering): همه آنها از الگوی داده‌محور بهره می‌برند - وقتی داده تغییر می‌کند، رابط کاربری به صورت خودکار به‌روزرسانی می‌شود. این یکی از بزرگ‌ترین مزایای آنها نسبت به جاوااسکریپت خام است.

مدیریت وضعیت: هر سه راهکارهای داخلی یا یکپارچه برای مدیریت state اپلیکیشن ارائه می‌دهند - از useState در React گرفته تا reactive data در Vue و Services در Angular.

### کارشان چیست؟

این ابزارها برای ساخت Single Page Applications (SPA) و رابط‌های کاربری دینامیک درون مرورگر طراحی شده‌اند. آنها به شما امکان می‌دهند:

- اپلیکیشن‌های وب پیچیده بسازید که مثل اپلیکیشن‌های دسکتاپ احساس می‌شوند
- تجربه کاربری روان و سریع بدون بارگذاری مجدد صفحه ایجاد کنید
- کد قابل نگهداری و مقیاس‌پذیر بنویسید


در بخش اول این مقاله قرار است مفاهیم اصلی را بررسی ‌کنیم:
1.  **ساختار کامپوننت (Component Structure)**
2.  **نمایش داده (Interpolation)**
3.  **مدیریت وضعیت (State Management)**
4.  **مدیریت رویدادها (Event Handling)**
5.  **حلقه‌ها و شرط‌ها (Control Flow)**
6.  **فرم‌ها و بایندینگ دوطرفه (Two-Way Binding)**
7.  **چرخه حیات و فراخوانی API (Lifecycle/Effects)**
8.  **استایل‌دهی (Styling)**

---

## ۱. ساختار کامپوننت (Component Structure)

هر سه ابزار از "کامپوننت" استفاده می‌کنند. کامپوننت یک قطعه کد مستقل است (مثل یک دکمه یا هدر) که HTML، CSS و Logic (جاوااسکریپت) را در خود دارد.

*   **React:** از **JSX** استفاده می‌کند (HTML داخل جاوااسکریپت).
*   **Vue:** از سیستم **Single File Component** استفاده می‌کند (بخش‌های `<template>`, `<script>`, `<style>` جدا هستند).
*   **Angular:** از **Class** و **Decorators** استفاده می‌کند و معمولاً فایل‌های HTML و CSS را جدا نگه می‌دارد.

#### مثال (یک کامپوننت ساده Hello World):

**React (Function Component):**
```jsx
// App.jsx
function App() {
  // منطق برنامه اینجا می‌آید
  return (
    <div>
      <h1>سلام دنیا!</h1>
    </div>
  );
}
export default App;
```

**Vue (Composition API):**
```html
<!-- App.vue -->
<template>
  <div>
    <h1>سلام دنیا!</h1>
  </div>
</template>

<script setup>
  // منطق برنامه اینجا می‌آید
</script>
```

**Angular (Component Decorator):**
```typescript
// app.component.ts
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `<div><h1>سلام دنیا!</h1></div>`,
})
export class AppComponent {
  // منطق برنامه اینجا می‌آید
}
```

---

## ۲. نمایش داده و متغیرها (Data Interpolation)

چگونه یک متغیر جاوااسکریپت را در صفحه نمایش دهیم؟

*   **React:** استفاده از آکولاد تکی `{ }`.
*   **Vue:** استفاده از دو آکولاد `{{ }}` (معروف به Mustache syntax).
*   **Angular:** استفاده از دو آکولاد `{{ }}` (مثل Vue).

#### مثال:

**React:**
```jsx
function App() {
  const name = "Ali";
  return <h1>سلام {name}</h1>; // یک آکولاد
}
```

**Vue:**
```html
<script setup>
  const name = "Ali";
</script>

<template>
  <h1>سلام {{ name }}</h1> <!-- دو آکولاد -->
</template>
```

**Angular:**
```typescript
export class AppComponent {
  name = "Ali";
}
// در تمپلیت: <h1>سلام {{ name }}</h1>
```

---

## ۳. مدیریت وضعیت (State) - مهم‌ترین بخش

وقتی داده تغییر می‌کند، UI باید آپدیت شود. به این داده‌ی قابل تغییر **State** می‌گویند.

*   **React:** از هوک `useState` استفاده می‌کند. شما نمی‌توانید متغیر را مستقیم تغییر دهید، باید از تابع "setter" استفاده کنید.
*   **Vue:** از `ref` (در روش مدرن Composition API) استفاده می‌کند. شما متغیر را مستقیم تغییر می‌دهید اما باید به `.value` دسترسی داشته باشید.
*   **Angular:** از ویژگی‌های کلاس (Class Properties) استفاده می‌کند. تغییر متغیر به صورت خودکار توسط Zone.js ردیابی می‌شود (یا اخیراً با Signals).

#### مثال (شمارنده یا Counter):

**React:**
```jsx
import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0); // تعریف استیت

  const increment = () => setCount(count + 1); 

  return <button onClick={increment}>تعداد: {count}</button>;
}
```

**Vue:**
```html
<script setup>
import { ref } from 'vue';

const count = ref(0); // تعریف استیت

const increment = () => count.value++; 
</script>

<template>
  <button @click="increment">تعداد: {{ count }}</button>
</template>
```

**Angular:**
```typescript
export class CounterComponent {
  count = 0; // تعریف استیت ساده

  increment() {
    this.count++; 
  }
}
// در HTML:
// <button (click)="increment()">تعداد: {{ count }}</button>
```

### ورودی گرفتن از والد (Props / Input)

در معماری کامپوننت‌محور، شما نیاز دارید داده را از کامپوننت والد (Parent) به کامپوننت فرزند (Child) بفرستید. به این داده‌ها **Props** (مخفف Properties) می‌گویند.

- **React:** پراپ‌ها به عنوان ورودی‌های تابع (Argument) به کامپوننت ارسال می‌شوند.
- **Vue:** باید در کامپوننت فرزند مشخص کنید که چه پراپ‌هایی را دریافت می‌کنید (`defineProps`).
- **Angular:** از دکوریتور `@Input()` برای مشخص کردن متغیرهای ورودی استفاده می‌کند.

فرض: یک `UserCard` که `name` می‌گیرد.

 **React (Props)**
 
**Child**
```jsx
export function UserCard({ name }) {
  return <p>User: {name}</p>;
}
```
**Parent**
```jsx
<UserCard name="Ali" />
```

 **Vue (Props)**
 
**Child**
```vue
<script setup>
defineProps({ name: String })
</script>

<template>
  <p>User: {{ name }}</p>
</template>
```
**Parent**
```vue
<UserCard name="Ali" />
```

**Angular (`@Input`)**

**Child**
```ts
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-user-card',
  template: `<p>User: {{name}}</p>`
})
export class UserCardComponent {
  @Input() name = '';
}
```
**Parent**
```html
<app-user-card [name]="'Ali'"></app-user-card>
```



### خروجی دادن به والد (Event / Emit / Output)

**React (callback prop)**

**Child**
```jsx
export function AddButton({ onAdd }) {
  return <button onClick={onAdd}>Add</button>;
}
```
**Parent**
```jsx
<AddButton onAdd={() => setCount(c => c + 1)} />
```

**Vue (`emit`)**

**Child**
```vue
<script setup>
const emit = defineEmits(['add'])
</script>

<template>
  <button @click="emit('add')">Add</button>
</template>
```
**Parent**
```vue
<AddButton @add="count++" />
```

 **Angular (`@Output` + EventEmitter)**
 
**Child**
```ts
import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-add-button',
  template: `<button (click)="add.emit()">Add</button>`,
})
export class AddButtonComponent {
  @Output() add = new EventEmitter<void>();
}
```
**Parent**
```html
<app-add-button (add)="count = count + 1"></app-add-button>
```

---

## ۴. مدیریت رویدادها (Event Handling)

چگونه کلیک کاربر یا تایپ کردن او را مدیریت کنیم؟

*   **React:** استفاده از کلمات camelCase مثل `onClick`, `onChange`.
*   **Vue:** استفاده از دایرکتیو `@` (یا `v-on:`). مثلا `@click`.
*   **Angular:** استفاده از پرانتز `( )`. مثلا `(click)`.

#### مثال (فراخوانی تابع هنگام کلیک):

**React:**
```jsx
<button onClick={handleClick}>Click Me</button>
```

**Vue:**
```html
<button @click="handleClick">Click Me</button>
```

**Angular:**
```html
<button (click)="handleClick()">Click Me</button>
```

---

## ۵. حلقه‌ها و شرط‌ها (Loops & Conditionals)

چگونه لیست‌ها را نمایش دهیم یا چیزی را مخفی کنیم؟

*   **React:** همه چیز جاوااسکریپت خالص است. از `map()` برای حلقه و از عملگر سه تایی `? :` یا `&&` برای شرط استفاده می‌شود.
*   **Vue:** از دایرکتیوهای خاص HTML مثل `v-for` و `v-if` استفاده می‌کند.
*   **Angular:** از دایرکتیوهای ساختاری مثل `*ngFor` و `*ngIf` (یا سینتکس جدید `@for`, `@if` در نسخه‌های جدید) استفاده می‌کند.

#### مثال (نمایش لیست کاربران):

فرض کنید آرایه‌ای به نام `users` داریم: `['Ali', 'Reza']`.

**React (استفاده از map):**
```jsx
<ul>
  {users.map((user, index) => (
    <li key={index}>{user}</li>
  ))}
</ul>
```

**Vue (استفاده از v-for):**
```html
<ul>
  <li v-for="(user, index) in users" :key="index">
    {{ user }}
  </li>
</ul>
```

**Angular (استفاده از *ngFor):**
```html
<ul>
  <li *ngFor="let user of users; let i = index">
    {{ user }}
  </li>
</ul>
```

#### مثال (نمایش شرطی - اگر ادمین بود):

**React:**
```jsx
{isAdmin ? <p>مدیر هستید</p> : <p>کاربر عادی</p>}
```

**Vue:**
```html
<p v-if="isAdmin">مدیر هستید</p>
<p v-else>کاربر عادی</p>
```

**Angular:**
```html
<p *ngIf="isAdmin; else userBlock">مدیر هستید</p>
<ng-template #userBlock><p>کاربر عادی</p></ng-template>
```
*(نکته: در انگولار ۱۷+ سینتکس `@if (isAdmin) { ... }` اضافه شده که شبیه جاوااسکریپت است).*


---

## ۶. فرم‌ها و بایندینگ دوطرفه (Two-Way Data Binding)

وقتی کاربر چیزی در `input` تایپ می‌کند، ما می‌خواهیم متغیر ما همزمان آپدیت شود و برعکس.

*   **React:** به صورت پیش‌فرض یک‌طرفه است. شما باید مقدار `value` را به استیت وصل کنید و در `onChange` استیت را آپدیت کنید (Controlled Component).
*   **Vue:** یک ویژگی جادویی به نام `v-model` دارد که کار را بسیار ساده می‌کند.
*   **Angular:** یک سینتکس معروف به "موز در جعبه" `[( )]` دارد: `[(ngModel)]`.

#### مثال (تایپ کردن در اینپوت و نمایش همزمان متن):

**React (دستی):**
```jsx
function Form() {
  const [text, setText] = useState('');

  return (
    <div>
      <input 
        value={text} 
        onChange={(e) => setText(e.target.value)} 
      />
      <p>شما نوشتید: {text}</p>
    </div>
  );
}
```

**Vue (اتوماتیک با v-model):**
```html
<script setup>
  import { ref } from 'vue';
  const text = ref('');
</script>

<template>
  <input v-model="text" />
  <p>شما نوشتید: {{ text }}</p>
</template>
```

**Angular (اتوماتیک با ngModel):**
```typescript
// نیاز به ایمپورت FormsModule در ماژول دارید
export class FormComponent {
  text = '';
}
// HTML:
// <input [(ngModel)]="text" />
// <p>شما نوشتید: {{ text }}</p>
```

---

## ۷. چرخه حیات (Lifecycle) - مثلاً لود شدن صفحه

گاهی می‌خواهید وقتی کامپوننت برای **اولین بار** در صفحه لود شد، یک کاری انجام دهید (مثلاً گرفتن داده از سرور/API).

*   **React:** از هوک `useEffect` با یک آرایه وابستگی خالی `[]` استفاده می‌کند.
*   **Vue:** از هوک `onMounted` استفاده می‌کند.
*   **Angular:** از اینترفیس `OnInit` و متد `ngOnInit` استفاده می‌کند.

#### مثال (لاگ کردن یک پیام هنگام لود شدن کامپوننت):

**React:**
```jsx
import { useEffect } from 'react';

function App() {
  useEffect(() => {
    console.log("کامپوننت لود شد!");
    // اینجا درخواست API می‌زنیم
  }, []);

  return <div>محتوا</div>;
}
```

**Vue:**
```html
<script setup>
import { onMounted } from 'vue';

onMounted(() => {
  console.log("کامپوننت لود شد!");
});
</script>
```

**Angular:**
```typescript
import { Component, OnInit } from '@angular/core';

export class AppComponent implements OnInit {
  ngOnInit() {
    console.log("کامپوننت لود شد!");
  }
}
```

---

## ۸. استایل‌دهی (CSS Styles)

چگونه به کامپوننت‌ها رنگ و لعاب بدهیم؟

*   **React:** روش‌های زیادی دارد. ساده‌ترین روش `import './App.css'` یا استایل درون‌خطی (Inline Style) به صورت آبجکت جاوااسکریپت است.
*   **Vue:** تگ `<style>` را در همان فایل کامپوننت دارد. اگر ویژگی `scoped` را اضافه کنید، استایل‌ها فقط روی همان کامپوننت اعمال می‌شوند (بسیار محبوب).
*   **Angular:** در فایل کامپوننت، فایلی مثل `styleUrls: ['./app.component.css']` را لینک می‌کند. انگولار به صورت پیش‌فرض استایل‌ها را ایزوله (Scoped) می‌کند.

#### مثال (قرمز کردن یک متن):

**React (Inline Style Object):**
```jsx
// استایل در ریکت یک آبجکت است، نه رشته متنی
// background-color تبدیل می‌شود به backgroundColor
<div style={{ color: 'red', fontSize: '20px' }}>
  متن قرمز
</div>
```

**Vue (Scoped CSS):**
```html
<template>
  <div class="my-text">متن قرمز</div>
</template>

<style scoped>
/* این کلاس فقط در همین فایل اثر دارد */
.my-text {
  color: red;
  font-size: 20px;
}
</style>
```

**Angular (External SCSS/CSS):**
```typescript
@Component({
  // ...
  styles: [`
    .my-text {
      color: red;
      font-size: 20px;
    }
  `]
})
```




---
##  سخن پایانی

همانطور که دیدیم  هر سه (React / Vue / Angular) برای ساختن اپلیکیشن‌ تحت مرورگر ساخته شده‌اند. «ایده‌ی مشترک» این است: UI را به **کامپوننت‌های کوچک** می‌شکنیم، **داده** را نگه می‌داریم، با **رویدادها** به صورت یکپارچه تغییرش می‌دهیم، و UI با تغییر داده **به‌روزرسانی** می‌شود. تفاوت اصلی در (syntax) و ابزارهای پیش‌فرض است.

در همین جا اولین سری از مقالات مقایسه همزمان react-vue-angular به پایان رسید.

اگر نظری و پیشنهادی داشتیم خوشحال می‌شوم که همین جا کامنت بگذارید و به امید دیدار دوباره.
