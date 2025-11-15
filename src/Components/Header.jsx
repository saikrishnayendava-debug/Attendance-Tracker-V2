import React from 'react'
import logo from '../assets/logo.png'
import { MdAccountCircle } from "react-icons/md";

import { Link, useLocation, useNavigate } from 'react-router-dom'
const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const handleClick = () => {
    localStorage.clear();
    navigate('/')
  }
  return (
    <section className='h-fit border-b border-[#222528]'>
      <Link to='/' className='flex items-center lg:justify-center lg:gap-2 bg-gradient-to-r px-2 py-3 bg-black relative '>
      <div className='w-13 h-13 sm:w-10 sm:h-10'>
        <img src={logo} alt="logo" className='rounded-md'/>
      </div>
      <div className='font-bold text-sm lg:text-2xl rounded p-2 '>
        <span className='text-[#00ce86] '>Attendance</span>
        <span className='text-slate-200'>Tracker</span>
      </div>
      </Link>
      <>
      {
        (location.pathname != '/') && (
          <button type='button' onClick={handleClick} className='cursor-pointer  bg-blue-500 text-white px-3 font-extrabold text-sm rounded-2xl py-2 absolute top-4 sm:top-5 right-5 flex gap-1 items-center justify-center'>
            Logout
            <MdAccountCircle size={20} />
          </button>
        )
      }
      </>
    </section>
  )
}

export default Header
