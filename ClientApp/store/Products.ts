import { fetch, addTask } from 'domain-task';
import { Action, Reducer, ActionCreator } from 'redux';
import { AppThunkAction } from './';

// -----------------
// STATE - This defines the type of data maintained in the Redux store.

export interface ProductsState {
    categorySlug: string;
    isLoading: boolean;
    products: Product[];
}

export interface Product {
    name: string;
    images: string[];
    categories: string[];
    sku: string;
    price: number;
    qty: number;
    description: string;
}

// -----------------
// ACTIONS - These are serializable (hence replayable) descriptions of state transitions.
// They do not themselves have any side-effects; they just describe something that is going to happen.

interface requestProductsAction {
    type: 'REQUEST_PRODUCTS';
    categorySlug: string;
}

interface ReceiveProductsAction {
    type: 'RECEIVE_PRODUCTS';
    categorySlug: string;
    products: Product[];
}

// Declare a 'discriminated union' type. This guarantees that all references to 'type' properties contain one of the
// declared type strings (and not any other arbitrary string).
type KnownAction = requestProductsAction | ReceiveProductsAction;

// ----------------
// ACTION CREATORS - These are functions exposed to UI components that will trigger a state transition.
// They don't directly mutate state, but they can have external side-effects (such as loading data).

export const actionCreators = {
    requestProducts: (categorySlug: string): AppThunkAction<KnownAction> => (dispatch, getState) => {
        const state = getState().products

        // Only load data if it's something we don't already have (and are not already loading)
        if (!state.products.length || state.categorySlug !== categorySlug) {
            let fetchTask = fetch(`/api/SampleData/Products?category=${categorySlug||''}`)
                .then(response => response.json() as Promise<Product[]>)
                .then(data => {
                    dispatch({ type: 'RECEIVE_PRODUCTS', products: data, categorySlug });
                });

            addTask(fetchTask); // Ensure server-side prerendering waits for this to complete
            dispatch({ type: 'REQUEST_PRODUCTS', categorySlug });
        }
    }
};

// ----------------
// REDUCER - For a given state and action, returns the new state. To support time travel, this must not mutate the old state.

const unloadedState: ProductsState = { products: [], isLoading: false, categorySlug: null };

export const reducer: Reducer<ProductsState> = (state: ProductsState, action: KnownAction) => {
    switch (action.type) {
        case 'REQUEST_PRODUCTS':
            return {
                categorySlug: action.categorySlug,
                products: state.products,
                isLoading: true
            };
        case 'RECEIVE_PRODUCTS':
            return {
                categorySlug: action.categorySlug,
                products: action.products,
                isLoading: false
            };
        default:
            // The following line guarantees that every action in the KnownAction union has been covered by a case above
            const exhaustiveCheck: never = action;
    }

    return state || unloadedState;
};

export const selectProduct = (state, productId: string): Product =>
    state.products.products.find(p => p.sku === productId)
