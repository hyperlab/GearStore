import {
  ProductsState, Product,
  reducer,
  selectSingleProduct
} from './Products';
import { ApplicationState } from './'

describe('Products store', () => {
    const defaultState: ProductsState = {
        categorySlug: null,
        isLoading: false,
        products: []
    };

    describe('reducer', () => {
        it('should have a default state', () => {
            expect(reducer(null, {type: 'UNKNOWN_ACTION'})).toEqual(defaultState);
        });

        it('should handle REQUEST_PRODUCTS', () => {
            const action = {
                type: 'REQUEST_PRODUCTS',
                categorySlug: 'testing'
            };

            const result: ProductsState = {
                categorySlug: action.categorySlug,
                isLoading: true,
                products: []
            };

            expect(reducer(defaultState, action)).toEqual(result);
        });

        it('should handle RECEIVE_PRODUCTS', () => {
            const products: Product[] = [{
                name: 'Test product #1',
                images: ['url.jpg'],
                categories: ['slug'],
                sku: 'product-id',
                price: 100,
                qty: 10,
                description: 'A great product!'
            }];

            const action = {
                type: 'RECEIVE_PRODUCTS',
                categorySlug: 'slug',
                products
            };

            const result: ProductsState = {
                categorySlug: 'slug',
                isLoading: false,
                products
            };

            expect(reducer(defaultState, action)).toEqual(result);
        });

        it('should handle unknown actions', () => {
            expect(reducer(defaultState, {type: 'UNKNOWN_ACTION'}))
                .toEqual(defaultState);
        });
    });

    describe('selectors', () => {
        describe('selectSingleProduct', () => {
            it('should return the product with requested id', () => {
                const productsState: ProductsState = {
                    categorySlug: 'slug',
                    isLoading: false,
                    products: [
                        {
                            name: 'Test product #1',
                            images: ['url.jpg'],
                            categories: ['slug'],
                            sku: 'product-id',
                            price: 100,
                            qty: 10,
                            description: 'A great product!'
                        }
                    ]
                };

                expect(selectSingleProduct({products: productsState}, 'product-id'))
                    .toEqual(productsState.products[0]);
            });
        });
    });
});
