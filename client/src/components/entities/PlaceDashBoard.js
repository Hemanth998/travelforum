import React, { Component } from 'react'
import Axios from 'axios';
import {Link} from 'react-router-dom';
import NoImg from "../../img/noimage.png";


 class PlaceDashBoard extends Component {

    state = {
        place : {},
        posts : []
    }
    componentWillMount = async () =>{
        const { placeSlug }= this.props.match.params;
        const res = await Axios.get(`/api/places/getPlaceDetailsBySlug/${placeSlug}`);
        const place = res.data;
        const placeID = place._id;
        const response = await Axios.get(`/api/posts/getPostsByPlace/${placeID}`);
        const posts = response.data;        
        this.setState({
            place:place,
            posts:posts
        })
    }
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
                <h1>Place</h1>  
                <p>{this.state.place.placeName}</p>
                <p>{this.state.place.placeDescription}</p>

                <h3>Posts tagged {this.state.place.placeName}</h3>
                <div className="row">
                    {posts}
                </div>

            </div>
        )
    }
}
export default PlaceDashBoard;