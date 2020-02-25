# RefMap

ECMAScript proposal for the RefMap.

**Author:**

- Robin Ricard (Bloomberg)

**Champions:**

- Robin Ricard (Bloomberg)
- Richard Button (Bloomberg)

**Advisors:**

- Dan Ehrenberg (Igalia)

**Stage:** 0

# Overview

The RefMap introduces a way to keep value references to objects.

One of its main goals is to be able to keep track of objects in [Records and Tuples][rt] without introducing anything mutable in them.

The RefMap is able to release objects from memory automatically.

# Examples

```js
const refm = new RefMap();

const rootRef = refm.ref(document.getElementById("root"));
assert(refm.deref(rootRef) === document.querySelector("#root"));

const otherRootRef = refm.ref(document.querySelector("#root"));
assert(rootRef === otherRootRef);
```

## _with [Records and Tuples][rt]_

```js
const refm = new RefMap();

const vdom = #{
    type: "div",
    props: #{ id: "root" },
    children: #[
        #{
            type: "button",
            props: #{
                onClick: refm.ref(function () {
                    alert("Clicked!");
                }),
            },
            children: #[
                "Click Me!",
            ],
        },
    ],
};

refm.deref(vdom.children[0].props.onClick).call();
// Alert: Clicked!
```

# API

## `new RefMap()`

Creates a `RefMap`. Does not takes any initializer arguments.

## `RefMap.prototype.ref(obj)`

Returns a stable `symbol` for a corresponding object `obj`.

> _Note_: The user does not get to choose which symbol gets created.

## `RefMap.prototype.deref(sym)`

Returns the object corresponding to the symbol `sym`. If a `symbol` not returned by the same `RefMap` gets passed here you will receive `undefined`.

# Behaviors

## Object-Ref stability

For a same object, expect the same ref symbol.

## Memory release

The `RefMap` will release all object refs if it gets released itself.

Additionally, if references are not being tracked anymore by the engine, they will also release the corresponding object.

> _Note_: This second point is impossible to polyfill.

# Polyfill

You will find a [polyfill in this same repository][poly].

[rt]: https://github.com/tc39/proposal-record-tuple
[poly]: ./polyfill/refmap.js