import * as Marionette from 'backbone.marionette';
import AppLayoutView from "./views/AppLayoutView";

const App = Marionette.Application.extend({
	initialize() {
		this.layout = new AppLayoutView();
		this.layout.render();
	}
});

const app = new App();

export default app;
