import React, { Component } from "react";
import { Button, ButtonGroup } from 'reactstrap';
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
		this.submitNewProject = this.submitNewProject.bind(this);
		this.deleteProject = this.deleteProject.bind(this);
	}

	changeView(view) {
		this.setState({view:view});
	}

	submitNewProject(data) {
		const url = "/api/project/"

		fetch(url, {
			method:'post',
			headers: {
				"content-type":"application/json",
				Authorization: `JWT ${localStorage.getItem('token')}`,
			},
			body:JSON.stringify(data)
		})
		.then(response => {
			if (response.ok) {
				this.props.verifyToken();
				this.setState({view:'home'});
			}
		})
	}

	deleteProject(pk, title) {
		const url = "/api/destroy/project/" + pk + "/"

		var confirmed = window.confirm("Are you sure you want to delete the following project: " + title +"?");
		if (confirmed) {
			fetch(url, {
				method:"delete",
				headers: {
					Authorization: `JWT ${localStorage.getItem('token')}`,
				}
			})
			.then(response => {
				if (response.ok) {
					this.props.verifyToken();
				}
			})
		}
	}

	render() {

		const homeScreen = ( 
					<div className="row">
						<div className="col-lg-6">
							<h2>Working on an existing project?</h2>
							<Button outline size="md" color="success" onClick={ () => this.changeView('existing') }>Click here</Button>
						</div>
						<div className="col-lg-6">
							<h2>Starting a new project?</h2>
							<Button outline size="md" color="success" onClick={ () => this.changeView('new') }>Click here</Button>
						</div>
					</div>
		
		)
		return (
			<div>
				<Button outline className="text-center mb-3" size="lg" color="dark" onClick={() => {this.changeView('home')}}>Project Management Home</Button>
				{this.state.view === 'home' ? homeScreen : null }
				{this.state.view === 'existing' ? <ExistingProjects deleteProject={this.deleteProject} projects={this.props.user.projects} /> : null }
				{this.state.view === 'new' ? <NewProject changeView={this.changeView} onFormSubmit={this.submitNewProject} /> : null }
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
		this.updateProject = this.updateProject.bind(this);
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

	updateProject(pk, data) {
		const url = "https://www.nicksdevenv.com/api/project/" + pk + "/"

		fetch(url, {
			method:'put',
			headers: {
				Authorization: `JWT ${localStorage.getItem('token')}`,
				"Content-Type":"application/json",
			},
			body:JSON.stringify(data)
		})
		.then(response => {
			if (response.ok) {
				this.fetchProjects();
			}
		})
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
				<ReactCSSTransitionGroup transitionName="test" transitionEnterTimeout={1000} transitionLeaveTimeout={500}>
					{this.props.projects.length < 1 ? noProjects : null }
					{this.props.projects.length > 0 && !this.state.activeProject ? <NormalList updateProject={this.updateProject} key="normal" deleteProject={this.props.deleteProject} selectProject={this.selectProject} projects={this.state.projects} /> : <CoolList key="cool" refresh={this.fetchProjects} selectProject={this.selectProject} project={this.state.projects[this.state.projects.map(e => e.pk).indexOf(this.state.activeProject)]}/> }
				</ReactCSSTransitionGroup>
			</div>
		)
	}
}

//					{this.state.activeProject ? <CoolList selectProject={this.selectProject} project={this.state.projects[this.state.projects.map(e => e.pk).indexOf(this.state.activeProject)]}/> : null }

class NormalList extends Component {
	constructor(props) {
		super(props)

		this.state = {
			editableProject:false,
			title:false,
			members:[]
		}

		this.toggleEditable = this.toggleEditable.bind(this);
		this.cleanData = this.cleanData.bind(this);
		this.handleChange = this.handleChange.bind(this);
	}

	toggleEditable(pk) {
		if (this.state.editableProject === pk) {
			this.setState({editableProject:false});
		}
		else {
			var title = this.props.projects[this.props.projects.map(e => e.pk).indexOf(pk)].title
			var members = this.props.projects[this.props.projects.map(e => e.pk).indexOf(pk)].members
			this.setState({editableProject:pk, title:title, members:members})
		}
	}

	cleanData(e) {
		e.preventDefault();

		var formData = {
			title:this.state.title,
			members:this.state.members,
		}

		this.props.updateProject(this.state.editableProject, formData);
		this.setState({editableProject:false, title:false, members:[]});
	}

	handleChange(e) {
		this.setState({[e.target.name]:e.target.value})
	}

