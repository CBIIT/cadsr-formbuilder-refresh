import {Collection} from 'backbone';
import ValidValueModel from './ValidValueModel';

const ValidValuesCollection = Collection.extend({
	model: ValidValueModel
});

export default ValidValuesCollection;