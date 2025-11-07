import { createBrowserRouter } from "react-router-dom";
import React from "react";
import Login from "../Pages/Login";
import Home from "../Pages/Home";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Login/>
    },
    {
        path : '/home',
        element: <Home/>
    }
])
export default router;