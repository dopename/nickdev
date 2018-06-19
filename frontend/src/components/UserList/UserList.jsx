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
	}

	componentDidMount() {
		if (!this.props.user) {
			this.infoFromToken();
		}
	}

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
			this.fetchUserList();
		})

	}

	fetchUserList() {
		var url = "https://www.nicksdevenv.com/api/user_list/"

		this.state.user.user_list.map((ul) => {
			fetch(url + ul + '/', {
				headers: {
					Authorization: `JWT ${localStorage.getItem('token')}`,
					"Content-Type":"application/json",
				}
			})
			.then(response => response.json())
			.then(json => {
				this.setState({user_list:[...this.state.user_list, json]});
			})
		})
	}

	toggleActiveList(pk) {
		if (this.state.activeList === pk) {
			this.setState({activeList:false});
		}
		else {
			this.setState({activeList:pk});
		}
	}

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
				this.setState({activeList:false, mode:'view'})
			}
		})
	}

	toggleView() {
		var newValue = this.state.mode === 'view' ? 'create' : 'view';
		this.setState({mode:newValue, activeList:false});
	}

	render() {
		var currentItemList = this.state.activeList ? this.state.user_list[this.state.user_list.map(e => e.pk).indexOf(this.state.activeList)].list_items : false

		var renderList = [];

		this.state.user_list.map((ul) => {
			renderList.push(<li key={ul.pk} onClick={() => this.toggleActiveList(ul.pk)} className={this.state.activeList === ul.pk ? "list-group-item pointer-hand active" : "list-group-item pointer-hand"}>{ul.list_title}</li>);
		});

		return (
			<div>
				<div className="col-lg-12">
					<Button outline color="success" size="lg" onClick={() => this.toggleView()}>Create new list</Button>
				</div>
				<div className="row">
					<div className="col-lg-6">
						{this.state.mode === 'view' ? <Lists user_list={this.state.user_list} activeList={this.state.activeList} toggleActiveList={this.toggleActiveList} />:<CreateList user_id={this.state.user.pk} onSubmit={this.submitCreateList} />}
					</div>
					<div className="col-lg-6">
						<h3>Items</h3>
						{ this.state.activeList ? <ListItems items={currentItemList} /> : null }
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
			renderList.push(<li key={ul.pk} onClick={() => this.props.toggleActiveList(ul.pk)} className={this.props.activeList === ul.pk ? "list-group-item pointer-hand active" : "list-group-item pointer-hand"}>{ul.list_title}</li>);
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
	}

	cleanData(data) {
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
			<form className="form-control" onSubmit={this.cleanData}>
				<input className="form-control" type="text" name="name" value={this.state.list_title} onChange={this.handleChange} />
				<input type="submit" value="Submit" />
			</form>
		)
	}
}

//`JWT ${localStorage.getItem('token')}`