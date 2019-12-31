import React, { Component } from "react";
import {Link} from 'react-router-dom';
import axios from "axios";
class Register extends Component {
  state = {
    firstName: "",
    lastName: "",
    userName: "",
    email: "",
    password: "",
    password1: "",
    errors: []
  };

  onChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  onSubmit = async e => {
    e.preventDefault();

    const {
      firstName,
      lastName,
      userName,
      email,
      password,
      password1
    } = this.state;

    const newUser = {
      firstName,
      lastName,
      userName,
      email,
      password
    };

    try {
      const config = {
        headers: {
          "Content-Type": "application/json"
        }
      };

      const body = JSON.stringify(newUser);

     

      if(password1 !== password){
          this.setState({
              errors : [{
                  msg : "Password and Confirm Password Doesn't match"
              }]
          })
      }

      else{
        const res = await axios.post("/api/users", body, config);
        
        alert('Registration Successful');

        window.location.href = "/login";
  
        console.log(res);
      }

     
      //display success message
    } catch (err) {
      console.log(err.response.data);
      this.setState({
          errors : err.response.data.errors
      })
      //display error messages
    }
  };

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
        <h1>Register</h1>

        {errors}

        <div className="col-md-6">
          <form onSubmit={e => this.onSubmit(e)}>
            <div className="form-group">
              <label htmlFor="firstNameField">First Name</label>
              <input
                type="text"
                name="firstName"
                id="firstNameField"
                value={this.state.firstName}
                onChange={e => this.onChange(e)}
                className="form-control"
              />
            </div>
            <div className="form-group">
              <label htmlFor="lastNameField">Last Name</label>
              <input
                type="text"
                name="lastName"
                id="lastNameField"
                value={this.state.lastName}
                onChange={e => this.onChange(e)}
                className="form-control"
              />
            </div>
            <div className="form-group">
              <label htmlFor="userNameField">User Name</label>
              <input
                type="text"
                name="userName"
                id="userNameField"
                value={this.state.userName}
                onChange={e => this.onChange(e)}
                className="form-control"
              />
            </div>
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
            <div className="form-group">
              <label htmlFor="password1Field">Confirm Password</label>
              <input
                type="password"
                name="password1"
                id="password1Field"
                value={this.state.password1}
                onChange={e => this.onChange(e)}
                className="form-control"
              />
            </div>
            <input type="submit" className="btn btn-primary" value="Register" />
          </form>

          <p>Already A user ? <Link to="/login">Sign-in</Link></p>
        </div>
      </div>
    );



  }
}

export default Register;
