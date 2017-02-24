import { createStore, applyMiddleware, compose, combineReducers, GenericStoreEnhancer } from 'redux';
import thunk from 'redux-thunk';
import { routerReducer } from 'react-router-redux';
import * as Store from './store';

import * as Products from './store/Products';
import * as Cart from './store/Cart';

export default function configureStore(initialState?: Store.ApplicationState) {
    // Build middleware. These are functions that can process the actions before they reach the store.
    const windowIfDefined = typeof window === 'undefined' ? null : window as any;
    // If devTools is installed, connect to it
    const devToolsExtension = windowIfDefined && windowIfDefined.devToolsExtension as () => GenericStoreEnhancer;
    const createStoreWithMiddleware = compose(
        applyMiddleware(thunk),
        devToolsExtension ? devToolsExtension() : f => f
    )(createStore);

    // Combine all reducers and instantiate the app-wide store instance
    const allReducers = buildRootReducer(Store.reducers);
    const store = createStoreWithMiddleware(allReducers, initialState) as Redux.Store<Store.ApplicationState>;

    // Enable Webpack hot module replacement for reducers
    if (module.hot) {
        module.hot.accept('./store', () => {
            const nextRootReducer = require<typeof Store>('./store');
            store.replaceReducer(buildRootReducer(nextRootReducer.reducers));
        });
    }

    if (windowIfDefined && windowIfDefined.localStorage) {
        // Persist cart items on client side
        let lastState = null
        let restored = false
        store.subscribe(() => {
            const state = store.getState()
            if (!restored) {
                restored = true

                try {
                    const items = JSON.parse(windowIfDefined.localStorage.getItem('cart'))
                    if (items.length) {
                        store.dispatch(Products.actionCreators.preloadCartProducts())
                        store.dispatch(Cart.actionCreators.restoreCart(items))
                        lastState = items
                    } else {
                        lastState = []
                    }
                } catch (e) {}
            }
            if (state.cart.items !== lastState) {
                lastState = state.cart.items
                windowIfDefined.localStorage.setItem('cart', JSON.stringify(state.cart.items))
            }
        })
    }

    return store;
}

function buildRootReducer(allReducers) {
    return combineReducers<Store.ApplicationState>(Object.assign({}, allReducers, { routing: routerReducer }));
}
