# redux-sveltify

[<img src="https://img.shields.io/npm/v/redux-sveltify">](https://www.npmjs.com/package/redux-sveltify)

Simple tool for merge functionality of a full-featured Redux store with Svelte's native stores.

## Usage

All you need to do is import sveltify and apply it to your redux store like in the example bellow.

```js
// counter.js

import sveltify from 'redux-sveltify';
import { createStore } from 'redux';

// Redux Store definition
const store = createStore((state = 0, { type, payload }) => {
    switch(type){
      case 'INCREMENT': return state + payload;
      case 'DECREMENT': return state - payload;
      case 'RESET': return 0;
      default: return state;
    }
});

// Action creators
const increment = (payload) => ({ type: 'INCREMENT', payload });
const decrement = (payload) => ({ type: 'DECREMENT', payload });

// All you need to do is pass the store to the imported function
// The second parameter is optional
export default sveltify(store, { increment, decrement });
```

```html
<!-- App.svelte -->

<script>
    import counter from './counter';

    setInterval(() => {
        // You can call the dispatch method from Redux
        counter.dispatch({ type: 'RESET' });
    }, 2000);
</script>

<!--
    Or you can call your actions like you would do in
    a native Svelte store
-->
<button on:click={counter.decrement(1)}> - </button>
<button on:click={counter.increment(1)}> + </button>

<!-- You can also subscribe to the store the Svelte way -->
<div> {$counter} </div>
```

## Typescript Support

This package has full Typescript support. All you have to do is type your Redux Store like you would do normally and everything will be properly typed after that.

### Redux Thunk

(Since 1.0.3) This package has typing support for Redux Thunk too! You only need to properly type your Redux store with Thunk like bellow

```typescript
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import sveltify from 'redux-sveltify';

// Thunk typings
import { ThunkMiddleware, ThunkDispatch } from 'redux-thunk';

// Definition of the recurrent types
type State = number;
type Action = {
    type: 'INCREMENT' | 'DECREMENT';
    payload: number;
};
type ThunkExtraParam = never;

type Thunk = ThunkMiddleware<State, Action, ThunkExtraParam>;
type Dispatch = ThunkDispatch<State, ThunkExtraParam, Action>;

// Definition of the store
const reduxStore = createStore(
    (state: State = 0, { type, payload }: Action) => {
        switch (type) {
          case 'INCREMENT': return state + payload;
          case 'DECREMENT': return state - payload;
          default: return state;
        }
    },
    null,
    // Typing thunk middleware
    applyMiddleware(thunk as Thunk)
);

// Base action creators
const increment = (payload: number) => ({ type: 'INCREMENT', payload }) as const;

// Thunk action creator
const incrementWithDelay = (payload: number, timeout = 0) =>
    async (dispatch: Dispatch) => {
        await new Promise(resolve => setTimeout(resolve, timeout));
        dispatch(increment(payload));
    }

// Sveltification of the Redux store
const svelteStore = sveltify(reduxStore, { incrementWithDelay });

const promise = svelteStore.incrementWithDelay(10, 1000);

promise; // Typed as Promise<void>
```
