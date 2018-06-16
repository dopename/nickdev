import React, { Component } from 'react';
import { Link, Route, Switch } from 'react-router-dom';
import LoginPage from './LoginPage/LoginPage'
import './Home.css'

export default class Home extends Component {
	constructor(props) {
		super(props)

		this.state = {
			logged_in:localStorage.getItem('token') ? true : false,
			user:localStorage.getItem('user') ? localStorage.getItem('user') : false,
			loginPage:false,
		}

		this.handleLogout = this.handleLogout.bind(this);
		this.handleLogin = this.handleLogin.bind(this);
		this.toggleLoginPage = this.toggleLoginPage.bind(this);
	}

	componentDidMount() {
		return null
	}

	handleLogout(e) {
		localStorage.removeItem('token');
		this.setState({logged_in:false});
	}

	handleLogin(e, data) {
		e.preventDefault();
		fetch('https://www.nickstestdev.com/token-auth/', {
		  method:'POST',
		  headers: {
			'Content-Type': 'application/json'
		  },
		  body:JSON.stringify(data)
		})
		.then(response => response.json())
		.then(json => {
		  console.log(json);
		  localStorage.setItem('token', json.token);
		  this.setState({loginPage:true});
		})
	}

	toggleLoginPage() {
		this.setState({loginPage:!this.state.loginPage});
	}

	render() {
		return(
			<div className="container-fluid">
				<TopNav handleLogout={this.handleLogout} toggleLoginPage={this.toggleLoginPage} />
				<Content loginPage={this.state.loginPage} handleLogin={this.handleLogin} />
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
			<div className="row">
				<div className="col-12 text-center">
					<ul className="list-inline text-center">
						<li className="list-inline-item mx-2">Home</li>
						<li className="list-inline-item mx-2">/</li>
						{this.props.logged_in ? <li className="list-inline-item mx-2" onClick={e => this.props.handleLogout(e)}>Logout</li> : <li className="list-inline-item mx-2" onClick={() => this.props.toggleLoginPage()}>Login</li> }
					</ul>
				</div>
			</div>
		)
	}
}

class Content extends Component {
	constructor(props) {
		super(props)
	}

	render() {
		let contentBody = (
					<div className="text-center">
						<h1>Welcome to my Development Environment!</h1>
						<p>This shit gon' get weird.</p>
					</div>
			)

		if (this.props.loginPage) {
			contentBody = <LoginPage handleLogin={this.props.handleLogin} />
		}

		return (
			<div className="row my-3">
				<div className="col-lg-2">
				</div>
				<div className="col-lg-8">
					{contentBody}
				</div>
				<div className="col-lg-2">
				</div>
			</div>
		)
	}
}


