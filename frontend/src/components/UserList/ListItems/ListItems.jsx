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
		var url = "https://www.nicksdevenv.com/api/list_item/" + this.props.list_item_pk + "/"

		fetch(url, {
			headers: {
				Authorization: `JWT ${localStorage.getItem('token')}`,
				"Content-Type":"application/json",
			}
		})
	}
}
