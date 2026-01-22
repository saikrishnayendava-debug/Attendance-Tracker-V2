import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from './LoadingSpinner';
import { FaRegFaceSadCry } from "react-icons/fa6";
import Navbar from './Navbar'
import Add from './Add'
import axios from 'axios';
import { FaFolder } from "react-icons/fa6";
const Pdfs = () => {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const params = useParams();
  const branch = params.branch;
  const year = params.year;
  useEffect(() => {
    load();
  }, [branch, year]);
  const load = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`https://database-9qqy.onrender.com/pdf/${branch}/${year}`);
      if (response.data.success) {
        const uniqueSubjects = [...new Set(response.data.data.map(pdf => pdf.Subject))];
        setSubjects(uniqueSubjects);
      }
    } catch (err) {
      console.error("Error fetching PDFs:", err);
    } finally {
      setLoading(false);
    }
  }
  return (
    <section className=" bg-black min-h-screen">
      <Navbar />
      <button onClick={load}>Load</button>
      <Add />
      {
        loading ? (
          <LoadingSpinner/>
        ) : (
          <div className=' flex justify-between gap-5 flex-wrap bg-black'>
         {
          subjects.length > 0 ? (
            subjects.map(subject => (
            <div
              onClick={() => navigate(`/material/${branch}/${year}/${subject}`)}
              key={subject} className='text-white font-extrabold  w-41 h-20 flex flex-col items-center justify-center gap-2 rounded-lg'>
                <FaFolder size={40} />
                <p className='text-center text-xs'>

              {subject}
                </p>
            </div>
          ))
          ) : (
            <div className='w-full mt-15 flex flex-col items-center justify-center gap-2'>
                <p className='text-2xs text-slate-200 font-bold text-center'>No Data Available</p>
                <FaRegFaceSadCry size={50} color='grey' />
              </div>
          )
          
         }
      </div>
        )
      }
      
    </section>
  )
}

export default Pdfs
