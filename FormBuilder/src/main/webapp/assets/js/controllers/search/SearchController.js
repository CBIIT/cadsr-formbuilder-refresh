import Service from "marionette-service";
import SearchRouter from  "../../routers/search/SearchRouter";
import SearchLayoutView from '../../views/search/SearchLayoutView';
import SearchResultsCollection from '../../collections/search/form-search/SearchResultsCollection';

const SearchController = Service.extend({
	initialize(options = {}) {
		this.container = options.container;
		//this.model = searchModel;
		const searchRouter = new SearchRouter();

		this.view = new SearchLayoutView(
			{
				el:         this.container.el,
				collection: new SearchResultsCollection()
			}
		);
		this.container.show(this.view);
	}
});

export default SearchController;