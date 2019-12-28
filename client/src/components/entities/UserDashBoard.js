import React, { Component } from "react";
import axios from 'axios';
import {Link} from 'react-router-dom';
import NoImg from "../../img/noimage.png";


class UserDashBoard extends Component {
  state = {
    userName: "",
    user : {},
    posts : []
  };

  componentWillMount = async () => {
    const { userName } = this.props.match.params;
    const res = await axios.get(`/api/users/getDetailsByUserName/${userName}`);
    const user = res.data;
    const userID = user._id;
    const response = await axios.get(`/api/posts/getPostsByUser/${userID}`);
    const posts = response.data;
    this.setState({
      userName: userName,
      user : user,
      posts : posts
    });
  };
  render() {

    const posts = this.state.posts.map(post => {
      let { content } = post;

      if (content.length > 30) {
        content = content.substring(0, 30) + "...";
      }
      return (
        <div className="card col-md-3 m-md-1" key={post._id}>
          <img src={NoImg} className="card-img-top" alt={NoImg} />
          <div className="card-body">
            <h5 className="card-title">{post.title}</h5>
            <p className="card-text">{content}</p>
            <Link to={`/posts/${post.urlSlug}`} className="card-link">
              Read More
            </Link>
          </div>
        </div>
      );
    });


    return (
      <div className="container">
        <h1>User Dashboard</h1>
        <h2>{this.state.userName}</h2>
        <p>{this.state.user.userType}</p>
        <div>
          <h3>Posts by {this.state.userName}</h3>
          <div className="row">
          {posts}
          </div>          
        </div>
      </div>
    );
  }
}

export default UserDashBoard;
