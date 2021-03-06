import * as React from 'react';
import ProductGrid from './ProductGrid';

import { connect } from 'react-redux';
import { ApplicationState }  from '../store';
import * as Products from '../store/Products';

// At runtime, Redux will merge together...
type CategoryProps = {
    categorySlug: string
    products: Products.Product[]
    params: { category: string }
} & typeof Products.actionCreators

export class CategoryPage extends React.Component<CategoryProps, void> {
    componentWillMount() {
        // This method runs when the component is first added to the page
        this.props.requestProducts(this.props.params.category);
    }

    public render() {
        return <div>
            <ProductGrid {...this.props} />
        </div>;
    }
}

export default connect(
    (state: ApplicationState) => ({
        products: Products.selectProducts(state),
        categorySlug: state.products.categorySlug
    }),
    Products.actionCreators
)(CategoryPage);
