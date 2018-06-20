import React, { Component } from 'react';
import { Button } from 'reactstrap';

export default class ListItems extends Component {
	constructor(props) {
		super(props)

		this.state = {
			items:[],
			new_item_title:'',
			description:'',
			accordianDisplay:false,
			editActive:false,

		}

		this.addListItem = this.addListItem.bind(this);
		this.deleteListItem = this.deleteListItem.bind(this);
		this.handleChange = this.handleChange.bind(this);
		this.toggleAccordianClick = this.toggleAccordianClick.bind(this);
		this.toggleEdit = this.toggleEdit.bind(this);
		this.cancelEdit = this.cancelEdit.bind(this);
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

		if (!this.state.editActive) {
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
					this.setState({new_item_title:'', description:'', editActive:false})
					this.props.updateList();
				}
			})
		}
		else {
			var data = {
				pk:this.state.editActive,
				user_list:this.state.items[this.state.items.map(e => e.pk).indexOf(this.state.editActive)].user_list,
				item_title:this.state.new_item_title,
				description:this.state.description,
			}

			var url = "https://www.nicksdevenv.com/api/list_item/"

			fetch(url + data.pk + "/", {
				method:'put',
				headers: {
					Authorization: `JWT ${localStorage.getItem('token')}`,
					"content-type":"application/json",
				},
				body: JSON.stringify(data)
			})
			.then(response => {
				if (response.ok) {
					this.setState({editActive:false});
					this.fetchListItems();
				}
			})
		}

	}

	deleteListItem(pk) {
		var url = "https://www.nicksdevenv.com/api/destroy/list_item/"

		fetch(url + pk + "/", {
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

	toggleEdit(pk) {
		var item = this.state.items[this.state.items.map(e => e.pk).indexOf(pk)]
		this.setState({editActive:pk, new_item_title:item.item_title, description:item.description});
	}

	cancelEdit() {
		this.setState({editActive:false, new_item_title:"", description:""})
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
				<li className="list-group-item">
					<h4 key={item.pk}>
						<i onClick={() => this.toggleAccordianClick(item.pk)} className="text-info float-left fa fa-arrows pointer-hand"></i>{item.item_title}<i onClick={() => this.deleteListItem(item.pk)} className="fa fa-close text-danger pointer-hand float-right ml-1"></i><i onClick={() => this.toggleEdit(item.pk)} className="fa fa-pencil text-warning pointer-hand float-right"></i>
					</h4>
					<h4 key={"accordian" + item.pk} className={this.state.accordianDisplay === item.pk ? "d-block text-left" : "d-none"}>{item.description}</h4>
				</li>
				)
		}, this)
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
					<input type="submit" className="form-control" value={!this.state.editActive ? "Add Item" : "Update Item"} />
					<Button outline color="danger" className="btn-block" size="md" onClick={() => this.cancelEdit()}>Cancel</Button>
				</form>
			</div>
		)
	}
}
