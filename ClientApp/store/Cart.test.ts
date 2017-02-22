import {
  CartState, Item,
  reducer
} from './Cart';

describe('Cart store', () => {
  describe('reducer', () => {
    const defaultState: CartState = {
      items: []
    };

    it('should have a default state', () => {
      expect(reducer(null, {type: 'UNKNOWN_ACTION'})).toEqual(defaultState);
    });

    it('should handle ADD_ITEM', () => {
      const item: Item = {
        productId: 'product1'
      };

      const result: CartState = {
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
        items: [item]
      };

      const action = {
        type: 'REMOVE_ITEM',
        productId: item.productId
      };

      expect(reducer(state, action)).toEqual(defaultState);
    });
  });
});
