import { FETCH_POSTS } from "./types";

// export function fetchPosts() {
//   console.log(456);
//   return (dispatch) => {
//     fetch("https://jsonplaceholder.typicode.com/posts")
//       .then(res => res.json())
//       .then(posts => {
//         // 分发action
//         dispatch({ type: FETCH_POSTS, payload: posts });
//       });
//   };
// }

export const fetchPosts = () => dispatch => {
  fetch("https://jsonplaceholder.typicode.com/posts")
    .then(res => res.json())
    .then(posts => {
      // 分发action
      dispatch({ type: FETCH_POSTS, payload: posts });
    });
};
