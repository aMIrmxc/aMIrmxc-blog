---
title: "Introduction to All React Hooks"
description: "A comprehensive reference for getting to know every React Hook, their use-cases and a practical example for each"
post_id: "all-react-hooks"
publishDate: "02 Mar 2024"
updatedDate: "03 Jan 2025"
tags: ["React", "Hooks", "JavaScript", "Frontend"]
eng: true
---

# Complete Guide to React Hooks

![alt text](img.png)

If you want to build applications with React, you absolutely need to become familiar with Hooks. They truly revolutionized the way we work with React and gave us a more functional approach to managing state and side effects. Whether you're just starting out or want to deepen your knowledge, this blog post covers everything you need to know.

## Hook Categories

React Hooks can be divided into eight main categories, each serving a specific purpose:

1. **State Management Hooks** - For managing component state
2. **Effect Hooks** - For performing side effects
3. **Ref Hooks** - For referencing values or DOM elements
4. **Performance Hooks** - For optimization through memoization
5. **Context Hooks** - For reading from React context
6. **Transition Hooks** - For managing transitions and improving UX
7. **Random Hooks** - Utility hooks for specific use cases
8. **React 19 Hooks** - New and powerful hooks

## Popularity Rating Table for Each Hook

- **useState** ⭐⭐⭐⭐⭐ - Constant use for component state
- **useEffect** ⭐⭐⭐ - Less frequent, mainly for synchronizing with browser APIs
- **useRef** ⭐⭐⭐⭐ - Common for DOM refs and mutable values
- **useContext** ⭐⭐⭐⭐ - Essential for using context
- **useMemo/useCallback** ⭐⭐⭐ - When you need performance optimization
- **useReducer** ⭐⭐⭐ - For complex state logic
- **useTransition/useDeferredValue** ⭐⭐ - For performance-sensitive UIs
- **useId** ⭐⭐ - For accessibility and forms
- **useLayoutEffect** ⭐⭐ - Rare, for DOM measurements
- **useImperativeHandle** ⭐ - Very rare, for library creators
- **useDebugValue** ⭐ - Only for development
- **useSyncExternalStore** ⭐ - Only for library creators
- **useInsertionEffect** ⭐ - Only for CSS-in-JS libraries

## State Management Hooks

### useState - The Foundation

`useState` is the most widely used and fundamental Hook in React. It's excellent for managing simple state in any component.

**Usage frequency: Very High** ⭐⭐⭐⭐⭐

```jsx
import React, { useState } from "react";

function Counter() {
	const [count, setCount] = useState(0);
	const [isVisible, setIsVisible] = useState(true);
	const [user, setUser] = useState({ name: "", email: "" });

	return (
		<div>
			<p>Count: {count}</p>
			<button onClick={() => setCount(count + 1)}>Increment</button>

			{isVisible && <p>This is conditionally displayed!</p>}
			<button onClick={() => setIsVisible(!isVisible)}>
				Toggle Visibility
			</button>
		</div>
	);
}
```

**Excellent use cases:**

- Inputs and user interactions
- Toggle states (modals, dropdowns, tooltips)
- Conditional application of styles and classes
- Counters and simple numeric values
- Shopping cart product quantities

`useState` is the workhorse of React. It allows functional components to have state, which was previously only possible in class components. The hook returns an array with two elements: the current state value and a function to update it. You can store any type of value: primitives (numbers, strings, booleans), objects, or arrays.

### useReducer - Complex State Management

When `useState` becomes heavy-handed for multiple related states, `useReducer` gives you better structure.

**Usage frequency: Medium** ⭐⭐⭐

```jsx
import React, { useReducer } from "react";

const initialState = {
	loading: false,
	data: null,
	error: null,
};

function dataReducer(state, action) {
	switch (action.type) {
		case "FETCH_START":
			return { ...state, loading: true, error: null };
		case "FETCH_SUCCESS":
			return { ...state, loading: false, data: action.payload };
		case "FETCH_ERROR":
			return { ...state, loading: false, error: action.payload };
		default:
			return state;
	}
}

function DataFetcher() {
	const [state, dispatch] = useReducer(dataReducer, initialState);

	const fetchData = async () => {
		dispatch({ type: "FETCH_START" });
		try {
			const response = await fetch("/api/data");
			const data = await response.json();
			dispatch({ type: "FETCH_SUCCESS", payload: data });
		} catch (error) {
			dispatch({ type: "FETCH_ERROR", payload: error.message });
		}
	};

	return (
		<div>
			<button onClick={fetchData}>Fetch Data</button>
			{state.loading && <p>Loading...</p>}
			{state.error && <p>Error: {state.error}</p>}
			{state.data && <pre>{JSON.stringify(state.data, null, 2)}</pre>}
		</div>
	);
}
```

