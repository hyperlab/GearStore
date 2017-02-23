import { fetch, addTask } from 'domain-task';
import { Action, Reducer, ActionCreator } from 'redux';
import { AppThunkAction, ApplicationState } from './';

// -----------------
// STATE - This defines the type of data maintained in the Redux store.

type ProductMap = { [key:string]: Product }

export interface ProductsState {
    categorySlug: string
    isLoading: boolean
    lastResult: string[]
    products: ProductMap
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
    prefetched?: boolean;
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
        if (!state.lastResult.length || state.categorySlug !== categorySlug) {
            const fetchTask = fetch(`/api/SampleData/Products?category=${categorySlug||''}`)
                .then(response => response.json() as Promise<Product[]>)
                .then(data => {
                    dispatch({ type: 'RECEIVE_PRODUCTS', products: data, categorySlug });
                });

            addTask(fetchTask); // Ensure server-side prerendering waits for this to complete
            dispatch({ type: 'REQUEST_PRODUCTS', categorySlug });
        }
    },
    preloadCartProducts: (): AppThunkAction<KnownAction> => (dispatch, getState) => {
        const state = getState().products
        const fetchTask = fetch('/api/SampleData/Products')
            .then(response => response.json() as Promise<Product[]>)
            .then(data => {
                dispatch({ type: 'RECEIVE_PRODUCTS', products: data, prefetched: true, categorySlug: null });
            });

        addTask(fetchTask); // Ensure server-side prerendering waits for this to complete
    }
};

// ----------------
// REDUCER - For a given state and action, returns the new state. To support time travel, this must not mutate the old state.

const unloadedState: ProductsState = { products: {}, isLoading: false, categorySlug: null, lastResult: [] };

export const reducer: Reducer<ProductsState> = (state: ProductsState, action: KnownAction) => {
    switch (action.type) {
        case 'REQUEST_PRODUCTS':
            return {
                ...state,
                categorySlug: action.categorySlug,
                lastResult: [],
                isLoading: true
            };
        case 'RECEIVE_PRODUCTS': {
            // Leave result list and categorySlug unchanged when prefetched
            const lastResult = action.prefetched ? state.lastResult
                : action.products.map(product => product.sku);
            const categorySlug = action.prefetched ? state.categorySlug
                : action.categorySlug;

            // Cache all loaded products in the store for now as we need them
            // for the very naive cart implementation
            const products = action.products.reduce((mem: ProductMap, product: Product) => {
                mem[product.sku] = product;
                return mem;
            }, {...state.products})

            return {
                ...state,
                isLoading: false,
                categorySlug,
                products,
                lastResult
            };
        }
        default:
            // The following line guarantees that every action in the KnownAction union has been covered by a case above
            const exhaustiveCheck: never = action;
    }

    return state || unloadedState;
};


export const selectSingleProduct = (state: {products: ProductsState}, sku: string): Product => {
    return state.products.products[sku]
}

export const selectProducts = (state: {products: ProductsState}): Product[] => {
    return state.products.lastResult.map((id: string) => state.products.products[id])
}

// Shuffle array using Fisher-Yates shuffle
const shuffle = source => {
    let output = source.slice();
    let counter = output.length;
    while (counter > 0) {
        const index = Math.floor(Math.random() * counter);
        counter--;
        const temp = output[counter];
        output[counter] = output[index];
        output[index] = temp;
    }

    return output;
};

let shuffledProducts = [];

export const selectRandomProducts = (state: {products: ProductsState}, count: number): Product[] => {
    if (!shuffledProducts.length) {
		const products = Object.keys(state.products.products).map(key => state.products.products[key]);
        shuffledProducts = shuffle(products);
    }
    return shuffledProducts.slice(0, count);
}
