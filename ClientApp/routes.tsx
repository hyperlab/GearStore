import * as React from 'react';
import { Router, IndexRoute, Route, HistoryBase } from 'react-router';
import { Layout } from './components/Layout';

import HomePage from './components/HomePage';
import CategoryPage from './components/CategoryPage';
import ProductPage from './components/ProductPage';

export default <Route component={ Layout }>
    <Route path='/' components={{ body: HomePage }} />
    <Route path='/:category'>
        <IndexRoute components={{ body: CategoryPage }} />
        <Route path=':sku' components={{ body: ProductPage }} />
    </Route>
</Route>;

// Enable Hot Module Replacement (HMR)
if (module.hot) {
    module.hot.accept();
}
