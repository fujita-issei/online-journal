import { useEffect, useState } from "react"
import { useAppDispatch, useAppSelector } from "../../hooks/ReduxHooks"
import axios from "axios"
import { nowYearMonthDate } from "../../constant/date"
import { setSleepNumberOfDay, setSleepSummary, setSleepSummaryInit } from "../../store/summary"
import type { SleepSummary } from "../../constant/summaryInitState"
import type { SleepData } from "./Graph/SleepGraph"
import SleepGraph from "./Graph/SleepGraph"

const SummarySleep = () => {

    const [open, setOpen] = useState(true)
    const [graph, setGraph] = useState(false)
    const [graphData, setGraphData] = useState<SleepData[]>([])
    const dispatch = useAppDispatch()
    const option = [3, 5, 7, 10, 15, 20, 30, 50, 100, 300, 500, 1000]
    const selectedColor = useAppSelector((state) => state.color.color)
    const { userId } = useAppSelector((state) => state.login)
    const { sleepNumberOfDay, sleepSummary } = useAppSelector((state) => state.summary)

    // 現在のsleepNumberOfDayを参照して、データを取得して反映させる
    useEffect(() => {
        const getSleepData = async () => {
            try {
                const res = await axios.get("/api/summary/getSleepData", {
                    params: {
                        userId: userId,
                        targetDate: nowYearMonthDate,
                        sleepNumberOfDay: sleepNumberOfDay
                    }
                })
                if (res.data.length == 0) return dispatch(setSleepSummaryInit())
                const fetchedData: SleepData[] = res.data;
                setGraphData(fetchedData)
                // 平均、一番早い、一番遅いを作る
                let sumGetUp = 0
                let earlyGetUp = 100000
                let lateGetUp = 0
                let sumGoBed = 0
                let earlyGoBed = 100000
                let lateGoBed = 0
                for (let i = 0; i < fetchedData.length; i++ ) {
                    const currentGetUp = (res.data[i].getUpHour * 60) + res.data[i].getUpMin
                    let currentGoBed = 0
                    if (res.data[i].goBedHour < 12) {
                        currentGoBed += ((res.data[i].goBedHour + 24) * 60) + res.data[i].goBedMin
                    } else {
                        currentGoBed += (res.data[i].goBedHour * 60) + res.data[i].goBedMin
                    }
                    sumGetUp  = sumGetUp + currentGetUp
                    sumGoBed = sumGoBed + currentGoBed
                    if (currentGetUp <= earlyGetUp) {
                        earlyGetUp = currentGetUp
                    }
                    if (currentGetUp >= lateGetUp) {
                        lateGetUp = currentGetUp
                    }
                    if (currentGoBed <= earlyGoBed) {
                        earlyGoBed = currentGoBed
                    }
                    if (currentGoBed >= lateGoBed) {
                        lateGoBed = currentGoBed
                    }
                }
                const payload: SleepSummary = {
                    aveGetUpHour: Math.trunc(Math.trunc(sumGetUp / fetchedData.length) / 60),
                    aveGetUpMin: Math.trunc(sumGetUp / fetchedData.length) - (Math.trunc(Math.trunc(sumGetUp / fetchedData.length) / 60) * 60),

                    earlyGetUpHour: Math.trunc(earlyGetUp / 60),
                    earlyGetUpMin: earlyGetUp - (Math.trunc(earlyGetUp / 60) * 60),

                    lateGetUpHour: Math.trunc(lateGetUp / 60),
                    lateGetUpMin: lateGetUp - (Math.trunc(lateGetUp / 60) * 60),

                    aveGoBedHour: Math.trunc(Math.trunc(sumGoBed / fetchedData.length) / 60),
                    aveGoBedMin: Math.trunc(sumGoBed / fetchedData.length) - (Math.trunc(Math.trunc(sumGoBed / fetchedData.length) / 60) * 60),

                    earlyGoBedHour: Math.trunc(earlyGoBed / 60),
                    earlyGoBedMin: earlyGoBed - (Math.trunc(earlyGoBed / 60) * 60),

                    lateGoBedHour: Math.trunc(lateGoBed / 60),
                    lateGoBedMin: lateGoBed - (Math.trunc(lateGoBed / 60) * 60)
                }
                dispatch(setSleepSummary(payload))
            } catch (e) {
                console.log("getSleepDataでエラー", e)
            }
        }
        getSleepData()
    }, [sleepNumberOfDay, dispatch, userId])

    const changeSleep= (value: string) => {
        dispatch(setSleepNumberOfDay(Number(value)))
    }

    return (
        <div className = {`border-2 ${selectedColor !== "pink" && "border-gray-400"} ${selectedColor == "pink" && "border-pink-300"} rounded-2xl shadow-lg py-4 px-2 mt-6`}>
            {/* ナビゲーション */}
            <div className = {`flex justify-start items-center gap-x-6 ml-2 border-b-2 border-dashed ${selectedColor !== "pink" && "border-gray-400"} ${selectedColor == "pink" && "border-pink-400"} pb-3`}>
                <div 
                    className = {`p-0.5 border cursor-pointer rounded-full ${open && selectedColor !== "pink" && "bg-gray-200 hover:bg-gray-400"} ${!open && selectedColor !== "pink" && "bg-gray-400 hover:bg-gray-600"} ${open && selectedColor == "pink" && "bg-pink-200 hover:bg-pink-400"} ${!open && selectedColor == "pink" && "bg-pink-400 hover:bg-pink-600"} transition-all duration-200`}
                    onClick = {() => setOpen(prev => !prev)}
                >
                    {open ?
                        <svg className = {`size-8 ${selectedColor == "blue" && "text-green-500 hover:text-green-700"} ${selectedColor == "whiteBlack" && "text-gray-600 hover:text-gray-800"} ${selectedColor == "pink" && "text-pink-500 hover:text-pink-700"} transition-all duration-200`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                        </svg>
                        :
                        <svg className = {`size-8 ${selectedColor == "blue" && "text-green-500 hover:text-green-700"} ${selectedColor == "whiteBlack" && "text-gray-600 hover:text-gray-800"} ${selectedColor == "pink" && "text-pink-500 hover:text-pink-700"} -rotate-90 transition-all duration-200`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                        </svg>
                    }
                </div>
                <h2 className = "text-2xl text-gray-700">すいみんの詳細</h2>
            </div>

            {/* ここから下がルーティーンの管理 */}
            {open &&  
                <div className = "mt-4">

                    <div className = "flex justify-center items-center gap-x-2">
                        <p>過去</p>
                        <div>
                            <select
                                data-testid="select-sleep-days"
                                className = {`px-2 w-20 text-center border-2 ${selectedColor !== "pink" && "border-gray-400/90"} ${selectedColor == "pink" && "border-pink-400"} rounded-lg shadow-lg hover:border-sky-400 transition duration-200`}
                                value = {sleepNumberOfDay}
                                onChange = {(e) => changeSleep(e.target.value)}
                            >
                                {option.map((opt) => <option key = {opt} value = {opt}>{opt}</option>)}
                            </select>
                        </div>
                        <p>日間</p>
                    </div>

                    {!Object.values(sleepSummary).every((value) =>  value == 0) ? (
                        <div>
                            <div className = {`md:flex justify-center items-center mt-4 border-2 px-2 py-4 rounded-xl shadow-lg ${selectedColor == "blue" && "border-sky-400 bg-sky-50"} ${selectedColor == "whiteBlack" && "border-gray-400 bg-gray-50"} ${selectedColor == "pink" && "border-pink-400 bg-pink-50 text-pink-700"} text-gray-600`}>
                                <div className = {`md:pr-8 md:border-r-2 md:border-dashed ${selectedColor == "blue" && "md:border-sky-500"} ${selectedColor == "whiteBlack" && "md:border-gray-500"} ${selectedColor == "pink" && "md:border-pink-500"}`}>
                                    <div className = "text-center text-lg flex justify-center items-center gap-x-2">
                                        <div>
                                            <svg className = "size-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 0 0 3 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 0 0 5.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 0 0 9.568 3Z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6Z" />
                                            </svg>
                                        </div>
                                        <p>平均就寝時間 :</p>
                                        <p className = "text-rose-600 text-2xl">{sleepSummary.aveGoBedHour}</p>
                                        <p>時</p>
                                        <p className = "text-rose-600 text-2xl">{sleepSummary.aveGoBedMin}</p>
                                        <p>分</p>
                                    </div>

                                    <div className = "mt-2 flex justify-center items-center text-xs gap-x-4">
                                        <p>最も早い時 : {sleepSummary.earlyGoBedHour} 時 {sleepSummary.earlyGoBedMin} 分</p>
                                        <p>最も遅い時 : {sleepSummary.lateGoBedHour} 時 {sleepSummary.lateGoBedMin} 分</p>
                                    </div>
                                </div>

                                <div className = "md:pl-8">
                                    <div className = "md:mt-0  mt-4 text-center text-lg flex justify-center items-center gap-x-2">
                                        <div>
                                            <svg className = "size-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 0 0 3 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 0 0 5.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 0 0 9.568 3Z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6Z" />
                                            </svg>
                                        </div>
                                        <p>平均起床時間 :</p>
                                        <p className = "text-rose-600 text-2xl">{sleepSummary.aveGetUpHour}</p>
                                        <p>時</p>
                                        <p className = "text-rose-600 text-2xl">{sleepSummary.aveGetUpMin}</p>
                                        <p>分</p>
                                    </div>

                                    <div className = "mt-2 flex justify-center items-center text-xs gap-x-4">
                                        <p>最も早い時 : {sleepSummary.earlyGetUpHour} 時 {sleepSummary.earlyGetUpMin} 分</p>
                                        <p>最も遅い時 : {sleepSummary.lateGetUpHour} 時 {sleepSummary.lateGetUpMin} 分</p>
                                    </div>
                                </div>
                            </div>

                            {graph ?
                                // 開いてるとき
                                // むずいから一番最後に
                                <div>
                                    <div className="mt-4 animate-fade-in">
                                        <SleepGraph data={graphData} />
                                        <div className="mt-4 text-center">
                                            <button
                                                className={`border-2 px-4 py-1 rounded-xl shadow-xl transition duration-200 ${selectedColor === "blue" ? "border-sky-500 bg-sky-500 text-white hover:bg-sky-600" : selectedColor === "pink" ? "border-pink-500 bg-pink-500 text-white hover:bg-pink-600" : "border-gray-500 bg-gray-500 text-white hover:bg-gray-600"}`}
                                                onClick={() => setGraph(false)}
                                            >
                                                閉じる
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                :
                                // 閉じてるとき
                                <div className = "mt-4 text-center">
                                    <button
                                        className = "border-2 px-4 py-1 border-rose-500 rounded-xl shadow-xl bg-rose-500 text-white hover:scale-110 hover:border-rose-600 hover:bg-rose-600 transition duration-200"
                                        onClick = {() => setGraph(true)}
                                    >
                                        グラフで見る
                                    </button>
                                </div>
                            }
                        </div>
                    ) : (
                        <div className = "mt-6">
                            <p className = "text-center text-xl">データが足りません。</p>
                        </div>
                    )}

                </div>
            }
        </div>
    )
}

export default SummarySleep