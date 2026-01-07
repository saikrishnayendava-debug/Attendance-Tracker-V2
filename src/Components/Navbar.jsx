import React from 'react'
import { FaHome } from "react-icons/fa";
import { FaTable } from "react-icons/fa";
import { FaCloud } from "react-icons/fa";
import { IoGameController } from "react-icons/io5";
import { ImBooks } from "react-icons/im";
import { useNavigate } from 'react-router-dom';
const Navbar = () => {
    const navigate = useNavigate();
    return (
        <div className='bg-black fixed bottom-0 z-50 w-full   flex justify-between items-center  text-slate-200 text-2xs h-15 font-bold'>
            <button className="border-r border-[#222528] h-full w-full flex flex-col items-center justify-center gap-0.4" onClick={()=> navigate('/home')}>
                <p className='text-slate-200'>Attendance</p>
                <FaHome  size={20} className='text-emerald-500'/>
            </button>
            <button className="border-r border-[#222528] h-full w-full flex flex-col items-center justify-center gap-0.4" onClick={() => navigate('/timetable')}>
                <p className='text-slate-200'>TimeTable</p>
                <FaTable size={20} className='text-emerald-500' />
            </button>
            <button className="border-r border-[#222528] h-full w-full flex flex-col items-center justify-center gap-0.4 " onClick={()=> navigate('/register')}>
                <p className='text-slate-200'>Register</p>
                <FaCloud size={20} className='text-emerald-500' />
            </button>
            <button className=" h-full w-full border-r border-[#222528] flex flex-col items-center justify-center gap-0.4" onClick={() => navigate('/subjectwise')}>
                <p className='text-slate-200'>Subject wise</p>
                <ImBooks size={20} className='text-emerald-500' />
            </button>
        </div>
    )
}
export default Navbar
