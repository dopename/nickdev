import React, { Component } from 'react';
import { Link, Route, Switch } from 'react-router-dom';
import LoginPage from './LoginPage/LoginPage'
import TestContent from './TestContent/TestContent'
import './Home.css'

export default class Home extends Component {
	constructor(props) {
		super(props)

		this.state = {
			logged_in:localStorage.getItem('token') ? true : false,
			user:localStorage.getItem('user') ? localStorage.getItem('user') : false,
			loginPage:false,
			activePage:'home',
		}

		this.handleLogout = this.handleLogout.bind(this);
		this.handleLogin = this.handleLogin.bind(this);
		this.toggleLoginPage = this.toggleLoginPage.bind(this);
		this.changePage = this.changePage.bind(this);
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
		fetch('https://www.nicksdevenv.com/token-auth/', {
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
		  this.setState({loginPage:false, logged_in:true});
		})
	}

	toggleLoginPage() {
		this.setState({loginPage:!this.state.loginPage});
	}

	changePage(page) {
		this.setState({activePage:page});
	}

	render() {
		return(
			<div className="container-fluid">
				<TopNav changePage={this.changePage} handleLogout={this.handleLogout} logged_in={this.state.logged_in} toggleLoginPage={this.toggleLoginPage} />
				<div className="row my-3">
					<div className="col-lg-2">
					</div>
					<div className="col-lg-8">
						{this.state.activePage === 'home' ? <HomeContent loginPage={this.state.loginPage} handleLogin={this.handleLogin} /> : null}
						{this.state.activePage === 'test' ? <TestContent /> : null}
						{this.state.activePage === 'login' ? <LoginPage handleLogin={this.handleLogin} /> : null}
					</div>
					<div className="col-lg-2">
					</div>
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
			<div className="row">
				<div className="col-12 text-center">
					<ul className="list-inline text-center">
						<li className="list-inline-item mx-2" onClick={() => this.props.changePage('home')}>Home</li>
						<li className="list-inline-item mx-2">/</li>
						<li className="list-inline-item mx-2" onClick={() => this.props.changePage('test')}>Test</li>
						<li className="list-inline-item mx-2">/</li>
						{this.props.logged_in ? <li className="list-inline-item mx-2" onClick={e => this.props.handleLogout(e)}>Logout</li> : <li className="list-inline-item mx-2" onClick={() => this.props.changePage('login')}>Login</li> }
					</ul>
				</div>
			</div>
		)
	}
}

class HomeContent extends Component {
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

		return (
			<div>
				{contentBody}
			</div>
		)
	}
}


