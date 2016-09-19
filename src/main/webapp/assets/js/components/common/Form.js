import React from 'react';
import Formsy from 'formsy-react';
import FRC from 'formsy-react-components';

/*TODO: Refactor to use ES6 class with Formsy.HOC instead of Mixin*/
const Form = React.createClass({

	mixins: [FRC.ParentContextMixin],

	propTypes: {
		children: React.PropTypes.node
	},
	render() {
		return (
			<Formsy.Form  {...this.props}>
				{this.props.children}
			</Formsy.Form>
		);
	}

});

export default Form;