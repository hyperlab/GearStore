import * as React from 'react';
import NavMenu from './NavMenu';
import Cart from './Cart';

export interface LayoutProps {
    body: React.ReactElement<any>;
    location: { key: any }
}

export class Layout extends React.Component<LayoutProps, void> {
    public render() {
        return <div className="mw9 center pa1 pa4-ns">
            <NavMenu location={this.props.location} />
            <div className="mb4 mb0-ns" key={this.props.location.key}>{ this.props.body }</div>
            <Cart />
        </div>;
    }
}
