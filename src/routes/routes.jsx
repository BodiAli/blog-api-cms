import App from "../App";
import ProtectedRoute from "./ProtectedRoute.jsx";
import Signup from "../pages/SignupPage/Signup.jsx";
import Login from "../pages/LoginPage/Login.jsx";
import NotFound from "../pages/NotFoundPage/NotFound.jsx";

const routes = [
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <App />
      </ProtectedRoute>
    ),
    errorElement: <NotFound />,
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
