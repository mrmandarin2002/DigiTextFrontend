import React from 'react';
import {Route, IndexRoute} from 'react-router'

import Menu from './webpages/Menu';
import Info from './webpages/Info';

export default(
    <Route path = '/' component = {Menu}>

        <Route path = "/info" component = {Info}/>

    </Route>

);
