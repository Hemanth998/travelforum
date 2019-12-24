import React, { Component } from "react";
import Select from "react-select";
import axios from "axios";

class AddNewPost extends Component {
  state = {
    title: "",
    content: "",
    options: [],
    selectedOptions: [],
    places: [],
    seedPlaces: [],
    token: null,
    errors: []
  };

  componentDidMount = async () => {
    const res = await axios.get("/api/places");
    const seedPlaces = res.data;

    this.setState({
      token: localStorage.getItem("token")
    });

    this.setState({
      seedPlaces: seedPlaces
    });

    const options = seedPlaces.map(place => {
      return {
        value: place._id,
        label: place.placeName
      };
    });

    this.setState({
      options
    });
  };

  onChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  onSubmit = async e => {
    e.preventDefault();

    const { title, content, places, token } = this.state;

    const newPost = {
      title,
      content,
      places
    };

    const config = {
      headers: {
        "Content-Type": "application/json",
        "x-auth-token": token
      }
    };

    const body = JSON.stringify(newPost);

    console.log(body);

    try {
      const res = await axios.post("/api/posts", body, config);

      alert(res.data.msg);

      window.location.href = "/";
    } catch (err) {
      this.setState({
        errors: err.response.data.errors
      });
    }
  };

  handleChange = async selectedOptions => {
    if (!selectedOptions) {
      selectedOptions = [];
    }
    await this.setState({
      selectedOptions
    });

    const places = selectedOptions.map(place => {
      return {
        place: place.value
      };
    });

    await this.setState({
      places
    });
  };

  render() {
    const { options, selectedOptions } = this.state;

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
        <h1>Add New Post</h1>

        {errors}

        <form onSubmit={e => this.onSubmit(e)}>
          <div className="form-group">
            <label htmlFor="titleField">Post Title</label>
            <input
              type="text"
              name="title"
              id="titleField"
              value={this.state.title}
              onChange={e => this.onChange(e)}
              className="form-control"
            />
          </div>
          <div className="form-group">
            <label htmlFor="contentField">Post Content</label>
            <textarea
              name="content"
              id="contentField"
              value={this.state.content}
              onChange={e => this.onChange(e)}
              className="form-control"
            />
          </div>
          <div className="form-group">
            <label htmlFor="placesField">Tag Places</label>
            <Select
              value={selectedOptions}
              name="places"
              id="placesField"
              onChange={this.handleChange}
              isMulti
              options={options}
            />
          </div>

          <input type="submit" className="btn btn-primary" value="post" />
        </form>
      </div>
    );
  }
}
export default AddNewPost;
