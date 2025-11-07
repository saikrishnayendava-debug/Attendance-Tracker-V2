import { createBrowserRouter } from "react-router-dom";
import React from "react";
import Login from "../Pages/Login";
import Home from "../Pages/Home";
import ChartComponent from "../Components/ChartComponent";
const router = createBrowserRouter([
    {
        path: "/",
        element: <Login/>
    },
    {
        path : '/home',
        element: <Home/>
    },
    {
        path : '/test',
        element: <ChartComponent/>
    }
])
export default router;