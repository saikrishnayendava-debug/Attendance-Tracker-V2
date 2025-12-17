import React from 'react'
import { FaRegFaceSadCry } from "react-icons/fa6";
import { FaArrowLeft } from "react-icons/fa";
import Header from './Header';
import { useLocation, useNavigate } from 'react-router-dom';
const SubjectWiseComponent = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { data } = location.state || {};
  return (
    <section className='flex justify-center bg-black h-full'>
      <Header />
      <div className='bg-black mt-10 p-4  text-slate-200 overflow-y-auto'>
        <button onClick={() => navigate(-1)} className='fixed top-15 left-0 p-5'>
          <FaArrowLeft size={20} color='white' />
        </button>

        <div className='flex flex-col items-center justify-center gap-2.5'>
          {
            Array.isArray(data) && data.length > 0 ? (
              <>
                <h2 className="mt-15 text-xl font-bold mb-1 text-center">Subject wise Attendance:</h2>
              {data.map((item, index) => (
                <div key={index} className={`grid grid-cols-3 border ${item.percentage < 75 ? "border-red-900" : "border-[#222528]"}  p-2 rounded w-70 lg:w-105 text-xs font-bold`}>
                  <p className='font-extrabold text-pink-300'>{item.subject_name}</p>
                  <p>{item.attended_held}</p>
                  <p>{item.percentage}%</p>
                </div>
                ))}
              </>
            ) : (
              <div className='mt-15 flex flex-col items-center justify-start gap-30'>
                <p className='text-xs text-slate-200 font-bold text-center'>No Data Available</p>
                <FaRegFaceSadCry size={80} color='grey' />
              </div>
            )
          }
        </div>
      </div>

    </section>
  )


}

export default SubjectWiseComponent