**Excellent use cases:**

- Forms with multiple related inputs
- Complex state logic with multiple sub-values
- States that are interdependent
- Data fetching states with loading and error

`useReducer` is particularly useful when you have complex state logic involving multiple sub-values, or when the next state depends on the previous one. It follows the Redux pattern with a reducer function that takes the current state and an action, then returns a new state. This makes state transitions more predictable and easier to test.

### useSyncExternalStore - External State Integration

This specialized Hook is for integrating non-React state management libraries.

**Usage frequency: Very Low** ⭐

```jsx
import { useSyncExternalStore } from "react";

// Example with a simple external store
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
		this.listeners.forEach((listener) => listener());
	},
};

function ExternalStoreComponent() {
	const state = useSyncExternalStore(
		store.subscribe.bind(store),
		store.getState.bind(store),
	);

	return (
		<div>
			<p>External Count: {state.count}</p>
			<button onClick={() => store.setState({ count: state.count + 1 })}>
				Increment External Store
			</button>
		</div>
	);
}
```

This hook is designed for library authors who need to integrate external data sources with React's concurrent rendering. It ensures that your component stays synchronized with an external store even during concurrent rendering scenarios. Most developers will never need this hook unless they're building a state management library or integrating with legacy stores.

## Effect Hooks

### useEffect - Side Effect Management

`useEffect` is for synchronizing with external systems, not for event handling or data fetching in modern React.

**Usage frequency: Medium** ⭐⭐⭐

```jsx
import React, { useState, useEffect } from "react";

function DocumentTitle() {
	const [count, setCount] = useState(0);

	// Synchronizing with browser API
	useEffect(() => {
		document.title = `Count: ${count}`;
	}, [count]);

	// Media player synchronization example
	useEffect(() => {
		const video = document.getElementById("my-video");
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
			<p>Count: {count}</p>
			<button onClick={() => setCount(count + 1)}>Increment</button>
			<video id="my-video" src="example.mp4" />
		</div>
	);
}
```

**Important notes:**

- Don't use for event-based side effects (use event handlers instead)
- Avoid for data fetching (use React Query, SWR, or framework patterns)
- Excellent for synchronizing with browser APIs

`useEffect` runs after React has committed changes to the DOM. It's designed for synchronizing your component with systems outside of React (like browser APIs, third-party libraries, or network requests). The dependency array tells React when to re-run the effect. An empty array means it runs once on mount, while omitting it means it runs after every render.

### useLayoutEffect - Synchronous Effects

Runs before the browser paints the screen.

**Usage frequency: Low** ⭐⭐

```jsx
import React, { useLayoutEffect, useRef, useState } from "react";

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
					position: "absolute",
					top: `-${tooltipHeight + 10}px`, // Position based on measured height
				}}
			>
				This tooltip is positioned based on its measured height
			</div>
		</div>
	);
}
```

`useLayoutEffect` has the same signature as `useEffect`, but it fires synchronously after all DOM mutations but before the browser has painted. This is useful when you need to read layout from the DOM and synchronously re-render. Use it sparingly as it can hurt performance by blocking visual updates.

### useInsertionEffect - CSS-in-JS Libraries

Highly specialized Hook for CSS-in-JS library creators.

**Usage frequency: Never** ⭐

```jsx
// Typically used inside libraries like styled-components
import { useInsertionEffect } from "react";

function useCSS(css) {
	useInsertionEffect(() => {
		// Insert CSS before other effects run
		const style = document.createElement("style");
		style.textContent = css;
		document.head.appendChild(style);

		return () => {
			document.head.removeChild(style);
		};
	}, [css]);
}
```

This hook fires before any DOM mutations. It's intended for CSS-in-JS library authors who need to inject styles into the DOM before layout effects read from it. Regular application developers should never use this hook.

## Ref Hooks

### useRef - Mutable References

`useRef` provides a way to persist values between renders without causing re-renders.

**Usage frequency: High** ⭐⭐⭐⭐

```jsx
import React, { useRef, useState } from "react";

function TimerComponent() {
	const [seconds, setSeconds] = useState(0);
	const intervalRef = useRef(null);
	const inputRef = useRef(null);

	const startTimer = () => {
		intervalRef.current = setInterval(() => {
			setSeconds((prev) => prev + 1);
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
			<p>Timer: {seconds} seconds</p>
			<button onClick={startTimer}>Start</button>
			<button onClick={stopTimer}>Stop</button>

			<input ref={inputRef} placeholder="Focus on me!" />
			<button onClick={focusInput}>Focus Input</button>
		</div>
	);
}
```

