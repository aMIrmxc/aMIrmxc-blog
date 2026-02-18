---
title: "Learning Vue.js Alongside React Code Examples"
description: By reading this post you'll walk through 13 practical, comparative steps—from component structure and state to Context vs. Provide/Inject and Redux vs. Pinia.
post_id: "vue-vs-react"
publishDate: "09 Oct 2024"
tags: ["Vue", "Learn", "React"]
eng: true
---

# Learning Vue.js for React Developers

![alt text](img.png)

**A Practical 13-Step Comparative Guide: From Component Structure and State to Context vs. Provide/Inject and Redux vs. Pinia**

If you're a React developer wanting to enter the Vue world, or even a Vue developer trying to understand React, you've come to the right place! Learning just this article will give you everything you need to confidently understand code from both frameworks and add them to your resume with complete confidence.

**What will we learn in this post?**

We'll explore these concepts step-by-step (with direct comparisons between React and Vue):

1. **Component Structure** - JSX in React vs. the three-part structure of `.vue` files (script/template/style)
2. **State Management & Reactivity** - Comparing `useState` with `ref` and `reactive`, and why mutation in Vue isn't problematic
3. **Conditionals & Loops** - Pure JavaScript in React vs. Directives like `v-if` and `v-for` in Vue
4. **Props & Parent-Child Communication** - Destructuring props in React vs. `defineProps` and `defineEmits` in Vue
5. **Side Effects & Lifecycle** - Equivalents of `useEffect` like `onMounted`, `watch`, and `onUnmounted`
6. **Computed Values** - Comparing `useMemo` with Vue's powerful `computed` capability
7. **Forms & Two-way Binding** - Manual input control in React vs. the magic of `v-model` in Vue
8. **Children in React and Slots in Vue** - Two different approaches for injecting content into components
9. **Deep Component Data Sharing** - Context API in React vs. Provide/Inject in Vue
10. **Logic Reusability** - Custom Hooks in React vs. Composables in Vue and their important functional differences
11. **DOM Access** - `useRef` in React vs. Template Refs in Vue
12. **Global State Management** - Comparing Redux/Zustand with Vue's official solution: **Pinia**
13. **A Simple Project (To-Do List)** - Implementing a real but simple example

Let's go! 🚀

---

## 1. Component Structure

In React, logic and template (JSX) are combined in a JavaScript function. In Vue, we typically use `.vue` files with three separate sections:

1. `<script setup>`: Application logic (JavaScript)
2. `<template>`: Application appearance (HTML)
3. `<style>`: Styles (CSS)

This separation of concerns in Vue makes it easier to navigate and maintain larger components, as styling, markup, and logic are visually distinct. The `scoped` attribute on `<style>` ensures CSS only applies to this component.

**React:**

```jsx
// App.jsx
import { useState } from "react";

export default function App() {
	const [name, setName] = useState("Ali");

	return (
		<div className="container">
			<h1>Hello {name}</h1>
		</div>
	);
}
```

**Vue:**

```html
<!-- App.vue -->
<script setup>
	import { ref } from "vue";

	const name = ref("Ali");
</script>

<template>
	<div class="container">
		<!-- No double curly braces needed for attributes, but required for text -->
		<h1>Hello {{ name }}</h1>
	</div>
</template>

<style scoped>
	.container {
		padding: 10px;
	}
</style>
```

---

## 2. Reactive State Management

In React you use `useState`. In Vue there are two main approaches: `ref` (for simple data like numbers and strings) and `reactive` (for objects).

**Important Note:** In Vue when using `ref` in the `<script>` section, you must use `.value` to change or read the value. However, in `<template>` you don't need `.value` (it unwraps automatically).

Vue's reactivity system is built differently from React's. While React requires immutable updates (creating new objects/arrays), Vue's reactivity tracks mutations directly. This is possible because Vue uses Proxy-based reactivity that intercepts property access and modifications.

**React:**

```jsx
const [count, setCount] = useState(0);

const increment = () => {
	setCount(count + 1); // or setCount(prev => prev + 1)
};
```

**Vue:**

```html
<script setup>
	import { ref } from "vue";

	const count = ref(0);

	const increment = () => {
		count.value++; // Direct mutation! (React's immutability requirement doesn't apply here)
	};
</script>

<template>
	<button @click="increment">Count is: {{ count }}</button>
</template>
```

---

## 3. Conditionals & Loops

React uses JavaScript's power (`map`, `&&`, `ternary`). Vue uses **Directives** (instructions starting with `v-`) in HTML.

Vue's directive-based approach keeps templates cleaner and more declarative, while React's JavaScript-first approach provides more flexibility for complex logic. Both approaches have their merits depending on your preference.

