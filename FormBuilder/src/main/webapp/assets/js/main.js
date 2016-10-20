import React from 'react';
import {render} from 'react-dom';
import {app} from './App';
import {Router, useRouterHistory} from 'react-router';
import rootRoute from './routers/rootRoute';
import { createHistory } from 'history';
const history = useRouterHistory(createHistory)({
	basename: '/FormBuilder'
});

render((
	<Router history={history} routes={rootRoute} />    ), document.getElementById('app'));
