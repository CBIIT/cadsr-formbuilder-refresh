import {Collection} from 'backbone';
import QuestionsModel from './QuestionsModel';

const QuestionsColllection = Collection.extend({
	model: QuestionsModel
});

export default QuestionsColllection;