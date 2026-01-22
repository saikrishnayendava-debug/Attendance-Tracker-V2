import { createBrowserRouter } from "react-router-dom";
import React from "react";
import Login from "../Pages/Login";
import Home from "../Pages/Home";
import TimeTable from "../Components/TimeTable";
import Table from "../Components/Table";
import SubjectWiseComponent from "../Components/SubjectWiseComponent";

import App from "../App";
import Material from "../Components/Material";
import Year from "../Components/Year";
import Pdfs from "../Components/Pdfs";
import Form from "../Components/Form";
import Subject from "../Components/Subject";



const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,         
    children: [
      {
        index: true,
        element: <Login />,
      },
      {
        path: "home",
        element: <Home />,
      },
      {
        path: "timetable",
        element: <TimeTable />,
      },
      {
        path: "register",
        element: <Table />,
      },
      {
        path: "subjectwise",
        element: <SubjectWiseComponent />,
      },
      {
        path : "material",
        element : <Material/>
      },
      {
        path : "material/:branch",
        element : <Year/>
      },
      {
        path :"material/:branch/:year",
        element : <Pdfs/>
      },
      {
        path : "material/:branch/:year/:subject",
        element : <Subject/>
      }
    ],
  },
]);

export default router;
