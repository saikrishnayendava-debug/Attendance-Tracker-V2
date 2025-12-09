import React from 'react'
import { Link } from 'react-router-dom'
const FooterComponent = () => {
  return (
    <section className='mt-10 border-t border-slate-300 bg-slate-50 dark:border-slate-700 dark:bg-slate-950  '>
      <div className="flex flex-col justify-center px-2 py-5 text-slate-500 text-2xs ">
        
        <p>The Attendance Tracker APK is completely <span className='bg-blue-300 text-black font-bold'>safe to use</span></p>
        <p>It is developed solely to help you <span className='bg-blue-300 text-black font-bold'>track your attendance</span> efficiently.</p>
        <p><span className='bg-blue-300 text-black font-bold'>All data is stored locally</span> on your device, <span>nothing is uploaded or stored</span> elsewhere.</p>
        <p>The service is free, original, and <span className='bg-blue-300 text-black font-bold'>completely ad-free.</span></p>
        <p>If you prefer not to use the APK file, you can also access the <span className='bg-blue-300 text-black font-bold'>service via the web</span>: <Link to='/https://attendancetracker-six.vercel.app/' className='text-red-500'>https://attendancetracker-six.vercel.app/</Link></p>
      </div>
    </section>
  )
}

export default FooterComponent
