import { useNavigate } from "react-router-dom"
import { useAppDispatch, useAppSelector } from "../../hooks/ReduxHooks"
import { changeMonthDate, setCurrentMonth, setMonthInit } from "../../store/monthJournal"
import dateToYearMonthDate from "../../func/DateToYearMonthDate"
import axios from "axios"
import calcDays from "../../func/calcDays"
import checkMonthYearJournalWritten from "../../func/checkMonthYearJournalWritten"

const MonthNavi = () => {


    const navigate = useNavigate()
    const dispatch = useAppDispatch()
    const selectedColor = useAppSelector((state) => state.color.color)
    const { targetDate, toDo, toDoCheck, toDoImportant, journal, journalCount, journalLastEditTime, summary } = useAppSelector((state) => state.monthJournal)
    const { userId } = useAppSelector((state) => state.login)
    const monthJournal = useAppSelector((state) => state.monthJournal)

    const saveAndBackPage = async () => {
        // httpリクエストを送って今いる日付のものをDBに保存
        try {
            await axios.post("/api/monthJournal/saveThisMonth", {
                userId: userId,
                targetDate: targetDate + "-01",
                toDo: toDo,
                toDoCheck: toDoCheck,
                toDoImportant: toDoImportant,
                journal: journal,
                journalCount: journalCount,
                journalLastEditTime: journalLastEditTime,
                summary: summary,
                isWritten: !checkMonthYearJournalWritten(monthJournal)
            })
            dispatch(setMonthInit())
            navigate("/createJournal")
        } catch (e) {
            console.log("saveAndBackPageでエラー", e)
        }
    }
    
    const moveLastMonth = async () => {
        // httpリクエストを送って、今月分をDBに保存。
        // そして、先月分をDBから取得して、stateを更新
        try {
            await axios.post("/api/monthJournal/saveThisMonth", {
                userId: userId,
                targetDate: targetDate + "-01",
                toDo: toDo,
                toDoCheck: toDoCheck,
                toDoImportant: toDoImportant,
                journal: journal,
                journalCount: journalCount,
                journalLastEditTime: journalLastEditTime,
                summary: summary,
                isWritten: !checkMonthYearJournalWritten(monthJournal)
            })
            const lastMonth = calcDays(targetDate + "-01", 1, "-").slice(0, 7)
            const res = await axios.get("/api/monthJournal/getThisMonth", {
                params: {
                    userId: userId,
                    targetDate: lastMonth + "-01"
                }
            })
            if (res.data.length == 0) {
                dispatch(setMonthInit())
                localStorage.setItem("monthJournalDate",lastMonth)
                dispatch(changeMonthDate(lastMonth))
            } else if(res.data.length == 1) {
                dispatch(setCurrentMonth(res.data[0]))
                localStorage.setItem("monthJournalDate",lastMonth)
                dispatch(changeMonthDate(lastMonth))
            } else {
                return
            }
        } catch (e) {
            console.log("moveLastMonthでエラー", e)
        }
    }

    const moveNextMonth = async () => {
        // httpリクエストを送って、今月分をDBに保存。
        // そして、来月分をDBから取得して、stateを更新
        try {
            await axios.post("/api/monthJournal/saveThisMonth", {
                userId: userId,
                targetDate: targetDate + "-01",
                toDo: toDo,
                toDoCheck: toDoCheck,
                toDoImportant: toDoImportant,
                journal: journal,
                journalCount: journalCount,
                journalLastEditTime: journalLastEditTime,
                summary: summary,
                isWritten: !checkMonthYearJournalWritten(monthJournal)
            })
            const nextMonth = calcDays(targetDate + "-01", 32, "+").slice(0, 7)
            const res = await axios.get("/api/monthJournal/getThisMonth", {
                params: {
                    userId: userId,
                    targetDate: nextMonth + "-01"
                }
            })
            if (res.data.length == 0) {
                dispatch(setMonthInit())
                localStorage.setItem("monthJournalDate",nextMonth)
                dispatch(changeMonthDate(nextMonth))
            } else if(res.data.length == 1) {
                dispatch(setCurrentMonth(res.data[0]))
                localStorage.setItem("monthJournalDate",nextMonth)
                dispatch(changeMonthDate(nextMonth))
            } else {
                return
            }
        } catch (e) {
            console.log("moveNextMonthでエラー", e)
        }
    }
    
    return (
        <div>
            <div className = "flex justify-start items-center ml-3 mt-4 gap-x-4">
                <div 
                    data-testid = "save-button"
                    className = {`border-2 cursor-pointer shadow-lg rounded-lg p-1 ${selectedColor !== "pink" && "border-gray-500 bg-gray-300 hover:bg-gray-400"} ${selectedColor == "pink" && "border-pink-500 bg-pink-300 hover:bg-pink-400"} hover:scale-105 transition duration-200`}
                    onClick = {() => saveAndBackPage()}
                >
                    <svg className = {`size-8 ${selectedColor == "pink" && "text-pink-600"}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3" />
                    </svg>
                </div>
                <div className = {`flex justify-center items-center border-2 ${selectedColor !== "pink" && "border-gray-400"} ${selectedColor == "pink" && "border-pink-400"} bg-white rounded-lg shadow-lg px-2 py-2 gap-x-2`}>
                    <div 
                        data-testid = "lastMonth-button"
                        className = {`p-1 cursor-pointer rounded-full ${selectedColor == "blue" && "bg-sky-200/80 hover:bg-sky-300"} ${selectedColor == "whiteBlack" && "bg-gray-200/80 hover:bg-gray-300"} ${selectedColor == "pink" && "bg-pink-200/80 hover:bg-pink-300"} hover:scale-105 transition duration-200`}
                        onClick = {() => moveLastMonth()}
                    >
                        <svg className = {`size-7 ${selectedColor == "pink" && "text-pink-600"}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m18.75 4.5-7.5 7.5 7.5 7.5m-6-15L5.25 12l7.5 7.5" />
                        </svg>
                    </div>
                    <div className = "mx-3">
                        <p className = "text-2xl">{dateToYearMonthDate(targetDate + "-01")[0]} 年 {dateToYearMonthDate(targetDate + "-01")[1]} 月</p>
                    </div>
                    <div 
                        data-testid = "nextMonth-button"
                        className = {`p-1 cursor-pointer rounded-full ${selectedColor == "blue" && "bg-sky-200/80 hover:bg-sky-300"} ${selectedColor == "whiteBlack" && "bg-gray-200/80 hover:bg-gray-300"} ${selectedColor == "pink" && "bg-pink-200/80 hover:bg-pink-300"} hover:scale-105 transition duration-200`}
                        onClick = {() => moveNextMonth()}
                    >
                        <svg className = {`size-7 ${selectedColor == "pink" && "text-pink-600"}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m5.25 4.5 7.5 7.5-7.5 7.5m6-15 7.5 7.5-7.5 7.5" />
                        </svg>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default MonthNavi