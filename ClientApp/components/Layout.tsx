import * as React from 'react';
import NavMenu from './NavMenu';
import Cart from './Cart';

export interface LayoutProps {
    body: React.ReactElement<any>;
    location: { key: any }
}

export class Layout extends React.Component<LayoutProps, void> {
    public render() {
        return <div className="mw9 center pa4">
            <NavMenu location={this.props.location} />
            <div key={this.props.location.key}>{ this.props.body }</div>
            <Cart />
        </div>;
    }
}
