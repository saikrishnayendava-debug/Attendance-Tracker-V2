import React from 'react'
import Navbar from './Navbar';

const Material = () => {
  const arr = ["CSE", "ECE", "EEE", "MECH", "CIVL", "IT", "AIDS", "CS-AI", "CS-D", "CS-C", "ECM"];
  return (
    <section className=" bg-black min-h-screen">
      <Navbar />
      <p className='text-white pt-6 text-center font-bold text-xs'>With in one day all material will be uploaded</p>
      <div className='pt-2 pb-20 flex justify-evenly items-center gap-5 flex-wrap bg-black'>
        {
          arr.map((item, index) => {
            return (
              <div key={index} className='text-white font-extrabold bg-emerald-400 w-41 h-20 flex items-center justify-center rounded-lg'>
                {item}
              </div>
            )
          })
        }
      </div>
    </section>
  )
}

export default Material