**Common use cases:**

- Storing timer IDs, intervals, timeouts
- References to DOM elements
- Keeping previous values
- Any mutable value that shouldn't trigger re-renders

`useRef` returns a mutable object whose `.current` property persists across renders. Unlike state, updating a ref doesn't trigger a re-render. This makes it perfect for storing values that you need to track but don't need to display, like timer IDs or DOM elements for direct manipulation.

### useImperativeHandle - Ref Forwarding

Used with `forwardRef` to customize the instance exposed to parent components.

**Usage frequency: Very Low** ⭐

```jsx
import React, { forwardRef, useImperativeHandle, useRef } from "react";

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
		},
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
			<button onClick={handleFocus}>Focus Custom Input</button>
		</div>
	);
}
```

This hook lets you customize the value that's exposed when a parent component uses a ref on your component. Instead of exposing the entire DOM element, you can expose only specific methods. This is useful for building reusable component libraries where you want to control the API surface.

## Performance Hooks

### useMemo - Memoize Values

Memoizes expensive computations to prevent unnecessary recalculations.

**Usage frequency: Medium** ⭐⭐⭐

```jsx
import React, { useMemo, useState } from "react";

function ExpensiveComponent({ numbers }) {
	const [multiplier, setMultiplier] = useState(1);

	// Expensive calculation - only runs when numbers or multiplier change
	const expensiveSum = useMemo(() => {
		console.log("Calculating expensive sum...");
		return numbers.reduce((sum, num) => sum + num, 0) * multiplier;
	}, [numbers, multiplier]);

	// Memoized object to prevent unnecessary child component re-renders
	const config = useMemo(
		() => ({
			theme: "dark",
			multiplier,
			total: expensiveSum,
		}),
		[multiplier, expensiveSum],
	);

	return (
		<div>
			<p>Sum: {expensiveSum}</p>
			<button onClick={() => setMultiplier(multiplier + 1)}>
				Increase Multiplier
			</button>
		</div>
	);
}
```

`useMemo` caches the result of a calculation between re-renders. It only recalculates when one of its dependencies changes. This is useful for expensive operations like filtering large arrays, complex calculations, or creating objects/arrays that are passed as props (to prevent child re-renders).

### useCallback - Memoize Functions

Memoizes functions to prevent recreation on every render.

**Usage frequency: Medium** ⭐⭐⭐

```jsx
import React, { useCallback, useState, memo } from "react";

// Child component wrapped with memo to demonstrate optimization
const Button = memo(({ onClick, children }) => {
	console.log(`Rendering button: ${children}`);
	return <button onClick={onClick}>{children}</button>;
});

function CallbackExample() {
	const [count, setCount] = useState(0);
	const [otherState, setOtherState] = useState(0);

	// Without useCallback, this function is recreated on every render
	const increment = useCallback(() => {
		setCount((prev) => prev + 1);
	}, []); // No dependencies, function never changes

	const decrement = useCallback(() => {
		setCount((prev) => prev - 1);
	}, []);

	return (
		<div>
			<p>Count: {count}</p>
			<Button onClick={increment}>Increment</Button>
			<Button onClick={decrement}>Decrement</Button>

			<p>Other State: {otherState}</p>
			<button onClick={() => setOtherState(otherState + 1)}>
				Update Other State
			</button>
		</div>
	);
}
```

`useCallback` is similar to `useMemo`, but instead of memoizing a calculated value, it memoizes the function itself. This is particularly useful when passing callbacks to optimized child components that rely on reference equality to prevent unnecessary renders (like components wrapped in `React.memo`).

## Context Hooks

### useContext - Using Context

Reads values from React Context providers.

**Usage frequency: High** ⭐⭐⭐⭐

```jsx
import React, { createContext, useContext, useState } from "react";

// Create contexts
const ThemeContext = createContext();
const UserContext = createContext();

// Provider component
function AppProvider({ children }) {
	const [theme, setTheme] = useState("light");
	const [user, setUser] = useState({ name: "Ali", role: "user" });

	return (
		<ThemeContext.Provider value={{ theme, setTheme }}>
			<UserContext.Provider value={{ user, setUser }}>
				{children}
			</UserContext.Provider>
		</ThemeContext.Provider>
	);
}

// Component that uses context
function ThemedButton() {
	const { theme, setTheme } = useContext(ThemeContext);
	const { user } = useContext(UserContext);

	return (
		<button
			style={{
				backgroundColor: theme === "dark" ? "#333" : "#fff",
				color: theme === "dark" ? "#fff" : "#333",
			}}
			onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
		>
			Hello {user.name}! Toggle theme
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

`useContext` allows you to subscribe to React context without introducing nesting. Instead of wrapping your component in a Context Consumer, you can simply call `useContext` and pass in the context object. This makes your code cleaner and easier to read. It's perfect for sharing data that's needed by many components at different nesting levels (like themes, current user, or language preferences).

## Transition Hooks

### useTransition - Non-urgent Updates

Marks state updates as non-urgent to keep the UI responsive.

**Usage frequency: Low** ⭐⭐

```jsx
import React, { useState, useTransition } from "react";

