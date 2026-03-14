import { useEffect } from "react"
import { useAppDispatch, useAppSelector } from "../hooks/ReduxHooks"
import { setSelectedMenu } from "../store/Menu"
import SummarySleep from "./Summary/SummarySleep"
import SummaryRoutine from "./Summary/SummaryRoutine"
import SummaryNG from "./Summary/SummaryNG"
import SummaryToDo from "./Summary/SummaryToDo"
import SummaryJournal from "./Summary/SummaryJournal"
import SummaryMoney from "./Summary/SummaryMoney"
import axios from "axios"
import { nowYearMonthDate } from "../constant/date"
import { format } from "date-fns"
import calcDays from "../func/calcDays"
import { setStreak } from "../store/summary"
import dateToYearMonthDate from "../func/DateToYearMonthDate"

const WatchSummary = () => {

    const dispatch = useAppDispatch()
    const selectedColor = useAppSelector((state) => state.color.color)
    const { userId } = useAppSelector((state) => state.login)
    const { streak, streakStartDay } = useAppSelector((state) => state.summary)

    useEffect(() => {
        localStorage.setItem("currentPage", "サマリーを見る")
        dispatch(setSelectedMenu("サマリーを見る"))
    }, [dispatch])

    // ジャーナルストリークを取得する
    useEffect(() => {
        const getJournalStreak = async () => {
            try {
                const res = await axios.get("/api/summary/getCurrentJournalStreak", {
                    params: {
                        userId: userId,
                        targetDate: nowYearMonthDate
                    }
                })
                const tidiedUpData = res.data.map((_data: { targetDate: string }) => {
                    return {
                        targetDate: format(_data.targetDate, "yyyy-MM-dd")
                    }
                })
                // ストリークと、開始日を計算する
                let numOfStreak = 0
                let streakStart = ""
                if (tidiedUpData.length == 0) return dispatch(setStreak({ streak: numOfStreak, streakStartDay: streakStart }))
                // 今日か昨日がなかったら、ストリーク0と出力
                if (tidiedUpData[0].targetDate == nowYearMonthDate || tidiedUpData[0].targetDate == calcDays(nowYearMonthDate, 1, "-")) {
                    numOfStreak += 1
                    streakStart = tidiedUpData[0].targetDate
                    for (let i = 0; i < tidiedUpData.length - 1; i++) {
                        // iとi+1の明日が同じなら、ジャーナルが続いている
                        if(tidiedUpData[i].targetDate == calcDays(tidiedUpData[i + 1].targetDate, 1, "+")) {
                            numOfStreak ++
                            streakStart = tidiedUpData[i + 1].targetDate
                        } else {
                            break
                        }
                    }
                }
                dispatch(setStreak({ streak: numOfStreak, streakStartDay: streakStart }))
            } catch(e) {
                console.log("ジャーナルストリークの取得でエラー", e)
            }
        }
        getJournalStreak()
    }, [userId, dispatch])

    return (
        <div className = {`mt-4 border-2 mx-3 py-6 px-3 rounded-2xl shadow-lg bg-white border-dashed ${selectedColor !== "pink" && "border-gray-500"} ${selectedColor == "pink" && "border-pink-500"}`}>
            <div className = "mt-2">
                <p className = "text-center text-xl text-gray-600">現在のジャーナルストリーク</p>
                <p className = "text-center text-2xl text-rose-600 my-2">{streak}日</p>
                {streak !== 0 && 
                    <p className = "text-center">{dateToYearMonthDate(streakStartDay)[0]} / {dateToYearMonthDate(streakStartDay)[1]} / {dateToYearMonthDate(streakStartDay)[2]} から毎日頑張っています</p>
                }
            </div>

            <SummarySleep />
            <SummaryRoutine />
            <SummaryNG />
            <SummaryToDo />
            <SummaryJournal />
            <SummaryMoney />

        </div>
    )
}

export default WatchSummary