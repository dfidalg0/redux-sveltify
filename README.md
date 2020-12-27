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
const store = createStore((count = 0, { type, payload }) => {
    switch(type){
      case 'INCREMENT': return state + payload;
      case 'DECREMENT': return state - payload;
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

<!-- Or you can call your actions like you would do in a native Svelte store -->
<button on:click={counter.decrement(1)}> - </button>
<!-- You can subscribe to the store the Svelte way -->
{$counter}
<button on:click={counter.increment(1)}> + </button>
```

## Typescript Support

This package has full Typescript support. All you have to do is type your Redux Store like you would do normally and everything will be properly typed after that.
