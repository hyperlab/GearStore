import { fetch, addTask } from 'domain-task';
import { Action, Reducer, ActionCreator } from 'redux';
import { AppThunkAction } from './';

// -----------------
// STATE - This defines the type of data maintained in the Redux store.

export interface CategoriesState {
    isLoading: boolean;
    items: Category[];
}

export interface Category {
    name: string;
}

// -----------------
// ACTIONS - These are serializable (hence replayable) descriptions of state transitions.
// They do not themselves have any side-effects; they just describe something that is going to happen.

interface requestCategoriesAction {
    type: 'REQUEST_CATEGORIES',
}

interface ReceiveCategoriesAction {
    type: 'RECEIVE_CATEGORIES',
    items: Category[]
}

// Declare a 'discriminated union' type. This guarantees that all references to 'type' properties contain one of the
// declared type strings (and not any other arbitrary string).
type KnownAction = requestCategoriesAction | ReceiveCategoriesAction;

// ----------------
// ACTION CREATORS - These are functions exposed to UI components that will trigger a state transition.
// They don't directly mutate state, but they can have external side-effects (such as loading data).

export const actionCreators = {
    requestCategories: (): AppThunkAction<KnownAction> => (dispatch, getState) => {
        // Only load data if it's something we don't already have (and are not already loading)
        if (!getState().categories.items.length) {
            let fetchTask = fetch('/api/SampleData/Categories')
                .then(response => response.json() as Promise<Category[]>)
                .then(data => {
                    dispatch({ type: 'RECEIVE_CATEGORIES', items: data });
                });

            addTask(fetchTask); // Ensure server-side prerendering waits for this to complete
            dispatch({ type: 'REQUEST_CATEGORIES' });
        }
    }
};

// ----------------
// REDUCER - For a given state and action, returns the new state. To support time travel, this must not mutate the old state.

export const unloadedState: CategoriesState = { items: [], isLoading: false };

export const reducer: Reducer<CategoriesState> = (state: CategoriesState, action: KnownAction) => {
    switch (action.type) {
        case 'REQUEST_CATEGORIES':
            return {
                items: state.items,
                isLoading: true
            };
        case 'RECEIVE_CATEGORIES':
            return {
                items: action.items,
                isLoading: false
            };
        default:
            // The following line guarantees that every action in the KnownAction union has been covered by a case above
            const exhaustiveCheck: never = action;
    }

    return state || unloadedState;
};
