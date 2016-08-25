import * as Marionette from 'backbone.marionette';
import template from '../../templates/app-layout/footer.html';

const FooterView = Marionette.ItemView.extend({
	template: template
});

export default FooterView;