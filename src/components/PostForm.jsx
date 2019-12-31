import React, { Component } from "react"

class PostForm extends Component {
  constructor() {
    super()
    this.state = {
      title: '',
      body: ''
    }
  }

  handleChange = e => {
    const { name, value } = e.currentTarget
    this.setState({ [name]: value })
  }
  handleSubmit = () => {
    const { title, body } = this.state
    fetch("https://jsonplaceholder.typicode.com/posts", {
      method: 'POST',
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ title, body })
    })
      .then(res => res.json())
      .then(data => console.log(data))
  }
  render() {
    return (
      <div>
        <input type="text" name="title" value={this.state.title} onChange={this.handleChange} />
        <br />
        <textarea name="body" value={this.state.body} onChange={this.handleChange} />
        <br />
        <button onClick={this.handleSubmit}>提交</button>
      </div>
    )
  }
}

export default PostForm