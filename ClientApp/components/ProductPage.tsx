import * as React from 'react';
import { connect } from 'react-redux';

import { ApplicationState }  from '../store';
import * as Products from '../store/Products';

import ProductImage from './ProductImage';
import {BuyButton} from './Buttons';

export class ProductPage extends React.Component<any, void> {
    componentWillMount() {
        // This method runs when the component is first added to the page
        this.props.requestProducts(this.props.params.category);
    }

    public render() {
        const {product} = this.props;

        if (!product) {
            return null;
        }

        return <div>
            <div className="w-100 w-50-ns fl-ns pr2-ns">
                <ProductImage image={product.images[0]}/>
            </div>
            <div className="w-100 w-50-ns fl-ns pa2 ph3-ns pb3-ns">
                <div className="dt w-100 mt1">
                    <div className="dtc">
                        <h1 className="f5 f4-ns mv0">{product.name}</h1>
                    </div>
                    <div className="dtc tr">
                        <h2 className="f5 mv0">${product.price}</h2>
                    </div>
                </div>
                <div dangerouslySetInnerHTML={{__html: product.description}}></div>
                <BuyButton sku={product.sku} />
            </div>
        </div>;
    }
}

export default connect(
    (state: ApplicationState, props: any) => ({
        product: Products.selectSingleProduct(state, props.params.sku)
    }),
    Products.actionCreators
)(ProductPage);
