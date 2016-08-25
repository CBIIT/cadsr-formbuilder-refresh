import {View} from 'backbone.marionette';
import _ from "underscore";
import template from '../../templates/app-layout/header.html';

 const HeaderView = View.extend({
	 template: template,
});

export default HeaderView