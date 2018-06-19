import React, { Component } from 'react'

export default class ListItems extends Component {
	constructor(props) {
		super(props)

		this.state = {
			items:[],
			new_item_title:'',
			new_item_description:'',

		}

		this.addListItem = this.addListItem.bind(this);
		this.deleteListItem = this.deleteListItem.bind(this);
		this.handleChange = this.handleChange.bind(this);
		this.toggleAccordianClick = this.toggleAccordianClick.bind(this);
	}

	componentDidMount() {
		this.fetchListItems();
	}

	componentDidUpdate(prevProps) {
		if (this.props != prevProps) {
			this.fetchListItems();
		}
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

	addListItem(e) {
		e.preventDefault();

		var data = {
			user_list:this.props.list,
			item_title:this.state.new_item_title,
			description:this.state.description,
		}

		var url = "https://www.nicksdevenv.com/api/list_item/"

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
				this.props.updateList();
			}
		})
	}

	deleteListItem(e) {
		e.prventDefault();
		var url = "https://www.nicksdevenv.com/api/destroy/list_item/"

		fetch(url + e + "/", {
			method: "delete",
			headers: {
				Authorization: `JWT ${localStorage.getItem('token')}`,
			}
		})
		.then(response => {
			if (response.ok) {
				this.props.updateList();
			}
		})
	}

	handleChange(e) {
		if (e.target.name === 'description') {
			this.setState({description:e.target.value})
		}
		else {
			this.setState({new_item_title:e.target.value})
		}
	}

	toggleAccordianClick(pk) {
		if (this.state.accordianDisplay === pk) {
			this.setState({accordianDisplay:false})
		}
		else {
			this.setState({accordianDisplay:pk})
		}
	}

	render() {
		var renderItems = [];

		this.state.items.map((item) => {
			renderItems.push(
				<li>
					<h4 key={item.pk} onClick={this.toggleAccordianClick(item.pk)} className="list-group-item pointer-hand">{item.item_title}</h4>
					<h4 key={"accordian" + item.pk} className={this.state.accordianDisplay === item.pk ? "d-none":"list-group-item d-block"}>{item.description}</h4>
				</li>
				)
		})
		return (
			<div>
				<ul className="list-group">
					{renderItems}
				</ul>
				<br/>
				<form onSubmit={this.addListItem}>
					<input className="form-control" type="text" name="new_item_title" value={this.state.new_item_title} onChange={this.handleChange} />
					<textarea className="form-control" type="textarea" name="description" value={this.state.description} onChange={this.handleChange} />
					<br/>
					<input type="submit" className="form-control" value="Add Item" />
				</form>
			</div>
		)
	}
}