#### Conditionals

**React:**

```jsx
{
	isLoggedIn ? <UserPanel /> : <LoginBtn />;
}
{
	isVisible && <p>Hello</p>;
}
```

**Vue:**

```html
<UserPanel v-if="isLoggedIn" />
<LoginBtn v-else />

<p v-show="isVisible">Hello</p>
<!-- v-show only sets display:none -->
```

`v-if` completely removes/adds elements from the DOM, while `v-show` only toggles CSS visibility. Use `v-if` for conditions that rarely change, and `v-show` for frequent toggling.

#### Loops

**React:**

```jsx
<ul>
	{items.map((item) => (
		<li key={item.id}>{item.name}</li>
	))}
</ul>
```

**Vue:**

```html
<ul>
	<li v-for="item in items" :key="item.id">{{ item.name }}</li>
</ul>
```

---

## 4. Props

In React, props are function arguments. In Vue, you must define them with `defineProps`.

Vue's explicit prop definition provides runtime type checking and better developer experience with warnings when incorrect prop types are passed. React achieves this through TypeScript or PropTypes library.

**React:**

```jsx
function Child({ title, count }) {
	return (
		<h1>
			{title}: {count}
		</h1>
	);
}
```

**Vue:**

```html
<!-- Child.vue -->
<script setup>
	// No need to import defineProps (it's a macro)
	const props = defineProps({
		title: String,
		count: Number,
	});
</script>

<template>
	<h1>{{ title }}: {{ count }}</h1>
</template>
```

---

## 5. Side Effects & Lifecycle

The equivalent of `useEffect` in Vue is typically `onMounted` (runs once) or `watch` (to monitor changes).

Vue's lifecycle hooks are more explicit and granular than React's unified `useEffect`. This makes it clearer what the intention is - whether you're running code on mount, watching for changes, or cleaning up.

**React (run on mount):**

```jsx
useEffect(() => {
	console.log("Component mounted");
	// cleanup function
	return () => console.log("Unmounted");
}, []);
```

**Vue:**

```html
<script setup>
	import { onMounted, onUnmounted } from "vue";

	onMounted(() => {
		console.log("Component mounted");
	});

	onUnmounted(() => {
		console.log("Unmounted");
	});
</script>
```

**React (watching variable changes):**

```jsx
useEffect(() => {
	console.log("Count changed", count);
}, [count]);
```

**Vue:**

```html
<script setup>
	import { watch } from "vue";

	watch(count, (newVal, oldVal) => {
		console.log("Count changed to", newVal);
	});
</script>
```

---

## 6. Computed Properties (equivalent to useMemo)

One of Vue's most powerful features. If a value is calculated based on other state, use `computed`.

Vue's `computed` automatically tracks dependencies - you don't need to manually specify a dependency array like React's `useMemo`. This reduces bugs from forgotten dependencies and makes code cleaner.

**React:**

```jsx
const doubleCount = useMemo(() => {
	return count * 2;
}, [count]);
```

**Vue:**

```html
<script setup>
	import { computed } from "vue";

	// Automatically detects dependencies, no dependency array needed
	const doubleCount = computed(() => count.value * 2);
</script>
```

---

## 7. Forms (Two-way Binding)

This is where Vue shines. In React you must separately write `value` and `onChange`. In Vue we use `v-model` which works like magic.

Vue's `v-model` is syntactic sugar for binding both the value and the input event. It automatically handles different input types (text, checkbox, radio, select) appropriately. In React, you need to manually handle each case.

**React:**

```jsx
<input value={text} onChange={(e) => setText(e.target.value)} />
```

**Vue:**

```html
<input v-model="text" />
```

---

## 8. Children vs Slots

In React, when you want to place content between component tags, you use `props.children`.

**React:**

```jsx
// Card.jsx
function Card({ children }) {
	return <div className="card">{children}</div>;
}

// Usage
<Card>
	<h1>Title</h1>
</Card>;
```

In Vue, we use the special `<slot />` tag.

Vue's slot system is more powerful than React's children prop. Vue supports named slots (multiple content insertion points) and scoped slots (passing data back to parent), giving more flexibility for component composition.

**Vue (Card.vue):**

```html
<template>
	<div class="card">
		<!-- Passed content goes here -->
		<slot />
	</div>
</template>

<style>
	.card {
		border: 1px solid #ccc;
		padding: 10px;
	}
</style>
```

**Usage:**

```html
<Card>
	<h1>Title</h1>
</Card>
```

---

## 9. Deep Data Sharing (Context API vs Provide/Inject)

In React, to avoid "Prop Drilling" (passing props from grandparent to grandchild), you use the **Context API** (`createContext`, `Provider`, `useContext`).

