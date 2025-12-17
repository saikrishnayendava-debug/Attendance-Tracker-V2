import React from 'react'
import { FaRegFaceSadCry } from "react-icons/fa6";
import { FaArrowLeft } from "react-icons/fa";
import { useLocation, useNavigate } from 'react-router-dom';
import Header from './Header';
const Table = ({ }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { data } = location.state || {};
    const headers = data?.[0] || [];
    const bodyRows = data?.slice(1) || [];

    const getCellColor = (value) => {
        if (value === 'P' || value.includes('P')) return 'bg-green-100';
        if (value === 'A' || value.includes('A')) return 'bg-red-100';
        if (value === '-') return 'bg-gray-50';
        return 'bg-slate-text-slate-200';
    };

    return (
        <section className='flex  justify-center bg-black h-full'>
            <Header/>
            <div className='bg-black mt-15  p-4 text-slate-200  overflow-y-auto '>
                <button onClick={() => navigate(-1)} className='fixed top-15 left-0 p-5'>
                    <FaArrowLeft size={20} color='white' />
                </button>

                {!data ?
                    (
                        <div className='mt-10 flex flex-col items-center justify-start gap-30'>
                            <p className='text-xs text-slate-200 font-bold text-center'>No Data Available</p>
                            <FaRegFaceSadCry size={80} color='grey' />
                        </div>

                    )
                    :
                    (
                        <div className="w-full overflow-x-auto px-4">
                            <div className="bg-black rounded-lg shadow-lg">

                                <h2 className="text-xl font-bold mb-1 text-center">Attendance Record:</h2>

                                <div className="overflow-x-auto mt-6">
                                    <table className="w-full border-collapse text-xs font-semibold">
                                        <thead>
                                            <tr className="bg-black">
                                                {headers.map((header, idx) => (
                                                    <th
                                                        key={idx}
                                                        className="border border-[#222528] px-3 py-2 text-left font-bold text-slate-200 sticky top-0 bg-black"
                                                    >
                                                        {header}
                                                    </th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {bodyRows.map((row, rowIdx) => (
                                                <tr key={rowIdx} className="bg-black">
                                                    {row.map((cell, cellIdx) => (
                                                        <td
                                                            key={cellIdx}
                                                            className={`border border-[#222528] px-3 py-2 ${cellIdx < 2 || cellIdx >= row.length - 2
                                                                ? 'font-semibold text-slate-200'
                                                                : cell === 'A' || cell.includes('A')
                                                                    ? 'text-pink-300'
                                                                    : 'text-slate-200'
                                                                }`}
                                                        >
                                                            {cell}
                                                        </td>
                                                    ))}
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                            </div>
                        </div>
                    )
                }
            </div>


        </section>
    );
}

export default Table
