import * as React from 'react';

class ProductImage extends React.Component<{image: string}, {loaded: boolean}> {
    private img
    state = { loaded: false }

    private onLoad() {
        this.setState((state) => ({ loaded: true }));
    }

    componentDidMount() {
        this.img = new (window as any).Image();
        this.img.onload = () => this.onLoad();
        this.img.src = this.props.image;
    }
    componentWillUnmount() {
        this.img.onload = this.img.src = this.img = null
    }

    render() {
        var opacity = (this.state.loaded ? 1 : 0)
        return <div className="aspect-ratio aspect-ratio--4x3 aspect-ratio--1x1-ns outline black-10">
            <div
                style={{
                    backgroundImage: `url(${this.props.image})`,
                    opacity, transition: 'all 250ms ease'
                }}
                className={'aspect-ratio--object bg-center contain db bn '}
            />
        </div>;
    }
}

export default ProductImage
