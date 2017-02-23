import * as React from 'react';

class ProductImage extends React.Component<{image: string}, {loaded: boolean}> {
    private img = null
    state = { loaded: false }

    private onLoad() {
        this.setState((state) => ({ loaded: true }));
    }

    componentDidMount() {
        const img = new (window as any).Image();
        img.onload = () => this.onLoad();
        img.src = this.props.image;
    }

    render() {
        var opacity = (this.state.loaded ? 1 : 0)
        return <div className="aspect-ratio aspect-ratio--1x1">
            <img
                ref={(img) => { this.img = img }}
                style={{
                    backgroundImage: `url(${this.props.image})`,
                    opacity, transition: 'all 250ms ease'
                }}
                className={'aspect-ratio--object bg-center contain db outline black-10'}
            />
        </div>;
    }
}

export default ProductImage
