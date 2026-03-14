import { useEffect, useState } from "react"
import { useAppDispatch, useAppSelector } from "../../hooks/ReduxHooks"
import axios from "axios"
import { nowYearMonthDate } from "../../constant/date"
import { setRoutineNumberOfDay, setRoutineSummary, setRoutineSummaryInit } from "../../store/summary"
import type { RoutineInitState } from "../../constant/routineInitState"
import RoutineGraphPieChart from "./Graph/RoutineGraphPieChart"
import RoutineGraphAchieve from "./Graph/RoutineGraphAchieve"
import RoutineGraphDaily from "./Graph/RoutineGraphDaily"

const routineSummaryInit = {
    routineDone: 0,
    routineAll: 0,
    achievementHighest: "",
    achievementLowest: ""
}

const SummaryRoutine = () => {

    const [open, setOpen] = useState(true)
    const [graph, setGraph] = useState(false)
    const [graphData, setGraphData] = useState<{ name: string; rate: number }[]>([])
    const [dailyGraph, setDailyGraph] = useState<{ date: string; rate: number}[]>([])
    const option = [3, 5, 7, 10, 15, 20, 30, 50, 100, 300, 500, 1000]
    const selectedColor = useAppSelector((state) => state.color.color)
    const dispatch = useAppDispatch()
    const { userId } = useAppSelector((state) => state.login)
    const { routineNumberOfDay, routineSummary } = useAppSelector((state) => state.summary)

    useEffect(() => {
        const getRoutineData = async () => {
            try {
                const res = await axios.get("/api/summary/getRoutineData", {
                    params: {
                        userId: userId,
                        targetDate: nowYearMonthDate,
                        routineNumberOfDay: routineNumberOfDay
                    }
                })
                if (res.data.length == 0) return dispatch(setRoutineSummaryInit())
                // 達成率、最も高いやつ、低いやつを計算
                let routineDone = 0
                let routineAll = 0
                const selectedRoutineId: string[] = []
                const selectedRoutineName: string[] = []
                const selectedRoutineDone: number[] = []
                const selectedRoutineAll: number[] = []
                for (let i = 0; i < res.data.length; i++) {
                    routineAll += res.data[i].routine.length
                    routineDone += res.data[i].routineCheck.filter((item: boolean) => item).length

                    // もしroutineIdがselectedRoutineIdになかったら、追加
                    res.data[i].routine.forEach((_routine: RoutineInitState, index: number) => {
                        if (selectedRoutineId.includes(_routine.routineId)) {
                            const _index = selectedRoutineId.indexOf(_routine.routineId)
                            selectedRoutineAll[_index] ++
                            if (res.data[i].routineCheck[index]) {
                                selectedRoutineDone[_index] ++
                            }
                        } else {
                            selectedRoutineId.push(_routine.routineId)
                            selectedRoutineName.push(_routine.routineName)
                            selectedRoutineAll.push(1)
                            if (res.data[i].routineCheck[index]) {
                                selectedRoutineDone.push(1)
                            } else {
                                selectedRoutineDone.push(0)
                            }
                        }
                    })
                }

                // state計算
                setGraphData(selectedRoutineName.map((name, i) => {
                    const done = selectedRoutineDone[i]
                    const all = selectedRoutineAll[i]
                    const rate = all === 0 ? 0 : Math.round((done / all) * 100)
                    return {
                        name: name,
                        rate: rate
                    }
                }))

                setDailyGraph(res.data.reverse()
                    .filter((item: { targetDate: string; routine: RoutineInitState[]; routineCheck: boolean[]}) => item.routineCheck.length > 0)
                    .map((_data: { targetDate: string; routine: RoutineInitState[]; routineCheck: boolean[]}) => {
                        const dateStr = new Date(_data.targetDate)
                        const displayDate = `${dateStr.getFullYear()}/${dateStr.getMonth() + 1}/${dateStr.getDate()}`;
                        const rate = Math.round((_data.routineCheck.filter((item: boolean) => item).length / _data.routineCheck.length) * 100)
                        return {
                            date: displayDate,
                            rate: rate
                        }
                }))

                let highestName = ""
                let lowestName = ""
                let highestRate = -1
                let lowestRate = 2

                for(let i=0; i < selectedRoutineId.length; i++) {
                    if (selectedRoutineAll[i] == 0) continue
                    const rate = selectedRoutineDone[i] / selectedRoutineAll[i]
                    if (rate > highestRate) {
                        highestName = selectedRoutineName[i]
                        highestRate = rate
                    }
                    if (rate < lowestRate) {
                        lowestName = selectedRoutineName[i]
                        lowestRate = rate
                    }
                }

                const payload = {
                    routineDone: routineDone,
                    routineAll: routineAll,
                    achievementHighest: highestName,
                    achievementLowest: lowestName
                }

                dispatch(setRoutineSummary(payload))
            } catch (e) {
                console.log("getRoutineDataでエラー", e)
            }
        }
        getRoutineData()
    }, [userId, routineNumberOfDay, dispatch])

    const changeRoutine = (value: string) => {
        dispatch(setRoutineNumberOfDay(Number(value)))
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
                <h2 className = "text-2xl text-gray-700">ルーティーンの詳細</h2>
            </div>

            {/* ここから下がルーティーンの管理 */}
            {open &&
                <div className = "mt-4">

                    <div className = "flex justify-center items-center gap-x-2">
                        <p>過去</p>
                        <div>
                            <select
                                data-testid = "select-routine-days"
                                className = {`px-2 w-20 text-center border-2 ${selectedColor !== "pink" && "border-gray-400/90"} ${selectedColor == "pink" && "border-pink-300"} rounded-lg shadow-lg hover:border-sky-400 transition duration-200`}
                                value = {routineNumberOfDay}
                                onChange = {(e) => changeRoutine(e.target.value)}
                            >
                                {option.map((opt) => <option key = {opt} value = {opt}>{opt}</option>)}
                            </select>
                        </div>
                        <p>日間</p>
                    </div>

                    {JSON.stringify(routineSummary) !== JSON.stringify(routineSummaryInit) ?(
                        <div>
                            <div>
                                <RoutineGraphPieChart/>
                            </div>
                            
                            <div className = "flex justify-center items-center text-lg gap-x-2">
                                <p>過去{routineNumberOfDay}日間で</p>
                                <p className = "text-rose-600 text-2xl">{routineSummary.routineDone}</p>
                                <p>/</p>
                                <p>{routineSummary.routineAll}個</p>
                            </div>
                            <p className = "text-center mt-2 text-gray-500">のルーティーンを達成しています。</p>

                            <div className = {`md:hidden mt-4 border-2 ${selectedColor !== "pink" && "border-gray-400"} ${selectedColor == "pink" && "border-pink-300"} rounded-lg shadow-lg mx-1 py-4 px-3`}>
                                <div className = {`border-b-2 pb-3 ${selectedColor !== "pink" && "border-gray-400"} ${selectedColor == "pink" && "border-pink-400"} border-dashed`}>
                                    <p className = "text-center text-md">最も達成率が高い :</p>
                                    <p className = "text-center text-rose-400 mt-2 text-lg">{routineSummary.achievementHighest}</p>
                                </div>
                                <div className = "pt-3">
                                    <p className = "text-center text-md">最も達成率が低い :</p>
                                    <p className = "text-center text-rose-400 mt-2 text-lg">{routineSummary.achievementLowest}</p>
                                </div>
                            </div>

                            <div className = {`hidden md:flex justify-center items-center mt-4 border-2 ${selectedColor !== "pink" && "border-gray-400/90"} ${selectedColor == "pink" && "border-pink-300"} rounded-lg shadow-lg mx-1 py-4 px-3`}>
                                <div className = {`pr-8 border-r-2 ${selectedColor !== "pink" && "border-gray-400"} ${selectedColor == "pink" && "border-pink-400"} border-dashed`}>
                                    <p className = "text-center text-md">最も達成率が高い :</p>
                                    <p className = "text-center text-rose-400 mt-2 text-lg">{routineSummary.achievementHighest}</p>
                                </div>
                                <div className = "pl-8">
                                    <p className = "text-center text-md">最も達成率が低い :</p>
                                    <p className = "text-center text-rose-400 mt-2 text-lg">{routineSummary.achievementLowest}</p>
                                </div>
                            </div>

                            {graph ?
                                // 開いてるとき
                                // むずいから一番最後に
                                <div>
                                    <div>
                                        <RoutineGraphAchieve chartData = {graphData}/>
                                    </div>
                                    <div>
                                        <RoutineGraphDaily chartData = {dailyGraph}/>
                                    </div>
                                    <div className="mt-4 text-center">
                                        <button
                                            className={`border-2 px-4 py-1 rounded-xl shadow-xl transition duration-200 ${selectedColor === "blue" ? "border-sky-500 bg-sky-500 text-white hover:bg-sky-600" : selectedColor === "pink" ? "border-pink-500 bg-pink-500 text-white hover:bg-pink-600" : "border-gray-500 bg-gray-500 text-white hover:bg-gray-600"}`}
                                            onClick={() => setGraph(false)}
                                        >
                                            閉じる
                                        </button>
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

export default SummaryRoutine