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
    <section className='h-fit border-b border-[#222528] fixed top-0 w-full z-10 flex items-center justify-between bg-black px-2'>
      <Link to='/' className='flex items-center lg:justify-center lg:gap-2 bg-gradient-to-r px-2 py-2  '>
        <div className='w-13 h-13'>
          <img src={logo} alt="logo" className='rounded-lg' />
        </div>
        <div className='font-bold text-sm lg:text-2xl rounded px-2 '>
          <span className='text-[#e63b2e] '>Attendance</span>
          <span className='text-slate-300'>Tracker</span>
        </div>
      </Link>
      <>
        {
          (location.pathname != '/') && (
            <button type='button' onClick={handleClick} className='cursor-pointer  bg-red-600 text-slate-100 px-3 font-bold text-sm rounded-lg py-2  flex gap-1 items-center justify-center'>
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
