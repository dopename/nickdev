import React, { Component } from 'react';
import { Link, Route, Switch } from 'react-router-dom';
import LoginPage from './LoginPage/LoginPage'
import TestContent from './TestContent/TestContent'
import './Home.css'
import { Nav, NavItem, NavLink, Button, Navbar, NavbarBrand, NavbarToggler, Collapse } from 'reactstrap';

export default class Home extends Component {
	constructor(props) {
		super(props)

		this.state = {
			logged_in:localStorage.getItem('token') ? true : false,
			user:localStorage.getItem('user') ? localStorage.getItem('user') : false,
			activePage:'home',
			collapsed:false,
		}

		this.handleLogout = this.handleLogout.bind(this);
		this.handleLogin = this.handleLogin.bind(this);
		this.changePage = this.changePage.bind(this);
		this.toggleNavbar = this.toggleNavbar.bind(this);
	}

	componentDidMount() {
		return null
	}

	handleLogout(e) {
		localStorage.removeItem('token');
		this.setState({activePage:'home',logged_in:false});
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
		  this.setState({activePage:'home', logged_in:true});
		})
	}

	changePage(page) {
		this.setState({activePage:page});
	}

	toggleNavbar() {
		this.setState({collapsed:!this.state.collapsed});
	}

	render() {
		return(
			<div>
				<TopNav collapsed={this.state.collapsed} toggleNavbar={this.toggleNavbar} changePage={this.changePage} handleLogout={this.handleLogout} logged_in={this.state.logged_in} />
				<div className="container-fluid">
					<div className="row">
						<div className="col-lg-2 px-0">
							<Nav vertical>
								<NavItem>
									<Button outline className="btn-block text-left" onClick={() => this.props.changePage('home')} color="info" size="lg">Home</Button>
								</NavItem>
								<NavItem>
									<Button outline className="btn-block text-left" onClick={() => this.props.changePage('test')} color="info" size="lg">Test</Button>
								</NavItem>
								<NavItem>
									<Button outline className="btn-block text-left" color="info" size="lg">Uhh Test</Button>
								</NavItem>
							</Nav>
						</div>
						<div className="col-lg-8">
							{this.state.activePage === 'home' ? <HomeContent /> : null}
							{this.state.activePage === 'test' ? <TestContent /> : null}
							{this.state.activePage === 'login' ? <LoginPage handleLogin={this.handleLogin} /> : null}
						</div>
						<div className="col-lg-2">
						</div>
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
			<div>
				<Navbar color="secondaty" expand="lg">
					<NavbarBrand href="/">NDE</NavbarBrand>
					<NavbarToggler onClick={() => this.props.toggleNavbar()} className="mr-2" />
					<Collapse isOpen={!this.props.collapsed} navbar>
						<Nav className="ml-auto" navbar>
							<NavItem>
								<h3 className="mx-2" onClick={() => this.props.changePage('home')}>Home</h3>
							</NavItem>
							<NavItem>
								<h3 className="mx-2" onClick={() => this.props.changePage('test')}>Test</h3>
							</NavItem>
							<NavItem>
								{this.props.logged_in ? <h3 className="list-inline-item mx-2" onClick={e => this.props.handleLogout(e)}>Logout</h3> : <h3 className="list-inline-item mx-2" onClick={() => this.props.changePage('login')}>Login</h3> }
							</NavItem>
						</Nav>
					</Collapse>
				</Navbar>
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


