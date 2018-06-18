import React, { Component } from 'react'

export default class UserList extends Component {
	constructor(props) {
		super(props)

		this.state = {
			default:false,
			user_list:[],
			user:false,
			mode:'view',
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

	toggleView() {
		var newValue = this.state.mode === 'view' ? 'create' : 'view';
		this.setState({mode:newValue});
	}

	render() {
		var renderList = [];

		this.state.user_list.map((ul) => {
			renderList.push(<li>ul.list_title</li>);
		});

		return (
			<div>
				<h3>Existing Lists</h3>
				<ul>
					{renderList}
				</ul>
				<h3>Click <p onClick={() => this.toggleView()}>here</p> to create a new list</h3>
			</div>
		)
	}
}


//`JWT ${localStorage.getItem('token')}`