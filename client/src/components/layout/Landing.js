import React, { Component } from "react";
import axios from "axios";

class Landing extends Component {
  state = {
    token: localStorage.getItem("token"),
    user: {}
  };

  componentDidMount = async () => {
    const { token } = this.state;

    if (token) {
      const config = {
        headers: {
          "x-auth-token": token
        }
      };

      const res = await axios.get("/api/auth", config);

      this.setState({
        user: res.data
      });
    }
  };
  render() {

    const { token, user} = this.state
    let msg = "You are Logged Out";
    if (token) {
      msg = (
          <p>
              Welcome {user.firstName} {user.lastName}
          </p>

          )

    }
    return (
      <div className="container">
        {msg}

        <h1>Landing</h1>
        <p className="lead">A Place where travel enthusiasts share travel experiences, learn and explore about new places</p>
      </div>
    );
  }
}
export default Landing;
