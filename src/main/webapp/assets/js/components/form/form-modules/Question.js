export function Question(ValidValueComponent){

	class Question extends Component {
		constructor(props){
super(props);
		}
		static getValidValues (items){
			if(items && items.length){
				const mapValidValues = (item, index) =>{
					return (
						<ValidValueComponent key={index} validValue={item}/>
					);
				};
				return (
					<PanelGroup defaultActiveKey="1"
					            accordion>
						<Panel header="Valid Values"
						       ventKey="1">
							<ul className={"list-unstyled"}>
								{items.map(mapValidValues)}
							</ul>
						</Panel>
					</PanelGroup>
				);
			}
		}

	}
	return Question;
}