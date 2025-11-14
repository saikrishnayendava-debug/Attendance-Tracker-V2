import React, { useEffect, useState } from 'react'
import Header from '../Components/Header'
import { useLocation, useNavigate } from 'react-router-dom'
import ToastNotification, { showToast } from '../Components/ToastNotification';
import { MdAccountBox } from "react-icons/md"

const Login = () => {  
  const navigate = useNavigate();
  const [data, setData] = useState({
    redgNo : localStorage.getItem("redgNo") || "",
    password : localStorage.getItem("password") || "",
  })
  const [code, setCode] = useState("VIIT")
  const [isViit, setIsViit] = useState(true);
  const handleOnChange = (e) => {
    const {name, value} = e.target;
    setData((prev) => {
      return {
        ...prev,
        [name] : value,
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
    if (redgNo && password) {
      navigate("/home");
    }
    setData({
      redgNo : "",
      password : ""
    })
  }
  return (
    <section className='bg-slate-200 h-screen'>
      <ToastNotification/>
      <Header/>
      <div className='top-0 bottom-0 left-0 right-0 flex justify-center items-end h-105  '>
        <div className='border border-slate-200 bg-white rounded-2xl w-85'>
          <form action="" className='grid p-5 rounded-2xl gap-4' onSubmit={handleSubmit}>
            <div className='flex justify-center items-center gap-1'>
              <p className='font-bold text-slate-900'>Login</p>
              <MdAccountBox size={22} className="text-[#00ce86]" />

            </div>
            <div className='flex flex-col gap-2'>
              <label htmlFor="RedgNo" className='font-semibold text-sm'>Registration Number</label>
              <input type='text' id='RedgNo' className='border border-slate-200 text-slate-800 text-center font-semibold rounded px-2 py-1 text-sm' onChange={handleOnChange} name="redgNo" value={data.redgNo}/>
            </div>
            <div className='flex flex-col gap-2'>
              <label htmlFor="pass" className='font-semibold t text-sm'>Password</label>
              <input type='text' id='pass' className='border border-slate-200 text-slate-700 text-center  rounded font-semibold px-2 py-1  text-sm' onChange={handleOnChange} name='password' value={data.password}/>
            </div>
            <div className='flex justify-around gap-2'> 
              <div className={`${isViit ? "bg-[#00ce86] ": "border border-slate-200 text-black"} w-full rounded-md py-1.5 text-center text-xs font-semibold`} onClick={handleViit}>VIIT</div>
              <div className={`${!isViit ? "bg-[#00ce86] ": "border border-slate-200 text-black"} w-full rounded-md py-1.5 text-center text-xs font-semibold `} onClick={handleView}>VIEW</div>
            </div>
            <button className='bg-slate-900 text-white cursor-pointer rounded py-1.5 font-semibold text-sm'>Submit</button>
          </form>
        </div>
      </div>
      <div className='font-bold text-center  mt-10'>Login once, use it forever</div>

    </section>
  )
}

export default Login
