import React, {Component, PropTypes} from 'react';
import {Grid, Row, Col, ControlLabel} from 'react-bootstrap';

const formMetadataStatic = (props) =>{

	const mapItems = (items, key) => {
		return items.map((item) => {
			return item[key];
		}).join(", ");
	};

	return (
		<Grid fluid={true}>
			<Row className="metaDataLabel">
				<Col lg={12}>
					<ControlLabel>LONG NAME</ControlLabel>
				</Col>
			</Row>
			<Row className="metaDataContent">
				<Col lg={12}>
					{props.formMetadata.longName}
				</Col>
			</Row>

			<Row className="metaDataLabel">
				<Col lg={12}>
					<ControlLabel>PROTOCOL</ControlLabel>
				</Col>
			</Row>
			<Row className="metaDataContent">
				<Col lg={12}>
					{mapItems(props.formMetadata.protocols,"longName")}
				</Col>
			</Row>

			<Row className="metaDataLabel">
				<Col lg={12}>
					<ControlLabel>CLASSIFICATIONS</ControlLabel>
				</Col>
			</Row>
			<Row className="metaDataContent">
				<Col lg={12}>
					{mapItems(props.formMetadata.classifications,"classSchemeLongName")}
				</Col>
			</Row>

			<Row className="metaDataLabel">
				<Col lg={12}>
					<ControlLabel>DESCRIPTION</ControlLabel>
				</Col>
			</Row>
			<Row className="metaDataContent">
				<Col lg={12}>
					{props.formMetadata.preferredDefinition}
				</Col>
			</Row>

			<Row className="metaDataLabel">
				<Col lg={6}>
					<ControlLabel>CONTEXT</ControlLabel>
				</Col>
				<Col lg={6}>
					<ControlLabel>CATEGORY</ControlLabel>
				</Col>
			</Row>
			<Row className="metaDataContent">
				<Col lg={6}>
					{props.formMetadata.context.name}
				</Col>
				<Col lg={6}>
					{props.formMetadata.formCategory}
				</Col>
			</Row>

			<Row className="metaDataLabel">
				<Col lg={6}>
					<ControlLabel>WORKFLOW STATUS</ControlLabel>
				</Col>
				<Col lg={6}>
					<ControlLabel>TYPE</ControlLabel>
				</Col>
			</Row>
			<Row className="metaDataContent">
				<Col lg={6}>
				{props.formMetadata.workflow}
				</Col>
				<Col lg={6}>
				{props.formMetadata.formType}
				</Col>
			</Row>

			<Row className="metaDataLabel">
				<Col lg={6}>
					<ControlLabel>HEADER INSTRUCTION</ControlLabel>
				</Col>
				<Col lg={6}>
					<ControlLabel>FOOTER INSTRUCTION</ControlLabel>
				</Col>
			</Row>
			<Row className="metaDataContent">
				<Col lg={6}>
				{props.formMetadata.headerInstructions}
				</Col>
				<Col lg={6}>
				{props.formMetadata.footerInstructions}
				</Col>
			</Row>
		</Grid>
	);
};

export default formMetadataStatic;