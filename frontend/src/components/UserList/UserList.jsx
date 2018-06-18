import React, { Component } from 'react'

export default class UserList extends Component {
	constructor(props) {
		super(props)

		this.state = {
			default:false,
			user_list:[],
		}
	}

	componentDidMount() {
		this.fetchUserList();
	}

	fetchUserList() {
		var url = "https://www.nicksdevenv.com/api/user_list/" + this.props.user_list_pk + "/"

		fetch(url, {
			headers: {
				Authorization: `JWT ${localStorage.getItem('token')}`,
				"Content-Type":"application/json",
			}
		})
		.then(response => response.json())
		.then(json => {
			this.setState({user_list:json.user.user_list});
		})

		this.fetchListItems();

	}

	fetchListItems() {
		var url = "https://www.nicksdevenv.com/api/"
		this.state.user_list.map((item) => {

		})
	}
}


//`JWT ${localStorage.getItem('token')}`