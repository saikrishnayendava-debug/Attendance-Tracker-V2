import React, { useEffect, useMemo, useRef, useState } from 'react'
import Header from '../Components/Header'
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css'
import { FaHourglassEnd } from "react-icons/fa";
import axios from 'axios'
import { MdBatteryAlert } from "react-icons/md";
import { BsCalendarDateFill } from "react-icons/bs";
import ToastNotification from '../Components/ToastNotification';
import { showToast } from '../Components/ToastNotification';
import attendenceCalculator from '../utils/main'
import { attendencePerform, getSundays } from '../utils/utils'
import { useNavigate } from 'react-router-dom'
import getAttendanceCounts from '../utils/helper'
import FooterComponent from '../Components/FooterComponent'
import getAttendanceTotals from '../utils/getAttendanceTotals'
import { PiStudentFill } from "react-icons/pi";
import attendanceTarget from '../utils/AttendanceTarget'
import { getAttendanceTodayArray } from '../utils/attendanceTodayArray'
import ChartComponent from '../Components/ChartComponent'
import { RiRefreshLine } from "react-icons/ri";
import SubjectWiseComponent from '../Components/SubjectWiseComponent';
import { ImPower } from "react-icons/im";

import Table from '../Components/Table';

const Home = () => {
  const navigate = useNavigate()
  const [data, setData] = useState({
    present: '',
    held: '',
    leaves: [],
    holidays: [],
    hours_can_skip: "",
    hours_needed: "",
    total_percentage: "",
    subjectwiseSummary: []
  })
  const [frnd_data, setFrnd_Data] = useState({
    frnd_redgNo: localStorage.getItem("frnd_redgNo") || "",
    frnd_password: localStorage.getItem("frnd_password") || "",
  })
  const [loading, setLoading] = useState(false)
  const [attendanceData, setAttendanceData] = useState()
  const [showLeaveCalendar, setShowLeaveCalendar] = useState(false)
  const [showHolidayCalendar, setShowHolidayCalendar] = useState(false)
  const [todayPeriodsPosted, setTodayPeriodsPosted] = useState()

  const [lastUpdated, setLastUpdated] = useState(localStorage.getItem("lastFetchTime"))

  const [animate, setAnimate] = useState(false);
  const [attendanceRaw, setAttendanceRaw] = useState(null);

  const cnt = useMemo(() => {
  if (!attendanceRaw) return 0;
  return getAttendanceCounts(attendanceRaw);
}, [attendanceRaw]);

  const [selectedPeriods, setSelectedPeriods] = useState([]);
  const tempCnt = selectedPeriods.length;
  const today = new Date();
  const minDate =
    (selectedPeriods.length > 0)
      ? new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1)
      : today;
  const maxDate = new Date();
  maxDate.setMonth(maxDate.getMonth() + 1);
