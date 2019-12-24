import React, { Component } from "react";
class UserDashBoard extends Component {
  state = {
    userName: ""
  };

  componentWillMount = async () => {
    const { userName } = this.props.match.params;
    this.setState({
      userName: userName
    });
  };
  render() {
    return (
      <div>
        <h1>User Dashboard</h1>
        <h2>{this.state.userName}</h2>
      </div>
    );
  }
}

export default UserDashBoard;
