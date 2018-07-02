import React, { Component } from "react";
import { Button } from 'reactstrap';

export default class ProjectManagement extends Component {
	constructor(props) {
		super(props)
	}

	render() {

		return (
			<div>
				<h1>This is your Project Management home screen</h1>
				<div className="row">
					<div className="col-6">
						<h3>Working on an existing project?</h3>
						<Button outline size="md" color="success">Click here</Button>
					</div>
					<div className="col-6">
						<h3>Starting a new project?</h3>
						<Button outline size="md" color="success">Click here</Button>
					</div>
				</div>
			</div>
		)
	}
}
