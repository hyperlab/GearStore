import * as React from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { ApplicationState }  from '../store';

import {Product} from '../store/Products';
import * as CartStore from '../store/Cart';

import ProductImage from './ProductImage';

import cartIcon from '../assets/icons/cart-full.svg';
import deleteIcon from '../assets/icons/delete.svg';

// At runtime, Redux will merge together...
type CartProps =
    typeof CartStore.actionCreators & {
        products: Product[]
        expanded: boolean
    };

class Cart extends React.Component<CartProps, void> {
    private getText():string {
        const count = this.props.products.length

        if (!count) {
            return 'Empty'
        } else if (count === 1) {
            return '1 item'
        }

        return `${count} items`
    }

    private renderItems() {
        const {expanded, products} = this.props

        if (!expanded) {
            return null
        } else if (!products.length) {
            return <div className="bg-white ma0 pa3 list ba b--black-10 bb-0 shadow-2">
                Your cart is empty
            </div>
        }

        return <ul className="bg-white ma0 pa0 list ba b--black-10 bb-0 shadow-2">
            {this.props.products.map((product, index) => (
                <li className="flex items-center pa2 ma0 bb b--black-10">
                    <div className="mr2" style={{width: '32px', height: '32px'}}>
                        <ProductImage image={product.images[0]} />
                    </div>
                    <strong>{product.name}</strong>
                    <span className="ml2">{'$' + product.price}</span>
                    <button className="bn p1 bg-transparent" onClick={() => this.props.removeItem(index)}>
                        <img src={deleteIcon} className="db" style={{height: '16px'}} />
                    </button>
                </li>
            ))}
        </ul>;
    }

    render() {
        return <div className="fixed right-1 bottom-0 z-999 flex flex-column">
            <button className="ph3 dtc pv2 bn white hover-bg-near-black bg-black-80 pointer self-end outline-0 shadow-2" onClick={this.props.toggleCart}>
                <img src={cartIcon} className="mr2 mb1 dib v-mid" />
                <strong>Your Cart: </strong>
                <span>{this.getText()}</span>
            </button>
            {this.renderItems()}
        </div>;
    }
}

export default connect(
    (state: ApplicationState) => ({
        expanded: state.cart.expanded,
        products: CartStore.selectProducts(state)
    }),
    CartStore.actionCreators
)(Cart);
