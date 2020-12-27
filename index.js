import { readable } from 'svelte/store';

export default function sveltify(reduxStore, actionCreators = {}) {
    const { getState, ...store } = reduxStore;

    const { subscribe } = readable(getState(), set => {
        const unsubscribe = store.subscribe(() => {
            set(getState());
        });

        return unsubscribe;
    });

    const actions = {};

    for (const name in actionCreators){
        const action = actionCreators[name];
        actions[name] = (...args) => store.dispatch(action(...args));
    }

    return {
        ...actions,
        ...store,
        subscribe
    };
}
