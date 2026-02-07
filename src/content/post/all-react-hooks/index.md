---
title: "معرفی همه  React Hook ها "
description: "مرجع جامع  برای آشنایی با تمام Hook های React، کاربرد و مثال عملی هرکدام"
publishDate: "02 Mar 2024"
updatedDate: "03 Jan 2025"
tags: ["React", "Hooks", "JavaScript", "Frontend"]
---


# برسی همه هوک های ریکت

اگه می‌خوای با React برنامه بسازی، حتماً باید با Hook ها آشنا بشی. اینا واقعاً شیوه‌ی کار کردن با React رو متحول کردن و یه راهکار تابعی‌تر به مدیریت state و side effect ها دادن بهمون. چه تازه شروع کرده باشی چه بخوای دونسته‌هاتو تعمیق بدی، این بلاگ پست همه چیزی که    باید بدونی رو پوشش میده.

## دسته‌بندی Hook ها

React Hook ها رو می‌تونیم به هشت دسته‌ی اصلی تقسیم کنیم که هر کدوم کار خاص خودشونو دارن:

1. **State Management Hooks** - برای مدیریت state کامپوننت
2. **Effect Hooks** - برای انجام side effect ها
3. **Ref Hooks** - برای reference کردن به value ها یا DOM element ها
4. **Performance Hooks** - برای بهینه‌سازی با memoization
5. **Context Hooks** - برای خوندن از React context
6. **Transition Hooks** - برای مدیریت transition ها و بهتر کردن UX
7. **Random Hooks** - Hook های کاربردی برای موارد خاص
8. **React 19 Hooks** - Hook های جدید و قدرتمند



## جدول میزان رایج بودن هرکدام از Hook ها

- **useState** ⭐⭐⭐⭐⭐ - مداوم برای state کامپوننت
- **useEffect** ⭐⭐⭐ - کم، عمدتاً برای همگام‌سازی با browser API
- **useRef** ⭐⭐⭐⭐ - رایج برای DOM ref ها و value های قابل تغییر
- **useContext** ⭐⭐⭐⭐ - ضروری برای استفاده از context
- **useMemo/useCallback** ⭐⭐⭐ - وقتی بهینه‌سازی performance نیاز داشته باشی
- **useReducer** ⭐⭐⭐ - برای logic های state پیچیده
- **useTransition/useDeferredValue** ⭐⭐ - برای UI های حساس به performance
- **useId** ⭐⭐ - برای accessibility و form ها
- **useLayoutEffect** ⭐⭐ - نادر، برای اندازه‌گیری DOM
- **useImperativeHandle** ⭐ - خیلی نادر، سازندگان کتابخونه
- **useDebugValue** ⭐ - فقط برای توسعه
- **useSyncExternalStore** ⭐ - فقط سازندگان کتابخونه
- **useInsertionEffect** ⭐ - فقط کتابخونه‌های CSS-in-JS



## State Management Hooks

### useState - پایه و اساس کار

`useState` پرکاربردترین و بنیادی‌ترین Hook تو React هست. برای مدیریت state ساده‌ی هر کامپوننت عالیه.

**میزان استفاده: خیلی زیاد** ⭐⭐⭐⭐⭐

```jsx
import React, { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [user, setUser] = useState({ name: '', email: '' });

  return (
    <div>
      <p>تعداد: {count}</p>
      <button onClick={() => setCount(count + 1)}>
        افزایش
      </button>

      {isVisible && <p>این شرطی نمایش داده میشه!</p>}
      <button onClick={() => setIsVisible(!isVisible)}>
        تغییر وضعیت نمایش
      </button>
    </div>
  );
}
```

**موارد استفاده‌ی عالی:**
- Input ها و تعاملات کاربر
- حالت‌های toggle (modal ها، dropdown ها، tooltip ها)
- اعمال شرطی style و class
- Counter ها و مقادیر عددی ساده
- تعداد محصولات سبد خرید

### useReducer - مدیریت State پیچیده

وقتی `useState` برای چندین state مرتبط سنگین میشه، `useReducer` ساختار بهتری بهت میده.

**میزان استفاده: متوسط** ⭐⭐⭐

```jsx
import React, { useReducer } from 'react';

const initialState = {
  loading: false,
  data: null,
  error: null
};

function dataReducer(state, action) {
  switch (action.type) {
    case 'FETCH_START':
      return { ...state, loading: true, error: null };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, data: action.payload };
    case 'FETCH_ERROR':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
}

function DataFetcher() {
  const [state, dispatch] = useReducer(dataReducer, initialState);

  const fetchData = async () => {
    dispatch({ type: 'FETCH_START' });
    try {
      const response = await fetch('/api/data');
      const data = await response.json();
      dispatch({ type: 'FETCH_SUCCESS', payload: data });
    } catch (error) {
      dispatch({ type: 'FETCH_ERROR', payload: error.message });
    }
  };

  return (
    <div>
      <button onClick={fetchData}>دریافت داده</button>
      {state.loading && <p>در حال بارگذاری...</p>}
      {state.error && <p>خطا: {state.error}</p>}
      {state.data && <pre>{JSON.stringify(state.data, null, 2)}</pre>}
    </div>
  );
}
```

