import App from "../App";
import ProtectedRoute from "./ProtectedRoute.jsx";
import Signup from "../pages/Signup.jsx";
import Login from "../pages/Login.jsx";
import NotFoundPage from "../pages/NotFoundPage.jsx";

const routes = [
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <App />
      </ProtectedRoute>
    ),
    errorElement: <NotFoundPage />,
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
