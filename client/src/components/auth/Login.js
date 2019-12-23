import React, { Component } from 'react'
import {Link} from 'react-router-dom';
import axios from "axios";
class Login extends Component {

  state = {
    email : '',
    password : '',
    errors: []
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

      alert('Login Successful');

      this.setState({
        errors : []
    })


      console.log(res);
      //display success message
    } catch (err) {
      console.log(err.response.data);
      //display error messages
      this.setState({
        errors : err.response.data.errors
    })
    }
  }

  render() {

    
    const errors = this.state.errors.map(err => {
      return (
      <p>
          <span className="red">{err.msg}</span><br/>
      </p>
      
      )
  })

    return (
      <div className="container">
      <h1>Login</h1>
      {errors}
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
        <p>Not A User ? <Link to="/register">Sign-Up</Link> for free</p>
      </div>
    </div>
    )
  }
}

export default Login;

