import React, { Component } from 'react'

export default class ListItems extends Component {
	constructor(props) {
		super(props)

		this.state = {
			items:[],
		}
	}

	componentDidMount() {
		this.fetchListItems();
	}

	fetchListItems() {
		var url = "https://www.nicksdevenv.com/api/list_item/"
		var queries = this.props.items.map((item) => {
			return fetch(url + item + "/", {
				headers: {
					Authorization: `JWT ${localStorage.getItem('token')}`,
					"Content-Type":"application/json",
				}
			})
			.then(response => response.json())
		})

		Promise.all(queries).then( (data) => { this.setState({items:data}) })
	}

	render() {
		var renderItems = [];

		this.state.items.map((item) => {
			renderItems.push(<li key={item.pk} className="list-group-item pointer-hand">{item.item_title}</li>)
		})
		return (
			<div>
				<ul className="list-group">
					{renderItems}
				</ul>
			</div>
		)
	}
}