	render() {
		const renderProjects = []

		this.props.projects.map((project) => {

			if (project.pk !== this.state.editableProject) {
				renderProjects.push(
					<li>
						<EditDeleteListItem 
							edit={this.toggleEditable} 
							select={this.props.selectProject} 
							delete={this.cleanData} 
							color="info"
							title={project.title}
							pk={project.pk}
							/>
						</li>
					)
			}
			else {
				renderProjects.push(
						<li><ActiveEditDeleteListItem toggle={this.toggleEditable} pk={project.pk} title={this.state.title} onSubmit={this.cleanData} handleChange={this.handleChange} /></li>
					)
			}
		})
		return (
			<ul className="list-group">
				{renderProjects}
			</ul>
		)
	}
}


class EditDeleteListItem extends Component {
	constructor(props) {
		super(props)
	}

	render() {
		return (
					<div className="row">
						<h4 key={"projecte" + this.props.pk}
							onClick={() => { this.props.edit(this.props.pk) } }
							className="list-group-item btn-outline-warning pointer-hand col-1 p-1">
							<i className="fa fa-pencil"></i>
						</h4>
						<h4 key={"project" + this.props.pk} 
							onClick={ () => {this.props.select(this.props.pk)} } 
							className={"list-group-item pointer-hand p-1 col-10 btn-outline-" + this.props.color}>
							{this.props.title}
						</h4>
						<h4 key={"projectd" + this.props.pk}
							onClick={() => {this.props.delete(this.props.pk, this.props.title)} }
							className="list-group-item btn-outline-danger pointer-hand col-1 p-1">
							<i className="fa fa-trash"></i>
						</h4>
					</div>
		)
	}
}


class ActiveEditDeleteListItem extends Component {
	constructor(props) {
		super(props)
	}
	render() {
		return ( 
					<form onSubmit={this.props.onSubmit}>
						<div className="row">
							<h4 key={"projecte" + this.props.pk}
								onClick={() => { this.props.toggle(this.props.pk) } }
								className="list-group-item btn-outline-warning pointer-hand col-1 p-1 active">
								<i className="fa fa-pencil"></i>
							</h4>
							<input key={"project" + this.props.pk} 
								value={this.props.title}
								onChange={this.props.handleChange}
								type="text"
								name="title"
								className="form-control col-9"
								/>
							<h4 onClick={() => {this.props.toggle(this.props.pk)} }
								className="btn btn-outline-danger pointer-hand col-1 p-1 m-0">
								&#10005;
							</h4>
							<input type="submit" className="btn-block form-control pointer-hand btn-outline-success col-1" value="&#10004;" />
						</div>
					</form>
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
				<h3 className="text-center my-2">Phases</h3>
				<Phases refresh={this.props.refresh} project={p.pk} phases={p.phases} />
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
			newPhase:false,
			editablePhase:false,
			title:null,
			order:null,
			project:this.props.project
		}

		this.submitPhaseForm = this.submitPhaseForm.bind(this);
		this.fetchPhases = this.fetchPhases.bind(this);
		this.toggleActivePhase = this.toggleActivePhase.bind(this);
		this.toggleNewPhase = this.toggleNewPhase.bind(this);
		this.handleChange = this.handleChange.bind(this);
		this.toggleEditablePhase = this.toggleEditablePhase.bind(this);
		this.updatePhase = this.updatePhase.bind(this);
		this.cleanData = this.cleanData.bind(this);
		this.deletePhase = this.deletePhase.bind(this);
	}

	componentDidMount() {
		this.fetchPhases();
	}

	componentDidUpdate(prevProps) {
		if (this.props != prevProps) {
			this.fetchPhases();
		}
	}

	submitPhaseForm(e) {
		e.preventDefault();

		var formData = {
			project:this.state.project,
			title:this.state.title,
			order:this.state.order,
		}

		const url = "/api/phase/"

		fetch(url, {
			method:'post',
			headers: {
				"content-type":"application/json",
				Authorization: `JWT ${localStorage.getItem('token')}`,
			},
			body:JSON.stringify(formData)
		})
		.then(response => {
			if (response.ok) {
				this.setState({
					newPhase:false,
					title:null,
					order:null
				});
				this.props.refresh();

			}
		})
	}

