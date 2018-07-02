import React, { Component } from "react";
import { Button } from 'reactstrap';

export default class ProjectManagement extends Component {
	constructor(props) {
		super(props)

		this.state = {
			view:'home',
		}
	}

	changeView(view) {
		this.setState({view:view});
	}

	render() {

		return (
			<div>
				{this.state.view === 'home' ? homeScreen : null }
				{this.state.view === 'existing' ? existingProjects : null }
				{this.state.view === 'new' ? newProject : null }
			</div>
		)
	}
}

const homeScreen = ( 
				<div className="row">
					<div className="col-6">
						<h2>Working on an existing project?</h2>
						<Button outline size="md" color="success" onClick={ () => this.changeView('existing') }>Click here</Button>
					</div>
					<div className="col-6">
						<h2>Starting a new project?</h2>
						<Button outline size="md" color="success" onClick={ () => this.changeView('new') }>Click here</Button>
					</div>
				</div>
	)