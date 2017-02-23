import * as React from 'react';
import ProductGrid from './ProductGrid';

import { connect } from 'react-redux';
import { ApplicationState }  from '../store';
import * as Products from '../store/Products';

// At runtime, Redux will merge together...
type HomeProps = {
    products: Products.Product[]
} & typeof Products.actionCreators;

export class Home extends React.Component<HomeProps, void> {
    componentWillMount() {
        // This method runs when the component is first added to the page
        this.props.requestProducts(null);
    }

    public render() {
        return <div>
            <h1 className="tc">New Arrivals</h1>
            <ProductGrid {...this.props} products={this.props.products.slice(0,4)} />
            <h1 className="tc">Bestsellers</h1>
            <ProductGrid {...this.props} products={this.props.products.slice(4)} />
        </div>;
    }
}

export default connect(
    (state: ApplicationState) => ({
        products: Products.selectProducts(state).slice(0,8)
    }),
    Products.actionCreators
)(Home);
