import { Action, Reducer } from 'redux';
import { AppThunkAction } from './';
import { Product, selectSingleProduct } from './Products';

// -----------------
// STATE - This defines the type of data maintained in the Redux store.

export interface CartState {
    items: Item[];
    expanded: boolean;
};

export interface Item {
    productId: string;
};

// -----------------
// ACTIONS - These are serializable (hence replayable) descriptions of state transitions.
// They do not themselves have any side-effects; they just describe something that is going to happen.

interface addItemAction {
    type: 'ADD_ITEM';
    productId: string;
}

interface removeItemAction {
    type: 'REMOVE_ITEM';
    index: number;
}

interface toggleAction {
    type: 'TOGGLE_CART'
}

// Declare a 'discriminated union' type. This guarantees that all references to 'type' properties contain one of the
// declared type strings (and not any other arbitrary string).
type KnownAction = addItemAction | removeItemAction | toggleAction;

export const actionCreators = {
    addItem: (productId: string): addItemAction => ({ type: 'ADD_ITEM', productId }),
    removeItem: (index: number): removeItemAction => ({ type: 'REMOVE_ITEM', index }),
    toggleCart: (): toggleAction => ({ type: 'TOGGLE_CART' })
};


// ----------------
// REDUCER - For a given state and action, returns the new state. To support time travel, this must not mutate the old state.

const unloadedState: CartState = { items: [], expanded: false };

export const reducer: Reducer<CartState> = (state: CartState, action: KnownAction) => {
    switch (action.type) {
        case 'ADD_ITEM':
            return {
                ...state,
                items: [...state.items, {productId: action.productId}]
            };
        case 'REMOVE_ITEM':
            return {
                ...state,
                items: state.items.filter((item, index) => index !== action.index)
            };
        case 'TOGGLE_CART':
            return {
                ...state,
                expanded: !state.expanded
            };
        default:
            // The following line guarantees that every action in the KnownAction union has been covered by a case above
            const exhaustiveCheck: never = action;
    }

    return state || unloadedState;
};

export const selectItems = (state): Item[] => state.cart.items;
export const selectProducts = (state): Product[] =>
    selectItems(state).map(item => selectSingleProduct(state, item.productId));
