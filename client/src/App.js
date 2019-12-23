import React, { Fragment } from "react";
import { BrowserRouter as Router,Route,Switch } from 'react-router-dom';
import NavBar from './components/layout/NavBar';
import Landing from './components/layout/Landing';
import Posts from './components/entities/Posts';
import PostPage from './components/entities/PostPage';
import Register from './components/auth/Register';
import Login from './components/auth/Login';
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
const App = () => (
  <Router>
    <Fragment>
      <NavBar />
      <Route exact path = "/" component={Landing} />
        <Switch>
          <Route exact path = "/latest" component={Posts} />
          <Route exact path = "/register" component={Register} />
          <Route exact path = "/login" component={Login} />
          <Route exact path = "/posts/:urlSlug" component={PostPage} />

        </Switch>
    </Fragment>
  </Router>
);
export default App;
