import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Meteor } from 'meteor/meteor';

export default class Login extends Component {
  constructor(props){
    super(props);
    this.state = {
      username: '',
      password: '',
      error: undefined
    };
  }


  handleLogin(evt) {
    evt.preventDefault();
    this.setState({error: undefined});
    Meteor.loginWithPassword(this.state.username, this.state.password, (error) => {
      if(error) this.setState({error: error.reason});
    });
  }

  render() {
    return (
      <div>
        <h2>Login</h2>
        <form className="login" onSubmit={(e)=>this.handleLogin(e)}>
          <p>Username: <input type="username" name="username" onChange={(e)=>this.setState({username: e.target.value})}/></p>
          <p>Password: <input type="password" name="password" onChange={(e)=>this.setState({password: e.target.value})}/></p>
          <p><input type="submit" value="Login"/></p>
          {this.state.error?<span className="error">{this.state.error}</span>:''}
        </form>
      </div>
    );
  }
}
