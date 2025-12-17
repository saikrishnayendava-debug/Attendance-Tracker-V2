import React, { useState } from 'react'
import { FaRegFaceSadCry } from "react-icons/fa6";
import { FaArrowLeft } from "react-icons/fa";
import { useLocation, useNavigate } from 'react-router-dom';
import Header from './Header';
const TimeTable = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { timetable } = location.state || {};
  if (!timetable || timetable.length === 0) {
    return (
      
      <section className=' flex justify-center bg-black h-full'>
        <Header/>
        <div className='bg-black  mt-25 p-4  flex flex-col items-center justify-start gap-30'>
          <button onClick={() => navigate(-1)} className='fixed top-15 left-0 p-5'>
            <FaArrowLeft size={20} color='white' />
          </button>
          <p className='text-xs text-slate-200 font-bold text-center'>No Data Available</p>

          <FaRegFaceSadCry size={80} color='grey' />
        </div>
      </section>
    );
  }

  const headers = timetable[0];
  const rows = timetable.slice(1);
  const today = new Date().toLocaleDateString('en-US', { weekday: 'short' });
  const todayRow = rows.find((row, index) => {
    return index !== 0 && row[0] === today
  })
  const todayData = todayRow ? todayRow.slice(1).filter(item => item && item !== "-") : [];

  return (
    <section className='flex justify-center bg-black h-full'>
      <Header/>
      <div className='bg-black mt-15  p-4  text-slate-200 overflow-y-auto'>

        <button onClick={() => navigate(-1)} className='fixed top-15 left-0 p-5'>
          <FaArrowLeft size={20} color='white' />
        </button>
        <h2 className="text-xl font-bold  mb-1 text-center">Time Table:</h2>

        <div className="border border-[#222528] rounded-lg overflow-hidden text-xs font-semibold mt-6">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  {headers.map((header, idx) => (
                    <th
                      key={idx}
                      className="px-1 py-3 text-center  font-extrabold border border-[#222528]"
                    >
                      {header === "Day of week" ? "Day" : header[0] === "P" ? header.substring(0, 8) : "Break"}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {rows.map((row, rowIdx) => (
                  <tr key={rowIdx} className="border-b border-[#222528]">
                    {row.map((cell, cellIdx) => (
                      <td key={cellIdx} className="px-4 py-3 border-r border-[#222528]">
                        {cell || "-"}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>


        <div className='flex justify-center mt-4'>
          <div className='w-105 text-slate-200 bg-black border  border-[#222528]  p-2 rounded'>

            <label className=' flex flex-col py-1 px-2'>
              <div className='font-bold text-sm mb-2'>
                Today's periods

              </div>
              {
                todayData.length > 0 ? (
                  <div className='grid grid-cols-5 gap-0.5'>
                    {todayData.map((period, index) => (
                      <p key={index} className='text-xs mt-1 font-extrabold  text-pink-300 rounded-md  w-fit '>{index + 1} - {period}</p>
                    ))}
                  </div>
                ) : (

                  <p className='text-xs mt-1'>No classes scheduled for today.</p>

                )
              }

            </label>
            <div className='flex items-center justify-around gap-1 mt-2'>



            </div>
          </div>
        </div>

      </div>
    </section>
  );
};


export default TimeTable
