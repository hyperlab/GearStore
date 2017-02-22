import * as React from 'react';
import { connect } from 'react-redux';

export const Button = ({ icon, text, onClick }) => {
    return  <button
        className="button-reset near-white bg-black-70 hover-bg-near-black inline-flex items-center b bn mv2 tc pa2"
        type="button"
        onClick={(e) => {
            onClick();
            e.preventDefault();
        }}
    >
        <img src={icon} />
        <span className="f6 ml2 pr2">{text}</span>
    </button>;
}

import cartIcon from '../assets/icons/cart-add.svg';
import {actionCreators} from '../store/Cart';

export const BuyButton = connect<{}, {}, {sku: string}>(
    () => ({
        text: 'Add to cart',
        icon: cartIcon
    }),
    (dispatch, props) => ({
        onClick: () => dispatch(actionCreators.addItem(props.sku))
    })
)(Button)
