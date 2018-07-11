import React, { Component } from "react";
import {connect} from "react-redux";

import {test} from "../../actions/index";

class Test extends Component {

	state = {
		text:""
	}

	submitNote = (e) => {
		e.preventDefault();
		this.props.addItem(4, this.state.text);
		this.setState({text: ""});
	}

	render() {
		return (
			<div>
				<h3>Add new note</h3>
				<form onSubmit={this.submitNote}>
					<input
						value={this.state.text}
						placeholder="Enter note here..."
						onChange={(e) => this.setState({text: e.target.value})}
						required />
					<input type="submit" value="Save Note" />
				</form>
				<h3>Notes</h3>
				<table>
				  <tbody>
					{this.props.list_items.map(note => (
					  <tr>
						<td>{note.text}, {note.id}</td>
						<td><button>edit</button></td>
						<td><button>delete</button></td>
					  </tr>
					))}
				  </tbody>
				</table>
			</div>
		)
	}
}

const mapStateToProps = state => {
	return {
		list_items: state.test.list_items
	}
}

const mapDispatchToProps = dispatch => {
	return {
		addItem: (id, text) => {
			dispatch(test.addItem(id, text))
		}
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(Test);