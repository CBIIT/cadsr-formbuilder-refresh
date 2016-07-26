import Marionette from 'backbone.marionette';
import Radio from 'backbone.radio';
import HeaderView from './HeaderView';
import FooterView from './FooterView';
import template from '../../templates/app-layout/app-layout.html';

const AppLayoutView = Marionette.LayoutView.extend({
	el:      "#app",
	template: template,
	regions: {
		header: '#header',
		main:   '#main',
		footer: '#footer'
	},

	onRender(){
		this.showHeader();
		this.showFooter();
	},

	showHeader () {
		const header = new HeaderView();
		this.showChildView('header', header);
	},

	showFooter () {
		const footer = new FooterView();
		this.showChildView('footer', footer);
	}
});

export default AppLayoutView;

