import {Collection} from 'backbone';
import DropDownOptionModel from './DropDownOptionModel';

const DropDownOptionsCollection = Collection.extend({
	model: DropDownOptionModel,
	parse(response){
		let modifiedResponse = response.map((item) =>{
			/*If the item in the array is an object, grab the name property */
			if(item.conteIdseq){
				return {
					/*renaming to contextIdSeq for readability */
					contextIdSeq: item.conteIdseq,
					name: item.name
				}
			}
			/*else the item in the array is a string, and make it the name property */
			else{
				return {
					name: item
				}
			}
		});
		return modifiedResponse;
	}
});

export default DropDownOptionsCollection;