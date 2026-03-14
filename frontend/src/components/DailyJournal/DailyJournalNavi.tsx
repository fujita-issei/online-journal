import { useNavigate } from "react-router-dom"
import { useAppDispatch, useAppSelector } from "../../hooks/ReduxHooks"
import { changeDate, setCurrentDailyJournal, setInit } from "../../store/dailyJournal"
import axios from "axios"
import calcDays from "../../func/calcDays"
import dateToYearMonthDate from "../../func/DateToYearMonthDate"
import checkJournalWritten from "../../func/checkJournalWritten"

const DailyJournalNavi = () => {

    const navigate = useNavigate()
    const dispatch = useAppDispatch()
    const { targetDate, getUpHour, getUpMin, goBedHour, goBedMin, routine, routineCheck, toDoTimeHour, toDoTimeMin, startToDoHour, startToDoMin, endToDoHour, endToDoMin, toDoTimeCheck, toDoList, toDoListCheck, toDoListImportant, importList, importListCheck, addList, addListCheck, journal, journalCount, journalLastEditTime, moneyInvestment, moneyWaste, moneyConsumption, moneyUseSum } = useAppSelector((state) => state.dailyJournal)
    const dailyJournal = useAppSelector((state) => state.dailyJournal)
    const { userId } = useAppSelector((state) => state.login)
    const selectedColor = useAppSelector((state) => state.color.color)
    
    const saveAndBackPage = async () => {
        // httpリクエストを送って今いる日付のものをDBに保存
        try {
            await axios.post("/api/dailyJournal/saveTodayJournal", {
                userId: userId,
                targetDate: targetDate,
                getUpHour: getUpHour,
                getUpMin: getUpMin,
                goBedHour: goBedHour,
                goBedMin: goBedMin, 
                routine: routine,
                routineCheck: routineCheck,
                toDoTimeHour: toDoTimeHour,
                toDoTimeMin: toDoTimeMin,
                startToDoHour: startToDoHour,
                startToDoMin: startToDoMin,
                endToDoHour: endToDoHour,
                endToDoMin: endToDoMin,
                toDoTimeCheck: toDoTimeCheck,
                toDoList: toDoList,
                toDoListCheck: toDoListCheck,
                toDoListImportant: toDoListImportant,
                importList: importList,
                importListCheck: importListCheck,
                addList: addList,
                addListCheck: addListCheck,
                journal: journal,
                journalCount: journalCount,
                journalLastEditTime: journalLastEditTime,
                moneyInvestment: moneyInvestment,
                moneyWaste: moneyWaste,
                moneyConsumption: moneyConsumption,
                moneyUseSum: moneyUseSum,
                isWritten: !checkJournalWritten(dailyJournal)
            })
            dispatch(setInit())
            navigate("/createJournal")
        } catch (e) {
            console.log("saveAndBackPageでエラー", e)
        }
        
    }

    const moveYestarday = async () => {
        // httpリクエストを送って、この日付のものをDBに保存
        try {
            await axios.post("/api/dailyJournal/saveTodayJournal", {
                userId: userId,
                targetDate: targetDate,
                getUpHour: getUpHour,
                getUpMin: getUpMin,
                goBedHour: goBedHour,
                goBedMin: goBedMin, 
                routine: routine,
                routineCheck: routineCheck,
                toDoTimeHour: toDoTimeHour,
                toDoTimeMin: toDoTimeMin,
                startToDoHour: startToDoHour,
                startToDoMin: startToDoMin,
                endToDoHour: endToDoHour,
                endToDoMin: endToDoMin,
                toDoTimeCheck: toDoTimeCheck,
                toDoList: toDoList,
                toDoListCheck: toDoListCheck,
                toDoListImportant: toDoListImportant,
                importList: importList,
                importListCheck: importListCheck,
                addList: addList,
                addListCheck: addListCheck,
                journal: journal,
                journalCount: journalCount,
                journalLastEditTime: journalLastEditTime,
                moneyInvestment: moneyInvestment,
                moneyWaste: moneyWaste,
                moneyConsumption: moneyConsumption,
                moneyUseSum: moneyUseSum,
                isWritten: !checkJournalWritten(dailyJournal)
            })

            const yestarday = calcDays(targetDate, 1, "-")

            // 前日のものを取得
            const res = await axios.get("/api/dailyJournal/getTodayJournal", {
                params: {
                    userId: userId,
                    targetDate: yestarday
                }
            })
            if (res.data.length == 0) {
                dispatch(setInit())
                localStorage.setItem("dailyJournalDate", yestarday)
                dispatch(changeDate(yestarday))
            } else if (res.data.length == 1) {
                dispatch(setCurrentDailyJournal(res.data[0]))
                localStorage.setItem("dailyJournalDate", yestarday)
                dispatch(changeDate(yestarday))
            } else {
                return 
            }
        } catch(e) {
            console.log("moveYestardayでエラー", e)
        }
    }

    const moveTomorrow = async () => {
        try {
            // httpリクエストを送って、この日付のものをDBに保存
            await axios.post("/api/dailyJournal/saveTodayJournal", {
                userId: userId,
                targetDate: targetDate,
                getUpHour: getUpHour,
                getUpMin: getUpMin,
                goBedHour: goBedHour,
                goBedMin: goBedMin, 
                routine: routine,
                routineCheck: routineCheck,
                toDoTimeHour: toDoTimeHour,
                toDoTimeMin: toDoTimeMin,
                startToDoHour: startToDoHour,
                startToDoMin: startToDoMin,
                endToDoHour: endToDoHour,
                endToDoMin: endToDoMin,
                toDoTimeCheck: toDoTimeCheck,
                toDoList: toDoList,
                toDoListCheck: toDoListCheck,
                toDoListImportant: toDoListImportant,
                importList: importList,
                importListCheck: importListCheck,
                addList: addList,
                addListCheck: addListCheck,
                journal: journal,
                journalCount: journalCount,
                journalLastEditTime: journalLastEditTime,
                moneyInvestment: moneyInvestment,
                moneyWaste: moneyWaste,
                moneyConsumption: moneyConsumption,
                moneyUseSum: moneyUseSum,
                isWritten: !checkJournalWritten(dailyJournal)
            })
            
            const tomorrow = calcDays(targetDate, 1, "+")

            const res = await axios.get("/api/dailyJournal/getTodayJournal", {
                params: {
                    userId: userId,
                    targetDate: tomorrow
                }
            })
            if (res.data.length == 0) {
                dispatch(setInit())
                localStorage.setItem("dailyJournalDate", tomorrow)
                dispatch(changeDate(tomorrow))
            } else if (res.data.length == 1) {
                dispatch(setCurrentDailyJournal(res.data[0]))
                localStorage.setItem("dailyJournalDate", tomorrow)
                dispatch(changeDate(tomorrow))
            } else {
                return 
            }
        } catch (e) {
            console.log("moveTomorrowでエラー", e)
        }
    }

    return (
        <div>
            <div className = "flex justify-start items-center ml-3 mt-4 gap-x-4">
                <div 
                    data-testid = "save-button"
                    className = {`border-2 cursor-pointer shadow-lg rounded-lg p-1 ${selectedColor !== "pink" && "border-gray-500 bg-gray-300 hover:bg-gray-400"} ${selectedColor == "pink" && "border-pink-400 bg-pink-300 hover:bg-pink-400"} hover:scale-105 transition duration-200`}
                    onClick = {() => saveAndBackPage()}
                >
                    <svg className = {`size-8 ${selectedColor == "pink" && "text-pink-600"}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3" />
                    </svg>
                </div>
                <div className = {`flex justify-center items-center border-2 ${selectedColor !== "pink" && "border-gray-400"} ${selectedColor == "pink" && "border-pink-400"} bg-white rounded-lg shadow-lg px-2 py-1 gap-x-2`}>
                    <div 
                        data-testid = "yestarday-button"
                        className = {`p-1 cursor-pointer rounded-full ${selectedColor == "blue" && "bg-sky-200/80 hover:bg-sky-300"} ${selectedColor == "whiteBlack" && "bg-gray-200/80 hover:bg-gray-300"} ${selectedColor == "pink" && "bg-pink-200/80 hover:bg-pink-300"} hover:scale-105 transition duration-200`}
                        onClick = {() => moveYestarday()}
                    >
                        <svg className = {`size-7 ${selectedColor == "pink" && "text-pink-600"}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m18.75 4.5-7.5 7.5 7.5 7.5m-6-15L5.25 12l7.5 7.5" />
                        </svg>
                    </div>
                    <div>
                        <p className = "text-2xl">{dateToYearMonthDate(targetDate)[0]}年 {dateToYearMonthDate(targetDate)[1]}月 {dateToYearMonthDate(targetDate)[2]}日</p>
                    </div>
                    <div
                        data-testid = "tomorrow-button"
                        className = {`p-1 cursor-pointer rounded-full ${selectedColor == "blue" && "bg-sky-200/80 hover:bg-sky-300"} ${selectedColor == "whiteBlack" && "bg-gray-200/80 hover:bg-gray-300"} ${selectedColor == "pink" && "bg-pink-200/80 hover:bg-pink-300"} hover:scale-105 transition duration-200`}
                        onClick = {() => moveTomorrow()}
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

export default DailyJournalNavi