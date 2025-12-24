import React, { useEffect, useState } from "react";
import { FaRegFaceSadCry } from "react-icons/fa6";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "./Header";

const TimeTable = () => {
  const navigate = useNavigate();

  const storedTimetable = localStorage.getItem("timetable");
  const initialTimetable = storedTimetable ? JSON.parse(storedTimetable) : null;

  const [timetable, setTimetable] = useState(initialTimetable);
  const [loading, setLoading] = useState(!initialTimetable);
  const [progress, setProgress] = useState(0);

  const code = localStorage.getItem("code");
  const redgNo = localStorage.getItem("redgNo");
  const password = localStorage.getItem("password");

  const timetable_api =
    code === "VIEW"
      ? `https://women-timetable-microservice.onrender.com/attendance?student_id=${encodeURIComponent(
          redgNo
        )}&password=${encodeURIComponent(password)}`
      : `https://periods-microservice-x3tx.onrender.com/attendance?student_id=${encodeURIComponent(
          redgNo
        )}&password=${encodeURIComponent(password)}`;

  useEffect(() => {
    let interval;

    const fetchTimetable = async () => {
      if (!initialTimetable) {
        interval = setInterval(() => {
          setProgress((p) => (p >= 90 ? 90 : p + 10));
        }, 200);
      }

      try {
        const res = await axios.get(timetable_api);
        const data = res?.data?.timetable;

        if (data && data.length > 0) {
          setTimetable(data);
          localStorage.setItem("timetable", JSON.stringify(data));
        }
      } catch (err) {
        console.error("Timetable fetch failed");
      } finally {
        if (!initialTimetable) {
          clearInterval(interval);
          setProgress(100);
          setTimeout(() => {
            setLoading(false);
            setProgress(0);
          }, 300);
        }
      }
    };

    fetchTimetable();
  }, []);

  const today = new Date().toLocaleDateString('en-US', { weekday: 'short' });

  const todayRow = timetable?.slice(1).find((row, index) => {
    return index !== 0 && row[0] === today
  })
  const todayData = todayRow ? todayRow.slice(1).filter(item => item && item !== "-") : [];

  
  /* ---------- UI STATES ---------- */

  if (loading) {
    return (
      <section className="flex justify-center bg-black min-h-screen">
        <Header />
        <button onClick={() => navigate(-1)} className="fixed top-20 left-0 p-5">
          <FaArrowLeft size={20} color="white" />
        </button>
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

  if (!timetable || timetable.length === 0) {
    return (
      <section className="flex justify-center bg-black min-h-screen">
        <Header />
        
        <div className="mt-24 flex flex-col items-center gap-6 text-slate-200">
          <button onClick={() => navigate(-1)} className="fixed top-15 left-0 p-5">
            <FaArrowLeft size={20} color="white" />
          </button>
          <p className="text-xs font-bold mb-15">No Data Available</p>
          <FaRegFaceSadCry size={80} color="grey" />
        </div>
      </section>
    );
  }

  /* ---------- MAIN TABLE ---------- */

  return (
    <section className="flex justify-center bg-black min-h-screen">
      <Header />
      <div className="bg-black mt-15 p-4 text-slate-200">
        <button onClick={() => navigate(-1)} className="fixed top-15 left-0 p-5">
          <FaArrowLeft size={20} color="white" />
        </button>

        <h2 className="text-xl font-bold mb-3 text-center">Time Table</h2>

        <div className="border border-[#222528] rounded-lg overflow-hidden text-xs font-semibold">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  {timetable[0].map((header, i) => (
                    <th
                      key={i}
                      className="px-2 py-3 text-center border border-[#222528]"
                    >
                      {header === "Day of week"
                        ? "Day"
                        : header.startsWith("P")
                        ? header.substring(0, 8)
                        : "Break"}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {timetable.slice(1).map((row, r) => (
                  <tr key={r}>
                    {row.map((cell, c) => (
                      <td
                        key={c}
                        className="px-3 py-3 border border-[#222528]"
                      >
                        {cell || "-"}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className='flex justify-center mt-4'>
          <div className='w-105 text-slate-200 bg-black border  border-[#222528]  p-2 rounded'>

            <label className=' flex flex-col py-1 px-2'>
              <div className='font-bold text-sm mb-2'>
                Today's periods

              </div>
              {
                todayData.length > 0 ? (
                  <div className='grid grid-cols-5 gap-0.5'>
                    {todayData.map((period, index) => (
                      <p key={index} className='text-xs mt-1 font-extrabold  text-pink-300 rounded-md  w-fit '>{index + 1} - {period}</p>
                    ))}
                  </div>
                ) : (

                  <p className='text-xs mt-1'>No classes scheduled for today.</p>

                )
              }

            </label>
            <div className='flex items-center justify-around gap-1 mt-2'>



            </div>
          </div>
        </div>
      

      </div>
    </section>
  );
};

export default TimeTable;
