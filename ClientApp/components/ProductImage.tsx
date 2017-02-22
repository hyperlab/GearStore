import * as React from 'react';

const ProductImage = ({ image }) => {
    return <div className="aspect-ratio aspect-ratio--1x1">
        <div style={{backgroundImage: `url(${image})`}} className="aspect-ratio--object bg-center contain db outline black-10" />
    </div>;
}

export default ProductImage
