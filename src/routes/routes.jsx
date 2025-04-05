import App from "../App";
import ProtectedRoute from "./ProtectedRoute.jsx";
import Signup from "../pages/Signup.jsx";
import Login from "../pages/Login.jsx";
import NotFound from "../pages/NotFound.jsx";

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
