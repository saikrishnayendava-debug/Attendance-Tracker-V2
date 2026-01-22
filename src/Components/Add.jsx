import React, { useState } from 'react'
import { FaPlus } from "react-icons/fa";
import Form from './Form';
const Add = ({branch}) => {
  const [show, setShow] = useState(false);
  return (
    <>
      <div className=' w-full h-fit p-4 flex justify-end   '>
      
        <button className='bg-white flex py-1 px-4 justify-evenly items-center gap-1 rounded-2xl' onClick={() => setShow(!show)}>
          <p className='font-extrabold text-sm'>Add</p>
          <FaPlus />
        </button>
      </div>
      {
        show && <Form close={() => setShow(false)} />
      }
    </>
  )
}

export default Add
