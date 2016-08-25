import  {View} from 'backbone.marionette';
import template from '../../../../templates/search/form-search/latest-version-only.html';

const LatestVersionOnlSelectorView = View.extend({
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