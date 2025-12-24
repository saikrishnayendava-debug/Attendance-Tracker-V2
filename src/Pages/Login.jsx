import React, { useEffect, useState } from 'react'
import Header from '../Components/Header'
import { useLocation, useNavigate } from 'react-router-dom'
import ToastNotification, { showToast } from '../Components/ToastNotification';
import { MdAccountBox } from "react-icons/md"
import logo from '../assets/logo.png'
import FooterComponent from '../Components/FooterComponent';

const Login = () => {
  const navigate = useNavigate();
  const [data, setData] = useState({
    redgNo: localStorage.getItem("redgNo") || "",
    password: localStorage.getItem("password") || "",
  })
  const [code, setCode] = useState("VIIT")
  const [isViit, setIsViit] = useState(true);
  const [isServer, setIsServer] = useState(true)
  const [server, setServer] = useState(1);
  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => {
      return {
        ...prev,
        [name]: value,
      }
    })
  }
  const handleViit = () => {
    setCode("VIIT");
    setIsViit(true);
  }
  const handleView = () => {
    setCode("VIEW");
    setIsViit(false);
  }
  const handleSubmit = (e) => {
    e.preventDefault()
    const redgNo = data.redgNo
    const password = data.password
    const selectedcode = code
    localStorage.setItem("redgNo", redgNo)
    localStorage.setItem("password", password)
    localStorage.setItem("code", selectedcode)
    localStorage.setItem("server", server)
    if (redgNo && password) {
      navigate("/home");
    }
    setData({
      redgNo: "",
      password: ""
    })
  }
  return (

    <section className='bg-black h-screen text-slate-200 flex flex-col items-center'>
      <ToastNotification />
      <Header />
      <div className='top-0 bottom-0 left-0 right-0 flex justify-center items-end h-105  '>
        <div className='border border-[#222528] rounded-2xl w-85'>
          <form action="" className='grid p-5 rounded-2xl gap-4' onSubmit={handleSubmit}>
            <div className='flex justify-center items-center gap-1'>
              <img src={logo} alt='logo' className='w-8 h-8 rounded-md' />
              <p className='font-bold'>Login</p>
            </div>
            <div className='flex flex-col gap-2'>
              <label htmlFor="RedgNo" className=' font-semibold text-sm'>Registration Number</label>
              <input type='text' id='RedgNo' placeholder='22L31A05O8' className='bg-black border border-[#222528]  text-center font-semibold rounded px-2 py-1 text-sm' onChange={handleOnChange} name="redgNo" value={data.redgNo} />
            </div>
            <div className='flex flex-col gap-2'>
              <label htmlFor="pass" className='font-semibold t text-sm'>Password</label>
              <input type='text' id='pass' placeholder='26112007' className='border border-[#222528] bg-black text-center  rounded font-semibold px-2 py-1  text-sm' onChange={handleOnChange} name='password' value={data.password} />
            </div>
            <div className='flex justify-around gap-2'>
              <div className={`${isViit ? "bg-white text-black" : "border border-[#222528] "} w-full cursor-pointer rounded-2xl py-1.5 text-center text-xs font-semibold`} onClick={handleViit}>VIIT</div>
              <div className={`${!isViit ? "bg-white text-black" : "border border-[#222528] "} w-full cursor-pointer rounded-2xl py-1.5 text-center text-xs font-semibold `} onClick={handleView}>VIEW</div>
            </div>
            <button className='bg-blue-500 text-white cursor-pointer rounded py-1.5 font-semibold text-sm'>Submit</button>
          </form>
        </div>
      </div>
      <div className='font-bold text-center mt-10'>Login once, use it forever</div>
      <div className='absolute bottom-0 flex flex-col border border-[#222528] w-fit rounded px-20 py-2 justify-center items-center gap-1'>
        <p className='text-2xs text-slate-400 text-center font-bold'>If server-1 fails, use server-2</p>

        <div className='flex justify-center gap-5 text-sm font-bold'>
          <button className={`${isServer && "border border-emerald-500"} bg-black text-white py-1 px-3 rounded text-xs`} onClick={() => {setServer(1); setIsServer(true)}}>Server 1</button>
          <button className={`${!isServer && "border border-emerald-500"} bg-black text-white py-1 px-3 rounded text-xs`} onClick={() => {setServer(2); setIsServer(false)}}>Server 2</button>
        </div>
      </div>
    </section>


  )
}

export default Login
