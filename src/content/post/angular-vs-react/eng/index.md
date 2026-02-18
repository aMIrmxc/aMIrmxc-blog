---
title: "From React to Angular: A Step-by-Step Angular Guide for React Developers"
description: "If you already work with React and want to pick up Angular, this article is for you. Skip starting from scratch—compare React and Angular concepts side-by-side and take the fastest learning path."
post_id: "angular-vs-react"
publishDate: "22 Nov 2025"
tags: ["React", "Angular", "Frontend"]
eng: true
---

# Learning Angular for React Developers 

![alt text](img.png)

If you're a React developer wanting to learn Angular, or an Angular developer wanting to enter the React world, you're probably thinking: "How hard can it be?" The good news is that many fundamental concepts are shared, but Angular has a different approach, and understanding it can smooth your learning journey.

React is a flexible library that gives you freedom of action, while Angular is a complete framework with a defined structure. If you're used to installing a new library for every need, you might be a bit surprised that Angular has everything prepared in advance!

In this article, instead of starting from scratch, **we'll use your React knowledge as a bridge** and compare concepts one-by-one. We'll explore:

- **Fundamental differences** between library and framework and how to set up a project
- **Component structure**: How we go from JSX functions to TypeScript classes
- **State management**: From `useState` to class variables and new Signals
- **Props and Data Flow**: Differences between passing props and the `@Input` decorator
- **Conditionals and loops**: From `map` and `&&` to modern Angular Control Flow
- **Component lifecycle**: `useEffect` equivalents in Angular
- **Form management**: Two-Way Binding with `[(ngModel)]`
- **State management strategies**: From Services and RxJS to NgRx
- **A complete practical example**: Todo List in React and Angular side-by-side

The goal isn't to say which is better, but to **transfer your mental model** from React to Angular. So grab your tea and let's start this journey together!

---

## 1. First Glance (Framework vs Library)

**Key Philosophical Difference:**

- **React:** It's a library. You need to install third-party libraries for routing, forms, and HTTP requests. React gives you building blocks and lets you choose your own tools (React Router, Axios, React Hook Form, etc.).

- **Angular:** It's a complete framework. Everything (Router, HTTP Client, Form Validation) is built-in. Angular is also heavily dependent on **TypeScript** - it's not optional, it's the default way to work.

### Installing and Setting Up an Angular Project

To install and run an Angular project, follow these steps in order:

**Prerequisites:** Node.js must be installed on your system.

**Step 1 - Install Angular CLI**

The Angular command-line tool (CLI) is essential for building, managing, and running projects. Install it globally:

```bash
npm install -g @angular/cli
```

**Step 2 - Create a New Project**

After installing the CLI, you can create a new project:

```bash
ng new my-project
```

The CLI will ask you configuration questions (routing, styling format, etc.)

**Step 3 - Navigate to Project Folder**

```bash
cd my-project
```

**Step 4 - Run and View the Project**

To compile and run the project on a local server:

```bash
ng serve --open
```

The `--open` flag automatically opens your browser to `http://localhost:4200`

---

## 2. Component Structure

**Core Difference in Architecture:**

In React, a component is a **function** that returns JSX. In Angular, a component is a **class** marked with a decorator, and the template (HTML) and logic (TS) are usually separate (though they can be inline).

**React Approach:**

```jsx
// App.jsx
import { useState } from "react";

function App() {
	return <h1>Hello React!</h1>;
}
export default App;
```

**Angular Approach:**

```typescript
// app.component.ts
import { Component } from "@angular/core";

@Component({
	selector: "app-root", // CSS selector for this component
	standalone: true, // Modern standalone component (Angular 14+)
	template: `<h1>Hello Angular!</h1>`, // Inline template
	// OR: templateUrl: './app.component.html' for external file
	styleUrls: ["./app.component.css"],
})
export class AppComponent {
	// Application logic goes here
}
```

- The `@Component` decorator provides metadata about the component
- `selector` is how you use this component in HTML: `<app-root></app-root>`
- `standalone: true` is the modern way (Angular 14+) that doesn't require NgModules
- You can write templates inline or in separate HTML files

