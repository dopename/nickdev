import React, { Component } from 'react';
import { Button } from 'reactstrap';

export default class UserList extends Component {
	constructor(props) {
		super(props)

		this.state = {
			default:false,
			user_list:[],
			user:false,
			mode:'view',
			activeList:false,
		}
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

	toggleView() {
		var newValue = this.state.mode === 'view' ? 'create' : 'view';
		this.setState({mode:newValue});
	}

	render() {
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
						<h3>Existing Lists</h3>
						<ul className="list-group">
							{renderList}
						</ul>
					</div>
					<div className="col-lg-6">
					</div>
				</div>
			</div>

		)
	}
}


//`JWT ${localStorage.getItem('token')}`