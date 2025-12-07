import React from 'react'
import { Link } from 'react-router-dom'
const FooterComponent = () => {
  return (
    <section className='mt-10  '>
      <div className="flex flex-col items-center justify-center gap-4 py-5">
        {/* <div className="flex items-center gap-2">
          <p>All Study Materials</p>
          <Link to="https://btechvault.vercel.app">click</Link>
        </div> */}
        <Link to='https://github.com/tarunsaiy' className='text-2xs text-slate-900  '>github </Link>
        {/* <p className='text-xs font-bold text-pink-400/40'>#Salaar #Shouryanga</p> */}
      </div>
    </section>
  )
}

export default FooterComponent
