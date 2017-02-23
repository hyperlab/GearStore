import {
  ProductsState, Product,
  reducer,
  selectSingleProduct,
  selectRandomProducts
} from './Products';
import { ApplicationState } from './'

describe('Products store', () => {
    const defaultState: ProductsState = {
        categorySlug: null,
        isLoading: false,
        products: {},
        lastResult: []
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
                products: {},
                lastResult: []
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
                products: { [products[0].sku]: products[0] },
                lastResult: [products[0].sku]
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
                };

                expect(selectSingleProduct({products: productsState}, 'product-id'))
                    .toEqual(productsState.products['product-id']);
            });
        });

        describe('selectRandomProducts', () => {
            it('should return the amount of requested product', () => {
                const generateProduct = (id: string): Product => ({
                    name: `Product ${id}`,
                    images: [`product-${id}.jpg`],
                    categories: ['category'],
                    sku: id,
                    price: 100,
                    qty: 10,
                    description: `Test product ${id}`
                })

                const productsState: ProductsState = {
                    categorySlug: 'slug',
                    isLoading: false,
                    lastResult: [],
                    products: {
                        '1': generateProduct('1'),
                        '2': generateProduct('2'),
                        'bag': generateProduct('bag'),
                        'watch': generateProduct('watch')
                    }
                };

                expect(selectRandomProducts({products: productsState}, 3).length)
                    .toBe(3);
            });
        });
    });
});
