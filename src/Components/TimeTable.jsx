import React, { useState } from 'react'
import { MdCancel } from "react-icons/md";
const TimeTable = ({ timetable, close }) => {

  if (!timetable || timetable.length === 0) {
    return (
      <section className='fixed top-20 bottom-0 left-0 right-0 flex justify-center items-center bg-black/70'>
        <div className='bg-black w-29/30 p-4 rounded-2xl text-xs text-slate-200 border border-[#222528]  overflow-y-auto max-h-[90vh] text-center'>
          No timetable data available
          <button onClick={close} className='block ml-auto'>
            <MdCancel size={30} color='#5ee9b5' />
          </button>
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
    <section className='fixed top-20 bottom-0 left-0 right-0 flex justify-center bg-black/70'>
      <div className='bg-black w-29/30 p-4 rounded-2xl text-slate-200 border border-[#222528] overflow-y-auto max-h-[90vh]'>

        <button onClick={close} className='block ml-auto'>
          <MdCancel size={30} color='#5ee9b5' />
        </button>
    <h2 className="text-xl font-bold mb-1">Time Table:</h2>

        <div className="border border-[#222528] rounded-lg overflow-hidden text-xs font-semibold">
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
