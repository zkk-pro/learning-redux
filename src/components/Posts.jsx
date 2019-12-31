import React, { Component } from "react";
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { fetchPosts } from '../actions/postActions'


class Posts extends Component {
  // constructor(props) {
  //   super(props)
  //   this.state = {
  //     posts: []
  //   }
  // }
  componentDidMount() {
    // 触发操作
    this.props.fetchPosts()
    // fetch("https://jsonplaceholder.typicode.com/posts")
    //   .then(res => res.json())
    //   .then(data => this.setState({ posts: data }))
  }
  render() {
    return (
      <div>
        {/* {this.state.posts.map(post => ( */}
        {this.props.posts.map(post => (
          <div key={post.id}>
            <h2>{post.title}</h2>
            <p>{post.body}</p>
          </div>
        ))}
      </div>
    );
  }
}

// 对store 的方法和state规定具体的数据类型
PropTypes.propTypes = {
  fetchPosts: PropTypes.func.isRequired,
  posts: PropTypes.array.isRequired
}

const mapStateToProps = state => ({
  // posts: 当前UI组件state的属性
  // state：就是 store 里的 state
  // postReducer：是我们拆分组件后，整合时：
  /*
    export default combineReducers({
      postReducer // 等同于 postReducer: postReducer
    })
  */
//  这里定义对象属性：postReducer
  // posts：就是 postReduces 这个 reducer 里定义的 initialState 里的 posts 属性
  posts: state.postReducer.posts
})
export default connect(mapStateToProps, { fetchPosts })(Posts)
