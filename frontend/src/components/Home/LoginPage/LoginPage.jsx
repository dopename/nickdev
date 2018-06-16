import React from 'react';
import PropTypes from 'prop-types';

class LoginPage extends React.Component {
  constructor(props) {
    super(props)

     this.state = {
        username: '',
        password: ''
      }
      this.handleChange = this.handleChange.bind(this);
  }

  handleChange(e) {
    const name = e.target.name;
    const value = e.target.value;
    this.setState(prevstate => {
      const newState = { ...prevstate };
      newState[name] = value;
      return newState;
    });
  }

  render() {
    return (
      <form onSubmit={e => this.props.handleLogin(e, this.state)}>
        <div className="text-center">
          <div className="row my-3">
            <div className="col-lg-12">
              <h2>Log In</h2>
            </div>
          </div>
          <div className="row">
            <div className="col-lg-3">
            </div>
            <div className="col-lg-6">
              <div className="mt-2">
                <label htmlFor="username">Username</label>
                <input
                  type="text"
                  name="username"
                  value={this.state.username}
                  onChange={this.handleChange}
                  className="form-control"
                />
              </div>
              <div className="my-2">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  name="password"
                  value={this.state.password}
                  onChange={this.handleChange}
                  className="form-control"
                />
              </div>
              <input type="submit" className="btn btn-lg btn-secondary" />
            </div>
            <div className="col-lg-3">
            </div>
        </div>
      </div>
    </form>
    );
  }
}

export default LoginPage;