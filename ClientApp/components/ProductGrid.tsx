import * as React from 'react';
import {Link} from 'react-router';
import ProductImage from './ProductImage';

import {Product} from '../store/Products';

interface ProductGridProps {
    products: Product[],
    categorySlug: string
}

export default class ProductGrid extends React.Component<ProductGridProps, void> {
    public render() {
        return <div className="flex flex-row flex-wrap">
            {this.props.products.map(product =>
                <Link
                    to={`/${this.props.categorySlug || product.categories[0]}/${product.sku}`}
                    className="w-100 w-third-m w-25-l flex-wrap pa2 black link dim"
                    key={product.sku}
                >
                <ProductImage image={product.images[0]} />
                <div className="pa2 ph3-ns pb3-ns">
                    <div className="dt w-100 mt1">
                    <div className="dtc">
                        <h1 className="f5 f4-ns mv0">{product.name}</h1>
                    </div>
                    <div className="dtc tr">
                        <h2 className="f5 mv0">${product.price}</h2>
                    </div>
                    </div>
                </div>
                </Link>
            )}
        </div>;
    }
}
