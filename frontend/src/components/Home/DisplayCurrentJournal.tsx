import { useNavigate } from "react-router-dom"
import { nowYearMonthDate } from "../../constant/date"
import calcDays from "../../func/calcDays"
import calcPastMonth from "../../func/calcPastMonth"
import calcPastYear from "../../func/calcPastYear"
import calcStartEndWeekDays from "../../func/calcStartEndWeekDays"
import dateToYearMonthDate from "../../func/DateToYearMonthDate"
import { useAppDispatch, useAppSelector } from "../../hooks/ReduxHooks"
import axios from "axios"
import { changeDate, setCurrentDailyJournal, setInit } from "../../store/dailyJournal"
import { changeWeekDate, setCurrentWeek, setWeekInit } from "../../store/weekJournal"
import YearMonthDateToDate from "../../func/YearMonthDateToDate"
import { changeMonthDate, setCurrentMonth, setMonthInit } from "../../store/monthJournal"
import { changeYearDate, setCurrentYear, setYearInit } from "../../store/yearJournal"

// 最近のジャーナルを表示するUIを構築するコンポーネント
const DisplayCurrentJournal = () => {

    const selectedColor = useAppSelector((state) => state.color.color)
    const { userId } = useAppSelector((state) => state.login)
    const dispatch = useAppDispatch()
    const navigate = useNavigate()
    const displayDate = (numberOfDays: number) => {
        return dateToYearMonthDate(calcDays(nowYearMonthDate, numberOfDays, "-"))
    }

    const moveDailyJournal = async (targetDate: string) => {
        try {
            // DBにアクセス。日付が一致するものがあったらそれを取ってきてstate更新
            // なかったら、初期stateで更新。
            const res = await axios.get("/api/dailyJournal/getTodayJournal", {
                params: {
                    userId: userId,
                    targetDate: targetDate
                }
            })
            if (res.data.length == 0) {
                dispatch(setInit())
                localStorage.setItem("dailyJournalDate", targetDate)
                dispatch(changeDate(targetDate))
                navigate(`/createJournal/daily`)
            } else if (res.data.length == 1) {
                dispatch(setCurrentDailyJournal(res.data[0]))
                localStorage.setItem("dailyJournalDate", targetDate)
                dispatch(changeDate(targetDate))
                navigate(`/createJournal/daily`)
            } else {
                return
            }
        } catch (e) {
            console.log(e)
        }
    }

    const moveWeekJournal = async (startDate: string, endDate: string) => {
        // DBにアクセス。開始と終わりが一致するものがあったら、それを取ってきてstate更新
        // なかったら、初期stateで更新
        try {
            const res = await axios.get("/api/weekJournal/getThisWeek", {
                params: {
                    userId: userId,
                    startDate: startDate,
                    endDate: endDate
                }
            })
            if (res.data.length == 0) {
                dispatch(setWeekInit())
                localStorage.setItem("weekJournalStartDate", startDate)
                localStorage.setItem("weekJournalEndDate", endDate)
                dispatch(changeWeekDate({ startDate: startDate, endDate: endDate }))
                navigate(`/createJournal/week`)
            } else if(res.data.length == 1) {
                dispatch(setCurrentWeek(res.data[0]))
                localStorage.setItem("weekJournalStartDate", startDate)
                localStorage.setItem("weekJournalEndDate", endDate)
                dispatch(changeWeekDate({ startDate: startDate, endDate: endDate }))
                navigate(`/createJournal/week`)
            } else {
                return 
            }
        } catch (e) {
            console.log("moveWeekJournalでエラー", e)
        }
    }

    const moveMonthJournal = async (targetDate: string) => {
        // DBにアクセス。日付が一致するものがあったらそれを取ってきてstate更新
        // なかったら、初期stateで更新。
        try {
            const res = await axios.get("/api/monthJournal/getThisMonth", {
                params: {
                    userId: userId,
                    targetDate: targetDate + "-01"
                }
            })
            if (res.data.length == 0) {
                dispatch(setMonthInit())
                localStorage.setItem("monthJournalDate", targetDate)
                dispatch(changeMonthDate(targetDate))
                navigate(`/createJournal/month`)
            } else if(res.data.length == 1) {
                dispatch(setCurrentMonth(res.data[0]))
                localStorage.setItem("monthJournalDate", targetDate)
                dispatch(changeMonthDate(targetDate))
                navigate(`/createJournal/month`)
            } else {
                return 
            }
        } catch(e) {
            console.log("moveMonthJournalでエラー", e)
        }
    }

    const moveYearJournal = async (targetDate: string) => {
        // DBにアクセス。日付が一致するものがあったらそれを取ってきてstate更新
        // なかったら、初期stateで更新。
        try {
        const res = await axios.get("/api/yearJournal/getThisYear", {
            params: {
                userId: userId,
                targetDate: targetDate + "-01-01"
            }
        })
        if (res.data.length == 0) {
            dispatch(setYearInit())
            localStorage.setItem("yearJournalDate", targetDate)
            dispatch(changeYearDate(targetDate))
            navigate(`/createJournal/year`)
        } else if(res.data.length == 1) {
            dispatch(setCurrentYear(res.data[0]))
            localStorage.setItem("yearJournalDate", targetDate)
            dispatch(changeYearDate(targetDate))
            navigate(`/createJournal/year`)
        } else {
            return 
        }
        } catch(e) {
        console.log("moveYearJournalでエラー", e)
        }
    }

    return (
    <>
        <div className = "md:flex justify-center items-center">
            {/* 最近の日別ジャーナルを表示する */}
            <div className = {`md:px-4 mt-10 mx-4 pt-4 pb-6 border-2 rounded-lg shadow-lg ${selectedColor == "blue" && "bg-sky-200"} ${selectedColor == "whiteBlack" && "bg-gray-200"} ${selectedColor == "pink" && "bg-pink-200"} border-gray-100`}>
                <div className = "md:px-4 md:py-2 mb-6 mx-8 py-1 rounded-md shadow-md bg-white border border-gray-100">
                    <h2 className = "text-center text-gray-600 text-lg">最近の日別ジャーナル</h2>
                </div>
                <div className = "grid justify-center grid-cols-2 gap-x-4 gap-y-2 px-4">
                    <div 
                        data-testid = "move-daily-button"
                        className = {`border-2 cursor-pointer rounded-lg shadow-md px-2 py-1 ${selectedColor == "blue" && "bg-sky-50 border-sky-400 hover:bg-sky-300 hover:scale-105 transition duration-100"}  ${selectedColor == "whiteBlack" && "bg-gray-50 border-gray-400 hover:bg-gray-300 hover:scale-105 transition duration-100"} ${selectedColor == "pink" && "bg-pink-50 border-pink-400 hover:bg-pink-300 hover:scale-105 transition duration-100"}`}
                        onClick = {() => moveDailyJournal(calcDays(nowYearMonthDate, 1, "-"))}
                    >
                        <p className = "text-center mb-1 text-gray-500">{displayDate(1)[0]}年</p>
                        <p className = "text-center text-gray-500">{displayDate(1)[1]}月 {displayDate(1)[2]}日</p>
                    </div>
                    <div 
                        className = {`border-2 cursor-pointer rounded-lg shadow-md px-2 py-1 ${selectedColor == "blue" && "bg-sky-50 border-sky-400 hover:bg-sky-300 hover:scale-105 transition duration-100"}  ${selectedColor == "whiteBlack" && "bg-gray-50 border-gray-400 hover:bg-gray-300 hover:scale-105 transition duration-100"} ${selectedColor == "pink" && "bg-pink-50 border-pink-400 hover:bg-pink-300 hover:scale-105 transition duration-100"}`}
                        onClick = {() => moveDailyJournal(calcDays(nowYearMonthDate, 2, "-"))}
                    >
                        <p className = "text-center mb-1 text-gray-500">{displayDate(2)[0]}年</p>
                        <p className = "text-center text-gray-500">{displayDate(2)[1]}月 {displayDate(2)[2]}日</p>
                    </div>
                    <div 
                        className = {`border-2 cursor-pointer rounded-lg shadow-md px-2 py-1 ${selectedColor == "blue" && "border-sky-100 bg-sky-500/80 hover:bg-sky-600/80"} ${selectedColor == "whiteBlack" && "border-gray-100 bg-gray-600/80 hover:bg-gray-700/80"} ${selectedColor == "pink" && "border-pink-100 bg-pink-500/80 hover:bg-pink-600/80"} hover:scale-105 transition duration-100`}
                        onClick = {() => moveDailyJournal(calcDays(nowYearMonthDate, 3, "-"))}
                    >
                        <p className = "text-center mb-1 text-white">{displayDate(3)[0]}年</p>
                        <p className = "text-center text-white">{displayDate(3)[1]}月 {displayDate(3)[2]}日</p>
                    </div>
                    <div 
                        className = {`border-2 cursor-pointer rounded-lg shadow-md px-2 py-1 ${selectedColor == "blue" && "border-sky-100 bg-sky-500/80 hover:bg-sky-600/80"} ${selectedColor == "whiteBlack" && "border-gray-100 bg-gray-600/80 hover:bg-gray-700/80"} ${selectedColor == "pink" && "border-pink-100 bg-pink-500/80 hover:bg-pink-600/80"} hover:scale-105 transition duration-100`}
                        onClick = {() => moveDailyJournal(calcDays(nowYearMonthDate, 4, "-"))}
                    >
                        <p className = "text-center mb-1 text-white">{displayDate(4)[0]}年</p>
                        <p className = "text-center text-white">{displayDate(4)[1]}月 {displayDate(4)[2]}日</p>
                    </div>
                </div>
            </div>

            {/* 最近の週別ジャーナルを表示する */}
            <div className = {`md:px-4 mt-10 mx-4 pt-4 pb-6 border-2 rounded-lg shadow-lg ${selectedColor == "blue" && "bg-indigo-200/90 border-gray-100"}  ${selectedColor == "whiteBlack" && "bg-gray-200 border-gray-100"} ${selectedColor == "pink" && "bg-pink-200 border-gray-100"}`}>
                <div className = "md:px-4 mb-6 mx-8 py-1 rounded-md shadow-md bg-white border border-gray-100">
                    <h2 className = "text-center text-gray-600 text-lg">最近の週別ジャーナル</h2>
                </div> 
                <div className = "grid justify-center grid-cols-1 gap-y-4 px-4">
                    <div 
                        data-testid = "move-week-button"
                        className = {`flex cursor-pointer justify-center border-2 rounded-lg shadow-md px-2 py-1 ${selectedColor == "blue" && "border-indigo-400 bg-indigo-50 hover:bg-indigo-300"} ${selectedColor == "whiteBlack" && "border-gray-400 bg-gray-50 hover:bg-gray-300"} ${selectedColor == "pink" && "border-pink-400 bg-pink-50 hover:bg-pink-300"}  hover:scale-105 transition duration-100`}
                        onClick = {() => moveWeekJournal(YearMonthDateToDate(calcStartEndWeekDays(1)[0], calcStartEndWeekDays(1)[1], calcStartEndWeekDays(1)[2]), YearMonthDateToDate(calcStartEndWeekDays(1)[3], calcStartEndWeekDays(1)[4], calcStartEndWeekDays(1)[5]))}
                    >
                        <div className = "mr-4">
                            <p className = "text-center mb-1 text-gray-500">{calcStartEndWeekDays(1)[0]}年</p>
                            <p className = "text-center text-gray-500">{calcStartEndWeekDays(1)[1]}月 {calcStartEndWeekDays(1)[2]}日</p>
                        </div>
                        <div className = "text-3xl pt-2 text-gray-600">〜</div>
                        <div className = "ml-4">
                            <p className = "text-center mb-1 text-gray-500">{calcStartEndWeekDays(1)[3]}年</p>
                            <p className = "text-center text-gray-500">{calcStartEndWeekDays(1)[4]}月 {calcStartEndWeekDays(1)[5]}日</p>
                        </div>
                    </div>
                    <div 
                        className = {`flex cursor-pointer justify-center border-2 rounded-lg shadow-md px-2 py-1 ${selectedColor == "blue" && "border-sky-100 bg-indigo-400 hover:bg-indigo-500/80"} ${selectedColor == "whiteBlack" && "border-gray-100 bg-gray-500 hover:bg-gray-600/80"} ${selectedColor == "pink" && "border-pink-100 bg-pink-400 hover:bg-pink-500/80"} hover:scale-105 transition duration-100`}
                        onClick = {() => moveWeekJournal(YearMonthDateToDate(calcStartEndWeekDays(2)[0], calcStartEndWeekDays(2)[1], calcStartEndWeekDays(2)[2]), YearMonthDateToDate(calcStartEndWeekDays(2)[3], calcStartEndWeekDays(2)[4], calcStartEndWeekDays(2)[5]))}
                    >
                        <div className = "mr-4">
                            <p className = "text-center mb-1 text-white">{calcStartEndWeekDays(2)[0]}年</p>
                            <p className = "text-center text-white">{calcStartEndWeekDays(2)[1]}月 {calcStartEndWeekDays(2)[2]}日</p>
                        </div>
                        <div className = "text-3xl pt-2 text-white">〜</div>
                        <div className = "ml-4">
                            <p className = "text-center mb-1 text-white">{calcStartEndWeekDays(2)[3]}年</p>
                            <p className = "text-center text-white">{calcStartEndWeekDays(2)[4]}月 {calcStartEndWeekDays(2)[5]}日</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div className = "md:flex justify-center items-start">
            {/* 最近の月別ジャーナルを表示する */}
            <div className = {`md:px-8 mt-10 mx-4 pt-4 pb-6 border-2 rounded-lg shadow-lg ${selectedColor == "blue" && "bg-lime-200/90 border-gray-100"} ${selectedColor == "whiteBlack" && "bg-gray-200 border-gray-100"} ${selectedColor == "pink" && "bg-pink-200 border-pink-100"}`}>
                <div className = "mb-6 mx-8 py-1 rounded-md shadow-md bg-white border border-gray-100">
                    <h2 className = "text-center text-gray-600 text-lg">最近の月別ジャーナル</h2>
                </div> 
                <div className = "grid grid-cols-2 justify-center gap-x-6 px-4">
                    <div 
                        data-testid = "move-month-button"
                        className = {`border-2 cursor-pointer rounded-lg shadow-md px-2 py-1 ${selectedColor == "blue" && "bg-lime-50 border-green-400 hover:bg-lime-300"} ${selectedColor == "whiteBlack" && "bg-gray-50 border-gray-400 hover:bg-gray-300"} ${selectedColor == "pink" && "bg-pink-50 border-pink-400 hover:bg-pink-300"} hover:scale-105 transition duration-100`}
                        onClick = {() => moveMonthJournal(calcPastMonth(1)[0] + "-" + calcPastMonth(1)[1])}
                    >
                            <p className = "text-center mb-1 text-gray-500">{calcPastMonth(1)[0]}年</p>
                            <p className = "text-center text-gray-500">{calcPastMonth(1)[1]}月</p>
                    </div>
                    <div 
                        className = {`border-2 cursor-pointer rounded-lg shadow-md px-2 py-1 ${selectedColor == "blue" && "border-sky-100 bg-lime-500 hover:bg-lime-600/80"} ${selectedColor == "whiteBlack" && "border-gray-100 bg-gray-500 hover:bg-gray-600/80"} ${selectedColor == "pink" && "border-pink-100 bg-pink-400 hover:bg-pink-500/80"} hover:scale-105 transition duration-100`}
                        onClick = {() => moveMonthJournal(calcPastMonth(2)[0] + "-" + calcPastMonth(2)[1])}
                    >
                            <p className = "text-center mb-1 text-white">{calcPastMonth(2)[0]}年</p>
                            <p className = "text-center text-white">{calcPastMonth(2)[1]}月</p>
                    </div>
                </div>
            </div>

            {/* 最近の年別ジャーナルを表示する */}
            <div className = {`md:px-8 md:pb-10 md:pt-6 mt-10 mb-6 mx-4 pt-4 pb-6 border-2 rounded-lg shadow-lg ${selectedColor == "blue" && "bg-lime-200/90 border-gray-100"} ${selectedColor == "whiteBlack" && "bg-gray-200 border-gray-100"} ${selectedColor == "pink" && "bg-pink-200 border-pink-100"} `}>
                <div className = "mb-6 mx-8 py-1 rounded-md shadow-md bg-white border border-gray-100">
                    <h2 className = "text-center text-gray-600 text-lg">最近の年別ジャーナル</h2>
                </div> 
                <div className = "grid grid-cols-2 justify-center gap-x-6 px-4">
                    <div 
                        data-testid = "move-year-button"
                        className = {`border-2 cursor-pointer rounded-lg shadow-md px-2 py-1 ${selectedColor == "blue" && "border-green-400 bg-lime-50 hover:bg-lime-300"} ${selectedColor == "whiteBlack" && "border-gray-400 bg-gray-50 hover:bg-gray-300"} ${selectedColor == "pink" && "border-pink-400 bg-pink-50 hover:bg-pink-300"} hover:scale-105 transition duration-100`}
                        onClick = {() => moveYearJournal(calcPastYear(1))}
                    >
                        <p className = "text-center text-gray-500">{calcPastYear(1)}年</p>
                    </div>
                    <div 
                        className = {`border-2 cursor-pointer rounded-lg shadow-md px-2 py-1 ${selectedColor == "blue" && "border-sky-100 bg-lime-500 hover:bg-lime-600/80"} ${selectedColor == "whiteBlack" && "border-gray-100 bg-gray-500 hover:bg-gray-600/80"} ${selectedColor == "pink" && "border-pink-100 bg-pink-500 hover:bg-pink-600/80"} hover:scale-105 transition duration-100`}
                        onClick = {() => moveYearJournal(calcPastYear(2))}
                    >
                        <p className = "text-center mb-1 text-white">{calcPastYear(2)}年</p>
                    </div>
                </div>
            </div>
        </div>
        
    </>
    )
}

export default DisplayCurrentJournal