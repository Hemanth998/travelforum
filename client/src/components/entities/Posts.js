import React, { Component } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import NoImg from "../../img/noimage.png";

class Posts extends Component {
  state = {
    posts: []
  };

  componentWillMount = async () => {
    const response = await axios.get("/api/posts");
    const posts = response.data;
    this.setState({
      posts: posts
    });
  };
  render() {

    const posts = this.state.posts.map(post => {

        let {content} = post;       

        if(content.length > 30){
            console.log(content.length);

            content = content.substring(0,30) + "...";
        }

      return ( 

        <div className="card col-md-3 m-md-1" key={post._id}>
          <img src={NoImg} className="card-img-top" alt={NoImg}/>
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
        <h1>Posts</h1>


        <div className="row">
        <div className="col-md-10">

            <div className="row">
            {posts} 
            </div>
                          
            
        </div>
        <div className="col-md-2">
            <h1>Ads section</h1>
        </div>
        </div>
        
      </div>
    );
  }
}
export default Posts;
