import React from 'react';
import AppLayout from '../components/layout/AppLayout';
import SearchLayout from '../components/search/SearchLayout';
import CDECartPage from '../components/carts/CDECartPage';
import ModuleCartPage from '../components/carts/ModuleCartPage';
import FormCartPage from '../components/carts/FormCartPage';
import FormLayout from '../components/form/FormLayout';
import {Route, IndexRoute} from 'react-router';
import {RedirectToLoginIfNotLoggedIn} from '../helpers/authHelpers';
import formHelpers from '../helpers/formHelpers';
import cartActions from '../constants/cartActions';
import {cartChannel, formChannel} from '../channels/radioChannels';
import formActions from '../constants/formActions';
import EVENTS from '../constants/EVENTS';
import ROUTES from '../constants/ROUTES';

export default (
	<Route path="/" component={AppLayout}> <IndexRoute component={SearchLayout}/>
		<Route path={ROUTES.SEARCH.SEARCH_FORMS} component={SearchLayout}/>
		<Route onEnter={RedirectToLoginIfNotLoggedIn} path={ROUTES.CART.VIEW_CDE_CART_PAGE} getComponent={(location, cb) =>{
			cartChannel.request(EVENTS.CARTS.SET_LAYOUT, {action: cartActions.VIEW_CDE_CART_PAGE});
			cb(null, CDECartPage);
		}}/>
		<Route pageName="Form" onEnter={RedirectToLoginIfNotLoggedIn} path={ROUTES.CART.VIEW_FORM_CART_PAGE} getComponent={(location, cb) =>{
			cartChannel.request(EVENTS.CARTS.SET_LAYOUT, {action: cartActions.VIEW_FORM_CART_PAGE});
			cb(null, FormCartPage);
		}}/>
		<Route pageName="Module" onEnter={RedirectToLoginIfNotLoggedIn} path={ROUTES.CART.VIEW_MODULE_CART_PAGE} getComponent={(location, cb) =>{
			cartChannel.request(EVENTS.CARTS.SET_LAYOUT, {action: cartActions.VIEW_MODULE_CART_PAGE});
			cb(null, ModuleCartPage);
		}}/>
		<Route path={ROUTES.FORM.VIEW_FORM} onEnter={formHelpers.fetchForm} getComponent={(location, cb) =>{
			cb(null, FormLayout);
		}}/>
		<Route path={ROUTES.FORM.CREATE_FORM} onEnter={RedirectToLoginIfNotLoggedIn} getComponent={(location, cb) =>{
			formChannel.request(EVENTS.FORM.SET_FORM_LAYOUT, {action: formActions.CREATE_FORM});
			cb(null, FormLayout);
		}}/>
	</Route>
);
