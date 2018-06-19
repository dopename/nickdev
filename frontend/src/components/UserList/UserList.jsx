import React, { Component } from 'react';
import { Button } from 'reactstrap';
import ListItems from './ListItems/ListItems'

export default class UserList extends Component {
	constructor(props) {
		super(props)

		this.state = {
			user_list:[],
			user:false,
			mode:'view',
			activeList:false,
		}

		this.toggleActiveList = this.toggleActiveList.bind(this);
		this.submitCreateList = this.submitCreateList.bind(this);
		this.infoFromToken = this.infoFromToken.bind(this)
		this.submitDeleteList = this.submitDeleteList.bind(this);
		this.submitCreateList = this.submitCreateList.bind(this);
	}

	componentDidMount() {
		if (!this.props.user) {
			this.infoFromToken();
		}
	}

	componentDidUpdate(prevProps) {
		if (this.props != prevProps) {
			this.fetchUserList(this.props.user);
		}
	}

	//infoFromToken queries the token-verify endpoint and sets state with the use object
	infoFromToken() {
		var url = "https://www.nicksdevenv.com/token-verify/"

		fetch(url, {
			method:'post',
			headers: {
				"content-type":"application/json",
				Authorization:`JWT ${localStorage.getItem('token')}`
			},
			body:JSON.stringify({token:localStorage.getItem('token')})
		})
		.then(response => response.json())
		.then(json => {
			console.log(json);
			this.setState({user:json.user});
			this.fetchUserList(json.user);
		})

	}

	//fetchUserList obtains the information for each userList item that a user has
	fetchUserList(user) {
		if (user === false) {
			user = this.state.user
		}
		var url = "https://www.nicksdevenv.com/api/user_list/"

		var queries = user.user_list.map((ul) => {
			return fetch(url + ul + '/', {
				headers: {
					Authorization: `JWT ${localStorage.getItem('token')}`,
					"Content-Type":"application/json",
				}
			})
			.then(response => response.json())
		})
		Promise.all(queries).then( (data) => { this.setState({user_list:data}) })
	}

	//toggleActiveList toggles which list is currently active
	toggleActiveList(pk) {
		if (this.state.activeList === pk) {
			this.setState({activeList:false});
		}
		else {
			this.setState({activeList:pk});
		}
	}

	//submitDeleteList deletes a list item and calls upon the verifyToken prop to update values
	submitDeleteList(data) {
		var url = "https://www.nicksdevenv.com/api/destroy/user_list/"

		fetch(url + data + "/", {
			method:"delete", 
			headers: {
				Authorization: `JWT ${localStorage.getItem('token')}`,
			}
		})
		.then(response => {
			if (response.ok) {
				this.props.verifyToken()
			}
		})
	}

	//submitCreateList creates a list item and calls upon the verifyToken prop to update values
	submitCreateList(data) {
		var url = "https://www.nicksdevenv.com/api/user_list/"

		fetch(url, {
			method:'post',
			headers: {
				"content-type":"application/json",
				Authorization: `JWT ${localStorage.getItem('token')}`,
			},
			body: JSON.stringify(data)
		})
		.then(response => {
			if (response.ok) {
				this.props.verifyToken();
			}
		})
	}


	toggleView(view) {
		var newValue = this.state.mode === view ? 'view' : view;
		this.setState({mode:newValue, activeList:false});
	}

