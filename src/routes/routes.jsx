import App from "../App";
import ProtectedRoute from "./ProtectedRoute.jsx";
import Signup from "../pages/SignupPage/Signup.jsx";
import Login from "../pages/LoginPage/Login.jsx";
import NotFound from "../pages/NotFoundPage/NotFound.jsx";
import CreatePost from "../components/CreatePost/CreatePost.jsx";

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
        path: "create-post",
        Component: CreatePost,
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
