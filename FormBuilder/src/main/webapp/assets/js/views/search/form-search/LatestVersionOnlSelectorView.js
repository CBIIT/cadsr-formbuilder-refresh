import  {ItemView} from 'backbone.marionette';
import template from '../../../../templates/search/form-search/latest-version-only.html';

const LatestVersionOnlSelectorView = ItemView.extend({
	template: template,
	initialize({value}) {
		this.value = value;
	},
	serializeData () {
		return {
			latestVersion: this.value
		};
	}
});

export default LatestVersionOnlSelectorView;