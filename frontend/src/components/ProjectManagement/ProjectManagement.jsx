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

		this.state = {
			projects: []
		}

		this.fetchProjects = this.fetchProjects.bind(this);
	}

	componendDidMount() {
		this.fetchProjects(this.props.projects);
	}

	componentDidUpdate(prevProps) {
		if (this.props != prevProps) {
			this.fetchProjects(this.props.projects);
		}
	}

	fetchProjects(projects) {
		const url = "https://www.nicksdevenv.com/api/project/"

		var queries = projects.map((project) => {
			return fetch(url + project + '/', {
				headers: {
					Authorization: `JWT ${localStorage.getItem('token')}`,
					"Content-Type":"application/json",
				}
			})
			.then(response => response.json())
		})
		Promise.all(queries).then( (data) => { this.setState({projects:data}) })
	}

	render() {
		console.log(this.state.projects);
		const noProjects = (
				<div>
					<h3>It looks like you don't have any projects!</h3>
					<p>Click the button below to start one.</p>
					<Button outline size="md" color="success" onClick={ () => this.props.changeview('new') }>Start Project</Button>
				</div>
			)

		return (
			<div>
				{this.props.projects.length > 0 ? <ViewProjects projects={this.state.projects} /> : null }
				{this.props.projects.length < 1 ? noProjects : null }
			</div>
		)
	}
}

class ViewProjects extends Component {
	constructor(props) {
		super(props)
	}

	render() {

		var renderProjects = []

		this.props.projects.map((project) => {
			renderProjects.push(<li key={project.pk} className="list-group-item btn-outline-info pointer-hand">{project.title}</li>)
		})

		return (
			<ul className="list-group">
				{renderProjects}
			</ul>
		)
	}
}


class NewProject extends Component {
	constructor(props) {
		super(props)
	}
}
