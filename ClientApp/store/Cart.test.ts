import {
    CartState, Item,
    reducer,
    selectItems, selectProducts
} from './Cart';
import { ApplicationState } from './';
import { unloadedState as categoriesDefaultState } from './Categories';

const defaultState: CartState = {
    items: [],
    expanded: false
};

describe('Cart store', () => {
    describe('reducer', () => {

        it('should have a default state', () => {
            expect(reducer(null, { type: 'UNKNOWN_ACTION' })).toEqual(defaultState);
        });

        it('should handle ADD_ITEM', () => {
            const item: Item = {
                productId: 'product1'
            };

            const result: CartState = {
                ...defaultState,
                items: [item]
            };

            const action = {
                type: 'ADD_ITEM',
                productId: item.productId
            };

            expect(reducer(defaultState, action)).toEqual(result);
        });

        it('should handle REMOVE_ITEM', () => {
            const item: Item = {
                productId: 'product1'
            };

            const state: CartState = {
                ...defaultState,
                items: [item]
            };

            const action = {
                type: 'REMOVE_ITEM',
                index: 0
            };

            expect(reducer(state, action)).toEqual(defaultState);
        });
    });

    describe('selectors', () => {
        describe('selectItems', () => {
            it('returns all items in cart', () => {
                const state: CartState = {
                    ...defaultState,
                    items: [
                        { productId: 'product1' },
                        { productId: 'product2' }
                    ]
                };

                expect(selectItems({ cart: state })).toEqual(state.items);
            });
        });

        describe('selectProducts', () => {
            it('returns all products in cart', () => {
                const state: ApplicationState = {
                    cart: {
                        ...defaultState,
                        items: [{ productId: 'product-id' }]
                    },
                    products: {
                        categorySlug: null,
                        isLoading: false,
                        products: {
                            'product-id': {
                                name: 'Test product #1',
                                images: ['url.jpg'],
                                categories: ['slug'],
                                sku: 'product-id',
                                price: 100,
                                qty: 10,
                                description: 'A great product!'
                            }
                        },
                        lastResult: ['product-id']
                    },
                    categories: categoriesDefaultState
                };

                expect(selectProducts(state)).toEqual(state.products.products);
            });
        });
    });
});