**موارد استفاده‌ی عالی:**
- Form هایی با چندین input مرتبط
- logic های state پیچیده با چندین زیرمجموعه
- state هایی که به هم وابسته‌ن
- حالت‌های data fetching با loading و error

### useSyncExternalStore - ادغام State خارجی

این Hook تخصصی برای ادغام کتابخونه‌های state management غیر React هست.

**میزان استفاده: خیلی کم** ⭐

```jsx
import { useSyncExternalStore } from 'react';

// مثال با یه external store ساده
const store = {
  state: { count: 0 },
  listeners: new Set(),

  getState() {
    return this.state;
  },

  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  },

  setState(newState) {
    this.state = { ...this.state, ...newState };
    this.listeners.forEach(listener => listener());
  }
};

function ExternalStoreComponent() {
  const state = useSyncExternalStore(
    store.subscribe.bind(store),
    store.getState.bind(store)
  );

  return (
    <div>
      <p>شمارش خارجی: {state.count}</p>
      <button onClick={() => store.setState({ count: state.count + 1 })}>
        افزایش Store خارجی
      </button>
    </div>
  );
}
```

## Effect Hooks

### useEffect - مدیریت Side Effect ها

`useEffect` برای sync کردن با سیستم‌های خارجی هست، نه برای event handling یا data fetching تو React مدرن.

**میزان استفاده: متوسط** ⭐⭐⭐

```jsx
import React, { useState, useEffect } from 'react';

function DocumentTitle() {
  const [count, setCount] = useState(0);

  // همگام‌سازی با browser API
  useEffect(() => {
    document.title = `تعداد: ${count}`;
  }, [count]);

  // مثال همگام‌سازی media player
  useEffect(() => {
    const video = document.getElementById('my-video');
    if (video) {
      if (count > 5) {
        video.play();
      } else {
        video.pause();
      }
    }
  }, [count]);

  return (
    <div>
      <p>تعداد: {count}</p>
      <button onClick={() => setCount(count + 1)}>
        افزایش
      </button>
      <video id="my-video" src="example.mp4" />
    </div>
  );
}
```

** نکته ها:**
- برای side effect های event-based استفاده نکن (از event handler ها استفاده کن)
- برای data fetching اجتناب کن (از React Query، SWR یا الگوهای framework استفاده کن)
- عالی برای همگام‌سازی با browser API ها

### useLayoutEffect - Effect های همزمان

قبل از اینکه browser صفحه رو نمایش بده اجرا میشه،

**میزان استفاده: کم** ⭐⭐

```jsx
import React, { useLayoutEffect, useRef, useState } from 'react';

function MeasuredTooltip() {
  const tooltipRef = useRef(null);
  const [tooltipHeight, setTooltipHeight] = useState(0);

  useLayoutEffect(() => {
    if (tooltipRef.current) {
      const height = tooltipRef.current.getBoundingClientRect().height;
      setTooltipHeight(height);
    }
  }, []);

  return (
    <div>
      <div
        ref={tooltipRef}
        style={{
          position: 'absolute',
          top: `-${tooltipHeight + 10}px` // موقعیت بر اساس ارتفاع اندازه‌گیری شده
        }}
      >
        این tooltip بر اساس ارتفاع اندازه‌گیری شده‌اش قرار گرفته
      </div>
    </div>
  );
}
```

### useInsertionEffect - کتابخونه‌های CSS-in-JS

Hook فوق تخصصی برای سازندگان کتابخونه‌های CSS-in-JS.

**میزان استفاده: هیچ‌وقت** ⭐

```jsx
// معمولاً داخل کتابخونه‌هایی مثل styled-components استفاده میشه
import { useInsertionEffect } from 'react';

function useCSS(css) {
  useInsertionEffect(() => {
    // قبل از اجرای effect های دیگه CSS رو insert کن
    const style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, [css]);
}
```

## Ref Hooks

### useRef - Reference های قابل تغییر

`useRef` راهی برای نگه داشتن value ها بین render ها بدون ایجاد re-render میده.

**میزان استفاده: زیاد** ⭐⭐⭐⭐

