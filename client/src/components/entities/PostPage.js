import React, { Component } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

class PostPage extends Component {
  state = {
    token: null,
    post: {},
    postedUser: {},
    loggedUser: {},
    commentText: "",
    comments: [],
    places: [],
    errors : []
  };

  componentWillMount = async () => {
    const { urlSlug } = this.props.match.params;

    const response = await axios.get(`/api/posts/${urlSlug}`);
    const post = response.data;
    const postedUser = post.user;
    const comments = post.comments;
    const places = post.places;
    const token = localStorage.getItem("token");

    if (token) {
      let config = {
        headers: {
          "x-auth-token": token
        }
      };

      const res = await axios.get("/api/auth", config);

      const user = res.data;

      this.setState({
        loggedUser: user
      });
    }

    this.setState({
      post: post,
      places,
      postedUser,
      comments,
      token
    });
  };

  onChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };
  addComment = async e => {
    const postID = this.state.post._id;
    const token = this.state.token;
    const newComment = {
      text: this.state.commentText
    };

    const config = {
      headers: {
        "x-auth-token": token,
        "Content-Type": "application/json"
      }
    };

    const body = JSON.stringify(newComment);

    try {
      const res = await axios.post(
        `/api/posts/comment/${postID}`,
        body,
        config
      );
      console.log(res.data);
      this.setState({
        comments: res.data,
        commentText: ""
      });
    } catch (err) {
      alert("exter text");
    }
  };


  deleteComment = async (e,id) => {

    const postID = this.state.post._id;
    const commentID = id;

    //delete Comment API

    const config = {
      headers : {
        "x-auth-token" : this.state.token
      }
    }

    try {
      const res = await axios.delete(`/api/posts/comment/${postID}/${commentID}`,config);
      alert('Comment Deleted');
      this.setState({
        comments: res.data
      });
    } catch (err) {
      this.setState({
        errors: err.response.data.errors
      });
    }
  }


  editPost = async (e,id) => {
      window.location.href = `/edit-post/${id}`;
  }

  deletePost = async (e,id) => {

    const config = {
      headers : {
        "x-auth-token" : this.state.token
      }
    }

    try {

    axios.delete(`/api/posts/${id}`,config);
      window.location.href = "/latest";
      
    } catch (err) {
      this.setState({
        errors: err.response.data.errors
      });
    }
}

  render() {
    const {
      post,
      loggedUser,
      postedUser,
      comments,
      token,
      places
    } = this.state;

    let commentsList;
    if (comments) {      
      commentsList = comments.map(comment => {

        let deleteButton = "";
        if(loggedUser._id === comment.user){
          deleteButton = (
            <button type="button" onClick={e => this.deleteComment(e,comment._id)} className="btn btn-danger">Delete</button>
          )
        }
        
        return (
          <p key={comment._id}>
            <Link to={`/users/${comment.userName}`}>{comment.userName}</Link>{" "}
            {comment.text}
            {deleteButton}
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

    let placesTagged = "";

    if (places) {
      placesTagged = places.map(place => {
        return (
          <div key={place.place._id}>
            <Link to={`/places/${place.place.urlSlug}`}>
              {" "}
              {place.place.placeName}
            </Link>
          </div>
        );
      });
    }

    let editButton = "";
    let deleteButton = "";

    if (token) {
      if (loggedUser._id === postedUser._id) {
        editButton = (
          <button type="button" className="btn btn-primary" onClick={e=>this.editPost(e,post._id)}>Edit</button>
        );

        deleteButton = (
          <button type="button" className="btn btn-danger" onClick={e=>this.deletePost(e,post._id)}>Delete</button>
        );

      }
    }


    const errors = this.state.errors.map((err, index) => {
      return (
        <p key={index}>
          <span className="red">{err.msg}</span>
          <br />
        </p>
      );
    });

    return (
      <div className="container">
        <div className="col-md-8">
          <h1>{post.title}</h1>
          {errors}
          <p>
            Posted By
            <Link to={`/users/${postedUser.userName}`}>
              {" "}
              {postedUser.userName}
            </Link>
          </p>
          <p>{post.content}</p>
        </div>
        <div className="col-md-3">
          {editButton}
          {deleteButton}
        </div>
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
