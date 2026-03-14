import { useEffect } from "react"
import { useAppDispatch, useAppSelector } from "../hooks/ReduxHooks"
import { setSelectedMenu } from "../store/Menu"
import { nowDate, nowMonth, nowYear, nowYearMonthDate } from "../constant/date"
import { useNavigate } from "react-router-dom"
import { changeDate, setCurrentDailyJournal, setInit } from "../store/dailyJournal"
import { changeWeekDate, setCurrentWeek, setWeekInit } from "../store/weekJournal"
import { changeMonthDate, setCurrentMonth, setMonthInit } from "../store/monthJournal"
import { changeYearDate, setCurrentYear, setYearInit } from "../store/yearJournal"
import axios from "axios"
import calcStartEndWeekDays from "../func/calcStartEndWeekDays"
import calcPastMonth from "../func/calcPastMonth"
import calcPastYear from "../func/calcPastYear"
import YearMonthDateToDate from "../func/YearMonthDateToDate"

const SelectJournal = () => {

  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const selectedColor = useAppSelector((state) => state.color.color)
  const { userId } = useAppSelector((state) => state.login)
  
  useEffect(() => {
    localStorage.setItem("currentPage", "ジャーナルを作成")
    dispatch(setSelectedMenu("ジャーナルを作成"))
  }, [dispatch])

  const moveDailyJournal = async () => {
    try {
      // DBにアクセス。日付が一致するものがあったらそれを取ってきてstate更新
      // なかったら、初期stateで更新。
      const res = await axios.get("/api/dailyJournal/getTodayJournal", {
        params: {
            userId: userId,
            targetDate: nowYearMonthDate
        }
      })
      if (res.data.length == 0) {
        dispatch(setInit())
        localStorage.setItem("dailyJournalDate", nowYearMonthDate)
        dispatch(changeDate(nowYearMonthDate))
        navigate(`/createJournal/daily`)
      } else if (res.data.length == 1) {
        dispatch(setCurrentDailyJournal(res.data[0]))
        localStorage.setItem("dailyJournalDate", nowYearMonthDate)
        dispatch(changeDate(nowYearMonthDate))
        navigate(`/createJournal/daily`)
      } else {
        return
      }
    } catch (e) {
      console.log(e)
    }
  }

  const moveWeekJournal = async () => {
    // DBにアクセス。開始と終わりが一致するものがあったら、それを取ってきてstate更新
    // なかったら、初期stateで更新
    try {
      const res = await axios.get("/api/weekJournal/getThisWeek", {
        params: {
          userId: userId,
          startDate: YearMonthDateToDate(calcStartEndWeekDays(0)[0], calcStartEndWeekDays(0)[1], calcStartEndWeekDays(0)[2]),
          endDate: YearMonthDateToDate(calcStartEndWeekDays(0)[3], calcStartEndWeekDays(0)[4], calcStartEndWeekDays(0)[5])
        }
      })
      if (res.data.length == 0) {
        dispatch(setWeekInit())
        localStorage.setItem("weekJournalStartDate", YearMonthDateToDate(calcStartEndWeekDays(0)[0], calcStartEndWeekDays(0)[1], calcStartEndWeekDays(0)[2]))
        localStorage.setItem("weekJournalEndDate", YearMonthDateToDate(calcStartEndWeekDays(0)[3], calcStartEndWeekDays(0)[4], calcStartEndWeekDays(0)[5]))
        dispatch(changeWeekDate({ startDate: YearMonthDateToDate(calcStartEndWeekDays(0)[0], calcStartEndWeekDays(0)[1], calcStartEndWeekDays(0)[2]), endDate: YearMonthDateToDate(calcStartEndWeekDays(0)[3], calcStartEndWeekDays(0)[4], calcStartEndWeekDays(0)[5]) }))
        navigate(`/createJournal/week`)
      } else if(res.data.length == 1) {
        dispatch(setCurrentWeek(res.data[0]))
        localStorage.setItem("weekJournalStartDate", YearMonthDateToDate(calcStartEndWeekDays(0)[0], calcStartEndWeekDays(0)[1], calcStartEndWeekDays(0)[2]))
        localStorage.setItem("weekJournalEndDate", YearMonthDateToDate(calcStartEndWeekDays(0)[3], calcStartEndWeekDays(0)[4], calcStartEndWeekDays(0)[5]))
        dispatch(changeWeekDate({ startDate: YearMonthDateToDate(calcStartEndWeekDays(0)[0], calcStartEndWeekDays(0)[1], calcStartEndWeekDays(0)[2]), endDate: YearMonthDateToDate(calcStartEndWeekDays(0)[3], calcStartEndWeekDays(0)[4], calcStartEndWeekDays(0)[5]) }))
        navigate(`/createJournal/week`)
      } else {
        return 
      }
    } catch (e) {
      console.log("moveWeekJournalでエラー", e)
    }
  }

  const moveMonthJournal = async () => {
    // DBにアクセス。日付が一致するものがあったらそれを取ってきてstate更新
    // なかったら、初期stateで更新。
    try {
      const res = await axios.get("/api/monthJournal/getThisMonth", {
        params: {
          userId: userId,
          targetDate: nowYear + "-" + nowMonth + "-01"
        }
      })
      if (res.data.length == 0) {
        dispatch(setMonthInit())
        localStorage.setItem("monthJournalDate", nowYear + "-" + nowMonth)
        dispatch(changeMonthDate(nowYear + "-" + nowMonth))
        navigate(`/createJournal/month`)
      } else if(res.data.length == 1) {
        dispatch(setCurrentMonth(res.data[0]))
        localStorage.setItem("monthJournalDate", nowYear + "-" + nowMonth)
        dispatch(changeMonthDate(nowYear + "-" + nowMonth))
        navigate(`/createJournal/month`)
      } else {
        return 
      }
    } catch(e) {
      console.log("moveMonthJournalでエラー", e)
    }
  }

  const moveYearJournal = async () => {
    // DBにアクセス。日付が一致するものがあったらそれを取ってきてstate更新
    // なかったら、初期stateで更新。
    try {
      const res = await axios.get("/api/yearJournal/getThisYear", {
        params: {
          userId: userId,
          targetDate: nowYear + "-01-01"
        }
      })
      if (res.data.length == 0) {
        dispatch(setYearInit())
        localStorage.setItem("yearJournalDate", nowYear)
        dispatch(changeYearDate(nowYear))
        navigate(`/createJournal/year`)
      } else if(res.data.length == 1) {
        dispatch(setCurrentYear(res.data[0]))
        localStorage.setItem("yearJournalDate", nowYear)
        dispatch(changeYearDate(nowYear))
        navigate(`/createJournal/year`)
      } else {
        return 
      }
    } catch(e) {
      console.log("moveYearJournalでエラー", e)
    }
  }

  return (
    <div className = {`my-6 mx-4 px-4 rounded-xl shadow-lg border-2 bg-white border-gray-500 ${selectedColor == "pink" && "border-pink-500"} border-dashed`}>
      
      <div className = "md:flex justify-center items-start gap-x-10">
        <div 
          data-testid = "daily-button"
          className = {`md:px-8 md:mt-8 md:py-20 cursor-pointer mt-10 border-2 text-gray-700 rounded-2xl shadow-lg flex items-center flex-col gap-y-2 py-10 ${selectedColor == "blue" && "bg-sky-200 border-gray-200 hover:bg-sky-300/80"} ${selectedColor == "whiteBlack" && "bg-gray-200 border-gray-300 hover:bg-gray-400/80"} ${selectedColor == "pink" && "bg-pink-200 border-pink-200 text-pink-700 hover:bg-pink-400/80"} hover:scale-105 transition duration-300`}
          onClick = {() => moveDailyJournal()}
        >
          <p className = "text-2xl">日別 ({nowYear}年 {nowMonth}月 {nowDate}日) の</p>
          <div className = "flex justify-center items-center gap-x-2">
            <p className = "text-2xl">ジャーナルを作成</p>
            <svg className = {`size-7 ${selectedColor !== "pink" && "text-gray-600"} ${selectedColor == "pink" && "text-pink-600"}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
            </svg>
          </div>
        </div>

        <div 
          data-testid = "week-button"
          className = {`md:px-6 md:py-9 cursor-pointer mt-8 border-2 text-white rounded-2xl shadow-lg flex items-center flex-col gap-y-2 py-10 ${selectedColor == "blue" && "bg-lime-500 border-gray-200 hover:bg-lime-600"} ${selectedColor == "whiteBlack" && "bg-gray-500 border-gray-200 hover:bg-gray-600"} ${selectedColor == "pink" && "bg-pink-500 border-pink-200 hover:bg-pink-600"} hover:scale-105 transition duration-300`}
          onClick = {() => moveWeekJournal()}
        >
          <p className = "text-2xl mb-2">週別</p>
          <div className = "flex justify-center text-xl">
            <div className = "mr-4">
              <p className = "text-center mb-1">{calcStartEndWeekDays(0)[0]}年</p>
              <p className = "text-center mb-1">{calcStartEndWeekDays(0)[1]}月 {calcStartEndWeekDays(0)[2]}日</p>
            </div>
            <div className = "text-3xl pt-2">〜</div>
            <div className = "ml-4">
              <p className = "text-center mb-1">{calcStartEndWeekDays(0)[3]}年</p>
              <p className = "text-center mb-1">{calcStartEndWeekDays(0)[4]}月 {calcStartEndWeekDays(0)[5]}日</p>
            </div>
          </div>
          <div className = "flex justify-center items-center gap-x-2 mt-2">
            <p className = "text-2xl">のジャーナルを作成</p>
            <svg className = "size-7" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
            </svg>
          </div>
        </div>
      </div>
      
      <div className = "md:flex justify-center items-start gap-x-10">
        <div 
          data-testid = "month-button"
          className = {`md:px-9 md:py-20 cursor-pointer mt-10 border-2 text-gray-700 rounded-2xl shadow-lg flex items-center flex-col gap-y-2 py-10 ${selectedColor == "blue" && "bg-indigo-200 border-gray-200 hover:bg-indigo-300/80"} ${selectedColor == "whiteBlack" && "bg-gray-200 border-gray-300 hover:bg-gray-400/80"} ${selectedColor == "pink" && "bg-pink-200 border-pink-200 text-pink-700 hover:bg-pink-300/80"} hover:scale-105 transition duration-300`}
          onClick = {() => moveMonthJournal()}
        >
          <p className = "text-2xl">月別 ({calcPastMonth(0)[0]}年 {calcPastMonth(0)[1]}月) の</p>
          <div className = "flex justify-center items-center gap-x-2">
            <p className = "text-2xl">ジャーナルを作成</p>
            <svg className = {`size-7 ${selectedColor !== "pink" && "text-gray-600"} ${selectedColor == "pink" && "text-pink-600"}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
            </svg>
          </div>
        </div>

        <div 
          data-testid = "year-button"
          className = {`md:px-9 md:py-20 cursor-pointer my-10 border-2 text-white rounded-2xl shadow-lg flex items-center flex-col gap-y-2 py-10 ${selectedColor == "blue" && "border-gray-200 bg-rose-500 hover:bg-rose-600/80"} ${selectedColor == "whiteBlack" && "border-gray-200 bg-gray-500 hover:bg-gray-600/80"} ${selectedColor == "pink" && "border-pink-200 bg-pink-500 hover:bg-pink-600/80"} hover:scale-105 transition duration-300`}
          onClick = {() => moveYearJournal()}
        >
          <p className = "text-2xl">年別 ({calcPastYear(0)}年) の</p>
          <div className = "flex justify-center items-center gap-x-2">
            <p className = "text-2xl">ジャーナルを作成</p>
            <svg className = "size-7" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
            </svg>
          </div>
        </div>
      </div>
    
    </div>
  )
}

export default SelectJournal