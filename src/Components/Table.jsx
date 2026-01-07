import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { FaRegFaceSadCry } from "react-icons/fa6";
import { FaArrowLeft } from "react-icons/fa";
import { useLocation, useNavigate } from 'react-router-dom';
import Header from './Header';
import Navbar from './Navbar';
import AttendanceStreakCalculator from './AttendanceStreakCalculator';
const Table = () => {
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([]);
    const [progress, setProgress] = useState(0);
    const [heatmap, setHeatmap] = useState()
    const code = localStorage.getItem("code");
    const redgNo = localStorage.getItem("redgNo");
    const password = localStorage.getItem("password");

    const register_api =
        code === "VIEW"
            ? `https://women-register-microservice.vercel.app/attendance?student_id=${encodeURIComponent(redgNo)}&password=${encodeURIComponent(password)}`
            : `https://register-api-green.vercel.app/attendance?student_id=${encodeURIComponent(redgNo)}&password=${encodeURIComponent(password)}`




    useEffect(() => {
        let interval;
        if (!redgNo || !password) {
            // navigate("/");
            return;
        }
        const fetchTimetable = async () => {



            try {
                setLoading(true);
                interval = setInterval(() => {
                    setProgress((p) => (p >= 90 ? 90 : p + 10));
                }, 200);
                const registerData = await axios.get(register_api);
                setData(registerData.data.attendance_table.rows);
                setHeatmap(registerData.data)
                
            } catch (err) {
                console.error("Timetable fetch failed");
            } finally {

                clearInterval(interval);
                setProgress(100);
                setTimeout(() => {
                    setLoading(false);
                    setProgress(0);
                }, 300);

            }
        };

        fetchTimetable();
    }, []);

    const headers = data?.[0] || [];
    const bodyRows = data?.slice(1) || [];

    if (loading) {
        return (
            <section className="flex justify-center bg-black  min-h-screen">
                
                <Navbar/>
                <div className="fixed top-20 left-0 right-0 z-50 p-4 bg-black flex justify-center">
                    <div className="flex items-center gap-3 w-80">
                        <div className="flex-1 bg-gray-700 rounded-full h-2">
                            <div
                                className="bg-emerald-500 h-full rounded transition-all duration-900 ease-in-out"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                        <span className="text-sm text-white w-12 font-bold">{progress}%</span>
                    </div>
                </div>
            </section>
        );
    }

    return (

        <section className='flex flex-col justify-center bg-black min-h-screen'>
            {/* <Header /> */}
            <Navbar />
            <div className='bg-black mt-5 p-4 text-slate-200  overflow-y-auto '>
                

                {data.length === 0 ?
                    (
                        <div className="mt-20 flex flex-col items-center gap-6 text-slate-200">

                            <p className="text-xs font-bold mb-15">No Data Available</p>
                            <FaRegFaceSadCry size={80} color="grey" />
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

            <div>
                <AttendanceStreakCalculator response={heatmap}/>
            </div>


        </section>
    );
}

export default Table
