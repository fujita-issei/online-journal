import { useNavigate } from "react-router-dom"
import { useAppDispatch, useAppSelector } from "../../hooks/ReduxHooks"
import { changeYearDate, setCurrentYear, setYearInit } from "../../store/yearJournal"
import axios from "axios"
import calcDays from "../../func/calcDays"
import checkMonthYearJournalWritten from "../../func/checkMonthYearJournalWritten"

const YearNavi = () => {

    const { targetDate, toDo, toDoCheck, toDoImportant, journal, journalCount, journalLastEditTime, summary } = useAppSelector((state) => state.yearJournal)
    const { userId } = useAppSelector((state) => state.login)
    const navigate = useNavigate()
    const dispatch = useAppDispatch()
    const selectedColor = useAppSelector((state) => state.color.color)
    const yearJournal = useAppSelector((state) => state.yearJournal)

    const saveAndBackPage = async () => {
        // httpリクエストを送って今いる日付のものをDBに保存
        try {
            await axios.post("/api/yearJournal/saveThisYear", {
                userId: userId,
                targetDate: targetDate + "-01-01",
                toDo: toDo,
                toDoCheck: toDoCheck,
                toDoImportant: toDoImportant,
                journal: journal,
                journalCount: journalCount,
                journalLastEditTime: journalLastEditTime,
                summary: summary,
                isWritten: !checkMonthYearJournalWritten(yearJournal)
            })
            dispatch(setYearInit())
            navigate("/createJournal")
        } catch (e) {
            console.log("saveAndBackPageでエラー", e)
        }
    }
    
    const moveLastYear = async () => {
        // httpリクエストを送って、今年分をDBに保存。
        // そして、先年分をDBから取得して、stateを更新
        try {
            await axios.post("/api/yearJournal/saveThisYear", {
                userId: userId,
                targetDate: targetDate + "-01-01",
                toDo: toDo,
                toDoCheck: toDoCheck,
                toDoImportant: toDoImportant,
                journal: journal,
                journalCount: journalCount,
                journalLastEditTime: journalLastEditTime,
                summary: summary,
                isWritten: !checkMonthYearJournalWritten(yearJournal)
            })
            const lastYear = calcDays(targetDate + "-01-01", 1, "-").slice(0, 4)
            const res = await axios.get("/api/yearJournal/getThisYear", {
                params: {
                    userId: userId,
                    targetDate: lastYear + "-01-01"
                }
            })
            if (res.data.length == 0) {
                dispatch(setYearInit())
                localStorage.setItem("yearJournalDate",lastYear)
                dispatch(changeYearDate(lastYear))
            } else if(res.data.length == 1) {
                dispatch(setCurrentYear(res.data[0]))
                localStorage.setItem("yearJournalDate",lastYear)
                dispatch(changeYearDate(lastYear))
            } else {
                return
            }
        } catch (e) {
            console.log("moveLastYearでエラー", e)
        }
    }

    const moveNextYear = async () => {
        // httpリクエストを送って、今年分をDBに保存。
        // そして、昨年分をDBから取得して、stateを更新
        try {
            await axios.post("/api/yearJournal/saveThisYear", {
                userId: userId,
                targetDate: targetDate + "-01-01",
                toDo: toDo,
                toDoCheck: toDoCheck,
                toDoImportant: toDoImportant,
                journal: journal,
                journalCount: journalCount,
                journalLastEditTime: journalLastEditTime,
                summary: summary,
                isWritten: !checkMonthYearJournalWritten(yearJournal)
            })
            const nextYear = calcDays(targetDate + "-12-31", 1, "+").slice(0, 4)
            const res = await axios.get("/api/yearJournal/getThisYear", {
                params: {
                    userId: userId,
                    targetDate: nextYear + "-01-01"
                }
            })
            if (res.data.length == 0) {
                dispatch(setYearInit())
                localStorage.setItem("yearJournalDate",nextYear)
                dispatch(changeYearDate(nextYear))
            } else if(res.data.length == 1) {
                dispatch(setCurrentYear(res.data[0]))
                localStorage.setItem("yearJournalDate",nextYear)
                dispatch(changeYearDate(nextYear))
            } else {
                return
            }
        } catch (e) {
            console.log("moveNextYearでエラー", e)
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
                        data-testid = "lastYear-button"
                        className = {`p-1 cursor-pointer rounded-full ${selectedColor == "blue" && "bg-sky-200/80 hover:bg-sky-300"} ${selectedColor == "whiteBlack" && "bg-gray-200/80 hover:bg-gray-300"} ${selectedColor == "pink" && "bg-pink-200/80 hover:bg-pink-300"} hover:scale-105 transition duration-200`}
                        onClick = {() => moveLastYear()}
                    >
                        <svg className = {`size-7 ${selectedColor == "pink" && "text-pink-600"}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m18.75 4.5-7.5 7.5 7.5 7.5m-6-15L5.25 12l7.5 7.5" />
                        </svg>
                    </div>
                    <div className = "mx-3">
                        <p className = "text-2xl">{targetDate} 年</p>
                    </div>
                    <div 
                        data-testid = "nextYear-button"
                        className = {`p-1 cursor-pointer rounded-full ${selectedColor == "blue" && "bg-sky-200/80 hover:bg-sky-300"} ${selectedColor == "whiteBlack" && "bg-gray-200/80 hover:bg-gray-300"} ${selectedColor == "pink" && "bg-pink-200/80 hover:bg-pink-300"} hover:scale-105 transition duration-200`}
                        onClick = {() => moveNextYear()}
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

export default YearNavi