function SearchableList({ items }) {
	const [query, setQuery] = useState("");
	const [filteredItems, setFilteredItems] = useState(items);
	const [isPending, startTransition] = useTransition();

	const handleSearch = (value) => {
		setQuery(value); // Urgent update - updates immediately

		startTransition(() => {
			// Non-urgent update - can be interrupted
			const filtered = items.filter((item) =>
				item.toLowerCase().includes(value.toLowerCase()),
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
				placeholder="Search items..."
			/>

			{isPending && <p>Filtering...</p>}

			<ul style={{ opacity: isPending ? 0.5 : 1 }}>
				{filteredItems.map((item, index) => (
					<li key={index}>{item}</li>
				))}
			</ul>
		</div>
	);
}
```

`useTransition` allows you to mark certain state updates as transitions, which means they can be interrupted by more urgent updates. This is useful for keeping your UI responsive when dealing with expensive operations like filtering large lists. The input field updates immediately (urgent), while the list filtering happens in the background (non-urgent) and can be interrupted if the user types again.

### useDeferredValue - Defer Updates

Defers updates to keep the app responsive, similar to `useTransition` but simpler.

**Usage frequency: Low** ⭐⭐

```jsx
import React, { useState, useDeferredValue } from "react";

function DeferredSearch({ items }) {
	const [query, setQuery] = useState("");
	const deferredQuery = useDeferredValue(query);

	// This expensive filtering uses the deferred value
	const filteredItems = items.filter((item) =>
		item.toLowerCase().includes(deferredQuery.toLowerCase()),
	);

	return (
		<div>
			<input
				type="text"
				value={query}
				onChange={(e) => setQuery(e.target.value)}
				placeholder="Search items..."
			/>

			<p>Searching for: {deferredQuery}</p>

			<ul>
				{filteredItems.map((item, index) => (
					<li key={index}>{item}</li>
				))}
			</ul>
		</div>
	);
}
```

`useDeferredValue` lets you defer re-rendering a non-urgent part of the UI. The input updates immediately, but the deferred value "lags behind" and updates only when React has free time. This is simpler than `useTransition` when you just need to defer a value rather than an entire state update.

## Random Hooks

### useDebugValue - Development Tool

Displays custom labels for custom hooks in React DevTools.

**Usage frequency: Very Low** ⭐

```jsx
import { useState, useDebugValue } from "react";

function useCounter(initialValue = 0) {
	const [count, setCount] = useState(initialValue);

	// Displays "Counter: 5" in React DevTools
	useDebugValue(count, (count) => `Counter: ${count}`);

	const increment = () => setCount((prev) => prev + 1);
	const decrement = () => setCount((prev) => prev - 1);

	return { count, increment, decrement };
}

function CounterComponent() {
	const { count, increment, decrement } = useCounter(10);

	return (
		<div>
			<p>Count: {count}</p>
			<button onClick={increment}>+</button>
			<button onClick={decrement}>-</button>
		</div>
	);
}
```

This hook is purely for debugging purposes. It adds a label to your custom hook in React DevTools, making it easier to inspect what's happening. The second parameter is optional and formats the displayed value. Most developers won't need this unless they're building reusable hook libraries.

### useId - Generate Unique IDs

Generates unique IDs for accessibility and form elements.

**Usage frequency: Low** ⭐⭐

```jsx
import React, { useId } from "react";

function FormField({ label, type = "text" }) {
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
			<FormField label="Email" type="email" />
			<FormField label="Password" type="password" />
			<FormField label="Confirm Password" type="password" />
		</form>
	);
}
```

`useId` generates stable unique IDs that are consistent between server and client rendering. This is crucial for accessibility attributes like `htmlFor` and `aria-describedby`. It solves the problem of ID mismatches in server-side rendering and ensures each instance of a component gets a unique ID even when rendered multiple times.

## Final Words

Understanding React Hooks and their appropriate use cases is crucial for building efficient and maintainable React applications. While some hooks like `useState` and `useRef` are daily companions, others serve specific purposes you'll encounter less frequently.

I'd love to hear your thoughts!
