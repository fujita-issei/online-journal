import { useNavigate } from "react-router-dom"
import { useAppDispatch, useAppSelector } from "../../hooks/ReduxHooks"
import { changeWeekDate, setCurrentWeek, setWeekInit } from "../../store/weekJournal"
import axios from "axios"
import calcDays from "../../func/calcDays"
import dateToYearMonthDate from "../../func/DateToYearMonthDate"
import checkWeekJournalWritten from "../../func/checkWeekJournalWritten"

const WeekNavi = () => {

    const { startDate, endDate, toDo, toDoCheck, toDoImportant, journal, journalCount, journalLastEditTime, summary } = useAppSelector((state) => state.weekJournal)
    const navigate = useNavigate()
    const dispatch = useAppDispatch()
    const selectedColor = useAppSelector((state) => state.color.color)
    const { userId } = useAppSelector((state) => state.login)
    const weekJournal = useAppSelector((state) => state.weekJournal)

    const saveAndBackPage = async () => {
        // httpリクエストを送って今いる日付のものをDBに保存
        try {
            await axios.post("/api/weekJournal/saveThisWeek", {
                userId: userId,
                startDate: startDate,
                endDate: endDate,
                toDo: toDo,
                toDoCheck: toDoCheck,
                toDoImportant: toDoImportant,
                journal: journal,
                journalCount: journalCount,
                journalLastEditTime: journalLastEditTime,
                summary: summary,
                isWritten: !checkWeekJournalWritten(weekJournal)
            })
            dispatch(setWeekInit())
            navigate("/createJournal")
        } catch(e) {
            console.log("moveLastWeekでの保存失敗エラー", e)
        }
    }

    const moveLastWeek = async () => {
        // httpリクエストを送って、今週分をDBに保存。
        // そして、先週分をDBから取得して、stateを更新
        try {
            await axios.post("/api/weekJournal/saveThisWeek", {
                userId: userId,
                startDate: startDate,
                endDate: endDate,
                toDo: toDo,
                toDoCheck: toDoCheck,
                toDoImportant: toDoImportant,
                journal: journal,
                journalCount: journalCount,
                journalLastEditTime: journalLastEditTime,
                summary: summary,
                isWritten: !checkWeekJournalWritten(weekJournal)
            })
            const startLastWeek = calcDays(startDate, 7, "-")
            const endLastWeek = calcDays(endDate, 7, "-")
            const res = await axios.get("/api/weekJournal/getThisWeek", {
                params: {
                    userId: userId,
                    startDate: startLastWeek,
                    endDate: endLastWeek
                }
            })
            if (res.data.length == 0) {
                dispatch(setWeekInit())
                localStorage.setItem("weekJournalStartDate",startLastWeek)
                localStorage.setItem("weekJournalEndDate", endLastWeek)
                dispatch(changeWeekDate({ startDate: startLastWeek, endDate: endLastWeek }))
            } else if(res.data.length == 1) {
                dispatch(setCurrentWeek(res.data[0]))
                localStorage.setItem("weekJournalStartDate",startLastWeek)
                localStorage.setItem("weekJournalEndDate", endLastWeek)
                dispatch(changeWeekDate({ startDate: startLastWeek, endDate: endLastWeek }))
            } else {
                return
            }
        } catch (e) {
            console.log("moveLastWeekでエラー", e)
        }
    }

    const moveNextWeek = async () => {
        // httpリクエストを送って、今週分をDBに保存
        // 次週分をDBから取ってきて、stateを更新
        try {
            await axios.post("/api/weekJournal/saveThisWeek", {
                userId: userId,
                startDate: startDate,
                endDate: endDate,
                toDo: toDo,
                toDoCheck: toDoCheck,
                toDoImportant: toDoImportant,
                journal: journal,
                journalCount: journalCount,
                journalLastEditTime: journalLastEditTime,
                summary: summary,
                isWritten: !checkWeekJournalWritten(weekJournal)
            })
            const startNextWeek = calcDays(startDate, 7, "+")
            const endNextWeek = calcDays(endDate, 7, "+")
            const res = await axios.get("/api/weekJournal/getThisWeek", {
                params: {
                    userId: userId,
                    startDate: startNextWeek,
                    endDate: endNextWeek
                }
            })
            if (res.data.length == 0) {
                dispatch(setWeekInit())
                localStorage.setItem("weekJournalStartDate",startNextWeek)
                localStorage.setItem("weekJournalEndDate", endNextWeek)
                dispatch(changeWeekDate({ startDate: startNextWeek, endDate: endNextWeek }))
            } else if(res.data.length == 1) {
                dispatch(setCurrentWeek(res.data[0]))
                localStorage.setItem("weekJournalStartDate",startNextWeek)
                localStorage.setItem("weekJournalEndDate", endNextWeek)
                dispatch(changeWeekDate({ startDate: startNextWeek, endDate: endNextWeek }))
            } else {
                return
            }
        } catch (e) {
            console.log("moveNextWeekでエラー", e)
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
                        data-testid = "lastWeek-button"
                        className = {`p-1 cursor-pointer rounded-full ${selectedColor == "blue" && "bg-sky-200/80 hover:bg-sky-300"} ${selectedColor == "whiteBlack" && "bg-gray-200/80 hover:bg-gray-300"} ${selectedColor == "pink" && "bg-pink-200/80 hover:bg-pink-300"} hover:scale-105 transition duration-200`}
                        onClick = {() => moveLastWeek()}
                    >
                        <svg className = {`size-7 ${selectedColor == "pink" && "text-pink-600"}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m18.75 4.5-7.5 7.5 7.5 7.5m-6-15L5.25 12l7.5 7.5" />
                        </svg>
                    </div>
                    <div className = "">
                        <p className = "text-2xl">{dateToYearMonthDate(startDate)[0]}年 {dateToYearMonthDate(startDate)[1]}月 {dateToYearMonthDate(startDate)[2]}日</p>
                        <div className = "flex justify-center my-1">
                            <svg className = "size-7 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 5.25 7.5 7.5 7.5-7.5m-15 6 7.5 7.5 7.5-7.5" />
                            </svg>
                        </div>
                        <p className = "text-2xl">{dateToYearMonthDate(endDate)[0]}年 {dateToYearMonthDate(endDate)[1]}月 {dateToYearMonthDate(endDate)[2]}日</p>
                    </div>
                    <div 
                        data-testid = "nextWeek-button"
                        className = {`p-1 cursor-pointer rounded-full ${selectedColor == "blue" && "bg-sky-200/80 hover:bg-sky-300"} ${selectedColor == "whiteBlack" && "bg-gray-200/80 hover:bg-gray-300"} ${selectedColor == "pink" && "bg-pink-200/80 hover:bg-pink-300"} hover:scale-105 transition duration-200`}
                        onClick = {() => moveNextWeek()}
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

export default WeekNavi