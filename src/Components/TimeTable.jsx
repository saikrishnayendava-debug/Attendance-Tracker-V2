import React from 'react'
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

  return (
    <section className='fixed top-20 bottom-0 left-0 right-0 flex justify-center bg-black/70'>
      <div className='bg-black w-29/30 p-4 rounded-2xl text-slate-200 border border-[#222528] overflow-y-auto max-h-[90vh]'>

        <button onClick={close} className='block ml-auto'>
          <MdCancel size={30} color='#5ee9b5' />
        </button>

        <div className="border border-[#222528] rounded-lg overflow-hidden text-xs font-semibold">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  {headers.map((header, idx) => (
                    <th
                      key={idx}
                      className="px-4 py-3 text-left font-bold border-r border-[#222528]"
                    >
                      {header === "Day of week" ? "Day" : header}
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

      </div>
    </section>
  );
};


export default TimeTable
