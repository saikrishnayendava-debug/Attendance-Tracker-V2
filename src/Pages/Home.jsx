import React, { useEffect, useState } from 'react'
import Header from '../Components/Header'
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css'
import axios from 'axios'
import ToastNotification from '../Components/ToastNotification';
import { showToast } from '../Components/ToastNotification';
import Loading from '../Components/Loading'
import attendenceCalculator from '../utils/main'
import { attendencePerform, getSundays } from '../utils/utils'
import { useNavigate } from 'react-router-dom'
import getAttendanceCounts from '../utils/helper'
import FooterComponent from '../Components/FooterComponent'
import getAttendanceTotals from '../utils/getAttendanceTotals'
import attendanceTarget from '../utils/AttendanceTarget'
import { getAttendanceTodayArray } from '../utils/attendanceTodayArray'
const Home = () => {
  const navigate = useNavigate()
  const [data, setData] = useState({
    present: '',
    held: '',
    leaves: [],
    holidays: [],
    hours_can_skip: "",
    hours_needed: "",
    total_percentage: ""
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

    console.log(tempCnt)
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
    const url = `https://apis-whpx.onrender.com/attendance?student_id=${redgNo}&password=${password}`

  // const url1 = `https://attendance-4dtj.onrender.com/api/attendance?student_id=${redgNo}&password=${password}`
  // const url2 = `https://vignanattendancescraping.onrender.com/attendance?regno=${redgNo}&password=${password}`

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
        total_percentage: response.data.total_info?.total_percentage || ''
      }));
      const result = getAttendanceCounts(response.data)

      setCnt(result)
      console.log("cnt" + result)
      const todayData = getAttendanceTodayArray(response.data);
      setTodayPeriodsPosted(todayData);

    } catch (error) {
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
          total_percentage: parsedData.total_info?.total_percentage || ''
        }));

        const result = getAttendanceCounts(parsedData);
        setCnt(result);

        const todayData = getAttendanceTodayArray(parsedData);
        setTodayPeriodsPosted(todayData);

        showToast("Poor internet connection");
      } else {
        showToast("Invalid details");
      }

    }
    finally {
      setLoading(false);
    }
  }



  useEffect(() => {
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

    <section className='bg-[#1a0f20] text-slate-200 min-h-screen'>
      <ToastNotification />
      <Header />

      <div className='mt-4 mx-1 flex items-center justify-around'>
        <div className=' bg-pink-800 h-13 min-h-13 max-h-13  rounded py-1  font-bold text-sm '>

          {
            totalPercentage >= 75 ? (
              <div className='flex flex-col items-center justify-center px-4 w-40'>
                <div>Periods can skip</div>
                <div>{hoursCanSkip}</div>
              </div>
            ) : (
              <div className='flex flex-col items-center justify-center px-4 w-40'>
                <div>Periods to attend</div>
                <div>{hoursNeeded}</div>
              </div>
            )
          }


        </div>
        <div className='bg-purple-950 h-13 min-h-13 max-h-13 rounded py-1 font-semibold text-sm w-40 flex flex-col items-center justify-center'>
          <div>Present attendance</div>
          <div>
            {data.total_percentage
              ? data.total_percentage
              : JSON.parse(localStorage.getItem("latestAttendanceData"))?.total_info?.total_percentage || 0}
          </div>
        </div>

      </div>


      <div className='top-0 bottom-0 left-0 right-0 flex justify-center mt-10'>

        <div className='border border-purple-950 shadow rounded-3xl w-105'>
          <form className='grid p-5 rounded-3xl gap-6 bg-[#111214]' onSubmit={handleSubmit}>
            <div className='font-semibold text-2xl text-slate-200'>Hi, {localStorage.getItem("redgNo")}</div>
            <div className='grid grid-cols-2 gap-2'>
              <label htmlFor="present" className='font-semibold  text-sm'>
                Number of periods attended
              </label>
              <input
                type='number'
                id='present'

                className='border bg-[#1a0f20] border-purple-900 rounded px-2 py-1  text-sm text-center'
                name='present'
                value={data.present}
                readOnly
                required
                onChange={handleOnChange}
              />
            </div>


            <div className='grid grid-cols-2 gap-2'>
              <label htmlFor="held" className='font-semibold  text-sm'>
                Number of periods held
              </label>
              <input
                type='number'
                id='held'
                readOnly
                className='border bg-[#1a0f20] border-purple-900 text-center rounded px-2 py-1  text-sm'
                name='held'
                value={data.held}
                required
                onChange={handleOnChange}
              />
            </div>
            <div>
              <div className='text-center text-xs mb-1'>Today attendance status</div>
              <div className='flex gap-2 items-center flex-wrap'>
                {todayPeriodsPosted?.map((item, index) => (
                  item.message ? (
                    <p key={index}>{item.message}</p>
                  ) : (
                    <div key={index} className={`${item.attendance_today?.trim().toUpperCase().includes("A")? 'bg-red-700' : 'bg-green-700'}  rounded flex gap-1 font-bold px-0.5 text-sm`}>
                      <span>{item.subject}:</span>
                      <span>{item.attendance_today}</span>
                    </div>
                  )
                ))}
              </div>
            </div>

            <div>
              <h1 className='text-center font-bold m-2'>Select period to bunk today</h1>
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
            ${isSelected ? 'bg-blue-400' : 'bg-pink-500'} 
            text-slate-200 w-6 h-6 rounded flex justify-center items-center font-semibold 
            ${isDisabled ? 'opacity-20 cursor-not-allowed' : 'cursor-pointer'}
          `}
                    >
                      {index + 1}
                    </button>
                  );
                })}
              </div>
            </div>


            <div className='grid grid-cols-2 gap-2'>
              <label className='font-semibold text-sm'>Leave dates</label>
              <button type='button' onClick={() => setShowLeaveCalendar(!showLeaveCalendar)} className='border bg-gray-800 border-gray-50 cursor-pointer rounded py-1 font-semibold text-sm w-25'>{
                showLeaveCalendar ? "Submit" : "Calender"
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


            <div className='grid grid-cols-2 gap-2'>
              <label className='font-semibold text-sm'>Holiday dates</label>
              <button type='button' onClick={() => setShowHolidayCalendar(!showHolidayCalendar)} className='border bg-gray-800 border-gray-50 cursor-pointer rounded py-1 font-semibold text-sm w-25'>{
                showHolidayCalendar ? "Submit" : "Calender"
              }</button>
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
            <div>
              <button type='button' onClick={fetchAttendance} className={`relative cursor-pointer bg-pink-800 rounded py-2 font-semibold text-sm w-full flex items-center justify-center overflow-hidden`}
                disabled={loading}>
                {loading && (
                  <span className="absolute left-0 top-0 h-full w-full bg-gray-600 animate-pulse opacity-90"></span>
                )}
                <span className={`relative ${loading ? " " : "text-white"}`}>
                  {loading ? "Fetching..." : "Fetch Attendance"}
                </span>
              </button>
              <p className='text-xs ml-0 mt-1'>Last updated: {lastUpdated}</p>
            </div>

            <div className='grid grid-cols-2 gap-3'>
              <button type='submit' className='cursor-pointer bg-purple-950  rounded py-2 font-semibold text-sm mt- '>
                Submit
              </button>
              <button type='button' onClick={handleReset} className='cursor-pointer bg-purple-950 rounded py-2 font-semibold text-sm mt- '>
                Reset
              </button>
            </div>
          </form>
        </div>
      </div>
      <div className='mt-10 mb-7'>
        <h1 className='text-center text-2xl font-bold text-slate-400'>Attendance as per data</h1>
      </div>
      <div className='flex flex-col items-center justify-center gap-2'>
        {

          attendanceArray?.map((item, index) => {
            return (
              <div key={index} className={`w-70 sm:w-150  ${item.absent ? "" : "bg-[rgba(10, 44, 17, 0.517)]"} ${item.absent ? "text-red-200" : "text-green-200"}  ${item.absent ? "border border-red-600" : "border border-green-400"} py-1.5 shadow font-bold flex justify-around text-sm`}>
                <p>{item.day} th</p>
                <p>{item.attendence}</p>
                <p>{item.absent ? "Absent" : "Present"}</p>
              </div>
            )
          })

        }
      </div>
      <FooterComponent />
    </section>

  )
}

export default Home
