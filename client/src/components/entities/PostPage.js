import React, { Component } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

class PostPage extends Component {
  state = {
    token: null,
    post: {},
    postedUser: {},
    loggedUser: {},
    commentText: '',
    comments : [],
    places : []
  };

  componentWillMount = async () => {
    const { urlSlug } = this.props.match.params;

    const response = await axios.get(`/api/posts/${urlSlug}`);
    const post = response.data;
    const postedUser = post.user;
    const comments = post.comments;
    const places = post.places;

    this.setState({
      post: post,
      places,
      postedUser,
      comments,
      token: localStorage.getItem("token")
    });
  };

  onChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };
  addComment = async e => {
    const postID = this.state.post._id
    const token = this.state.token;
    const newComment = {
      text: this.state.commentText
    };

    const config = {
      headers : {
        "x-auth-token" : token,
        "Content-Type" : "application/json"
      }
    }

    const body = JSON.stringify(newComment);
  

    try {
      const res = await axios.post(`/api/posts/comment/${postID}`,body,config);
      console.log(res.data)
      this.setState({
        comments : res.data,
        commentText : ''
      })
    } catch (err) {
      alert('exter text');
    }  

  };

  render() {
    const { post, postedUser,comments,token,places } = this.state;

    let commentsList;
    if (comments) {
      commentsList = comments.map(comment => {
        return (
          <p key={comment._id}>
            <Link to={`/users/${comment.userName}`}>
              {comment.userName}
            </Link>
            {" "}
            {comment.text}
          </p>
        );
      });
    }

    let addComments = "";

    if (token) {
      addComments = (
        <div className="form-group">
          <label htmlFor="commentTextField">Post A Comment</label>
          <textarea
            name="commentText"
            id="commentTextField"
            value={this.state.commentText}
            onChange={e => this.onChange(e)}
            className="form-control"
          />
          <button
            type="button"
            onClick={e => this.addComment(e)}
            className="btn btn-primary"
          >
            Post
          </button>
        </div>
      );
    } else {
      addComments = <Link to="/login">Login to Comment</Link>;
    }


    let placesTagged = '';

    if(places) {
      placesTagged = places.map(place => {
          return (
            <div key={place.place._id}>
               <Link to={`/places/${place.place.urlSlug}`}>
            {" "}
            {place.place.placeName}
          </Link>

            </div>
          )
      }) 
    }

    return (
      <div className="container">
        <h1>{post.title}</h1>
        <p>
          Posted By
          <Link to={`/users/${postedUser.userName}`}>
            {" "}
            {postedUser.userName}
          </Link>
        </p>
        <p>{post.content}</p>

        <div>
          <h3>Comments</h3>
          {commentsList}
          {addComments}
          <h2>Places Tagged</h2>
          {placesTagged}
        </div>
      </div>
    );
  }
}
export default PostPage;