	deletePhase(pk, title) {
		const url = "/api/destroy/phase/" + pk + "/"

		var confirmed = window.confirm("Are you sure you want to delete the following phase: " + title +"?");
		if (confirmed) {
			fetch(url, {
				method:"delete",
				headers: {
					Authorization: `JWT ${localStorage.getItem('token')}`,
				}
			})
			.then(response => {
				if (response.ok) {
					this.props.refresh();
				}
			})
		}
	}

	updatePhase(pk, data) {
		const url = "https://www.nicksdevenv.com/api/update/phase/" + pk + "/"

		fetch(url, {
			method:'put',
			headers: {
				Authorization: `JWT ${localStorage.getItem('token')}`,
				"Content-Type":"application/json",
			},
			body:JSON.stringify(data)
		})
		.then(response => {
			if (response.ok) {
				this.props.refresh();
			}
		})
	}

	cleanData(e) {
		e.preventDefault();

		var formData = {
			title:this.state.title,
		}

		this.updatePhase(this.state.editablePhase, formData);
		this.setState({editablePhase:false, title:null});
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

	toggleEditablePhase(pk) {
		if (this.state.editablePhase === pk) {
			this.setState({editablePhase:false, title:null});
		}
		else {
			var title = this.state.phases[this.state.phases.map(e => e.pk).indexOf(pk)].title
			this.setState({editablePhase:pk, title:title});
		}
	}

	toggleNewPhase() {
		this.setState({newPhase:!this.state.newPhase});
	}

	handleChange(e) {
		this.setState({[e.target.name]:e.target.value})
	}

	render() {
							// <h4 
							// className={this.state.activePhase === phase.pk ? "list-group-item btn-outline-success pointer-hand active" : "list-group-item btn-outline-success pointer-hand" }
							// onClick={ () => { this.toggleActivePhase(phase.pk) } } 
							// key={"phase" + phase.pk}
							// >
							// 	{phase.title}
							// </h4>

		var renderPhases = [];

		this.state.phases.map((phase) => {

			if (phase.pk !== this.state.editablePhase) {
				renderPhases.push(
						<li>
							<EditDeleteListItem
								edit={this.toggleEditablePhase} 
								select={this.toggleActivePhase} 
								delete={this.deletePhase} 
								color="success"
								title={phase.title}
								pk={phase.pk}
							/>
							{this.state.activePhase === phase.pk ? <li><PhaseObjectives refresh={this.fetchPhases} phase={this.state.activePhase} objectives={this.state.phases[this.state.phases.map(e => e.pk).indexOf(this.state.activePhase)].objectives} /></li> : null }
						</li>
				)
			}
			else {
				renderPhases.push(
					<li>
						<ActiveEditDeleteListItem 
							toggle={this.toggleEditablePhase} 
							pk={phase.pk} 
							title={this.state.title} 
							onSubmit={this.cleanData} 
							handleChange={this.handleChange} 
							/>
					</li>

					)
			}
		})

		if (!this.state.newPhase) {
			renderPhases.push(<li><AddButton position="center" onClick={this.toggleNewPhase} /></li>)
		}
		else {
			var newForm = (
					<form className="mt-3" onSubmit={this.submitPhaseForm}>
						<h4 className="text-center">New Phase</h4>
						<div className="container">
							<div className="form-group row">
								<div className="col-lg-8">
									<h5 className="my-1 text-center">Title:</h5>
									<input required type="text" name="title" value={this.state.title} onChange={this.handleChange} className="form-control" />
								</div>
								<div className="col-lg-4">
									<h5 className="my-1 text-center">Order:</h5>
									<input required type="number" name="order" value={this.state.order} onChange={this.handleChange} className="form-control" />
								</div>
							</div>
							<input type="submit" className="form-control pointer-hand btn-outline-secondary" value="Submit" />
							<Button outline color="danger" className="btn-block" size="md" onClick={() => this.toggleNewPhase()}>Cancel</Button>
						</div>
					</form>
				);

			renderPhases.push(newForm)
		}

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
			//orderError:false,
			activeObjective:false,
			createNew:false,
			title:null,
			order:null,
			description:null,
			notes:null,
			priority:null,
			due_date:null, 
			phase:this.props.phase
		}

		this.toggleActiveObjective = this.toggleActiveObjective.bind(this);
		this.fetchObjectives = this.fetchObjectives.bind(this);
		this.toggleNewObjective = this.toggleNewObjective.bind(this);
		this.submitNewObjective = this.submitNewObjective.bind(this);
		this.handleChange = this.handleChange.bind(this);
		this.completeObjective = this.completeObjective.bind(this);
		this.deleteObjective = this.deleteObjective.bind(this);
		//this.checkOrderDuplicate = this.checkOrderDuplicate.bind(this);
	}

