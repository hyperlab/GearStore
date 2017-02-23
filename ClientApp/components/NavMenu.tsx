import * as React from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { ApplicationState }  from '../store';
import * as Categories from '../store/Categories';

// At runtime, Redux will merge together...
type CategoriesProps =
    Categories.CategoriesState     // ... state we've requested from the Redux store
    & typeof Categories.actionCreators   // ... plus action creators we've requested
    & { location: any }


class NavMenu extends React.Component<CategoriesProps, void> {
    componentWillMount() {
        // This method runs when the component is first added to the page
        this.props.requestCategories();
    }

    public render() {
        const {items} = this.props;

        return <nav className="pa2 pa4-ns">
            <Link className="link dim black b f1 f-headline-ns tc db mb3 mb4-ns mt3 mt0-ns" to="/" title="Home">Gear Store</Link>
            <div className="tc pb3">
                <Link to="/" className="link dim gray f6 f5-ns dib mr3" activeClassName="b">Home</Link>
                {items.map(item =>
                    <Link key={item.name} to={`/${item.name}`} className="link dim gray f6 f5-ns dib mr3 pb2" activeClassName="b">{item.name}</Link>
                )}
            </div>
        </nav>;
    }
}

export default connect<{},{},{ location: any }>(
    (state: ApplicationState) => state.categories, // Selects which state properties are merged into the component's props
    Categories.actionCreators                      // Selects which action creators are merged into the component's props
)(NavMenu);
