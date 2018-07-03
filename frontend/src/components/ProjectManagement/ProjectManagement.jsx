import React, { Component } from "react";
import { Button } from 'reactstrap';
//import { CSSTransition, TransitionGroup } from 'react-transition-group';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import './ProjectManagement.css';

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
			projects: [],
			activeProject: false,
		}

		this.fetchProjects = this.fetchProjects.bind(this);
		this.selectProject = this.selectProject.bind(this);
	}

	componentDidMount() {
		this.fetchProjects();
	}

	componentDidUpdate(prevProps) {
		if (this.props != prevProps) {
			this.fetchProjects();
		}
	}

	fetchProjects() {
		const url = "https://www.nicksdevenv.com/api/project/"

		var queries = this.props.projects.map((project) => {
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

	selectProject(pk) {
		if (this.state.activeProject === pk) {
			this.setState({activeProject:false});
		}
		else {
			this.setState({activeProject:pk});
		}
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

		// const renderProjects = []

		// this.state.projects.map((project) => {
		// 	renderProjects.push(<li key={project.pk} 
		// 							onClick={ () => {this.selectProject(project.pk)} } 
		// 							className={this.state.activeProject === project.pk ? "list-group-item btn-outline-info pointer-hand active": "list-group-item btn-outline-info pointer-hand"}>
		// 							{project.title}
		// 							</li>)
		// })

		return (
			<div>
				<ReactCSSTransitionGroup transitionName="test" transitionEnterTimeout={1000} transitionLeaveTimeout={1000}>
					{this.props.projects.length < 1 ? noProjects : null }
					{this.props.projects.length > 0 && !this.state.activeProject ? <NormalList key="normal" selectProject={this.selectProject} projects={this.state.projects} /> : <CoolList key="cool" selectProject={this.selectProject} project={this.state.projects[this.state.projects.map(e => e.pk).indexOf(this.state.activeProject)]}/> }
				</ReactCSSTransitionGroup>
			</div>
		)
	}
}

//					{this.state.activeProject ? <CoolList selectProject={this.selectProject} project={this.state.projects[this.state.projects.map(e => e.pk).indexOf(this.state.activeProject)]}/> : null }

class NormalList extends Component {
	constructor(props) {
		super(props)
	}

	render() {
		const renderProjects = []

		this.props.projects.map((project) => {
			renderProjects.push(<li key={"project" + project.pk} 
									onClick={ () => {this.props.selectProject(project.pk)} } 
									className="list-group-item btn-outline-info pointer-hand">
									{project.title}
									</li>)
		})
		return (
			<ul className="list-group">
				{renderProjects}
			</ul>
		)
	}
}

class CoolList extends Component {
	constructor(props) {
		super(props)
	}

	render() {
		const p = this.props.project
		return (
			<div>
				<ul className="list-group">
					<li key={"project" + p.pk} className="list-group-item btn-outline-info active">{p.title}<i onClick={ () => this.props.selectProject(p.pk) } className="fa fa-bars pointer-hand float-right"></i></li>
				</ul>
				<br/>
				<br/>
				<Phases phases={p.phases} />
			</div>
		)
	}
}

class Phases extends Component {
	constructor(props) {
		super(props)

		this.state = {
			phases:[],
			activePhase:false,
		}
	}

	componentDidMount() {
		this.fetchPhases();
	}

	componentDidUpdate(prevProps) {
		if (this.props != prevProps) {
			this.fetchPhases();
		}
	}

	fetchPhases() {
		const url = "https://www.nicksdevenv.com/api/phase/"
		var queries = this.props.phases.map((phase) => {
			return fetch(url + phase + "/", {
				headers: {
					Authorization: `JWT ${localStorage.getItem('token')}`,
				}
			})
			.then(response => response.json())
		})

		Promise.all(queries).then((data) => { this.setState({phases:data}) })
	}

	toggleActivePhase(pk) {
		if (this.state.activePhase === pk) {
			this.setState({activePhase:false});
		}
		else {
			this.setState({activePhase:pk});
		}
	}

	render() {

		var renderPhases = [];

		this.state.phases.map((phase) => {
			renderPhases.push(
					<li className="list-group-item btn-outline-success pointer-hand" onClick={ () => { this.toggleActivePhase(phase.pk) } } key={"phase" + phase.pk}>
						<h4>{phase.title}</h4>
						{this.state.activePhase === phase.pk ? <PhaseObjectives objectives={this.state.phases[this.state.phases.map(e => e.pk).indexOf(this.state.activePhase)].objectives} /> : null }
					</li>)
		})

		return (
			<ul className="list-group">
				{renderPhases}
			</ul>
		)
	}
}

class PhaseObjectives extends Component {
	constructor(props) {
		super(props)

		this.state = {
			objectives:[],
		}
	}

	componentDidMount() {
		this.fetchObjectives(this.props.objectives);
	}

	componentDidUpdate(prevProps) {
		if (this.props !== prevProps) {
			this.fetchObjectives(this.props.objectives);
		}
	}

	fetchObjectives(objectives) {
		const url = "https://www.nicksdevenv.com/api/objective/"

		var queries = objectives.map((objective) => {
			return fetch(url + objective + "/", {
				headers: {
					Authorization: `JWT ${localStorage.getItem('token')}`,
				}
			})
			.then(response => response.json())
		})

		Promise.all(queries).then((data) => { this.setState({objectives:data}) } )
	}

	render() {
		var obj = this.state.objectives.sort(function (a, b) {
			return a.pk - b.pk;
		});

		var renderObjectives = [];

		obj.map((o) => {
			renderObjectives.push(<li className="list-group-item btn-outline-secondary">{o.title}</li>)
		})

		return (
			<ul className="list-group">
				{renderObjectives}
			</ul>
		)
	}
}


class NewProject extends Component {
	constructor(props) {
		super(props)
	}
}
