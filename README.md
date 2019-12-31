
## 安装

```javascript
yarn add redux react-redux react-thunk
```

## 使用Provider组件

React-Redux 提供Provider组件，可以让容器组件拿到state（store里的state）

```javascript
// App.js
import React from "react";
import { Provider } from "react-redux";
import Posts from "./components/Posts";
import PostForm from "./components/PostForm";
import "./App.css";

function App() {
  return (
    // {store}来自哪里？
    <Provider store={store}>
      <div className="App">
        <PostForm />
        <Posts />
      </div>
    </Provider>
  );
}

export default App;
```

## Store

Store 就是保存数据的地方，可以把它看成一个容器。整个应用只能有一个 Store

### 创建Store

使用 redux 中的`createStore`方法创建一个 Store

语法：`createStore(reducer, [preloadedState], enhancer)`

- reducer (Function): 接收两个参数，分别是当前的 state 树和要处理的 action，返回新的 state 树。可以有一个，也可以有多个。
- preloadedState: 状态的初始值。
- enhancer：增强redux的功能。
  + 实际就是使用 applyMiddleware()方法，该方法是redux的原生方法，作用是将中间件组成一个数组，依次执行

在src目录下新建store文件夹，然后新建index.js文件

```JavaScript
// src/store/index.js
import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";

const initialState = {};
const middleware = [thunk]

const store = createStore(() => [], initialState, applyMiddleware(...middleware));

export default store;
```

### redux-thunk中间件

该中间件是处理异步分发的action，如果有多个action，它会放到一个地方，然后一个个执行，执行完这个自动执行下一个。

### reducer是什么

store 收到 action 以后，必须给出一个新的 state，这样 view 才能发生变化，这种 state 计算的过程就叫`reducer`，reduce是一个函数，接受当前的 state 的 一个 action 作为参数，返回一个新的 state。

**reducer拆分**

因为会有很多很多的 reducer，这就导致 reducer 这个函数会非常庞大，所以可以把 reducer 拆分成多个，但是拆分 reducer 后，就需要把多个 reducer 进行绑定合成`一个新的reducer`，这就会用到一个`combineReducers()`方法。

在src下新建一个 reducers 文件夹，这个文件夹就包含了所有拆分的 reducer，其中index.js文件为整合 reducer

```javascript
// src/reducers/index.js
import { combineReducers } from "redux";
import postReducer from './postReducer'

export default combineReducers({
  post: postReducer
})
```

拆分的 reducer

```javascript
// src/reducers/postReducer.js
const initialState = {
  posts: []
}

export default function(state = initialState, action) {
  switch(action.type) {
    default: 
      return state
  }
}
```

## Action

在 src 下新建 actions 文件夹，然后新建 postsAction.js 文件

```javascript
// src/actions/postsAction.js
export function fetchPosts() {
  console.log(123)
}
```

下面来看看，在UI组件中，如何使用这里的action

## react-redux

react-redux给我们提供了两个东西，一个是`Provider`组件，这个组件可以让其下面的所有的子组件获得store里的state；另一个是connect方法，这个方法是在UI组件中生成容器组件，然后进行连接（UI组件想要使用action，就要将action和UI组件进行连接）

### connect()方法

```javascript
// Posts.jsx 组件
import React, { Component } from "react";
import { connect } from 'react-redux'
import { fetchPosts } from '../actions/postActions'


class Posts extends Component {
  constructor(props) {
    super(props)
    this.state = {
      posts: []
    }
  }
  componentDidMount() {
    this.props.fetchPosts()
    // fetch("https://jsonplaceholder.typicode.com/posts")
    //   .then(res => res.json())
    //   .then(data => this.setState({ posts: data }))
  }
  render() {
    return (
      <div>
        {this.state.posts.map(post => (
          <div key={post.id}>
            <h2>{post.title}</h2>
            <p>{post.body}</p>
          </div>
        ))}
      </div>
    );
  }
}
export default connect(null, { fetchPosts })(Posts)
```

上面的代码，使用了react-redux 库的connect方法，将组件和容器连接起来，connect 将用户的操作映射成action（fetchPosts），然后执行了下面的代码

```javascript
// src/actions/postsAction.js
export function fetchPosts() {
  console.log(123)
}
```

当然目前是会报错的，因为action需要执行分发操作，修改`src/actions/postsAction.js`的代码：

```javascript
// src/actions/postsAction.js
export const fetchPosts = () => dispatch => {
  fetch("https://jsonplaceholder.typicode.com/posts")
    .then(res => res.json())
    .then(posts => {
      // 分发action
      dispatch({ type: FETCH_POSTS, payload: posts });
    });
};
```

默认情况下，store.dispatch 的参数只能是对象，不能是函数，所以就需要使用中间件，也就是上面介绍的`redux-thunk`，在创建store的时候，使用该中间件增强redux，`redux-thunk`中间主要的功能是让store.dispatch可以接受一个函数作为参数。这是异步操作的解决方案（返回一个函数）。

### 触发reducer

上面的代码在异步执行完后，派发了一个 action，我们在reducer里处理这个 action

```javascript
// src/reducers/postReducer.js
import { FETCH_POSTS } from "../actions/types";

const initialState = {
  posts: []
};
// state需要是一个对象
export default function(state = initialState, action) {
  switch (action.type) {
    // 匹配到action，将action传递过来的值生成一个新的 state 并返回
    case FETCH_POSTS:
      return { ...state, posts: action.payload };
    default:
      return state;
  }
}
```

### 在组件中获取store里的state

在react-redux中，想要在UI组件获取store里的state，就需要用到`mapStateToProps()`函数：

```javascript
import React, { Component } from "react";
import { connect } from 'react-redux'
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
```

这就是一整个redux状态管理的流程了。

## 使用ReduxDevTools浏览器插件

```javascript
// src/store/index.js
import { createStore, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";
import rootReducers from '../reducers'

const initialState = {};
const middleware = [thunk]

const enhancer = compose(applyMiddleware(...middleware), window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__())

const store = createStore(rootReducers, initialState, enhancer);

export default store;
```