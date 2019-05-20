import { useState } from 'react';

export const store = {
    state: {},
    setState(value) {
        this.state = value;
        this.setters.forEach(setter => setter(this.state));
    },
    setters: []
};

// Bind the setState function to the store object so
// we don't lose context when calling it elsewhere
store.setState = store.setState.bind(store);

// this is the custom hook we'll call on components.
export function useStore() {
    const [ state, set ] = useState(store.state);
    if (!store.setters.includes(set)) {
        store.setters.push(set);
    }

    return [ state, store.setState ];
}