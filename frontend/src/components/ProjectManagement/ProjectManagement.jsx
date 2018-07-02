import React, { Component } from "react";
import { Button } from 'reactstrap';

export default class ProjectManagement extends Component {
	constructor(props) {
		super(props)

		this.state = {
			view:'home',
			projects:[],
		}

		this.changeView = this.changeView.bind(this);
		this.fetchProjects = this.fetchProjects.bind(this);
	}

	componentDidMount() {
		this.fetchProjects(this.props.user.projects);
	}

	componentDidUpdate(prevProps) {
		if (this.props != prevProps) {
			this.fetchProjects(this.props.user.projects);
		}
	}

	changeView(view) {
		this.setState({view:view});
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
				{this.state.view === 'view' ? <ViewProjects projects={this.state.projects} /> : null }
				{this.state.view === 'new' ? <NewProject /> : null }
			</div>
		)
	}
}


class ViewProjects extends Component {
	constructor(props) {
		super(props)
	}

	render() {
		const noProjects = (
				<div>
					<h3>It looks like you don't have any projects!</h3>
					<p>Click the button below to start one.</p>
					<Button outline size="md" color="success" onClick={ () => this.props.changeview('new') }>Start Project</Button>
				</div>
			)

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