```jsx
import React, { useRef, useState } from 'react';

function TimerComponent() {
  const [seconds, setSeconds] = useState(0);
  const intervalRef = useRef(null);
  const inputRef = useRef(null);

  const startTimer = () => {
    intervalRef.current = setInterval(() => {
      setSeconds(prev => prev + 1);
    }, 1000);
  };

  const stopTimer = () => {
    clearInterval(intervalRef.current);
  };

  const focusInput = () => {
    inputRef.current.focus();
  };

  return (
    <div>
      <p>تایمر: {seconds} ثانیه</p>
      <button onClick={startTimer}>شروع</button>
      <button onClick={stopTimer}>توقف</button>

      <input ref={inputRef} placeholder="روی من فوکوس کن!" />
      <button onClick={focusInput}>فوکوس Input</button>
    </div>
  );
}
```

**موارد استفاده‌ی رایج:**
- ذخیره کردن timer ID ها، interval ها، timeout ها
- reference به DOM element ها
- نگه‌داری مقادیر قبلی
- هر value قابل تغییری که نباید باعث re-render بشه

### useImperativeHandle - Ref Forwarding

همراه با `forwardRef` برای سفارشی کردن instance ای که به parent component نمایش داده میشه.

**میزان استفاده: خیلی کم** ⭐

```jsx
import React, { forwardRef, useImperativeHandle, useRef } from 'react';

const CustomInput = forwardRef((props, ref) => {
  const inputRef = useRef(null);

  useImperativeHandle(ref, () => ({
    focus: () => {
      inputRef.current.focus();
    },
    blur: () => {
      inputRef.current.blur();
    },
    getValue: () => {
      return inputRef.current.value;
    }
  }));

  return <input ref={inputRef} {...props} />;
});

function ParentComponent() {
  const customInputRef = useRef(null);

  const handleFocus = () => {
    customInputRef.current.focus();
  };

  return (
    <div>
      <CustomInput ref={customInputRef} />
      <button onClick={handleFocus}>فوکوس Custom Input</button>
    </div>
  );
}
```

## Performance Hooks

### useMemo - مموری کردن Value ها

محاسبات سنگین رو memoize میکنه تا از محاسبه‌های غیرضروری جلوگیری کنه.

**میزان استفاده: متوسط** ⭐⭐⭐

```jsx
import React, { useMemo, useState } from 'react';

function ExpensiveComponent({ numbers }) {
  const [multiplier, setMultiplier] = useState(1);

  // محاسبه‌ی سنگین - فقط وقتی numbers یا multiplier تغییر کنه اجرا میشه
  const expensiveSum = useMemo(() => {
    console.log('در حال محاسبه‌ی مجموع سنگین...');
    return numbers.reduce((sum, num) => sum + num, 0) * multiplier;
  }, [numbers, multiplier]);

  // object مموری شده برای جلوگیری از re-render غیرضروری component های فرزند
  const config = useMemo(() => ({
    theme: 'dark',
    multiplier,
    total: expensiveSum
  }), [multiplier, expensiveSum]);

  return (
    <div>
      <p>مجموع: {expensiveSum}</p>
      <button onClick={() => setMultiplier(multiplier + 1)}>
        افزایش ضریب
      </button>
    </div>
  );
}
```

### useCallback - مموری کردن Function ها

function ها رو memoize میکنه تا از ساخته شدن مجدد در هر render جلوگیری کنه.

**میزان استفاده: متوسط** ⭐⭐⭐

```jsx
import React, { useCallback, useState, memo } from 'react';

// کامپوننت فرزند wrapped شده با memo برای نمایش بهینه‌سازی
const Button = memo(({ onClick, children }) => {
  console.log(`در حال render کردن دکمه: ${children}`);
  return <button onClick={onClick}>{children}</button>;
});

function CallbackExample() {
  const [count, setCount] = useState(0);
  const [otherState, setOtherState] = useState(0);

  // بدون useCallback، این function در هر render دوباره ساخته میشه
  const increment = useCallback(() => {
    setCount(prev => prev + 1);
  }, []); // بدون dependency، function هیچ‌وقت تغییر نمیکنه

  const decrement = useCallback(() => {
    setCount(prev => prev - 1);
  }, []);

  return (
    <div>
      <p>تعداد: {count}</p>
      <Button onClick={increment}>افزایش</Button>
      <Button onClick={decrement}>کاهش</Button>

      <p>State دیگر: {otherState}</p>
      <button onClick={() => setOtherState(otherState + 1)}>
        بروزرسانی State دیگر
      </button>
    </div>
  );
}
```

## Context Hooks

### useContext - استفاده از Context

مقادیر از React Context provider ها رو می‌خونه.

**میزان استفاده: زیاد** ⭐⭐⭐⭐

