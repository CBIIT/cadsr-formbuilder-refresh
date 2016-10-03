import {Collection} from 'backbone';
import QuestionsModel from './QuestionsModel';

const QuestionsCollection = Collection.extend({
	model: QuestionsModel
});

export default QuestionsCollection;