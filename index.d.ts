declare module 'redux-sveltify' {
    import { Store, Action, AnyAction } from 'redux';

    type Unsubscribe = () => void;

    type ActionCreatorsMapper <T extends Record<string, (...args: any) => any>> = {
        [K in keyof T]: (...args: Parameters<T[K]>) => ReturnType<T[K]>
    };

    export type SvelteReduxStore <
        S, // State
        A extends Action<any> = AnyAction, // Action
        C extends Record<string, (...args: any) => A> = {} // Action Creators
    > = Omit<Store<S,A>, 'subscribe'> & ActionCreatorsMapper<C> & {
        /**
         * ADAPTED FROM THE REDUX DOCS
         *
         * Adds a change listener. It will be called any time an action is
         * dispatched, and some part of the state tree may potentially have changed.
         *
         * You may call `dispatch()` from a change listener, with the following
         * caveats:
         *
         * 1. The subscriptions are snapshotted just before every `dispatch()` call.
         * If you subscribe or unsubscribe while the listeners are being invoked,
         * this will not have any effect on the `dispatch()` that is currently in
         * progress. However, the next `dispatch()` call, whether nested or not,
         * will use a more recent snapshot of the subscription list.
         *
         * 2. The listener should not expect to see all states changes, as the state
         * might have been updated multiple times during a nested `dispatch()` before
         * the listener is called. It is, however, guaranteed that all subscribers
         * registered before the `dispatch()` started will be called with the latest
         * state by the time it exits.
         *
         * @param handler A callback to be invoked on every dispatch.
         * @returns A function to remove this change listener.
         */
        subscribe: (handler: (state: S) => void) => Unsubscribe;
    }

    /**
    * @param reduxStore Redux base store you want to sveltify
    * @returns
    * Svelte's readable store with both Svelte's features like automatic
    * subscription, writing prevention and Redux' features like Devtools,
    * middlewares, combined reducers, etc..
    */
    export default function sveltify <
        S, A extends Action<any> = AnyAction, C extends Record<string, (...args: any) => A> = {}
    > (reduxStore: Store<S, A>, actionCreators?: C): SvelteReduxStore<S,A,C>;
}
