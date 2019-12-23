import React, { Component } from 'react'
import axios from "axios";
class Login extends Component {

  state = {
    email : '',
    password : ''
  }

 onChange = e => {
   this.setState({
        [e.target.name] : e.target.value
   })
 }
     

 onSubmit = async e => {
    e.preventDefault();

    const {email,password} = this.state

    const user = {
      email,
      password
    };

    try {
      const config = {
        headers: {
          "Content-Type": "application/json"
        }
      };

      const body = JSON.stringify(user);

      const res = await axios.post("/api/auth", body, config);

      console.log('Login Successful');

      console.log(res);
      //display success message
    } catch (err) {
      console.log(err.response.data);
      //display error messages
    }
  }

  render() {
    return (
      <div className="container">
      <h1>Login</h1>

      <div className="col-md-4">
        <form onSubmit={e => this.onSubmit(e)}>
          <div className="form-group">
            <label htmlFor="emailField">Email</label>
            <input
              type="text"
              name="email"
              id="emailField"
              value={this.state.email}
              onChange={e => this.onChange(e)}
              className="form-control"
            />
          </div>
          <div className="form-group">
            <label htmlFor="passwordField">Password</label>
            <input
              type="password"
              name="password"
              id="passwordField"
              value={this.state.password}
              onChange={e => this.onChange(e)}
              className="form-control"
            />
          </div>
          <input type="submit" className="btn btn-primary" value="Login" />
        </form>
      </div>
    </div>
    )
  }
}

export default Login;

