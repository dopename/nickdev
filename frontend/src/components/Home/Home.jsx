import React, { Component } from 'react';
import { Link, Route, Switch } from 'react-router-dom';
import LoginPage from './LoginPage/LoginPage'
import UserList from '../UserList/UserList'
import './Home.css'
import { Nav, NavItem, NavLink, Button, Navbar, NavbarBrand, NavbarToggler, Collapse } from 'reactstrap';

export default class Home extends Component {
	constructor(props) {
		super(props)

		this.state = {
			logged_in:localStorage.getItem('token') ? true : false,
			user:false,
			activePage:'home',
			collapsed:true,
			sideNav:true,
			mobile:window.screen.width > 540 ? false : true,
		}

		this.handleLogout = this.handleLogout.bind(this);
		this.handleLogin = this.handleLogin.bind(this);
		this.changePage = this.changePage.bind(this);
		this.toggleNavbar = this.toggleNavbar.bind(this);
		this.toggleSideNav = this.toggleSideNav.bind(this);
		this.refreshToken = this.refreshToken.bind(this);
		this.verifyToken = this.verifyToken.bind(this);
	}

	componentDidMount() {
		if (this.state.logged_in) {
			this.verifyToken()
		}
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
		  this.setState({activePage:'home', logged_in:true, user:json.user});
		})
	}

	refreshToken() {
		fetch('https://www.nicksdevenv.com/token-refresh/', {
			method:'post',
			headers: {
				"content-type":"application/json",
				Authorization:`JWT ${localStorage.getItem('token')}`
			},
			body: JSON.stringify({token:localStorage.getItem('token')})
		})
		.then(response => {
			if (response.ok) {
				return response.json()
			}
		})
		.then(json => {
			localStorage.setItem('token', json.token)
		})
	}

	verifyToken() {
		fetch('https://www.nicksdevenv.com/token-verify/', {
			method:'post',
			headers: {
				"content-type":"application/json",
				Authorization:`JWT ${localStorage.getItem('token')}`
			},
			body: JSON.stringify({token:localStorage.getItem('token')})
		})
		.then(response => {
			if (response.ok) {
				return response.json()
			}
		})
		.then(json => {
			this.setState({user:json.user});
		})
	}

	changePage(page) {
		this.setState({activePage:page});
	}

	toggleNavbar() {
		this.setState({collapsed:!this.state.collapsed});
	}

	toggleSideNav() {
		this.setState({sideNav:!this.state.sideNav});
	}

	render() {
		let sideNav = (
					<Nav vertical>
						<NavItem className="text-center">
							<Button outline className="text-center" onClick={() => this.toggleSideNav()} color={this.state.sideNav ? "danger" : "success"}><i class={this.state.sideNav ? "fa fa-arrow-left" : "fa fa-arrow-right"}></i></Button>
						</NavItem>
						<h4 className="mb-1">{this.state.sideNav ? "Nick's Dev Env" : "NDE"}</h4>
						<NavItem>
							<Button outline className={ this.state.sideNav ? "btn-block text-left":"btn-block text-center"} onClick={() => this.changePage('home')} color="info" size="lg">{this.state.sideNav ? <p className="m-0">Home <i className='fa fa-home'></i></p> : <i className='fa fa-home sz-30'></i>}</Button>
						</NavItem>
						<NavItem>
							<Button outline className={ this.state.sideNav ? "btn-block text-left":"btn-block text-center"} onClick={() => this.changePage('user_list')} color="info" size="lg">{this.state.sideNav ? <p className="m-0">User List <i className='fa fa-bolt'></i></p> : <i className='fa fa-bolt sz-30'></i>}</Button>
						</NavItem>
						<NavItem>
							<Button outline className={ this.state.sideNav ? "btn-block text-left":"btn-block text-center"} onClick={() => this.changePage('login')} color="info" size="lg">{this.state.sideNav ? <p className="m-0">Login <i className='fa fa-mail-forward'></i></p> : <i className='fa fa-mail-forward sz-30'></i>}</Button>
						</NavItem>
						<NavItem>
							<Button outline className={ this.state.sideNav ? "btn-block text-left":"btn-block text-center"} onClick={() => this.changePage('pm')} color="info" size="lg">{this.state.sideNav ? <p className="m-0">Project Management <i className='fa fa-mail-forward'></i></p> : <i className='fa fa-mail-forward sz-30'></i>}</Button>
						</NavItem>
					</Nav>
			)

		return(
			<div>
				<TopNav collapsed={this.state.collapsed} toggleNavbar={this.toggleNavbar} changePage={this.changePage} handleLogout={this.handleLogout} logged_in={this.state.logged_in} />
				<div className="container-fluid">
					<div className="row my-2">
						<div className={this.state.sideNav && !this.state.mobile ? "col-lg-2 px-0" : "col-lg-1 px-0 small-sidebar"}>
							{!this.state.mobile ? sideNav : null}
						</div>
						<div className={this.state.sideNav ? "col-lg-8" : "col-lg-11 content-small-sidebar"}>
							<div className="container">
								{this.state.activePage === 'home' ? <HomeContent /> : null}
								{this.state.activePage === 'user_list' ? <UserList user={this.state.user} refreshToken={this.refreshToken} verifyToken={this.verifyToken} /> : null}
								{this.state.activePage === 'login' ? <LoginPage handleLogin={this.handleLogin} /> : null}
								{this.state.activePage === 'pm' ? <ProjectManagement /> : null }
							</div>
						</div>
						{this.state.sideNav ? <div className="col-lg-2"></div> : null}
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
				<Navbar color="dark" dark expand="lg">
					<NavbarBrand className="black-text" href="/"><h3>NDE</h3></NavbarBrand>
					<NavbarToggler onClick={() => this.props.toggleNavbar()} className="mr-2" />
					<Collapse isOpen={!this.props.collapsed} navbar>
						<Nav className="ml-auto" navbar>
							<NavItem>
								<h4 className="mx-2 white-text pointer-hand" onClick={() => this.props.changePage('home')}>Home</h4>
							</NavItem>
							<NavItem>
								<h4 className="mx-2 white-text pointer-hand" onClick={() => this.props.changePage('user_list')}>User List</h4>
							</NavItem>
							<NavItem>
								{this.props.logged_in ? <h4 className="list-inline-item mx-2 white-text pointer-hand" onClick={e => this.props.handleLogout(e)}>Logout</h4> : <h4 className="list-inline-item mx-2 white-text" onClick={() => this.props.changePage('login')}>Login</h4> }
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