```jsx
import React, { createContext, useContext, useState } from 'react';

// ایجاد context
const ThemeContext = createContext();
const UserContext = createContext();

// کامپوننت Provider
function AppProvider({ children }) {
  const [theme, setTheme] = useState('light');
  const [user, setUser] = useState({ name: 'علی', role: 'user' });

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <UserContext.Provider value={{ user, setUser }}>
        {children}
      </UserContext.Provider>
    </ThemeContext.Provider>
  );
}

// کامپوننتی که از context استفاده میکنه
function ThemedButton() {
  const { theme, setTheme } = useContext(ThemeContext);
  const { user } = useContext(UserContext);

  return (
    <button
      style={{
        backgroundColor: theme === 'dark' ? '#333' : '#fff',
        color: theme === 'dark' ? '#fff' : '#333'
      }}
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
    >
      سلام {user.name}! تغییر theme
    </button>
  );
}

function App() {
  return (
    <AppProvider>
      <ThemedButton />
    </AppProvider>
  );
}
```

## Transition Hooks

### useTransition - آپدیت های غیرضروری

state update ها رو به عنوان غیرضروری علامت‌گذاری میکنه تا UI responsive بمونه.

**میزان استفاده: کم** ⭐⭐

```jsx
import React, { useState, useTransition } from 'react';

function SearchableList({ items }) {
  const [query, setQuery] = useState('');
  const [filteredItems, setFilteredItems] = useState(items);
  const [isPending, startTransition] = useTransition();

  const handleSearch = (value) => {
    setQuery(value); // آپدیت فوری - بلافاصله اپدیت میشه

    startTransition(() => {
      // آپدیت غیرفوری - میتونه interrupt بشه
      const filtered = items.filter(item =>
        item.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredItems(filtered);
    });
  };

  return (
    <div>
      <input
        type="text"
        value={query}
        onChange={(e) => handleSearch(e.target.value)}
        placeholder="جستجوی آیتم‌ها..."
      />

      {isPending && <p>در حال فیلتر کردن...</p>}

      <ul style={{ opacity: isPending ? 0.5 : 1 }}>
        {filteredItems.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    </div>
  );
}
```

### useDeferredValue - به تعویق انداختن آپدیت ها

آپدیت ها رو به تعویق می‌ندازه تا app responsive بمونه، شبیه `useTransition` ولی ساده‌تر.

**میزان استفاده: کم** ⭐⭐

```jsx
import React, { useState, useDeferredValue } from 'react';

function DeferredSearch({ items }) {
  const [query, setQuery] = useState('');
  const deferredQuery = useDeferredValue(query);

  // این فیلترینگ سنگین از deferred value استفاده میکنه
  const filteredItems = items.filter(item =>
    item.toLowerCase().includes(deferredQuery.toLowerCase())
  );

  return (
    <div>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="جستجوی آیتم‌ها..."
      />

      <p>جستجو برای: {deferredQuery}</p>

      <ul>
        {filteredItems.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    </div>
  );
}
```

## Random Hooks

### useDebugValue - ابزار توسعه

label های سفارشی برای custom hook ها تو React DevTools نمایش میده.

**میزان استفاده: خیلی کم** ⭐

```jsx
import { useState, useDebugValue } from 'react';

function useCounter(initialValue = 0) {
  const [count, setCount] = useState(initialValue);

  // تو React DevTools "Counter: 5" نمایش میده
  useDebugValue(count, count => `Counter: ${count}`);

  const increment = () => setCount(prev => prev + 1);
  const decrement = () => setCount(prev => prev - 1);

  return { count, increment, decrement };
}

function CounterComponent() {
  const { count, increment, decrement } = useCounter(10);

  return (
    <div>
      <p>تعداد: {count}</p>
      <button onClick={increment}>+</button>
      <button onClick={decrement}>-</button>
    </div>
  );
}
```

### useId - تولید ID یکتا

ID های یکتا برای accessibility و element های form تولید میکنه.

**میزان استفاده: کم** ⭐⭐

```jsx
import React, { useId } from 'react';

function FormField({ label, type = 'text' }) {
  const id = useId();

  return (
    <div>
      <label htmlFor={id}>{label}</label>
      <input type={type} id={id} />
    </div>
  );
}

function RegistrationForm() {
  return (
    <form>
      <FormField label="ایمیل" type="email" />
      <FormField label="رمز عبور" type="password" />
      <FormField label="تایید رمز عبور" type="password" />
    </form>
  );
}
```


## سخن آخر


فهمیدن React Hook ها و موارد استفاده‌ی مناسبشون برای ساختن اپلیکیشن‌های React کارآمد و قابل نگه‌داری خیلی مهمه. در حالی که بعضی از Hook ها مثل `useState` و `useRef` همراهان روزانه‌ هستند بقیه اهداف خاصی دارن که کمتر بهشون برمی‌خوری.

خوشحال میشم نظرت رو بدونم.