const sundayArray = useMemo(() => {
  return getSundays(today).map(sun => sun.getDate());
}, []);

  const emptyArray = new Array(7).fill(null);
  const [cachedValues, setCachedValues] = useState({
    totalPercentage: 0,
    hoursCanSkip: 0,
    hoursNeeded: 0
  });
  const [miniloading, setMiniLoading] = useState(false);
  const [frndAttendanceData, setFrndAttendanceData] = useState(
    localStorage.getItem("frnd_latestAttendanceData") || ""
  );

  const [frndPeriods, setFrndPeriods] = useState(null);
  // const [animationClick, setAnimationClick] = useState(false);
  const handleTempClick = (index) => {
    setSelectedPeriods(prev => {
      if (prev.includes(index)) {
        return prev.filter(i => i !== index); // unselect
      } else {
        return [...prev, index]; // select
      }
    });
  };


  const attendanceArray = useMemo(() => {
    if (!attendanceRaw || !data.present || !data.held) return [];


    const leavesArray = [...data.leaves]; // Date[]
  const holidaysArray = [...data.holidays];
    return attendenceCalculator(
      holidaysArray,
      leavesArray,
      28,
      data.present - (tempCnt + cnt),
      data.held - cnt,
      new Date(),
      sundayArray,
      7
    );
  }, [
    attendanceRaw,
  data.leaves,
  data.holidays,
  data.present,
  data.held,
  tempCnt,
  cnt,
  sundayArray
  ]);
  // console.log(attendanceArray);

  const handleOnChange = (e) => {
    const { name, value } = e.target
    setData(prev => ({
      ...prev,
      [name]: value
    }))
  }
  const handleFrndChange = (e) => {
    const { name, value } = e.target
    setFrnd_Data(prev => ({
      ...prev,
      [name]: value
    }))
  }


  const handleLeaveDayClick = (date) => {
    setData(prev => {
      const exists = prev.leaves.some(d => d.toDateString() === date.toDateString())
      return {
        ...prev,
        leaves: exists
          ? prev.leaves.filter(d => d.toDateString() !== date.toDateString()) // remove if clicked again
          : [...prev.leaves, date] // add new date
      }
    })
  }

  const handleHolidayDayClick = (date) => {
    setData(prev => {
      const exists = prev.holidays.some(d => d.toDateString() === date.toDateString())
      return {
        ...prev,
        holidays: exists
          ? prev.holidays.filter(d => d.toDateString() !== date.toDateString())
          : [...prev.holidays, date]
      }
    })
  }


  const handleReset = () => {
    setData(prev => ({
      ...prev,
      leaves: [],
      holidays: []
    }));


    setSelectedPeriods([]);
    setShowLeaveCalendar(false);
    setShowHolidayCalendar(false);
  }

  const redgNo = localStorage.getItem("redgNo");
  const password = localStorage.getItem("password");
  const code = localStorage.getItem("code");
  const url =
    code === "VIEW"
      ? `https://womens-api.vercel.app/attendance?student_id=${encodeURIComponent(redgNo)}&password=${encodeURIComponent(password)}`
      : `https://viit-main-api-teal.vercel.app/attendance?student_id=${encodeURIComponent(redgNo)}&password=${encodeURIComponent(password)}`; /*saikrishna */


  const fetchAttendance = async () => {
    try {
      setLoading(true);
      
      const response = await axios.get(url);
      localStorage.setItem("latestAttendanceData", JSON.stringify(response.data));

      // const totals = getAttendanceTotals(response.data)
      const now = new Date().toLocaleString('en-IN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
      })
      localStorage.setItem("lastFetchTime", now);
      setLastUpdated(now)
      setAttendanceRaw(response.data);
      setAttendanceData(response.data)
      setData(prev => ({
        ...prev,
        present: response.data.total_info?.total_attended || '',
        held: response.data.total_info?.total_held || '',
        hours_can_skip: response.data.total_info?.hours_can_skip || '',
        hours_needed: response.data.total_info?.additional_hours_needed || '',
        total_percentage: response.data.total_info?.total_percentage || '',
        subjectwiseSummary: response.data?.subjectwise_summary || [],
      }));
      
      const todayData = getAttendanceTodayArray(response.data);
      setTodayPeriodsPosted(todayData);
      // console.log(result)
     





    } catch (error) {
      showToast("Failed to fetch data");
      const storedData = localStorage.getItem("latestAttendanceData");
      const lastFetchTime = localStorage.getItem("lastFetchTime");

      if (storedData && lastFetchTime) {
        const parsedData = JSON.parse(storedData);
        setLastUpdated(lastFetchTime);
        setAttendanceData(parsedData);
          setAttendanceRaw(parsedData);
        setData(prev => ({
          ...prev,
          present: parsedData.total_info?.total_attended || '',
          held: parsedData.total_info?.total_held || '',
          hours_can_skip: parsedData.total_info?.hours_can_skip || '',
          hours_needed: parsedData.total_info?.additional_hours_needed || '',
          total_percentage: parsedData.total_info?.total_percentage || '',
        }));

        

        const todayData = getAttendanceTodayArray(parsedData);
        setTodayPeriodsPosted(todayData);

        return;
      }
    }


    finally {
      setAnimate(false);
      setLoading(false);
    }
  }


  const fetch_frnd_Attendance = async () => {
    try {
      setMiniLoading(true);
      const frnd_num = frnd_data.frnd_redgNo;
      const frnd_pass = frnd_data.frnd_password;

      localStorage.setItem("frnd_redgNo", frnd_num);
      localStorage.setItem("frnd_password", frnd_pass);

      const url =
        code === "VIEW"
          ? `https://womens-api.vercel.app/attendance?student_id=${encodeURIComponent(frnd_num)}&password=${encodeURIComponent(frnd_pass)}`
          : `https://apis-livid-eight.vercel.app/attendance?student_id=${encodeURIComponent(frnd_num)}&password=${encodeURIComponent(frnd_pass)}`;

      const response = await axios.get(url);
      setFrndAttendanceData(response.data.total_info?.total_percentage || '');
      const todayData = getAttendanceTodayArray(response.data);
      setFrndPeriods(todayData);
      localStorage.setItem("frnd_latestAttendanceData", JSON.stringify(response.data.total_info?.total_percentage));



    } catch (error) {
      showToast("Failed to fetch data");
      return;

    }

    finally {
      setMiniLoading(false);
    }
  }



  useEffect(() => {
    const sendLog = async () => {
      try {
        await axios.post("https://logs-uhwy.onrender.com/log", { number: redgNo });
      } catch (error) {
        console.error(error);
      }
    };
    if (!redgNo || !password) {
      navigate('/');
      return;
    }
    setAnimate(true);
    setSelectedPeriods([]);

    const storedData = JSON.parse(localStorage.getItem("latestAttendanceData"))?.total_info || {};

    const cached = localStorage.getItem("latestAttendanceData");
  const parsedData = cached ? JSON.parse(cached) : null;

  if (parsedData?.total_info) {
    const storedData = parsedData.total_info;
    
    setCachedValues({
      totalPercentage: storedData.total_percentage || 0,
      hoursCanSkip: storedData.hours_can_skip || 0,
      hoursNeeded: storedData.additional_hours_needed || 0,
    });

    setData(prev => ({
      ...prev,
      present: storedData.total_attended || '',
      held: storedData.total_held || '',
      hours_can_skip: storedData.hours_can_skip || '',
      hours_needed: storedData.additional_hours_needed || '',
      total_percentage: storedData.total_percentage || '',
      subjectwiseSummary: parsedData.subjectwise_summary || [],
    }));

    setAttendanceRaw(parsedData);
    setTodayPeriodsPosted(getAttendanceTodayArray(parsedData));
  }

    
        
      sendLog();
    

  }, [])





  const totalPercentage = data.total_percentage || cachedValues.totalPercentage;
  const hoursCanSkip = data.hours_can_skip || cachedValues.hoursCanSkip;
  const hoursNeeded = data.hours_needed || cachedValues.hoursNeeded;






  return (

    <section className=' bg-black min-h-screen-'>
      <ToastNotification />
      <Header />
      <p className={`pt-16 h-fit text-xs font-bold animate-pulse text-center text-slate-200`}>Dont reload the page, click the fetch attendance button below</p>

      <div className='mt-2 mx-1 flex items-center justify-around'>
        
        <div className=' bg-emerald-200 pt-2  text-slate-900 h-40 w-40 rounded-3xl py-1 font-bold text-sm '>
          {
            totalPercentage >= 75 ? (
              <div className='flex flex-col font-extrabold items-center justify-center '>
                <div>Periods can skip</div>
                <div className="flex flex-row w-full items-center justify-center">
                  <div className='text-6xl mt-6'>
                    {hoursCanSkip}
                  </div>
                  {/* <IoMdBatteryFull size={25} className='text-green-500' /> */}
                  <ImPower />
                </div>
                <div className='mt-4'>{Math.floor(hoursCanSkip / 7)} days, {hoursCanSkip % 7} periods</div>

              </div>
            ) : (
              <div className='flex flex-col font-bold items-center justify-center'>
                <div>Periods to attend</div>
                <div className="flex flex-row w-full items-center justify-center">

                  <div className='text-6xl mt-6 text-red-500'>{hoursNeeded}</div>
                  {/* <MdBatteryAlert size={25} className='text-red-500' /> */}

                </div>
                <div className='mt-4'>{Math.floor(hoursNeeded / 7)} days, {hoursNeeded % 7} periods</div>
              </div>
            )
          }


        </div>



        <div className='h-40 rounded-3xl border border-[#222528] shadow shadow-slate-800 py-1 font-extrabold text-sm w-40 flex flex-col items-center justify-center text-[#e6fdff]'>
          <div className='bg-emerald-200 text-black rounded-2xl px-1'>Present attendance</div>
          <div>
            {data.total_percentage
              ? <ChartComponent progress={data.total_percentage} />
              : <ChartComponent progress={JSON.parse(localStorage.getItem("latestAttendanceData"))?.total_info?.total_percentage || 0} />
            }
          </div>
        </div>

      </div>

      <div className='flex justify-center mt-4'>
        <div className='w-105 text-slate-200'>

          <div className='grid grid-cols-2  bg-black border px-4 py-3  border-[#222528] rounded '>
            <label className=' flex flex-col'>
              <div className='font-semibold text-sm'>
                Time Table
                <span className='bg-green-500 text-2xs w-fit px-1 rounded-4xl ml-1'>new</span>
              </div>
              <span className='text-2xs text-slate-500 font-semibold'>Full Academic time Table</span>

            </label>
            <button type='button' onClick={() => navigate('/timetable')} className=' cursor-pointer ml-30  w-fit rounded-lg'>
              <p className='text-red-300 text-sm font-extrabold'>click</p>
            </button>


          </div>
        </div>
      </div>


      <div className='top-0 bottom-0 left-0 right-0 flex justify-center mt-3'>

        <div className=' w-105 text-slate-200'>
          <form className='grid gap-5'>
            <div className=' grid p-5 gap-5 rounded-md border border-[#222528] text-slate-200'>
              <div className='font-bold flex gap-2 items-center justify-center'>
                Hi, {localStorage.getItem("redgNo")}
              </div>
              <div className='grid grid-cols-2 gap-2'>
                <label htmlFor="present" className='text-xs font-semibold'>
                  Number of periods attended
                </label>
                <input
                  type='number'
                  id='present'

                  className='bg-black border  border-[#222528] font-bold rounded px-2 py-1  text-sm text-center focus:outline-none focus:ring-0 focus:border-emerald-500'
                  name='present'
                  value={data.present}
                  readOnly
                  required
                  onChange={handleOnChange}
                />
              </div>


              <div className='grid grid-cols-2 gap-2'>
                <label htmlFor="held" className='text-xs font-semibold '>
                  Number of periods held
                </label>
                <input
                  type='number'
                  id='held'
                  readOnly
                  className='bg-black border  border-[#222528]  font-bold rounded px-2 py-1  text-sm text-center focus:outline-none focus:ring-0 focus:border-emerald-500'
                  name='held'
                  value={data.held}
                  required
                  onChange={handleOnChange}
                />
              </div>
              <div className='bg-black border  border-[#222528] p-1.5 rounded'>
                <div className='text-center text-xs mb-1 font-bold '>Today attendance status</div>
                <div className='flex gap-2 items-center flex-wrap'>
                  {todayPeriodsPosted?.map((item, index) => (
                    item.message ? (
                      <p key={index} className='text-xs text-center'>{item.message}</p>
                    ) : (
                      <div key={index} className={`${item.attendance_today?.trim().toUpperCase().includes("A") ? 'bg-red-500 ' : 'bg-[#00ce86] '} text-black rounded flex gap-1 font-extrabold px-1 text-sm`}>
                        <span>{item.subject}:</span>
                        <span>{item.attendance_today}</span>
                      </div>
                    )
                  ))}
                </div>
              </div>

              <div>
                <p className={`text-xs font-bold animate-bounce text-center`}>Dont reload the page, click the button below</p>
                <button type='button' onClick={fetchAttendance} className={`relative cursor-pointer bg-white rounded-2xl py-2 font-extrabold text-black text-sm w-full flex items-center justify-center overflow-hidden gap-1.5 `}
                  disabled={loading}>
                  {loading && (
                    <span className="absolute left-0 top-0 h-full w-full bg-gray-600 animate-pulse opacity-90"></span>
                  )}
                  <span className={`relative ${loading ? " " : ""}`}>
                    {loading ? "Fetching..." : "Fetch Attendance"}
                  </span>
                  <FaHourglassEnd size={14} />
                </button>
                <p className='text-xs ml-0 mt-1 font-semibold'>Last updated: {lastUpdated}</p>
              </div>

              <div className='border border-[#222528] p-1 py-2 rounded-md'>
                <h1 className='text-center text-sm font-bold  mb-3'>Select period to bunk today</h1>
                <div className='flex justify-evenly flex-wrap'>
                  {emptyArray.map((_, index) => {
                    const isSelected = selectedPeriods.includes(index);
                    const isDisabled = cnt >= index + 1;

                    return (
                      <button
                        type='button'
                        key={index}
                        disabled={isDisabled || loading}
                        onClick={() => { handleTempClick(index); setShowHolidayCalendar(false); setShowLeaveCalendar(false); }}
                        className={`
            ${isSelected ? 'border border-[#222528] bg-black text-white' : 'bg-slate-200'} 
            text-gray-900 w-6 h-6 rounded flex justify-center items-center font-extrabold text-sm 
            ${isDisabled ? 'opacity-20 cursor-not-allowed' : 'cursor-pointer'}
          `}
                      >
                        {index + 1}
                      </button>
                    );
                  })}
                </div>
              </div>


            </div>


            <div className='grid grid-cols-2 bg-black border  border-[#222528] p-2 rounded '>
              <label className='font-bold text-sm flex flex-col py-1 px-2'>
                Leave dates
                <span className='text-2xs text-slate-500 font-semibold'>Select dates you wish to put leaves</span>
              </label>
              <button type='button' onClick={() => setShowLeaveCalendar(!showLeaveCalendar)} className=' cursor-pointer ml-30 p-2 bg-emerald-300 w-fit rounded-2xl '>{
                <BsCalendarDateFill className='text-emerald-800  rounded' size={30} />
              }</button>
              {
                showLeaveCalendar && (

                  <Calendar
                    className={'text-black'}
                    onClickDay={handleLeaveDayClick}
                    value={null}
                    tileClassName={({ date }) =>
                      data.leaves.some(d => d.toDateString() === date.toDateString())
                        ? 'bg-red-500 text-white rounded-full'
                        : ''
                    }
                    minDate={minDate}
                    maxDate={maxDate}
                  />
                )
              }
            </div>


            <div className='grid grid-cols-2  bg-black border  border-[#222528]  p-2 rounded'>
              <label className='font-semibold text-sm flex flex-col py-1 px-2'>
                Holiday dates
                <span className='text-2xs text-slate-500 font-semibold'>Select dates of public holidays</span>

              </label>
              <button type='button' onClick={() => setShowHolidayCalendar(!showHolidayCalendar)} className=' cursor-pointer ml-30 p-2 bg-emerald-300 w-fit rounded-2xl'>
                <BsCalendarDateFill className='text-emerald-800  rounded' size={30} />

              </button>
              {
                showHolidayCalendar && (
                  <>
                    <Calendar
                      className={'text-black'}
                      onClickDay={handleHolidayDayClick}
                      value={null}
                      tileClassName={({ date }) =>
                        data.holidays.some(d => d.toDateString() === date.toDateString())
                          ? 'bg-green-500 text-white rounded-full'
                          : ''
                      }
                      minDate={minDate}
                      maxDate={maxDate}
                    />

                  </>
                )
              }

            </div>

            <div className='grid'>

              <button type='button' disabled={!(selectedPeriods.length > 0 || data.leaves.length > 0 || data.holidays.length > 0) || loading} onClick={handleReset} className='cursor-pointer bg-gray-700 text-white rounded py-2 font-extrabold text-sm flex gap-1 items-center justify-center'>
                Reset
                <RiRefreshLine className='text-white rounded-md' size={20} />
              </button>
            </div>


          </form>
        </div>
      </div>


      <div className=' sm:105  mt-5 rounded-md'>
        <div className='my-5'>
          <h1 className='text-center text-2xl font-bold text-slate-200'>Attendance as per data</h1>
        </div>
        <div className='flex flex-col items-center justify-center gap-2'>
          {

            attendanceArray?.map((item, index) => {
              return (
                <div key={index} >

                  {(index === 0 && selectedPeriods.length > 0) ? (
                    <div className={`w-90 mb-8  ${(tempCnt === 7) ? "text-[#fc9999] border border-red-500" : "text-slate-200 border border-[#87ecbb] bg-[#0a2c1184] "}   py-1.5  rounded font-bold flex justify-around text-sm `}>
                      <p>{item.day}</p>


                      <p className='font-extrabold'>{item.attendence} %</p>
                      <div className='font-extrabold flex gap-5 text-[#fc9999]'>

                        <p>{7 - selectedPeriods.length} / 7</p>
                        <p>
                          -{selectedPeriods.length}
                        </p>

                      </div>
                    </div>

                  ) : (
                    <div className={`w-90 ${index === 0 && "mb-8"}  ${(item.absent) ? "text-[#fc9999] border border-red-500" : "text-slate-200 border border-[#87ecbb] bg-[#0a2c1184] "}   py-1.5  rounded font-bold flex justify-around text-sm `}>
                      <p>{item.day} </p>


                      <p className='font-extrabold'>{item.attendence} %</p>
                      <p>{item.absent ? "Absent" : "Present"}</p>
                    </div>
                  )
                  }

                </div>
              )
            })

          }
        </div>
      </div>



      <div className='flex justify-center mt-4'>
        <div className='w-105 text-slate-200'>

          <div className='grid grid-cols-2  bg-black border  border-[#222528]  p-2 rounded'>
            <label className=' flex flex-col py-1 px-2'>
              <div className='font-semibold text-sm'>
                Check full attendance register
                {/* <span className='bg-green-500 text-2xs w-fit px-1 rounded-4xl ml-1'>new</span> */}
              </div>
              <span className='text-2xs text-slate-500 font-semibold'>Detailed day wise attendance</span>

            </label>
            <button type='button' onClick={() => navigate('/register')} className=' cursor-pointer ml-30 p-2  w-fit rounded-lg'>
              <p className='text-red-300 text-sm font-extrabold'>click</p>
            </button>


          </div>
        </div>
      </div>
      <div className='flex justify-center mt-4'>
        <div className='w-105 text-slate-200'>

          <div className='grid grid-cols-2  bg-black border  border-[#222528]  p-2 rounded'>
            <label className=' flex flex-col py-1 px-2'>
              <div className='font-semibold text-sm'>
                Subject-wise attendance summary

              </div>
              <span className='text-2xs text-slate-500 font-semibold'>Detailed attendance of each subject</span>

            </label>
            <button type='button' disabled={loading} onClick={() => navigate('/subjectwise', { state: { data: data.subjectwiseSummary } })} className=' cursor-pointer ml-30 p-2  w-fit rounded-lg'>
              <p className='text-red-300 text-sm font-extrabold'>click</p>
            </button>


          </div>
        </div>
      </div>
      <div className='flex justify-center mt-4 mb-5'>
        <div className='w-105 text-slate-200 bg-black border  border-[#222528]  p-2 rounded'>

          <label className=' flex flex-col py-1 px-2'>
            <div className='font-semibold text-sm'>
              Check your friend's attendance
              {/* <span className='bg-green-500 text-2xs w-fit px-1 rounded-4xl ml-1'>new</span> */}
            </div>
            <span className='text-2xs text-slate-500 font-semibold'>login once, use it forever</span>

          </label>
          <div className='flex items-center justify-around gap-1 mt-2'>
            <div className='flex flex-col gap-3'>

              <input type="text" placeholder='22L31A05K3' className='w-40 bg-black border   border-[#222528] font-bold rounded px-2 py-1  text-sm text-center focus:outline-none focus:ring-0 focus:border-emerald-500' value={frnd_data.frnd_redgNo} onChange={handleFrndChange} name='frnd_redgNo' />
              <input type="text" placeholder='password' className='w-40 bg-black border  border-[#222528] font-bold rounded px-2 py-1  text-sm text-center focus:outline-none focus:ring-0 focus:border-emerald-500' value={frnd_data.frnd_password} onChange={handleFrndChange} name='frnd_password' />

            </div>
            <div className='flex flex-col gap-3'>
              <button disabled={loading} className={`${miniloading ? "animate-pulse opacity-40" : ""} bg-emerald-500 text-black rounded-lg py-1.5 font-extrabold text-sm`} onClick={fetch_frnd_Attendance}>Fetch</button>
              <input type="text" className='w-20 bg-black border  border-[#222528] font-bold rounded px-2 py-1  text-sm text-center focus:outline-none focus:ring-0 focus:border-emerald-500 text-white' value={frndAttendanceData} readOnly />
            </div>

          </div>
          <div className='bg-black border  border-[#222528] p-1.5 rounded mt-3'>
            <div className='text-center text-xs mb-1 font-bold '>Today attendance status</div>
            <div className='flex gap-2 items-center flex-wrap'>
              {frndPeriods?.map((item, index) => (
                item.message ? (
                  <p key={index} className='text-xs text-center'>{item.message}</p>
                ) : (
                  <div key={index} className={`${item.attendance_today?.trim().toUpperCase().includes("A") ? 'bg-red-500 ' : 'bg-[#00ce86] '} text-black rounded flex gap-1 font-extrabold px-1 text-sm`}>
                    <span>{item.subject}:</span>
                    <span>{item.attendance_today}</span>
                  </div>
                )
              ))}
            </div>
          </div>
        </div>
      </div>

      <FooterComponent />




    </section>

  )
}

export default Home
