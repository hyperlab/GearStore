import { CategoriesState, Category, reducer } from './Categories';

describe('Categories store', () => {
  describe('reducer', () => {
    it('should have a default state', () => {
      const result: CategoriesState = {
        items: [], isLoading: false
      };
      expect(reducer(null, {type: 'UNKNOWN_ACTION'})).toEqual(result);
    });

    it('should handle REQUEST_CATEGORIES', () => {
      const state: CategoriesState = {
        items: [], isLoading: false
      };
      const result: CategoriesState = {
        ...state,
        isLoading: true
      };

      expect(reducer(state, {type: 'REQUEST_CATEGORIES'})).toEqual(result);
    });

    it('should handle RECEIVE_CATEGORIES', () => {
      const state: CategoriesState = {
        items: [], isLoading: true
      };

      const item: Category = {
        name: 'Sample item #1'
      };

      const result: CategoriesState = {
        items: [item], isLoading: false
      };

      expect(reducer(state, {type: 'RECEIVE_CATEGORIES', items: [item]}))
        .toEqual(result);
    });

    it('should pass through state if action is unknown', () => {
      const result: CategoriesState = {
        items: [], isLoading: true
      };
      expect(reducer(result, {type: 'UNKNOWN_ACTION'})).toEqual(result);
    });
  });
});
