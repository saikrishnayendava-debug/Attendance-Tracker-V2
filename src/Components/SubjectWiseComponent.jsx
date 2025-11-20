import React from 'react'
import { MdCancel } from "react-icons/md";
const SubjectWiseComponent = ({ data, close }) => {
  return (
    <section className='fixed top-20 bottom-0 left-0 right-0 flex items-center justify-center'>
      <div className='bg-black w-5/6 p-4 rounded-3xl text-slate-200 border border-[#222528] overflow-y-auto max-h-[70vh]'>
        <button onClick={close} className='block ml-auto cursor-pointer'>
          <MdCancel size={30} color='#5ee9b5'/>
        </button>
        <div className='flex flex-col items-center justify-center gap-2.5'>
          {
            Array.isArray(data) && data.length > 0 ? (

              data.map((item, index) => (
                <div key={index} className={`grid grid-cols-3 border ${item.percentage < 75 ? "border-red-900" : "border-[#222528]"}  p-2 rounded w-50 lg:w-105 text-xs font-bold`}>
                <p className='font-extrabold text-pink-300'>{item.subject_name}</p>
                <p>{item.attended_held}</p>
                <p>{item.percentage}%</p>
                </div>
              ))
            ) : <p className='text-xs text-slate-200 font-bold'>No Data Available</p>
          }
        </div>
      </div>

    </section>
  )


}

export default SubjectWiseComponent