	componentDidMount() {
		this.fetchObjectives();
	}

	componentDidUpdate(prevProps) {
		if (this.props !== prevProps) {
			this.fetchObjectives();
		}
	}

	fetchObjectives(objectives) {
		const url = "https://www.nicksdevenv.com/api/objective/"

		var queries = this.props.objectives.map((objective) => {
			return fetch(url + objective + "/", {
				headers: {
					Authorization: `JWT ${localStorage.getItem('token')}`,
				}
			})
			.then(response => response.json())
		})

		Promise.all(queries).then((data) => { this.setState({objectives:data, order:Math.max.apply(Math, data.map((o) => {return o.order })) +1 }) })
	}

	toggleActiveObjective(pk) {
		if (this.state.activeObjective === pk) {
			this.setState({activeObjective:false});
		}
		else {
			this.setState({activeObjective:pk});
		}
	}

	toggleNewObjective() {
		this.setState({createNew:!this.state.createNew});
	}

	submitNewObjective(e) {
		e.preventDefault();
		const url = "https://www.nicksdevenv.com/api/objective/"

		var submitData = {
			title:this.state.title,
			order:this.state.order,
			description:this.state.description,
			notes:this.state.notes,
			priority:this.state.priority,
			due_date:this.state.due_date,
			phase:this.props.phase
		}

		// var duplicateOrder = this.checkOrderDuplicate(submitData['order'])

		// if (!duplicateOrder) {
		fetch(url, {
			method:'post',
			headers: {
				"content-type":"application/json",
				Authorization: `JWT ${localStorage.getItem('token')}`,
			},
			body: JSON.stringify(submitData)
		})
		.then(response => {
			if (response.ok) {
				this.setState({
					createNew:false,
					title:null,
					order:null,
					description:null,
					notes:null,
					priority:null,
					due_date:null,
					orderError:false
				})
				this.props.refresh();
			}
		})
		// }
		// else {
		// 	this.setState({orderError:true})
		// }

	}

	// checkOrderDuplicate(num) {
	// 	this.state.objectives.map(obj => {
	// 		if (num === obj.order.toString()) {
	// 			return true
	// 		}
	// 	})
	// 	return false
	// }

	completeObjective(obj, complete) {
		const pk = obj.pk

		delete obj.pk

		if (complete) {
			obj.completed = !obj.completed
		}

		const url = "https://www.nicksdevenv.com/api/objective/"

		fetch(url + pk + "/", {
			method:'put',
			headers: {
				"content-type":"application/json",
				Authorization: `JWT ${localStorage.getItem('token')}`,
			},
			body:JSON.stringify(obj)

		})
		.then(response => {
			if (response.ok) {
				this.fetchObjectives();
			}
		})
	}

	deleteObjective(pk, title) {
		const url = "/api/destroy/objective/" + pk + "/"

		var confirmed = window.confirm("Are you sure you want to delete the following objective: " + title +"?");

		if (confirmed) {
			fetch(url, {
				method:"delete",
				headers: {
					Authorization: `JWT ${localStorage.getItem('token')}`,
				}
			})
			.then(response => {
				if (response.ok) {
					this.props.refresh();
				}
			})
		}
	}

	handleChange(event) {
		this.setState({[event.target.name] : event.target.value});
	}

