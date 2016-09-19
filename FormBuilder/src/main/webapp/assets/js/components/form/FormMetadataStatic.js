import React, {Component, PropTypes} from 'react';
import {Row, Col} from 'react-bootstrap';

const formMetadataStatic = (props) =>{
	return (
		<div>
			<Row> <Col lg={9}> Long Name: {props.formMetadata.longName}
			</Col> <Col lg={3}> Version: {props.formMetadata.version}
			</Col> </Row> <Row> <Col lg={12}> Definition: {props.formMetadata.preferredDefinition}
		</Col> </Row> <Row> <Col lg={6}> Context:{props.formMetadata.context.name}</Col>
			<Col lg={6}> Category: {props.formMetadata.formCategory}
		</Col> </Row> <Row> <Col lg={6}> Workflow Status: {props.formMetadata.workflow}
		</Col> <Col lg={6}> Type: {props.formMetadata.formType}
		</Col> </Row> <Row> <Col lg={6}> Header Instructions: {props.formMetadata.headerInstructions}
		</Col> <Col lg={6}> Footer Instructions: {props.formMetadata.footerInstructions}
		</Col> </Row>
		</div>
	);
};

export default formMetadataStatic;