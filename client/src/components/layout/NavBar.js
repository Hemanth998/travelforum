import React, { Component } from "react";
import { Link } from "react-router-dom";

class NavBar extends Component {
  // state = {
  //   token: localStorage.getItem("token")
  // };

  constructor(props) {
    super(props);
    this.toggleNavbar = this.toggleNavbar.bind(this);
    this.state = {
      collapsed: true,
      token : localStorage.getItem("token")
    };
  }
  toggleNavbar() {
    this.setState({
      collapsed: !this.state.collapsed
    });
  }

  logoutAction = async e => {
    await localStorage.clear();

    this.setState({
      token: null
    });

    window.location.href = "/";
  };
  render() {

    const collapsed = this.state.collapsed;
    const classOne = collapsed ? 'collapse navbar-collapse' : 'collapse navbar-collapse show';
    const classTwo = collapsed ? 'navbar-toggler navbar-toggler-right collapsed' : 'navbar-toggler navbar-toggler-right';
    let newpost = "";
    let register = "";
    let login = "";
    let logout = "";

    if (this.state.token) {
      newpost = (
        <li className="nav-item active">
          <Link to="/add-new-post" className="nav-link">
            New Post
          </Link>
        </li>
      );
      logout = (
        <li className="nav-item active">
          <a href="#!" className="nav-link" onClick={e => this.logoutAction(e)}>
            Logout
          </a>
        </li>
      );
    } else {
      register = (
        <li className="nav-item">
          <a href="/register" className="nav-link">
            Register
          </a>
        </li>
      );

      login = (
        <li className="nav-item">
          <a href="/login" className="nav-link">
            Login
          </a>
        </li>
      );
    }
    return (
      <div>
        <nav className="navbar navbar-expand-md bg-light navbar-light sticky-top">
          <div className="container">
            <a href="/" className="navbar-brand">
              travelforum
            </a>
            <button onClick={this.toggleNavbar} className={`${classTwo}`} type="button" data-toggle="collapse" data-target="#navbarResponsive" aria-controls="navbarResponsive" aria-expanded="false" aria-label="Toggle navigation">
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className={`${classOne}`} id="navbarResponsive">
              <ul className="navbar-nav ml-auto">
                <li className="nav-item active">
                  <Link to="/latest" className="nav-link">
                    Latest Posts
                  </Link>
                </li>
                {newpost}
                {register}
                {login}
                {logout}
              </ul>
            </div>
          </div>
        </nav>
      </div>
    );
  }
}

export default NavBar;
