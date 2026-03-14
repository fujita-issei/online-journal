import { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../hooks/ReduxHooks'
import { setSelectedMenu } from '../store/Menu'
import DailyJournalNavi from './DailyJournal/DailyJournalNavi'
import DailySleep from './DailyJournal/DailySleep'
import DailyRoutine from './DailyJournal/DailyRoutine'
import DailyToDo from './DailyJournal/DailyToDo'
import DailyNGList from './DailyJournal/DailyNGList'
import DailyJournal from './DailyJournal/DailyJournal'
import DailyMoney from './DailyJournal/DailyMoney'
import { changeDate, setInit } from "../store/dailyJournal"
import axios from "axios"
import dateToYearMonthDate from '../func/DateToYearMonthDate'

const CreateDailyJournal = () => {

    const dispatch = useAppDispatch()
    const [ reset, setReset ] = useState(false)
    const { targetDate } = useAppSelector((state) => state.dailyJournal)
    const selectedColor = useAppSelector((state) => state.color.color)
    const { userId } = useAppSelector((state) => state.login)

    useEffect(() => {
        localStorage.setItem("currentPage", "ジャーナルを作成")
        dispatch(setSelectedMenu("ジャーナルを作成"))
    }, [dispatch])

    const resetAll = async () => {
        // その日付のものをDBから削除して、stateをリセットする
        try {
            await axios.delete("/api/dailyJournal/deleteTodayJournal", {
                params: {
                    userId: userId,
                    targetDate: targetDate
                }
            })
            setReset(false)
            window.scrollTo(0, 0)
            dispatch(setInit())
            dispatch(changeDate(targetDate))
        } catch(e) {
            console.log("resetAllでエラー", e)
        }
    }

    return (
        <div>
            <DailyJournalNavi />
            <div className = {`mt-4 border-2 mx-3 py-6 px-3 rounded-2xl shadow-lg bg-white border-dashed ${selectedColor !== "pink" && "border-gray-500"} ${selectedColor == "pink" && "border-pink-500"}`}>
                <DailySleep />
                <DailyRoutine />
                <DailyToDo />
                <DailyNGList />
                <DailyJournal />
                <DailyMoney />
                <div className = "mt-6 flex justify-center">
                    <button
                        data-testid = "reset-1"
                        className = "border-2 cursor-pointer border-red-500 px-6 py-2 rounded-xl shadow-lg text-red-600 text-xl hover:scale-110 transition duration-300"
                        onClick = {() => setReset(true)}
                    >リセットする</button>
                </div>
            </div>

            {/* リセットボタンを押したら、確認用のモーダルを表示 */}
            <div
                className = {`fixed inset-0 z-50 flex justify-center items-center transition-opacity duration-300 ${reset ? "opacity-100" : "opacity-0 pointer-events-none"}`}
            >
                {/* 背景フィルター */}
                <div
                    onClick = {() => setReset(false)}
                    className = "absolute inset-0 bg-black/50 cursor-pointer"
                ></div>

                {/* 表示される確認パネル */}
                <div
                    onClick = {(e) => e.stopPropagation()}
                    className = {`relative cursor-pointer bg-white rounded-lg shadow-lg py-6 px-6 w-11/12 h-60 flex flex-col items-center text-lg transition-opacity duration-300 ${reset ? "opacity-100" : "opacity-0"}`}
                >
                    <p className = "mb-1">{dateToYearMonthDate(targetDate)[0]}年 {dateToYearMonthDate(targetDate)[1]}月 {dateToYearMonthDate(targetDate)[2]}日 の</p>
                    <p className = "mb-3">ジャーナルをリセットします</p>
                    <p className = "text-xl">本当によろしいですか？</p>
                    <div className = "flex justify-center items-center mt-8 gap-x-8">
                        <button
                            data-testid = "reset-2"
                            className = "bg-red-500 px-4 py-2 rounded-xl shadow-lg text-white border-2 border-red-500 hover:border-red-600 hover:bg-red-600 hover:scale-110 transition duration-200"
                            onClick = {() => resetAll()}
                        >
                            リセットする
                        </button>
                        <button
                            className = "border-2 border-red-500 px-6 py-2 rounded-xl shadow-lg hover:border-red-600 hover:scale-110 transition duration-200"
                            onClick  = {() => setReset(false)}
                        >
                            戻る
                        </button>
                    </div>
                </div>


            </div>


        </div>
    )
}

export default CreateDailyJournal