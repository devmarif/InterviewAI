import { createBrowserRouter, RouterProvider } from "react-router";

import AuthLayouts from "../Layouts/AuthLayouts";

import Login from "../features/auth/pages/Login";
import Register from "../features/auth/pages/Register";

import ProtectedRoute from "../features/components/ProtectedRoute";

import Home from "../interview/pages/Home";
import Interview from "../interview/pages/Interview";

/**
 * Application routing configuration.
 *
 * Public routes:
 *
 * /
 * - Login page
 *
 * /register
 * - Registration page
 *
 * Protected routes:
 *
 * /home
 * - Interview preparation dashboard
 */
const AppRoute = createBrowserRouter([
  // ==================================================
  // PUBLIC ROUTES
  // ==================================================

  {
    path: "/",

    element: <AuthLayouts />,

    children: [
      {
        index: true,
        element: <Login />,
      },

      {
        path: "register",
        element: <Register />,
      },
    ],
  },

  // ==================================================
  // PROTECTED ROUTES
  // ==================================================

  {
    element: <ProtectedRoute />,

    children: [
      {
        path: "/home",
        element: <Home />,
      },
      {
        path: "/interview/:interviewId",
        element: <Interview />,
      },
    ],
  },
]);

/**
 * Application Router Provider.
 *
 * Provides the configured router to the React application.
 *
 * @returns {JSX.Element}
 */
const AppRoutes = () => {
  return <RouterProvider router={AppRoute} />;
};

export default AppRoutes;