In Vue, this mechanism is called **Provide/Inject**.

Vue's Provide/Inject is simpler than React's Context API - no need to create separate context objects or wrap components in providers. Just provide in the parent and inject in any descendant.

**React:**

```jsx
// Context creation
const ThemeContext = createContext("light");

// Parent
<ThemeContext.Provider value="dark">
	<Child />
</ThemeContext.Provider>;

// GrandChild
const theme = useContext(ThemeContext);
```

**Vue:**
No need to create a separate file for Context.

```html
<!-- Parent.vue -->
<script setup>
	import { provide, ref } from "vue";

	const theme = ref("dark");
	// Pass key (which can be a string) and value
	provide("themeKey", theme);
</script>

<!-- GrandChild.vue -->
<script setup>
	import { inject } from "vue";

	// Can also provide a default value (light)
	const theme = inject("themeKey", "light");
</script>

<template>
	<div>Theme is: {{ theme }}</div>
</template>
```

**Note:** If `theme` is a `ref` in the parent component and changes, it will update in the child too (Reactivity is preserved).

---

## 10. Logic Reusability (Custom Hooks vs Composables)

This is one of the most important sections.

In React we have **Custom Hooks**. In Vue they're called **Composables**. Their structure is very similar, but they have one major functional difference.

**Important Functional Difference:**

- **React Hooks:** Every time the component renders, the hook runs again (unless memoized)
- **Vue Composables:** Code inside `setup` (or the Composable) runs only **once** when the component is created. This means concerns about `useCallback` and `useMemo` are much less in Vue.

This fundamental difference stems from React's re-rendering model vs Vue's fine-grained reactivity. React components re-execute their entire function body on each render, while Vue's setup runs once and establishes reactive connections that persist.

Let's build a Composable for mouse position:

**React (useMouse.js):**

```javascript
import { useState, useEffect } from "react";

export function useMouse() {
	const [x, setX] = useState(0);
	const [y, setY] = useState(0);

	useEffect(() => {
		const update = (e) => {
			setX(e.clientX);
			setY(e.clientY);
		};
		window.addEventListener("mousemove", update);
		return () => window.removeEventListener("mousemove", update);
	}, []);

	return { x, y };
}
```

**Vue (useMouse.js):**
Exactly the same logic! Composable files are typically kept in a `composables` folder.

```javascript
import { ref, onMounted, onUnmounted } from "vue";

export function useMouse() {
	const x = ref(0);
	const y = ref(0);

	const update = (e) => {
		x.value = e.clientX;
		y.value = e.clientY;
	};

	onMounted(() => window.addEventListener("mousemove", update));
	onUnmounted(() => window.removeEventListener("mousemove", update));

	// Return ref values to use in component
	return { x, y };
}
```

**Using in Vue Component:**

```html
<script setup>
	import { useMouse } from "./composables/useMouse";

	const { x, y } = useMouse();
</script>

<template> Mouse position: {{ x }}, {{ y }} </template>
```

---

## 11. DOM Access (useRef vs Template Refs)

In React, for direct access to an HTML element (e.g., to focus an input), you use `useRef`.

**React:**

```jsx
const inputRef = useRef(null);

useEffect(() => {
	inputRef.current.focus();
}, []);

return <input ref={inputRef} />;
```

**Vue:**
In Vue, simply create a `ref` variable with the same name as the `ref` attribute in the template.

Vue's template refs are more straightforward - just match the variable name to the ref attribute. No need for `.current` property like React, just `.value` which is consistent with other refs.

```html
<script setup>
	import { ref, onMounted } from "vue";

	// Must be null initially
	const inputElem = ref(null);

	onMounted(() => {
		// Access DOM with .value
		inputElem.value.focus();
	});
</script>

<template>
	<!-- Variable name and ref attribute must match -->
	<input ref="inputElem" />
</template>
```

---

## 12. Global State Management (Redux/Zustand vs Pinia)

In the React world, you have many options (Redux Toolkit, Zustand, Context, Recoil).

In the Vue world, there's an official standard library called **Pinia** (previously Vuex, but Pinia is more modern and simpler).

Pinia was designed with Composition API in mind and provides excellent TypeScript support, DevTools integration, and a simpler API than Vuex. It's the recommended state management solution for Vue 3.

Pinia is very similar to **Zustand** in React. Very simple without extra boilerplate.

**A Simple Store in Pinia:**

```javascript
// stores/counter.js
import { defineStore } from "pinia";
import { ref, computed } from "vue";

export const useCounterStore = defineStore("counter", () => {
	// State
	const count = ref(0);

	// Getters (Computed)
	const doubleCount = computed(() => count.value * 2);

	// Actions
	function increment() {
		count.value++;
	}

	return { count, doubleCount, increment };
});
```

