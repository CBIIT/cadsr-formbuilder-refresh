import {Collection} from 'backbone';
import QuestionsModel from './QuestionsModel';

const QuestionsCollection = Collection.extend({
	comparator: "displayOrder",
	model: QuestionsModel
});

export default QuestionsCollection;