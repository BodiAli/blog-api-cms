import App from "../App";
import ProtectedRoute from "./ProtectedRoute.jsx";
import Signup from "../pages/SignupPage/Signup.jsx";
import Login from "../pages/LoginPage/Login.jsx";
import NotFound from "../pages/NotFoundPage/NotFound.jsx";
import CreatePost from "../components/CreatePost/CreatePost.jsx";
import UserPosts from "../components/UserPosts/UserPosts.jsx";
import UserPost from "../components/UserPost/UserPost.jsx";
import ErrorHandler from "../components/ErrorHandler/ErrorHandler.jsx";

const routes = [
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <App />
      </ProtectedRoute>
    ),
    errorElement: <NotFound />,
    children: [
      {
        errorElement: <ErrorHandler />,
        children: [
          {
            index: true,
            Component: UserPosts,
          },
          {
            path: "create-post",
            Component: CreatePost,
          },
          {
            path: "users/posts/:postId",
            Component: UserPost,
          },
        ],
      },
    ],
  },

  {
    path: "log-in",
    Component: Login,
  },

  {
    path: "sign-up",
    Component: Signup,
  },
];

export default routes;
