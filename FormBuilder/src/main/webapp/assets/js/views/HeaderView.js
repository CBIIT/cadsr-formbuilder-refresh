import * as Marionette from 'backbone.marionette';
import _ from "underscore";
import template from '../../templates/app-layout/header.html';

 const HeaderView = Marionette.ItemView.extend({
	 template: template,
});

export default HeaderView