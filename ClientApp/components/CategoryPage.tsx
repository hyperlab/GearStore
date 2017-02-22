import * as React from 'react';
import ProductGrid from './ProductGrid';

import { connect } from 'react-redux';
import { ApplicationState }  from '../store';
import * as Products from '../store/Products';

// At runtime, Redux will merge together...
type HomeProps =
    Products.ProductsState     // ... state we've requested from the Redux store
    & typeof Products.actionCreators   // ... plus action creators we've requested
    & { params: { category: string }}


export class Home extends React.Component<HomeProps, void> {
    componentWillMount() {
        // This method runs when the component is first added to the page
        this.props.requestProducts(this.props.params.category);
    }
    componentWillReceiveProps(newProps) {
        // This method runs when the component is first added to the page
        if (newProps.params.category !== this.props.params.category) {
            this.props.requestProducts(newProps.params.category);
        }
    }

    public render() {
        return <div>
            <ProductGrid {...this.props} />
        </div>;
    }
}

export default connect(
    (state: ApplicationState) => state.products, // Selects which state properties are merged into the component's props
    Products.actionCreators                 // Selects which action creators are merged into the component's props
)(Home);
