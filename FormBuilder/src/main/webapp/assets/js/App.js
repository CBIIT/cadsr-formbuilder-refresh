import {Application} from 'backbone.marionette';
import AppLayoutView from "./views/AppLayoutView";

const App = Application.extend({
	region:         "#app",
	onStart() {
		this.showView(new AppLayoutView());
	}
});

const app = new App();

export default app;
