import React, { Component } from 'react';
import {Link} from 'react-router-dom';
import axios from 'axios';

class Posts extends Component {

    state = {
        posts : []
    }

    componentWillMount = async () => {
        const response = await axios.get('/api/posts');
        const posts = response.data;
        this.setState({
            posts  : posts
        })
    }
    render() {

        const post = this.state.posts.map(post => {
            return (
                <div key={post._id}>
                    <h1>{post.title}</h1>
                    <p>{post.content}</p>
                    <Link to={`/posts/${post.urlSlug}`}>More</Link>
                </div>
            )
        })
        return (
            <div className="container">
                <h1>Posts</h1>
                {post}
            </div>
        )
    }
}
export default Posts