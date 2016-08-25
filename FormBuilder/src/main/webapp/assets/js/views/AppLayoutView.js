import {View} from 'backbone.marionette';
import EVENTS from '../constants/EVENTS';
import {appChannel} from '../channels/radioChannels'
import HeaderView from './HeaderView';
import FooterView from './FooterView';
import template from '../../templates/app-layout/app-layout.html';


const AppLayoutView = View.extend({
	template: template,
	regions:  {
		header: '#header',
		main:   '#main',
		footer: '#footer'
	},
	initialize(){
		/*The Main region gets shown when the appLayout receives a radio event via appChannel with the actual view passed into it */
		appChannel.reply(EVENTS.APP.SET_MAIN_CONTENT_LAYOUT, (contentView) =>{
			this.showMainContent(contentView);
		});
	},
	onRender() {
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
	},
	showMainContent(contentView){
		this.showChildView('main', contentView);
	}
});

export default AppLayoutView;

