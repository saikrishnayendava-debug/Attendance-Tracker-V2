import React from 'react'
import logo from '../assets/logo.png'
import { MdAccountCircle } from "react-icons/md";
import { FaArrowLeft } from "react-icons/fa";
import { Link, useLocation, useNavigate } from 'react-router-dom'
const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const handleClick = () => {
    localStorage.clear();
    navigate('/')
  }
  const presentlocation = location.pathname.split('/')[1];

  return (
    <section className='h-15 border-b border-[#222528] fixed top-0 w-full z-10 flex items-center justify-between bg-black px-2'>
      <Link to='/' className='flex items-center lg:justify-center lg:gap-2 bg-gradient-to-r  py-2  '>
        
        <div className='w-10 h-10 pl-1'>
          <img src={logo} alt="logo" className='rounded-lg' />
        </div>
        <div className='font-bold text-sm lg:text-2xl rounded px-2 '>
          <span className='text-[#00ce86] '>Attendance</span>
          <span className='text-slate-300'>Tracker</span>
        </div>
      </Link>
      <>
        {
          (location.pathname != '/') && (
            <button type='button' onClick={handleClick} className='cursor-pointer  bg-blue-500 text-slate-100 px-2 font-bold text-sm rounded-lg py-1.5  flex gap-1 items-center justify-center'>
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
