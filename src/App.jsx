import React from 'react'
import './App.css'
import Home from './Pages/Home'
import Login from './Pages/Login'
import { Outlet } from "react-router-dom";
import FooterComponent from "./Components/FooterComponent";
import ToastNotification from './Components/ToastNotification';

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <ToastNotification />
      <main className="flex-grow">
        <Outlet />
      </main>
      
    </div>
  );
}

export default App;
