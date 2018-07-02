import React, { Component } from "react";
import { Button } from 'reactstrap';

export default class ProjectManagement extends Component {
	constructor(props) {
		super(props)

		this.state = {
			view:'home',
		}

		this.changeView = this.changeView.bind(this);
	}

	changeView(view) {
		this.setState({view:view});
	}

	render() {

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
		return (
			<div>
				{this.state.view === 'home' ? homeScreen : null }
				{this.state.view === 'existing' ? <ExistingProjects projects={this.props.user.projects} /> : null }
				{this.state.view === 'new' ? <NewProject /> : null }
			</div>
		)
	}
}


class ExistingProjects extends Component {
	constructor(props) {
		super(props)
	}

	fetchProject(pk) {
		const url = "https://www.nicksdevenv.com/api/project/"
		fetch(url + pk + '/')
		.then(response => response.json())
	}

	render() {
		console.log(this.props.projects);
		const noProjects = (
				<div>
					<h3>It looks like you don't have any projects!</h3>
					<p>Click the button below to start one.</p>
					<Button outline size="md" color="success" onClick={ () => this.props.changeview('new') }>Start Project</Button>
				</div>
			)

		const renderProjects = []

		if (this.props.projects) {
			this.props.projects.map((project) => {
				var result = this.fetchProject(project);
				renderProjects.push(<li key={project} className="list-group-item btn-outline-info pointer-hand">{result.title}</li>)
			})
		}

		return (
			<div>
				{this.props.projects ? <ul className="list-group">{renderProjects}</ul> : noProjects }
			</div>
		)
	}
}

class NewProject extends Component {
	constructor(props) {
		super(props)
	}
}
