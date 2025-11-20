import React, { useEffect, useState } from 'react'
import Header from '../Components/Header'
import { IoMdBatteryFull } from "react-icons/io";
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css'
import { IoMdArrowDropdown } from "react-icons/io";
import { FaHourglassEnd } from "react-icons/fa";
import axios from 'axios'
import { MdBatteryAlert } from "react-icons/md";
import { PiBatteryVerticalLowBold } from "react-icons/pi"
import { BsCalendarDateFill } from "react-icons/bs";
import ToastNotification from '../Components/ToastNotification';
import { showToast } from '../Components/ToastNotification';
import Loading from '../Components/Loading'
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
import { SlCalender } from "react-icons/sl";
import { GoGraph } from "react-icons/go";
import { RiRefreshLine } from "react-icons/ri";
import SubjectWiseComponent from '../Components/SubjectWiseComponent';
import { ImPower } from "react-icons/im";
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
  const [loading, setLoading] = useState(false)
  const [tempCnt, setTempCnt] = useState(0);
  const [attendanceData, setAttendanceData] = useState()
  const [showLeaveCalendar, setShowLeaveCalendar] = useState(false)
  const [showHolidayCalendar, setShowHolidayCalendar] = useState(false)
  const [todayPeriodsPosted, setTodayPeriodsPosted] = useState(null)
  var leavesArray = [];
  const [lastUpdated, setLastUpdated] = useState(null)
  var holidaysArray = [];
  const [attendanceArray, setAttendanceArray] = useState([]);
  const [cnt, setCnt] = useState(0)
  const [skip, setSkip] = useState(null)
  const today = new Date();
  const maxDate = new Date();
  maxDate.setMonth(maxDate.getMonth() + 1);
  const sundays = getSundays(today);
  const sundayArray = sundays.map(sun => sun.getDate());
  const emptyArray = new Array(7).fill(null);
  const [selectedPeriods, setSelectedPeriods] = useState([]);
  const [cachedValues, setCachedValues] = useState({
    totalPercentage: 0,
    hoursCanSkip: 0,
    hoursNeeded: 0
  });
  const [openSubjsectWise, setOpenSubjectWise] = useState(false);
  const handleTempClick = (index) => {
    setSelectedPeriods(prev => {
      if (prev.includes(index)) {
        return prev.filter(i => i !== index); // unselect
      } else {
        return [...prev, index]; // select
      }
    });
  };

  const handleOnChange = (e) => {
    const { name, value } = e.target
    setData(prev => ({
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

  const handleSubmit = (e) => {
    e.preventDefault()
    leavesArray = data.leaves.map(d => d.getDate());
    holidaysArray = data.holidays.map(d => d.getDate());
    const result = attendenceCalculator(holidaysArray, leavesArray, 28, data.present - (tempCnt + cnt), data.held - cnt, today.getDate(), sundayArray, 7)
    setAttendanceArray(result)
    console.log(data)
  }
  const handleReset = () => {
    setData(prev => ({
      ...prev,
      leaves: [],
      holidays: []
    }));
    setAttendanceArray([])
    setTempCnt(0);
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
      : `https://apis-livid-eight.vercel.app/attendance?student_id=${encodeURIComponent(redgNo)}&password=${encodeURIComponent(password)}`;


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
      const result = getAttendanceCounts(response.data)

      setCnt(result)
      console.log("cnt" + result)
      const todayData = getAttendanceTodayArray(response.data);
      setTodayPeriodsPosted(todayData);

    } catch (error) {
      showToast("Failed to fetch data");
      const storedData = localStorage.getItem("latestAttendanceData");
      const lastFetchTime = localStorage.getItem("lastFetchTime");

      if (storedData && lastFetchTime) {
        const parsedData = JSON.parse(storedData);
        setLastUpdated(lastFetchTime);
        setAttendanceData(parsedData);

        setData(prev => ({
          ...prev,
          present: parsedData.total_info?.total_attended || '',
          held: parsedData.total_info?.total_held || '',
          hours_can_skip: parsedData.total_info?.hours_can_skip || '',
          hours_needed: parsedData.total_info?.additional_hours_needed || '',
          total_percentage: parsedData.total_info?.total_percentage || '',
        }));

        const result = getAttendanceCounts(parsedData);
        setCnt(result);

        const todayData = getAttendanceTodayArray(parsedData);
        setTodayPeriodsPosted(todayData);

        return;
      }
    }

    finally {
      setLoading(false);
    }
  }



  useEffect(() => {
    if (!redgNo || !password) {
      navigate("/");
      return;
    }
    fetchAttendance();
    setSelectedPeriods([]);
    const storedData = JSON.parse(localStorage.getItem("latestAttendanceData"))?.total_info || {};
    setCachedValues({
      totalPercentage: storedData.total_percentage || 0,
      hoursCanSkip: storedData.hours_can_skip || 0,
      hoursNeeded: storedData.additional_hours_needed || 0
    });

  }, [])
  useEffect(() => {
    setTempCnt(selectedPeriods.length);
  }, [selectedPeriods])
  const totalPercentage = data.total_percentage || cachedValues.totalPercentage;
  const hoursCanSkip = data.hours_can_skip || cachedValues.hoursCanSkip;
  const hoursNeeded = data.hours_needed || cachedValues.hoursNeeded;




  return (

    <section className=' bg-black min-h-screen-'>
      <ToastNotification />
      <Header />

      <div className='mt-2 mx-1 flex items-center justify-around pt-19'>
        <div className=' bg-emerald-200 pt-2  text-black min-h-40 max-h-40 w-40 rounded-3xl py-1 font-bold text-sm'>
          {
            totalPercentage >= 75 ? (
              <div className='flex flex-col font-extrabold items-center justify-center '>
                <div>Periods can skip</div>
                <div className="flex flex-row w-full items-center justify-center">
                  <div className='text-6xl mt-6 '>
                    {hoursCanSkip}
                  </div>
                  <IoMdBatteryFull size={25} className='text-green-500' />
                  <ImPower />
                </div>
                <div className='mt-4'>{Math.floor(hoursCanSkip / 7)} days, {hoursCanSkip % 7} periods</div>

              </div>
            ) : (
              <div className='flex flex-col font-bold items-center justify-center'>
                <div>Periods to attend</div>
                <div className="flex flex-row w-full items-center justify-center">

                  <div className='text-6xl mt-6'>{hoursNeeded}</div>
                  <MdBatteryAlert size={25} className='text-red-600'  />
                  
                </div>
                <div className='mt-4'>{Math.floor(hoursCanSkip / 7)} days, {hoursCanSkip % 7} periods</div>
              </div>
            )
          }


        </div>
        <div className='min-h-40 max-h-40 rounded-3xl bg-emerald-900 py-1 font-extrabold text-sm w-40 flex flex-col items-center justify-center text-emerald-200'>
          <div>Present attendance</div>
          <div>
            {data.total_percentage
              ? <ChartComponent progress={data.total_percentage} />
              : <ChartComponent progress={JSON.parse(localStorage.getItem("latestAttendanceData"))?.total_info?.total_percentage || 0} />
            }
          </div>
        </div>

      </div>


      <div className='top-0 bottom-0 left-0 right-0 flex justify-center mt-3'>

        <div className=' w-105 text-slate-200'>
          <form className='grid gap-5' onSubmit={handleSubmit}>
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

                  className='bg-black border  border-[#222528] font-bold rounded px-2 py-1  text-sm text-center'
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
                  className='bg-black border  border-[#222528]  font-bold rounded px-2 py-1  text-sm text-center'
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
                <h1 className='text-center text-sm font-bold  m-1'>Select period to bunk today</h1>
                <div className='flex justify-evenly flex-wrap'>
                  {emptyArray.map((_, index) => {
                    const isSelected = selectedPeriods.includes(index);
                    const isDisabled = cnt >= index + 1;

                    return (
                      <button
                        type='button'
                        key={index}
                        disabled={isDisabled}
                        onClick={() => handleTempClick(index)}
                        className={`
            ${isSelected ? 'bg-lime-500' : 'bg-[#00ce86]'} 
            text-lime-100 w-6 h-6 rounded flex justify-center items-center font-extrabold text-sm 
            ${isDisabled ? 'opacity-20 cursor-not-allowed' : 'cursor-pointer'}
          `}
                      >
                        {index + 1}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <button type='button' onClick={fetchAttendance} className={`relative cursor-pointer bg-slate-200 rounded-2xl py-2 font-extrabold text-black text-sm w-full flex items-center justify-center overflow-hidden gap-1.5`}
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
            </div>


            <div className='grid grid-cols-2 bg-black border  border-[#222528] p-2 rounded '>
              <label className='font-bold text-sm flex flex-col py-1 px-2'>
                Leave dates
                <span className='text-2xs text-slate-500 font-semibold'>Select dates you wish to put leaves</span>
              </label>
              <button type='button' onClick={() => setShowLeaveCalendar(!showLeaveCalendar)} className=' cursor-pointer ml-30 p-2 bg-emerald-300 w-fit rounded-lg '>{
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
                    minDate={today}
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
              <button type='button' onClick={() => setShowHolidayCalendar(!showHolidayCalendar)} className=' cursor-pointer ml-30 p-2 bg-emerald-300 w-fit rounded-lg'>
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
                      minDate={today}
                      maxDate={maxDate}
                    />

                  </>
                )
              }

            </div>




            <div className='grid grid-cols-2 gap-3'>
              <button type='submit' className='cursor-pointer bg-gray-700 text-white  rounded-lg py-2 font-extrabold text-sm flex gap-1 items-center justify-center'>
                Submit
                <GoGraph className=' rounded-md p-1 text-white ' size={24} />
              </button>
              <button type='button' onClick={handleReset} className='cursor-pointer bg-gray-700 text-white rounded-lg py-2 font-extrabold text-sm flex gap-1 items-center justify-center'>
                Reset
                <RiRefreshLine className='text-white rounded-md' size={20} />
              </button>
            </div>


          </form>
        </div>
      </div>



      <div className='mt-10 mb-7'>
        <h1 className='text-center text-2xl font-bold text-slate-200'>Attendance as per data</h1>
      </div>
      <div className='flex flex-col items-center justify-center gap-2'>
        {

          attendanceArray?.map((item, index) => {
            return (
              <div key={index} className={`w-70 sm:w-150   ${item.absent ? "text-red-300 " : "text-green-300 "} bg-black border border-[#222528] py-1.5  rounded font-bold flex justify-around text-xs `}>
                <p>{item.day} th</p>
                <p className='font-extrabold'>{item.attendence} %</p>
                <p>{item.absent ? "Absent" : "Present"}</p>
              </div>
            )
          })

        }
      </div>

      <div className='flex justify-center mt-15'>
        <div className='w-105 text-slate-200'>

          <div className='grid grid-cols-2  bg-black border  border-[#222528]  p-2 rounded'>
            <label className=' flex flex-col py-1 px-2'>
              <div className='font-semibold text-sm'>
                Subject-wise attendance summary
                <span className='bg-blue-600 text-2xs w-fit px-1 rounded-4xl ml-1'>new</span>
              </div>
              <span className='text-2xs text-slate-500 font-semibold'>Detailed attendance of each subject</span>

            </label>
            <button type='button' onClick={() => setOpenSubjectWise(true)} className=' cursor-pointer ml-30 p-2  w-fit rounded-lg'>
              <p className='text-emerald-300 text-sm font-extrabold'>click</p>
            </button>


          </div>
        </div>
      </div>

      {
        openSubjsectWise && (
          <SubjectWiseComponent data={data.subjectwiseSummary} close={() => setOpenSubjectWise(false)} />
        )
      }
      <FooterComponent />
    </section>

  )
}

export default Home