---

## 3. State Management

In React, you use the `useState` hook. In classic Angular, class variables **are** the state, and Angular automatically detects changes through its change detection mechanism.

_(Note: In newer Angular versions, there's a concept called Signals that's similar to useState, but we'll first look at the classic approach)._

**React Approach:**

```jsx
function Counter() {
	const [count, setCount] = useState(0);

	const increment = () => {
		setCount(count + 1);
	};

	return <button onClick={increment}>Count: {count}</button>;
}
```

**Angular Approach:**

```typescript
@Component({
	selector: "app-counter",
	standalone: true,
	template: ` <button (click)="increment()">Count: {{ count }}</button> `,
})
export class CounterComponent {
	count = 0; // This IS the state

	increment() {
		this.count++; // Direct mutation is allowed!
	}
}
```

**Key Differences Explained:**

1. **Variable Display:**
   - React: `{value}` (single curly braces in JSX)
   - Angular: `{{value}}` (double curly braces - called interpolation)

2. **Event Binding:**
   - React: `onClick` (camelCase attribute)
   - Angular: `(click)` (parentheses syntax for events)

3. **Mutation Pattern:**
   - React: Immutable - must use `setState` function
   - Angular: Mutable - can directly change class properties (change detection handles it)

---

## 4. Props / Input

In React, you receive props as function arguments. In Angular, you use the `@Input()` decorator to mark properties that can be passed from parent components.

**React (Parent → Child):**

```jsx
// Parent
<UserCard name="Ali" />;

// Child
function UserCard({ name }) {
	return <p>User: {name}</p>;
}
```

**Angular (Parent → Child):**

```typescript
// Parent Template (HTML)
<app-user-card [name]="'Ali'"></app-user-card>
// The square brackets [] indicate property binding

// Child Component (user-card.component.ts)
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-user-card',
  template: `<p>User: {{ name }}</p>`
})
export class UserCardComponent {
  @Input() name: string = ''; // Define input property
}
```

- `[name]` with square brackets means "bind this property"
- Without brackets `name="Ali"` would pass the literal string "Ali"
- With brackets `[name]="'Ali'"` evaluates the expression and passes the value
- The `@Input()` decorator makes the property accessible from parent components

---

## 5. Loops and Conditionals

In React, you use `map` and JavaScript operators (`&&` or `? :`). In modern Angular (v17+), there's new "Control Flow" syntax that's very readable.

**Conditionals (Conditional Rendering):**

**React:**

```jsx
{
	isAdmin && <button>Edit</button>;
}
```

**Angular:**

```html
@if (isAdmin) {
<button>Edit</button>
}
```

**Loops (List Rendering):**

**React:**

```jsx
<ul>
	{users.map((user) => (
		<li key={user.id}>{user.name}</li>
	))}
</ul>
```

**Angular:**

```html
<ul>
	@for (user of users; track user.id) {
	<li>{{ user.name }}</li>
	}
</ul>
```

- The `@if` and `@for` syntax is Angular's new built-in control flow (v17+)
- `track user.id` is like React's `key` prop - it helps Angular optimize rendering
- Older Angular versions used `*ngIf` and `*ngFor` directives instead
- The new syntax is cleaner and more performant

---

## 6. Lifecycle

You know `useEffect`. In Angular, there are specific methods in the class that serve similar purposes.

**Lifecycle Mapping:**

- **`useEffect(() => {}, [])` (Mount):** Equivalent to `ngOnInit` in Angular
- **`useEffect(() => { return () => {} }, [])` (Unmount):** Equivalent to `ngOnDestroy`

**Angular Lifecycle Example:**

```typescript
import { Component, OnInit, OnDestroy } from "@angular/core";

export class ExampleComponent implements OnInit, OnDestroy {
	ngOnInit() {
		console.log("Component loaded - like useEffect with empty array");
		// Good place for API calls
	}

	ngOnDestroy() {
		console.log("Component is being destroyed - like cleanup function");
		// Clean up subscriptions, timers, etc.
	}
}
```

- You must implement the interface (`implements OnInit`) to use the lifecycle method
- Other useful lifecycle hooks:
  - `ngOnChanges()` - when input properties change (like useEffect with dependencies)
  - `ngAfterViewInit()` - after component's view is fully initialized
  - `ngDoCheck()` - custom change detection

---

## 7. Form Management (Two-Way Binding)

In React, to connect an input to state, you need to write both `value` and `onChange`. Angular has a "magical" directive called `[(ngModel)]` that creates two-way binding.

**React Approach:**

```jsx
<input value={name} onChange={(e) => setName(e.target.value)} />
```

**Angular Approach:**

```html
<!-- Requires importing FormsModule -->
<input [(ngModel)]="name" />
<p>Hello {{ name }}</p>
```

- When you type in the input, the `name` variable in the class automatically updates, and vice versa
- The `[(ngModel)]` syntax is called "banana in a box" 🍌📦
- You must import `FormsModule` to use `ngModel`
- This is conceptually similar to React's controlled components but with less boilerplate

---

## 8. State Management Approaches in Angular

Unlike React where third-party libraries (like Redux or Zustand) are quickly added to projects, Angular's framework has very powerful built-in tools. State management in Angular can be divided into three main levels:

### 1. Native Approach (Services and RxJS)

This is the most common method in medium and large projects. In React, you used Context API; in Angular, we use Services with RxJS.

- **BehaviorSubject:** A variable defined in a service that holds the state
- **Observable:** Components "subscribe" to this state to be notified of changes

**Example Pattern:**

```typescript
// state.service.ts
import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable({ providedIn: "root" })
export class StateService {
	private countSubject = new BehaviorSubject<number>(0);
	count$ = this.countSubject.asObservable();

	increment() {
		this.countSubject.next(this.countSubject.value + 1);
	}
}
```

### 2. Using Signals (Modern Approach)

If you're comfortable with `useState` in React, Signals (introduced in v16+) will be your best friend in Angular. Signals make state management much simpler, improve performance, and make code more readable.

- **Writable Signals:** Works like `useState`
- **Computed Signals:** Like `useMemo` for state-dependent calculations
- **Effect:** Like `useEffect` for running side effects when state changes

**Example:**

```typescript
import { signal, computed, effect } from "@angular/core";

export class CounterComponent {
	count = signal(0);
	doubleCount = computed(() => this.count() * 2);

	constructor() {
		effect(() => {
			console.log("Count changed:", this.count());
		});
	}

	increment() {
		this.count.update((val) => val + 1);
	}
}
```

### 3. Global State Management (NgRx)

If you used Redux in React, NgRx is exactly equivalent. This library is built on Redux patterns and includes Actions, Reducers, and Effects.

- **Suitable for:** Very large projects with high complexity
- **Note:** Learning NgRx takes time due to significant boilerplate

**Quick Comparison:**

| Concept in React      | Equivalent in Angular               |
| --------------------- | ----------------------------------- |
| useState / useReducer | Signals or Internal Component State |
| Context API           | Services + RxJS (BehaviorSubject)   |
| Redux / Zustand       | NgRx or NGXS                        |
| useEffect             | Signals Effect or RxJS Hooks        |

This section requires detailed explanation, so it will be fully covered in the next part of this series. If you want it published sooner, please let me know in the comments!

---

## 9. Complete Code Example (Simple Todo List)

Let's build a complete **Todo List** to see the different mental models side-by-side.

### React Version (Functional with Hooks)

This is the code you're probably familiar with:

```jsx
import { useState } from "react";
import "./App.css";

function TodoApp() {
	// 1. State Definition
	const [text, setText] = useState("");
	const [todos, setTodos] = useState([
		{ id: 1, title: "Learn React", completed: true },
		{ id: 2, title: "Learn Angular", completed: false },
	]);

	// 2. Logic Methods
	const addTodo = () => {
		if (!text.trim()) return;
		const newTodo = { id: Date.now(), title: text, completed: false };

		setTodos([...todos, newTodo]);
		setText("");
	};

	const deleteTodo = (id) => {
		setTodos(todos.filter((t) => t.id !== id));
	};

	const toggleTodo = (id) => {
		setTodos(
			todos.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)),
		);
	};

	// 3. Template (JSX)
	return (
		<div className="container">
			<h2>My Todo List (React)</h2>

			<div className="input-group">
				<input
					value={text}
					onChange={(e) => setText(e.target.value)}
					placeholder="New task..."
				/>
				<button onClick={addTodo}>Add</button>
			</div>

			<ul>
				{todos.map((todo) => (
					<li key={todo.id}>
						<span
							onClick={() => toggleTodo(todo.id)}
							style={{
								textDecoration: todo.completed ? "line-through" : "none",
							}}
						>
							{todo.title}
						</span>
						<button onClick={() => deleteTodo(todo.id)}>Delete</button>
					</li>
				))}
			</ul>
		</div>
	);
}

export default TodoApp;
```

### Angular Version

In Angular, files are usually separate (TS, HTML, CSS), but here for simplicity, everything is shown in one file.

```typescript
import { Component } from "@angular/core";
import { FormsModule } from "@angular/forms"; // 1. Required for [(ngModel)]

// Interface for TypeScript (optional but recommended)
interface Todo {
	id: number;
	title: string;
	completed: boolean;
}

@Component({
	selector: "app-todo",
	standalone: true,
	imports: [FormsModule], // Import required modules in the component itself
	template: `
		<div class="container">
			<h2>My Todo List (Angular)</h2>

			<div class="input-group">
				<!-- 3. Two-Way Binding: text value updates simultaneously in UI and class -->
				<input
					[(ngModel)]="text"
					placeholder="New task..."
					(keydown.enter)="addTodo()"
				/>
				<button (click)="addTodo()">Add</button>
			</div>

			<ul>
				<!-- 4. Control Flow: new loop syntax -->
				@for (todo of todos; track todo.id) {
					<li>
						<span
							(click)="toggleTodo(todo)"
							[style.text-decoration]="todo.completed ? 'line-through' : 'none'"
							class="todo-text"
						>
							{{ todo.title }}
						</span>
						<button (click)="deleteTodo(todo.id)">Delete</button>
					</li>
				} @empty {
					<p>No tasks exist!</p>
				}
			</ul>
		</div>
	`,
	styles: [
		`
			.todo-text {
				cursor: pointer;
				margin-right: 10px;
			}
		`,
	],
})
export class TodoComponent {
	// State Definition (simple class variables)
	text: string = "";
	todos: Todo[] = [
		{ id: 1, title: "Learn React", completed: true },
		{ id: 2, title: "Learn Angular", completed: false },
	];

	// Logic Methods
	addTodo() {
		if (!this.text.trim()) return;

		const newTodo: Todo = {
			id: Date.now(),
			title: this.text,
			completed: false,
		};

		this.todos.push(newTodo); // Direct mutation allowed!
		this.text = ""; // Clear input by changing variable
	}

	deleteTodo(id: number) {
		// We can use splice or filter and reassign to this.todos
		this.todos = this.todos.filter((t) => t.id !== id);
	}

	toggleTodo(todo: Todo) {
		// We have the object reference, change it directly!
		// No need to map the entire array
		todo.completed = !todo.completed;
	}
}
```

**Key Differences Highlighted:**

1. **State Updates:** React requires immutability (`setTodos([...todos, newTodo])`), Angular allows direct mutation (`this.todos.push(newTodo)`)

2. **Event Handling:** React uses camelCase (`onClick`), Angular uses parentheses syntax `(click)`

3. **Conditional Rendering:** React uses JSX expressions, Angular has built-in `@empty` block for empty states

4. **Two-Way Binding:** React needs `value` + `onChange`, Angular has `[(ngModel)]`

5. **Styling:** Both support inline styles, but syntax differs (`style={{}}` vs `[style.property]`)

---

## 10. Conclusion

If you've stayed with me this far, congratulations! You now have a general understanding of the differences between Angular and React, and you know that transitioning from one to the other isn't as difficult as you might have thought.

As mentioned at the beginning of the article, if you want the **advanced State Management** section (Services, RxJS, and NgRx) published sooner, please let me know in the comments so it can be prioritized.

Good luck! 🚀
