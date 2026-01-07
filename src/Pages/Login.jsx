import React, { useEffect, useState } from 'react'
import Header from '../Components/Header'
import { useLocation, useNavigate, Link } from 'react-router-dom'
import logo from '../assets/logo.png'
import { setState } from './Home';
import { MessageCircle, Search, X, Mic } from 'lucide-react';
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
const Login = () => {
  const navigate = useNavigate();
  const [data, setData] = useState({
    redgNo: localStorage.getItem("redgNo") || "",
    password: localStorage.getItem("password") || "",
  })
  const [code, setCode] = useState("VIIT")
  const [isViit, setIsViit] = useState(true);
  const [inputType, setInputType] = useState("text");
  const [hide, setHide] = useState(false)
  const searchResults = [
    {
      title: 'Vercel',
      url: 'https://attendancetracker-six.vercel.app/',
      heading: 'Attendance Tracker',
      description: 'Track student attendance instantly. View daily attendance, summaries, and reports with a fast, simple attendance tracking system.'
    },
    {
      title: 'attendancetracker.co.in',
      url: 'https://attendancetracker.co.in',
      heading: 'Attendance Tracker',
      description: 'Track student attendance instantly. View daily attendance, summaries, and reports with a fast, simple attendance tracking system.'
    }
  ];
  const handleWhatsAppShare = () => {
    const title = 'Attendance Tracker';
    const url = 'https://attendancetracker-six.vercel.app/';
    const description = 'Track student attendance instantly with this simple tracking system!';

    const text = encodeURIComponent(`${title}\n\n${description}\n\n${url}`);

    // Check if mobile
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    const whatsappUrl = isMobile
      ? `whatsapp://send?text=${text}`
      : `https://web.whatsapp.com/send?text=${text}`;
    window.open(whatsappUrl, '_blank');
  };

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
    setState(true)
    if (redgNo && password) {
      navigate("/home");
    }

  }
  const handleEye = (e) => {
    e.preventDefault();
    inputType === "password" ? setInputType("text") : setInputType("password");
    setHide(!hide)
  }

  return (
    <section className='bg-black min-h-screen text-slate-200 flex flex-col items-center'>
      <Header />
      <div className='top-0 bottom-0 left-0 right-0 flex justify-center items-center h-105 pt-20'>
        <div className='border border-[#222528] rounded-2xl w-85'>
          <form action="" className='grid p-5 rounded-2xl gap-4' onSubmit={handleSubmit}>
            <div className='flex justify-center items-center gap-1'>
              <img src={logo} alt='logo' className='w-8 h-8 rounded-md' />
              <p className='font-bold text-orange-600'>Login</p>
            </div>
            <div className='flex flex-col gap-2'>
              <label htmlFor="RedgNo" className='font-semibold text-sm'>Registration Number</label>
              <input
                type='text'
                id='RedgNo'
                placeholder='22L31A05O8'
                className='bg-black border border-[#222528] text-center font-semibold rounded px-2 py-1 text-sm'
                onChange={handleOnChange}
                name="redgNo"
                value={data.redgNo}
              />
            </div>
            <div className='flex flex-col gap-2'>
              <label htmlFor="pass" className='font-semibold text-sm'>Password</label>
              <div className='border border-[#222528] flex items-center justify-center'>

                <input
                  type={inputType==="password" ? "password" : "text"}
                  id='pass'
                  placeholder='26112007'
                  className='border-none bg-black text-center rounded font-semibold px-2 py-1 text-sm'
                  onChange={handleOnChange}
                  name='password'
                  value={data.password}
                />
                <button className='relative left-9' onClick={handleEye}>
                  {
                    hide ? <FaEyeSlash className='text-slate-400'/> : <FaEye className='text-slate-400'/>
                  }
                </button>
              </div>
            </div>
            <div className='flex justify-around gap-2'>
              <div
                className={`${isViit ? "bg-white text-black" : "border border-[#222528]"} w-full cursor-pointer rounded-2xl py-1.5 text-center text-xs font-bold`}
                onClick={handleViit}
              >
                VIIT
              </div>
              <div
                className={`${!isViit ? "bg-white text-black" : "border border-[#222528]"} w-full cursor-pointer rounded-2xl py-1.5 text-center text-xs font-bold`}
                onClick={handleView}
              >
                VIEW
              </div>
            </div>
            <button className='bg-orange-600 text-black cursor-pointer rounded py-1.5 font-bold text-sm'>
              Submit
            </button>
            <div className='font-bold text-center'>Login once, use it forever</div>
          </form>
        </div>
      </div>

      {/* WhatsApp Share Section */}
      <div className='flex flex-col items-center gap-2 my-4'>
        <p className='font-extrabold'>Share to your friends</p>
        <button
          onClick={handleWhatsAppShare}
          className='flex items-center gap-2 bg-slate-200 text-black p-1.5 rounded-lg font-bold text-xs animate-bounce'
        >
          <MessageCircle size={20} color='green' />
          <span>Share on WhatsApp</span>
        </button>
      </div>

      <div className="w-full bg-black text-white rounded-4xl">
        {/* Search Bar */}
        <div className="px-2 py-4">
          <div className="flex items-center bg-gray-700 rounded-full px-2 py-2 mx-auto">
            <Search className="text-gray-400" size={16} />
            <span className="flex-1 text-white text-sm mx-2">
              attendance tracker viit
            </span>
            <X className="text-gray-400 cursor-pointer mx-1" size={16} />
            <div className="w-px h-4 bg-gray-600 mx-1"></div>
            <Mic className="text-gray-400 cursor-pointer" size={16} />
          </div>
        </div>



        {/* Search Results */}
        <div className="px-2">
          {searchResults.map((result, index) => (
            <a
              key={index}
              href={result.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block mb-4 hover:bg-gray-900 rounded p-2 transition-colors"
            >
              {/* Site Info */}
              <div className="flex items-center gap-2 mb-2">
                <div className="w-7 h-6 rounded-full pl-1 flex items-center justify-center text-xs font-bold">
                  <img src={logo} className='rounded-full' alt="logo" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-gray-300 text-xs truncate">{result.title}</div>
                  <div className="text-gray-500 text-xs truncate">{result.url}</div>
                </div>
                <button className="text-gray-400 hover:text-white">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <circle cx="12" cy="5" r="2" />
                    <circle cx="12" cy="12" r="2" />
                    <circle cx="12" cy="19" r="2" />
                  </svg>
                </button>
              </div>

              {/* Result Content */}
              <div className="pl-8">
                <h2 className="text-blue-400 text-sm mb-1 hover:underline cursor-pointer">
                  {result.heading}
                </h2>
                <p className="text-gray-400 text-xs leading-relaxed">
                  {result.description}
                </p>
              </div>
            </a>
          ))}
        </div>
      </div>


    </section>


  )
}

export default Login
