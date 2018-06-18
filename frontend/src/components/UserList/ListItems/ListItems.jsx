import React, { Component } from 'react'

export default class ListItems extends Component {
	constructor(props) {
		super(props)

		this.state = {
			default:false,
		}
	}

	componentDidMount() {
		this.fetchListItems();
	}

	fetchListItems() {
		var url = "https://www.nicksdevenv.com/api/user_list/" + this.props.user_list + "/"

		fetch(url, {
			headers: {
				Authorization: `JWT ${localStorage.getItem('token')}`,
				"Content-Type":"application/json",
			}
		})
	}
}
