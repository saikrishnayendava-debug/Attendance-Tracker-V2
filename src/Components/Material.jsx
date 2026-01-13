import React from 'react'
import { FaRegFaceSadCry } from "react-icons/fa6";
import Navbar from './Navbar';
import Rajasaab3 from '../assets/Rajasaab3.jpg'

const Material = () => {
  return (
    <section className="flex flex-col justify-center bg-black min-h-screen">
        
        <Navbar/>

        <div className="mt-24 flex flex-col items-center gap-6 text-slate-200">
          
          <p className="text-xs font-bold text-center">All year materials, pdfs, questionbanks, previous year papers will be uploaded on 17/01/2026</p>
          <p className='mb-15 text-2xs font-bold'>From Btech Vault</p>
          {/* <FaRegFaceSadCry size={80} color="grey" /> */}
        </div>
        
      </section>
  )
}

export default Material
