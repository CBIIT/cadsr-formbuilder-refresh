import Marionette from 'backbone.marionette';
import Radio from 'backbone.radio';
import HeaderView from './HeaderView';
import FooterView from './FooterView';
import template from '../../templates/app-layout/app-layout.html';

let appChannel = Radio.channel('appEvents');

const AppLayoutView = Marionette.LayoutView.extend({
	el:       "#app",
	template: template,
	regions:  {
		header: '#header',
		main:   '#main',
		footer: '#footer'
	},
	initialize(){
		/*The Main region gets shown when the appLayout receives a radio event via appChannel with the actual view passed into it */
		appChannel.reply('set:mainLayout', (contentView) =>{
			this.showMain(contentView);
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
	showMain(contentView){
		this.showChildView('main', contentView);
	}
});

export default AppLayoutView;

