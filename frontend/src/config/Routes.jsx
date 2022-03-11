import React from 'react';

import { Route, Switch } from 'react-router-dom';

import Home from '../pages/Home';
import Catalog from '../pages/Catalog';
import Detail from '../pages/detail/Detail';
// import Genres from '../pages/Genres'

const Routes = () => {
    return (
        <Switch>
            <Route
                path='/:category/search/:keyword'
                component={Catalog}
            />
            <Route
                path='/:category/:id'
                component={Detail}
            />
            <Route
                path='/:category'
                component={Catalog}
            />
            {/* <Route
                path='/genre/movie/list'
                component={Genres}
            /> */}
            <Route
                path='/'
                exact
                component={Home}
            />
        </Switch>
    );
}

export default Routes;
