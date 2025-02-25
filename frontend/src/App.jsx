import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./components/Home";
import Login from "./components/Login";
import SignUp from "./components/SignUp";
import PageNotFound from "./components/PageNotFound";
import { Toaster } from "react-hot-toast";
import { CheckAuth } from "./Authentication/CheckAuth";

const App = () => {
  const router = createBrowserRouter([
    {
      path: "/",
      loader: CheckAuth,
      element: <Home />,
    },
    {
      path: "/edit/:id",
      loader: CheckAuth,
      element: <Home />,
    },
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/sign-up",
      element: <SignUp />,
    },
    {
      path: "*",
      element: <PageNotFound />,
    },
  ]);

  return (
    <div>
      <Toaster position="top-right" reverseOrder={false} />
      <RouterProvider router={router} />
    </div>
  );
};

export default App;
