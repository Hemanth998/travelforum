import React, { Component } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

class PostPage extends Component {
  state = {
    post: {},
    user: {}
  };

  componentWillMount = async () => {
    const { urlSlug } = this.props.match.params;

    const response = await axios.get(`/api/posts/${urlSlug}`);
    const post = response.data;

    const user = post.user;

    this.setState({
      post: post,
      user: user
    });
  };

  render() {
    const { post } = this.state;
    const { user } = this.state;

    let comments;
    if (post.comments) {
      comments = post.comments.map(comment => {
        return (
          <p key={comment._id}>
            <Link to={`/users/${comment.user._id}`}>
              {comment.user.userName}
            </Link>{" "}
            {comment.text}
          </p>
        );
      });
    }

    return (
      <div>
        <h1>{post.title}</h1>
        <p>{post.content}</p>

        <p>
          Posted By<Link to={`/user/${user._id}`}> {user.userName}</Link>
        </p>

        <div>
          <h3>Comments</h3>
          {comments}
        </div>
      </div>
    );
  }
}
export default PostPage;
