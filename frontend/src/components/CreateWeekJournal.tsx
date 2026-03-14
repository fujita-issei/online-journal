import { useEffect, useState } from "react"
import WeekNavi from "./WeekJournal/WeekNavi"
import { setSelectedMenu } from "../store/Menu"
import { useAppDispatch, useAppSelector } from "../hooks/ReduxHooks"
import WeekToDo from "./WeekJournal/WeekToDo"
import WeekJournal from "./WeekJournal/WeekJournal"
import WeekSummary from "./WeekJournal/WeekSummary"
import { changeWeekDate, setWeekInit } from "../store/weekJournal"
import dateToYearMonthDate from "../func/DateToYearMonthDate"
import axios from "axios"

const CreateWeekJournal = () => {

    const dispatch = useAppDispatch()
    const [ reset, setReset ] = useState(false)
    const { startDate, endDate } = useAppSelector((state) => state.weekJournal)
    const selectedColor = useAppSelector((state) => state.color.color)
    const { userId } = useAppSelector((state) => state.login)
    const [renderingTrigger, setRenderingTrigger] = useState(0)

    useEffect(() => {
            localStorage.setItem("currentPage", "ジャーナルを作成")
            dispatch(setSelectedMenu("ジャーナルを作成"))
    }, [dispatch])

    const resetAll = async () => {
        // その週のものをDBから削除して、Stateをリセットする
        try {
            await axios.delete("/api/weekJournal/deleteWeekJournal", {
                params: {
                    userId: userId,
                    startDate: startDate,
                    endDate: endDate
                }
            })
            setReset(false)
            window.scrollTo(0, 0)
            dispatch(setWeekInit())
            dispatch(changeWeekDate({ startDate: startDate, endDate: endDate}))
            setRenderingTrigger(prev => prev + 1)
        } catch (e) {
            console.log("resetAllでエラー", e)
        }
    }

    return (
        <div>
            <WeekNavi />
            <div className = {`mt-4 border-2 mx-3 py-6 px-3 rounded-2xl shadow-lg bg-white border-dashed ${selectedColor !== "pink" && "border-gray-500"} ${selectedColor == "pink" && "border-pink-500"}`}>

                <WeekToDo />
                <WeekJournal />
                <WeekSummary renderingTrigger = {renderingTrigger} />

                <div className = "mt-6 flex justify-center">
                    <button
                        data-testid = "reset-1"
                        className = "cursor-pointer border-2 border-red-500 px-6 py-2 rounded-xl shadow-lg text-red-600 text-xl hover:scale-110 transition duration-300"
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
                    className = {`relative cursor-pointer bg-white rounded-lg shadow-lg py-6 px-6 w-11/12 h-68 flex flex-col items-center text-lg transition-opacity duration-300 ${reset ? "opacity-100" : "opacity-0"}`}
                >
                    <p className = "mb-1">{dateToYearMonthDate(startDate)[0]} 年 {dateToYearMonthDate(startDate)[1]} 月 {dateToYearMonthDate(startDate)[2]} 日 から</p>
                    <p className = "mb-1">{dateToYearMonthDate(endDate)[0]} 年 {dateToYearMonthDate(endDate)[1]} 月 {dateToYearMonthDate(endDate)[2]} 日 の</p>
                    <p className = "mb-3">ジャーナルをリセットします</p>
                    <p className = "text-xl">本当によろしいですか？</p>
                    <div className = "flex justify-center items-center mt-8 gap-x-8">
                        <button
                            data-testid = "reset-2"
                            className = "bg-red-500 cursor-pointer px-4 py-2 rounded-xl shadow-lg text-white border-2 border-red-500 hover:border-red-600 hover:bg-red-600 hover:scale-110 transition duration-200"
                            onClick = {() => resetAll()}
                        >
                            リセットする
                        </button>
                        <button
                            className = "border-2 border-red-500 cursor-pointer px-6 py-2 rounded-xl shadow-lg hover:border-red-600 hover:scale-110 transition duration-200"
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

export default CreateWeekJournal