import React, { Component } from 'react';
import { Link, Route, Switch } from 'react-router-dom';
import './Home.css'

export default class Home extends Component {
	constructor(props) {
		super(props)

		this.state = {
			logged_in:localStorage.getItem('token') ? true : false,
		}

		this.handleLogout = this.handleLogout.bind(this);
	}

	componentDidMount() {
		return null
	}

	handleLogout(e) {
		localStorage.removeItem('token');
		this.setState({logged_in:false});
	}

	render() {
		return(
			<div className="container-fluid">
				<div className="row">
					<TopNav />
					<Content />
				</div>
			</div>
		)
	}
}

class TopNav extends Component {
	constructor(props){
		super(props)
	}

	render() {
		return (
			<ul className="list-inline text-center">
				<li className="list-inline-item mx-2">Home</li>
				<li className="list-inline-item mx-2">/</li>
				{this.props.logged_in ? <li className="list-inline-item mx-2" onClick={e => this.props.handleLogout(e)}>Logout</li> : <li className="list-inline-item mx-2">Login</li> }
			</ul>
		)
	}
}

class Content extends Component {
	render() {
		return (
			<div className="row my-3">
				<div className="col-lg-2">
				</div>
				<div className="col-lg-8">
					<div className="text-center">
						<h1>Welcome to my Development Environment!</h1>
						<p>This shit gon' get weird.</p>
					</div>
				</div>
				<div className="col-lg-2">
				</div>
			</div>
		)
	}
}