	render() {
		var obj = this.state.objectives.sort(function (a, b) {
			return a.pk - b.pk;
		});

		var renderObjectives = [];

		obj.map((o) => {
			renderObjectives.push(
				<li>
					<h5 className={"list-group-item pointer-hand btn-outline-" + (o.completed ? "primary":"secondary") + (this.state.activeObjective === o.pk ?  " active" : "")}
					onClick={ () => { this.toggleActiveObjective(o.pk) } }
					>
						<span class="badge badge-success badge-pill float-left">{o.order}</span>{o.title}<span class="badge badge-info badge-pill float-right">{o.priority ? o.priority : "N/A"}</span>
					</h5>
					{this.state.activeObjective === o.pk ? <ObjectiveInfo deleteObjective={this.deleteObjective} completeObjective={this.completeObjective} o={o} /> : null }
				</li>
			)
		})

//{this.state.orderError ? <h5 className="alert alert-danger" role="alert">Two objectives can't be done in the same order!</h5> : null}

		const newForm = (
			<form className="mt-3" onSubmit={this.submitNewObjective}>
				<h4 className="text-center">New Objective</h4>
				<div className="form-group row">
					<div className="col-lg-5">
						<h5 className="my-1 text-center">Title:</h5>
						<input className="form-control" required type="text" name="title" value={this.state.title} onChange={this.handleChange} />
					</div>
					<div className="col-lg-3">
						<h5 className="my-1 text-center">Due Date:</h5>
						<input className="form-control" type="date" name="due_date" value={this.state.due_date} onChange={this.handleChange} />
					</div>
					<div className="col-lg-2">
						<h5 className="my-1 text-center">Order</h5>
						<input className="form-control" type="number" name="order" value={this.state.order} onChange={this.handleChange} />
					</div>
					<div className="col-lg-2">
						<h5 className="my-1 text-center">Priority</h5>
						<input className="form-control" type="number" name="priority" value={this.state.priority} onChange={this.handleChange} />
					</div>
				</div>
				<div className="form-group row">
					<div className="col-lg-12">
						<h5 className="my-1 text-center">Description</h5>
						<textarea className="form-control" required type="text" name="description" value={this.state.description} onChange={this.handleChange}></textarea>
					</div>
				</div>
				<div className="form-group row">
					<div className="col-lg-12">
						<h5 className="my-1 text-center">Notes</h5>
						<textarea className="form-control" type="text" name="notes" value={this.state.notes} onChange={this.handleChange}></textarea>
					</div>
				</div>
				<input type="submit" className="form-control pointer-hand btn-outline-secondary" value="Submit" />
				<Button outline className="mb-2" color="danger" className="btn-block" size="md" onClick={() => this.toggleNewObjective()}>Cancel</Button>
			</form>
		)


		if (!this.state.createNew) {
			renderObjectives.push(<li><AddButton position="center" onClick={this.toggleNewObjective} /></li>)
		}
		else {
			renderObjectives.push(
					<li>
						{newForm}
					</li>
				)
		}

		return (
			<div>
				<ul className="list-group-item">
					{renderObjectives}
				</ul>
			</div>
		)
	}
}


class ObjectiveInfo extends Component {
	constructor(props) {
		super(props)

		this.state = {
			editable:false,
			description:this.props.o.description,
			notes:this.props.o.notes,
			due_date:this.props.o.due_date,
			mobile:window.screen.width > 540 ? false : true,
			order:this.props.o.order,
			priority:this.props.o.priority
		}

		this.toggleEditable = this.toggleEditable.bind(this);
		this.handleChange = this.handleChange.bind(this);
		this.submitEdit = this.submitEdit.bind(this);
	}

	submitEdit(e) {
		e.preventDefault();

		var obj = this.props.o

		obj.description = this.state.description
		obj.notes = this.state.notes
		obj.due_date = this.state.due_date
		obj.order = this.state.order
		obj.priority = this.state.priority

		this.setState({editable:false});

		this.props.completeObjective(obj, false);
	}


	toggleEditable() {
		this.setState({editable:!this.state.editable});
	}

	handleChange(e) {
		this.setState({[e.target.name]:e.target.value})
	}