**Using in Component:**

```html
<script setup>
	import { useCounterStore } from "@/stores/counter";

	const store = useCounterStore();
	// Now you have access to store.count and store.increment
</script>

<template>
	<button @click="store.increment">
		Count: {{ store.count }} (Double: {{ store.doubleCount }})
	</button>
</template>
```

---

## 13. Simple Project: To-Do List

Let's implement what we learned in previous sections as a small **"To-Do List"** project.

In this example, we have a list where you can add new items, mark them as done (check), or delete them.

Let's start with React:

**React:**

```jsx
import React, { useState } from "react";

export default function TodoApp() {
	const [newTask, setNewTask] = useState("");
	const [tasks, setTasks] = useState([
		{ id: 1, text: "Learn React", done: true },
		{ id: 2, text: "Learn Vue", done: false },
	]);

	const addTask = () => {
		const text = newTask.trim();
		if (!text) return;

		setTasks((prev) => [...prev, { id: Date.now(), text, done: false }]);

		setNewTask("");
	};

	const toggleTask = (id) => {
		// In React it's better to update state immutably
		setTasks((prev) =>
			prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)),
		);
	};

	const removeTask = (id) => {
		setTasks((prev) => prev.filter((t) => t.id !== id));
	};

	return (
		<div className="mx-auto max-w-md p-4">
			<div className="mb-4 flex gap-2">
				<input
					className="flex-1 rounded border px-3 py-2"
					value={newTask}
					onChange={(e) => setNewTask(e.target.value)}
					onKeyDown={(e) => e.key === "Enter" && addTask()}
					placeholder="New task..."
				/>
				<button
					className="rounded bg-blue-600 px-4 py-2 text-white"
					onClick={addTask}
				>
					Add
				</button>
			</div>

			<ul className="space-y-2">
				{tasks.map((task) => (
					<li key={task.id} className="flex items-center justify-between">
						<span
							className={`flex-1 cursor-pointer ${task.done ? "text-gray-400 line-through" : ""}`}
							onClick={() => toggleTask(task.id)}
						>
							{task.text}
						</span>

						<button
							onClick={() => removeTask(task.id)}
							aria-label={`Delete ${task.text}`}
						>
							❌
						</button>
					</li>
				))}
			</ul>
		</div>
	);
}
```

**Vue:**

```html
<script setup>
	import { ref } from "vue";

	// 1. State Definition
	const newTask = ref("");
	const tasks = ref([
		{ id: 1, text: "Learn React", done: true },
		{ id: 2, text: "Learn Vue", done: false },
	]);

	// 2. Methods
	const addTask = () => {
		if (newTask.value.trim() === "") return;

		tasks.value.push({
			id: Date.now(),
			text: newTask.value,
			done: false,
		});

		newTask.value = ""; // Clear input
	};

	const toggleTask = (task) => {
		task.done = !task.done; // Mutating state directly!
	};

	const removeTask = (id) => {
		tasks.value = tasks.value.filter((t) => t.id !== id);
	};
</script>

<template>
	<div class="app">
		<!-- 3. Event Modifiers -->
		<!-- In React: onKeyDown={(e) => e.key === 'Enter' && addTask()} -->
		<input v-model="newTask" @keyup.enter="addTask" placeholder="New task..." />
		<button @click="addTask">Add</button>

		<ul>
			<li v-for="task in tasks" :key="task.id">
				<!-- 4. Class Binding -->
				<!-- In React: className={task.done ? 'done' : ''} -->
				<span :class="{ 'done-style': task.done }" @click="toggleTask(task)">
					{{ task.text }}
				</span>

				<button @click="removeTask(task.id)">❌</button>
			</li>
		</ul>
	</div>
</template>

<style scoped>
	.done-style {
		text-decoration: line-through;
		color: gray;
		cursor: pointer;
	}
</style>
```

**Additional Explanation for the To-Do Example:**

Key differences highlighted in this practical example:

1. **State Updates:** React requires immutable patterns (spreading, mapping), while Vue allows direct mutations
2. **Event Modifiers:** Vue's `@keyup.enter` is cleaner than React's manual key checking
3. **Two-way Binding:** `v-model` in Vue vs `value`/`onChange` in React
4. **Class Binding:** Vue's object syntax `:class="{ 'done-style': task.done }"` vs React's template literals
5. **Directives:** `v-for` provides a more template-like syntax vs `map()` in JSX

Both implementations achieve the same result, but demonstrate the different philosophies: React's JavaScript-first approach vs Vue's template-first approach with special directives.
