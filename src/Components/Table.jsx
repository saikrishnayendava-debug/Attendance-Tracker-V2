import React from 'react'
import { MdCancel } from "react-icons/md";
const Table = ({ data, close }) => {

    const headers = data?.[0] || [];
    const bodyRows = data?.slice(1) || [];

    const getCellColor = (value) => {
        if (value === 'P' || value.includes('P')) return 'bg-green-100';
        if (value === 'A' || value.includes('A')) return 'bg-red-100';
        if (value === '-') return 'bg-gray-50';
        return 'bg-slate-text-slate-200';
    };

    return (
        <section className='fixed top-20 bottom-0 left-0 right-0 flex  justify-center bg-black/70'>
            <div className='bg-black w-29/30 p-4 rounded-2xl text-slate-200 border border-[#222528] overflow-y-auto max-h-[90vh]'>
                <button onClick={close} className='block ml-auto cursor-pointer'>
                    <MdCancel size={30} color='#5ee9b5' />
                </button>

                {!data ?
                    (
                        <p className='text-xs text-slate-200 font-bold text-center'>No Data Available</p>
                    )
                    :
                    (
                        <div className="w-full overflow-x-auto p-4">
                            <div className="bg-black rounded-lg shadow-lg">

                                <h2 className="text-xl font-bold mb-1">Attendance Record:</h2>

                                <div className="overflow-x-auto">
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