	render() {
		var currentItemList = this.state.activeList ? this.state.user_list[this.state.user_list.map(e => e.pk).indexOf(this.state.activeList)].list_items : false

		return (
			<div>
				<div className="row">
					<div class="col-lg-3 text-center">
						<Button outline className={this.state.mode === "create" ? "active" : null} color="success" size="lg" onClick={() => this.toggleView('create')}>Create a list</Button>
					</div>
					<div class="col-lg-3 text-center">
						<Button outline className={this.state.mode === "delete" ? "active" : null} color="danger" size="lg" onClick={() => this.toggleView('delete')}>Delete a list</Button>
					</div>
					<div class="col-lg-3 text-center">
						<Button outline className={this.state.mode === "view" ? "active" : null} color="info" size="lg" onClick={() => this.toggleView('view')}>View lists</Button>
					</div>
					<div class="col-lg-3 text-center">
						<Button outline className={this.state.mode === "edit" ? "active" : null} color="warning" size="lg" onClick={() => this.toggleView('edit')}>Edit a list</Button>
					</div>
				</div>
				<div className="row">
					<div className="col-lg-6">
						{this.state.mode === 'view' ? <Lists user_list={this.state.user_list} activeList={this.state.activeList} toggleActiveList={this.toggleActiveList} />:null}
						{this.state.mode === 'create' ? <CreateList user_id={this.state.user.pk} onSubmit={this.submitCreateList} /> : null}
						{this.state.mode === 'delete' ? <DeleteList user_list={this.state.user_list} onSubmit={this.submitDeleteList} /> : null}
					</div>
					<div className="col-lg-6">
						<h3>Items</h3>
						{ this.state.activeList ? <ListItems updateList={this.fetchUserList} list={this.state.activeList} items={currentItemList} /> : null }
					</div>
				</div>
			</div>

		)
	}
}

class Lists extends Component {
	constructor(props) {
		super(props)
	}

	render() {
		var renderList = []

		this.props.user_list.map((ul) => {
			renderList.push(<li key={ul.pk} onClick={() => this.props.toggleActiveList(ul.pk)} className={this.props.activeList === ul.pk ? "list-group-item pointer-hand btn-outline-info active" : "list-group-item btn-outline-info pointer-hand"}>{ul.list_title}</li>);
		});
		return (
			<div>
				<h3>Lists</h3>
				<ul className="list-group">
					{renderList}
				</ul>
			</div>
		)
	}
}

class CreateList extends Component {
	constructor(props) {
		super(props)

		this.state = {
			list_title:""
		}

		this.cleanData = this.cleanData.bind(this);
		this.handleChange = this.handleChange.bind(this);
	}

	cleanData(e) {
		e.preventDefault();
		var newData = {
			custom_user:this.props.user_id,
			list_title:this.state.list_title,
		}

		this.props.onSubmit(newData);
	}

	handleChange(e) {
		this.setState({list_title:e.target.value});
	}

	render() {
		return (
			<div>
				<h3>Create a List</h3>
				<form onSubmit={this.cleanData}>
					<input className="form-control" type="text" name="list_title" value={this.state.list_title} onChange={this.handleChange} />
					<br/>
					<input type="submit" className="form-control" value="Submit" />
				</form>
			</div>
		)
	}
}


class DeleteList extends Component {
	constructor(props) {
		super(props)

		this.state = {
			selected:false,
		}

		this.toggleActive = this.toggleActive.bind(this);
		this.submitDelete = this.submitDelete.bind(this);
	}

	toggleActive(pk) {
		this.setState({selected:pk})
	}

	submitDelete(e) {
		e.preventDefault();
		this.props.onSubmit(this.state.selected);
	}

	render() {
		var renderList = []

		this.props.user_list.map((ul) => {
			renderList.push(<li key={ul.pk} onClick={() => this.toggleActive(ul.pk)} className={this.state.selected === ul.pk ? "list-group-item pointer-hand btn-outline-danger active" : "list-group-item pointer-hand btn-outline-danger"}>{ul.list_title}</li>);
		});

		return (
			<div>
				<h3>Delete List</h3>
				<ul className="list-group">
					{renderList}
				</ul>
				<form onSubmit={this.submitDelete}>
					<input type="hidden" name="pk" value={this.state.selected} />
					<br/>
					<input type="submit" className="form-control" value="Submit" />
				</form>
			</div>
		)
	}
}

//`JWT ${localStorage.getItem('token')}`