	render() {
		const normalDisplay = (
			<div>
				<p className="my-1 px-2 text-left"><strong>Description:</strong> {this.props.o.description}</p>
				<p className="my-1 px-2 text-left"><strong>Notes:</strong> {this.props.o.notes}</p>
				<p className="my-1 px-2 text-left"><strong>Due Date:</strong> {this.props.o.due_date}</p>
				<p className="px-2 text-primary text-left"><small>Last edit: {this.props.o.last_edit}</small></p>
				<ButtonGroup className={"mb-2" + (this.state.mobile ? " btn-block btn-group-vertical" : "")}>
					<Button outline size="md" color="warning" onClick={() => this.toggleEditable()}>Edit Objective</Button>
					<Button outline size="md" color="danger" onClick={() => this.props.deleteObjective(this.props.o.pk, this.props.o.title)}>Delete Objective</Button>
					{this.props.o.completed ? <Button outline size="md" onClick={() => {this.props.completeObjective(this.props.o, true)} } color="secondary">Mark Incomplete</Button> : <Button outline size="md" onClick={() => {this.props.completeObjective(this.props.o, true)} } color="primary">Mark Complete</Button>}
				</ButtonGroup>
			</div>
			)

		var editDisplay = (
			<form className="my-2" onSubmit={this.submitEdit}>
				<div className="input-group">
					<div className="input-group-prepend col-2">
						<strong>Order:</strong>
					</div>
					<input type="number" className="form-control col-10" name="order" value={this.state.order} onChange={this.handleChange} />
				</div>
				<div className="input-group">
					<div className="input-group-prepend col-2">
						<strong>Priority:</strong>
					</div>
					<input type="number" className="form-control col-10" name="priority" value={this.state.priority} onChange={this.handleChange} />
				</div>
				<div className="input-group">
					<div className="input-group-prepend col-2">
						<strong>Description:</strong>
					</div>
					<textarea required type="text" className="form-control col-10" name="description" value={this.state.description} onChange={this.handleChange} />
				</div>
				<div className="input-group">
					<div className="input-group-prepend col-2">
						<strong>Notes:</strong>
					</div>
					<textarea type="text" className="form-control col-10" name="notes" value={this.state.notes} onChange={this.handleChange} />
				</div>
				<div className="input-group">
					<div className="input-group-prepend col-2">
						<strong>Due Date:</strong>
					</div>
					<input type="date" className="form-control col-10" name="due_date" value={this.state.due_date} onChange={this.handleChange} />
				</div>
				<input type="submit" className="form-control pointer-hand btn-outline-secondary" value="Submit Edits" />
				<Button outline className="mb-2" color="danger" className="btn-block" size="md" onClick={() => this.toggleEditable()}>Cancel</Button>
			</form>
			)

		return (
			<div className="border border-dark">
				{this.state.editable ? editDisplay : normalDisplay }
			</div>
		)
	}
}


class AddButton extends Component {
	constructor(props) {
		super(props)
	}

	render() {
		return (
			<h4 className="mt-3"><i className={"fa fa-plus text-success pointer-hand text-" + this.props.position} onClick={() => { this.props.onClick() } }></i></h4>
		)
	}
}

class DeleteButton extends Component {
	constructor(props) {
		super(props)
	}

	render() {
		return (
			<h4 className="mt-3"><i className={"fa fa-trash text-danger pointer-hand text-" + this.props.position} onClick={() => { this.props.onClick() } }></i></h4>
		)
	}
}

class EditButton extends Component {
	constructor(props) {
		super(props)
	}

	render() {
		return (
			<h4 className="mt-3"><i className={"fa fa-pencil text-warning pointer-hand text-" + this.props.position} onClick={() => { this.props.onClick() } }></i></h4>
		)
	}
}


class NewProject extends Component {
	constructor(props) {
		super(props)

		this.state = {
			userList:[],
			title:"",
			members:[],
		}

		this.cleanData = this.cleanData.bind(this);
		this.handleChange = this.handleChange.bind(this);
		this.handleSelectChange = this.handleSelectChange.bind(this);
	}

	componentDidMount() {
		const url = "/api/users/"

		fetch(url, {
			headers: {
				Authorization: `JWT ${localStorage.getItem('token')}`,
			}
		})
		.then(response => response.json())
		.then(json => {
			this.setState({userList:json})
		})
	}

	cleanData(e) {
		e.preventDefault();

		var data = {
			title:this.state.title,
			members:this.state.members
		}

		this.props.onFormSubmit(data)
	}

	handleChange(e) {
		this.setState({[e.target.name]:e.target.value})
	}

	handleSelectChange(e) {
		var options = e.target.options;
		var value = [];
		for (var i = 0, l = options.length; i < l; i++) {
			if (options[i].selected) {
				value.push(options[i].value);
			}
		}
  		this.setState({members:value});
	}

	render() {
		var options = []

		this.state.userList.map((user) => {
			options.push(<option key={"user_" + user.pk} value={user.pk}>{user.username}</option>)
		})

		return ( 
			<div>
				<h3 className="text-center my-2">Add New Project</h3>
				<form onSubmit={this.cleanData}>
					<div className="form-group row">
						<div className="col-lg-6">
							<h4 className="text-center">Title:</h4>
							<input className="form-control" name="title" type="text" value={this.state.title} onChange={this.handleChange} />
						</div>
						<div className="col-lg-6">
							<h4 className="text-center">Members:</h4>
							<select multiple="multiple" className="form-control" name="members" value={this.state.members} onChange={this.handleSelectChange}>{options}</select>
						</div>
					</div>
					<input type="submit" className="form-control pointer-hand btn-outline-secondary" value="Submit" />
					<Button outline className="mb-2" color="danger" className="btn-block" size="md" onClick={() => this.props.changeView('home')}>Cancel</Button>
				</form>
			</div>
		)
	}
}
