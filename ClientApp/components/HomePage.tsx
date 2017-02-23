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
            <ProductGrid {...this.props} />
        </div>;
    }
}

export default connect(
    (state: ApplicationState) => ({
        products: Products.selectRandomProducts(state, 8)
    }),
    Products.actionCreators
)(Home);
