---
title: "Best Practices for Integrating React and TypeScript"
date: 2023-06-29T16:21:00.222Z
tags: ["typescript","react","front-end development"]
---


React and TypeScript are two popular technologies in front-end development. React is a widely used and efficient JavaScript library for building user interfaces, while TypeScript is a statically typed superset of JavaScript that provides a more robust type system. When used together, React and TypeScript can enhance code quality, maintainability, and productivity. However, integrating these two technologies can be challenging for developers who are new to either or both. In this post, we will discuss some best practices for integrating React and TypeScript.

## Use the correct types for props and state

To benefit from TypeScript's strong typing system, it is essential to define the correct types for React's props and state. This helps to catch errors at compile-time rather than at runtime. For props, consider creating an interface for each component that describes the prop types. For example:

```tsx
interface HelloProps {
  name: string;
  age: number;
}

const Hello = ({ name, age }: HelloProps) => (
  <div>
    <p>Hello, {name}!</p>
    <p>You are {age} years old</p>
  </div>
);
```

In this example, we define an interface `HelloProps` with two properties `name` and `age` of type `string` and `number`. We then use this interface to define the props type for the `Hello` component.

For state, consider using TypeScript's `Partial` type to define the initial state as an object with optional properties. For example:

```tsx
interface HelloState {
  name: string;
  age?: number;
}

class Hello extends React.Component<{}, HelloState> {
  state: HelloState = { name: '' };

  setName = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ name: event.target.value });
  }

  setAge = (event: React.ChangeEvent<HTMLInputElement>) => {
    const age = parseInt(event.target.value);
    this.setState({ age: isNaN(age) ? undefined : age });
  }

  render() {
    return (
      <div>
        <input type="text" value={this.state.name} onChange={this.setName} />
        <input type="number" value={this.state.age} onChange={this.setAge} />
      </div>
    );
  }
}
```

In this example, we define an interface `HelloState` with two properties `name` and `age` of type `string` and `number`, respectively. We then use this interface to define the state type for the `Hello` component. We initialize the state with an object that has only the required `name` property. The `setAge` method updates the `age` property if the user enters a valid number, otherwise it sets the `age` property to `undefined`.

## Use generics with higher-order components

React allows the composition of components by using higher-order components (HOCs). HOCs are functions that take a component as input and return a new component. TypeScript offers a way to define generic types for HOCs, making them more flexible and reusable.

Here is an example of a generic HOC:

```tsx
interface Props {
  text: string;
}

function withUpperCase<P extends Props>(WrappedComponent: React.ComponentType<P>) {
  return (props: P) => {
    const { text, ...rest } = props as Props;
    return <WrappedComponent text={text.toUpperCase()} {...rest} />;
  };
}

const MyComponent = (props: Props) => <div>{props.text}</div>;

const MyComponentWithUpperCase = withUpperCase(MyComponent);
```

In this example, we define an interface `Props` with a `text` property of type `string`. We then define a generic HOC `withUpperCase` that takes a component `WrappedComponent` of type `React.ComponentType<P>`. The `withUpperCase` function returns a new component that passes the `text` property as uppercase to the wrapped component. Here, we use the destructuring with `...rest` in order to pass any other props the component might have down to the wrapped component.

## Use utility types to manipulate types

TypeScript offers utility types that can simplify the manipulation of types. For example, the `Pick` type can be used to create a new type with only a subset of the properties of an existing type:

```tsx
interface Props {
  name: string;
  age: number;
  address: string;
}

type PersonProps = Pick<Props, 'name' | 'age'>;

const Person = (props: PersonProps) => (
  <div>
    <p>Name: {props.name}</p>
    <p>Age: {props.age}</p>
  </div>
);
```

In this example, we define an interface `Props` with properties `name`, `age`, and `address`. We then define a new type `PersonProps` using the `Pick` utility type, which selects only the `name` and `age` properties. We use this type to define the props type for the `Person` component.

## Conclusion

Integrating React and TypeScript can lead to clearer and more maintainable code, but it requires some knowledge of best practices to avoid common pitfalls. Defining correct prop and state types, using generic higher-order components, and manipulating types using utility types are some useful techniques to improve your React and TypeScript development experience.

By following these best practices, you can ensure that your React and TypeScript code is more accurate, readable, and scalable.