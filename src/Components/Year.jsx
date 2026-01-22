import React from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from './Navbar';
import Add from './Add';

const Year = () => {
  const navigate = useNavigate();
  const params = useParams();
  const branch = params.branch;
  console.log(branch)
  const arr = ["1", "2", "3", "4"];
  return (
    <section className=" bg-black min-h-screen">
      <Navbar/>
      <Add/>
      <div className=' flex justify-evenly items-center gap-5 flex-wrap bg-black'>
        {
          arr.map((item, index) => {
            return (
              <div
              onClick={()=> navigate(`/material/${branch}/${item}`)}
              key={index} className='text-white font-extrabold bg-emerald-400 w-41 h-20 flex items-center justify-center rounded-lg'>
                {item} year
              </div>
            )
          })
        }
      </div>
    </section>
  )
}

export default Year
