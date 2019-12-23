import React  from 'react';

import {Link} from 'react-router-dom';



const NavBar = () => {

    return (
      <div>
        
<nav className="navbar navbar-expand-md bg-light navbar-light sticky-top">
	<div className="container">
		<a href="/" className="navbar-brand">travelforum</a>
		<button className="navbar-toggler" type="button">
			<span className="navbar-toggler-icon"></span>
		</button>
		<div className="collapse navbar-collapse">
			<ul className="navbar-nav ml-auto">
				<li className="nav-item active">
					<Link to="/latest" className="nav-link">Latest Posts</Link>
				</li>
				<li className="nav-item">
					<a href="/register" className="nav-link">Register</a>
				</li>
				<li className="nav-item">
					<a href="/login" className="nav-link">Login</a>
				</li>
			</ul>
		</div>
	</div>
</nav>
      </div>
    )
}

export default NavBar;