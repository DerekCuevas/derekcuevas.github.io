---
title: "Mastering Browser Storage in TypeScript"
date: 2023-06-03T12:03:29.544Z
tags: ["typescript","web development"]
---


The web storage API provides a simple way to store data on the browser for a certain amount of time. Web storage comes in two types of objects, the `localStorage` and the `sessionStorage`. In this post, we are going to dive deep into these storage APIs and explore some best practices and optimization methods for manipulating them with TypeScript.

### The localStorage and sessionStorage Objects

Both localStorage and sessionStorage implement the same set of methods for manipulating data:

- `setItem(key, value)` - Add or update an entry in storage for a particular key.
- `getItem(key)` - Retrieve the value for a given key from storage.
- `removeItem(key)` - Delete a key/value pair from storage.
- `clear()` - Remove all key/value pairs from storage.

The main difference between localStorage and sessionStorage is their life cycle. In short, localStorage entires persist even after your browser is closed down, while sessionStorage entries dissolve as soon as the user closes the tab or browser.

### Using the localStorage Object

You can access the localStorage object through the global `window` object. Here's how you would store and retrieve a simple string in localStorage:

```typescript
// Set a value in localStorage
localStorage.setItem('name', 'John Doe');

// Get a value from localStorage
const name = localStorage.getItem('name');
console.log(name);
```

This code will output `John Doe` to the console.

To maintain type safety and avoid runtime errors, we can define our own typed wrapper class for localStorage:

```typescript
class LocalStorageWrapper {
  getItem<T>(key: string): T | undefined {
    try {
      const item = localStorage.getItem(key);
      if (item) return JSON.parse(item) as T;
      return undefined;
    } catch (error) {
      console.log(error);
      return undefined;
    }
  }

  setItem<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.log(error);
    }
  }

  removeItem(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.log(error);
    }
  }

  clear(): void {
    try {
      localStorage.clear();
    } catch (error) {
      console.log(error);
    }
  }
}

const localStorageWrapper = new LocalStorageWrapper();

// Usage
localStorageWrapper.setItem('name', 'John Doe');
const name = localStorageWrapper.getItem<string>('name');
console.log(name);
```

### Using the sessionStorage Object

Using sessionStorage is almost identical to localStorage. Here's an example:

```typescript
// Set a value in sessionStorage
sessionStorage.setItem('name', 'John Doe');

// Retrieve a value from sessionStorage
const name = sessionStorage.getItem('name');
console.log(name);
```

Again, this code will output `John Doe` to the console.

Similar to localStorage, we can also create a typed wrapper class for sessionStorage:

```typescript
class SessionStorageWrapper {
  getItem<T>(key: string): T | undefined {
    try {
      const item = sessionStorage.getItem(key);
      if (item) return JSON.parse(item) as T;
      return undefined;
    } catch (error) {
      console.log(error);
      return undefined;
    }
  }

  setItem<T>(key: string, value: T): void {
    try {
      sessionStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.log(error);
    }
  }

  removeItem(key: string): void {
    try {
      sessionStorage.removeItem(key);
    } catch (error) {
      console.log(error);
    }
  }

  clear(): void {
    try {
      sessionStorage.clear();
    } catch (error) {
      console.log(error);
    }
  }
}

const sessionStorageWrapper = new SessionStorageWrapper();

// Usage
sessionStorageWrapper.setItem('name', 'John Doe');
const name = sessionStorageWrapper.getItem<string>('name');
console.log(name);
```

### Best Practices for Browser Storage

- Avoid storing sensitive information in localStorage or sessionStorage, as they are both vulnerable to XSS attacks.
- Use typed wrapper classes like we did here, as this way you can avoid casting issues and reduce the chance of runtime errors.
- Don't use browser storage as a replacement for a server-side database. Browser storage is a limited resource with a size limit of around 5-10MB per domain. The storage quota limit varies depending on the browser and device, but it's safe to assume that the available storage is limited.
- Remove items from storage if they are not needed anymore. Don't waste a user's precious browser storage.

Browser storage APIs offer powerful tools to store and retrieve data in the browser, but it's important to use them wisely and safely. TypeScript provides us with powerful type safety features that we used to create typed wrapper classes for both localStorage and sessionStorage. Hopefully, you can use these techniques to write safer and more efficient code next time you use browser storage in your TypeScript projects.