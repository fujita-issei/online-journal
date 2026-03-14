import { useEffect, useState } from "react"
import { useAppDispatch, useAppSelector } from "../../hooks/ReduxHooks"
import axios from "axios"
import { nowYearMonthDate } from "../../constant/date"
import { setToDoNumberOfDay, setToDoSummary, setToDoSummaryInit } from "../../store/summary"
import { format } from "date-fns"
import ToDoDonePieChart from "./Graph/ToDoDonePieChart"
import ToDoAchieveGoalTimePieChart from "./Graph/ToDoAchieveGoalTimePieChart"
import formatDate from "../../func/formatDate"
import ToDoTimeGraph from "./Graph/ToDoTimeGraph"

const toDoSummaryInit = {
    sumToDoHour: 0,
    sumToDoMin: 0,
    aveToDoHour: 0,
    aveToDoMin: 0,
    long1stDate: "",
    long1stHour: 0,
    long1stMin: 0,
    long2ndDate: "",
    long2ndHour: 0,
    long2ndMin: 0,
    long3rdDate: "",
    long3rdHour: 0,
    long3rdMin: 0,
    short1stDate: "",
    short1stHour: 0,
    short1stMin: 0,
    short2ndDate: "",
    short2ndHour: 0,
    short2ndMin: 0,
    short3rdDate: "",
    short3rdHour: 0,
    short3rdMin: 0,
    toDoDone: 0,
    toDoAll: 0,
    achieveGoalTime: 0
}

const SummaryToDo = () => {

    const [open, setOpen] = useState(true)
    const [graph, setGraph] = useState(false)
    const dispatch = useAppDispatch()
    const [pieChartData, setPieChartData] = useState<{ achieveGoalTime: number; all: number; }>({ achieveGoalTime: 0, all: 0 })
    const [graphData, setGraphData] = useState<{ targetDate: string; toDoTime: number; }[]>([])
    const option = [3, 5, 7, 10, 15, 20, 30, 50, 100, 300, 500, 1000]
    const selectedColor = useAppSelector((state) => state.color.color)
    const { userId } = useAppSelector((state) => state.login)
    const { toDoNumberOfDay, toDoSummary } = useAppSelector((state) => state.summary)

    useEffect(() => {
        const getToDoData = async () => {
            try {
                const res = await axios.get("/api/summary/getToDoData", {
                    params: {
                        userId: userId,
                        targetDate: nowYearMonthDate,
                        toDoNumberOfDay: toDoNumberOfDay
                    }
                })
                if (res.data.length == 0) return dispatch(setToDoSummaryInit())
                const tidiedUpData = res.data.map((_data: { targetDate: string; toDoTimeHour: number; toDoTimeMin: number; toDoTimeCheck: boolean[]; toDoListCheck: boolean[]}) => {
                    return {
                        targetDate: format(_data.targetDate, "yyyy-MM-dd"),
                        goalToDoTime: _data.toDoTimeHour * 60 + _data.toDoTimeMin,
                        toDoTime: _data.toDoTimeCheck.filter((item: boolean) => item).length * 30,
                        toDoListAll: _data.toDoListCheck.length,
                        toDoListDone: _data.toDoListCheck.filter((item: boolean) => item).length
                    }
                })

                let sumToDo = 0
                const payload = {
                    sumToDoHour: 0,
                    sumToDoMin: 0,
                    aveToDoHour: 0,
                    aveToDoMin: 0,
                    long1stDate: "",
                    long1stHour: 0,
                    long1stMin: 0,
                    long2ndDate: "",
                    long2ndHour: 0,
                    long2ndMin: 0,
                    long3rdDate: "",
                    long3rdHour: 0,
                    long3rdMin: 0,
                    short1stDate: "",
                    short1stHour: 0,
                    short1stMin: 0,
                    short2ndDate: "",
                    short2ndHour: 0,
                    short2ndMin: 0,
                    short3rdDate: "",
                    short3rdHour: 0,
                    short3rdMin: 0,
                    toDoDone: 0,
                    toDoAll: 0,
                    achieveGoalTime: 0
                }

                tidiedUpData.forEach((data: { targetDate: string; goalToDoTime: number; toDoTime: number; toDoListAll: number; toDoListDone: number}) => {
                    sumToDo += data.toDoTime

                    payload.toDoDone += data.toDoListDone
                    payload.toDoAll += data.toDoListAll 

                    if (data.toDoTime >= data.goalToDoTime && !(data.goalToDoTime == 0 && data.toDoTime == 0)) {
                        payload.achieveGoalTime += 1
                    }
                })
                payload.sumToDoHour += Math.trunc(sumToDo / 60)
                payload.sumToDoMin += sumToDo - (Math.trunc(sumToDo / 60) * 60)

                // toDoTimeの大きい順に、データを並び替える
                // toDoTime が大きい順（降順）に並び替えた新しい配列を作成
                // それをもとに、トップとワーストそれぞれ一位から順に決める
                const rearrangeData: { targetDate: string; goalToDoTime: number; toDoTime: number; toDoListAll: number; toDoListDone: number}[] = [...tidiedUpData].sort((a, b) => b.toDoTime - a.toDoTime);
                if (rearrangeData.length >= 1) {
                    payload.long1stDate = rearrangeData[0].targetDate
                    payload.long1stHour = Math.trunc(rearrangeData[0].toDoTime / 60)
                    payload.long1stMin = rearrangeData[0].toDoTime - (Math.trunc(rearrangeData[0].toDoTime / 60) * 60)
                }
                if (rearrangeData.length >= 2) {
                    payload.long2ndDate = rearrangeData[1].targetDate
                    payload.long2ndHour = Math.trunc(rearrangeData[1].toDoTime / 60)
                    payload.long2ndMin = rearrangeData[1].toDoTime - (Math.trunc(rearrangeData[1].toDoTime / 60) * 60)
                }
                if (rearrangeData.length >= 3) {
                    payload.long3rdDate = rearrangeData[2].targetDate
                    payload.long3rdHour = Math.trunc(rearrangeData[2].toDoTime / 60)
                    payload.long3rdMin = rearrangeData[2].toDoTime - (Math.trunc(rearrangeData[2].toDoTime / 60) * 60)
                }
                if (rearrangeData.length >= 1) {
                    payload.short1stDate = rearrangeData[rearrangeData.length - 1].targetDate
                    payload.short1stHour = Math.trunc(rearrangeData[rearrangeData.length - 1].toDoTime / 60)
                    payload.short1stMin = rearrangeData[rearrangeData.length - 1].toDoTime - (Math.trunc(rearrangeData[rearrangeData.length - 1].toDoTime / 60) * 60)
                }
                if (rearrangeData.length >= 2) {
                    payload.short2ndDate = rearrangeData[rearrangeData.length - 2].targetDate
                    payload.short2ndHour = Math.trunc(rearrangeData[rearrangeData.length - 2].toDoTime / 60)
                    payload.short2ndMin = rearrangeData[rearrangeData.length - 2].toDoTime - (Math.trunc(rearrangeData[rearrangeData.length - 2].toDoTime / 60) * 60)
                }
                if (rearrangeData.length >= 3) {
                    payload.short3rdDate = rearrangeData[rearrangeData.length - 3].targetDate
                    payload.short3rdHour = Math.trunc(rearrangeData[rearrangeData.length - 3].toDoTime / 60)
                    payload.short3rdMin = rearrangeData[rearrangeData.length - 3].toDoTime - (Math.trunc(rearrangeData[rearrangeData.length - 3].toDoTime / 60) * 60)
                }

                const dataLength = tidiedUpData.length
                payload.aveToDoHour = Math.trunc(Math.trunc(sumToDo / dataLength) / 60)
                payload.aveToDoMin = Math.trunc(sumToDo / dataLength) -  Math.trunc(Math.trunc(sumToDo / dataLength) / 60) * 60

                // グラフ用にデータをセットする
                setPieChartData({
                    achieveGoalTime: payload.achieveGoalTime,
                    all: tidiedUpData.filter((data: { targetDate: string; goalToDoTime: number; toDoTime: number; toDoListAll: number; toDoListDone: number}) => {
                        return !(data.goalToDoTime == 0 && data.toDoTime == 0)
                    }).length
                })
                setGraphData(tidiedUpData.map((data: { targetDate: string; goalToDoTime: number; toDoTime: number; toDoListAll: number; toDoListDone: number}) => {
                    return {
                        targetDate: data.targetDate,
                        toDoTime: data.toDoTime
                    }
                }))

                dispatch(setToDoSummary(payload))
            } catch(e) {
                console.log("getToDoDataでエラー", e)
            }
        }
        getToDoData()
    }, [userId, toDoNumberOfDay, dispatch])

    const changeToDo = (value: string) => {
        dispatch(setToDoNumberOfDay(Number(value)))
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
                <h2 className = "text-2xl text-gray-700">やるべきことリストの詳細</h2>
            </div>

            {/* ここから下がルーティーンの管理 */}
            {open &&
                <div className = "mt-4">

                    <div className = "flex justify-center items-center gap-x-2">
                        <p>過去</p>
                        <div>
                            <select
                                data-testid = "select-toDo-days"
                                className = {`px-2 w-20 text-center border-2 ${selectedColor !== "pink" && "border-gray-400/90"} ${selectedColor == "pink" && "border-pink-300"} rounded-lg shadow-lg hover:border-sky-400 transition duration-200`}
                                value = {toDoNumberOfDay}
                                onChange = {(e) => changeToDo(e.target.value)}
                            >
                                {option.map((opt) => <option key = {opt} value = {opt}>{opt}</option>)}
                            </select>
                        </div>
                        <p>日間</p>
                    </div>

                    {JSON.stringify(toDoSummary) !== JSON.stringify(toDoSummaryInit) ? (
                        <div>
                            {/* toDoDoneとtoDoAll */}
                            <div>
                                <ToDoDonePieChart />
                                <div className = "flex justify-center items-center text-lg gap-x-2">
                                    <p>過去{toDoNumberOfDay}日間で</p>
                                    <p className = "text-rose-600 text-2xl">{toDoSummary.toDoDone}</p>
                                    <p>/</p>
                                    <p>{toDoSummary.toDoAll}個</p>
                                </div>
                                <p className = "text-center mt-2 text-gray-500">のやるべきことを達成しています。</p>
                            </div>

                            {/* achieveGoalTime */}
                            <div>
                                <ToDoAchieveGoalTimePieChart chartData = {pieChartData}/>
                                <div className = "flex justify-center items-center text-lg gap-x-2">
                                    <p>過去{toDoNumberOfDay}日間で</p>
                                    <p className = "text-rose-600 text-2xl">{pieChartData.achieveGoalTime}</p>
                                    <p>/</p>
                                    <p>{pieChartData.all}日</p>
                                </div>
                                <p className = "text-center mt-2 text-gray-500">決めた目標時間よりもやることをやっています。</p>
                            </div>

                            <div className = {`mt-4 border-2 ${selectedColor == "blue" && "border-sky-400 bg-sky-50"} ${selectedColor == "whiteBlack" && "border-gray-400 bg-gray-50"} ${selectedColor == "pink" && "border-pink-400 bg-pink-50 text-pink-700"} rounded-xl shadow-xl px-2 py-4`}>
                                <p className = "text-lg text-center">やるべきことをやった合計時間</p>
                                <div className = {` pb-3 ${selectedColor == "blue" && "border-sky-400"} ${selectedColor == "whiteBlack" && "border-gray-400"} ${selectedColor == "pink" && "border-pink-400"} border-dashed mt-1 flex justify-center items-center gap-x-2`}>
                                    <p className = "text-rose-600 text-2xl">{toDoSummary.sumToDoHour}</p>
                                    <p>時間</p>
                                    <p className = "text-rose-600 text-2xl">{toDoSummary.sumToDoMin}</p>
                                    <p>分</p>
                                </div>
                                <div className = {`border-b-2 pb-4 ${selectedColor == "blue" && "border-sky-400"} ${selectedColor == "whiteBlack" && "border-gray-400"} ${selectedColor == "pink" && "border-pink-400"} border-dashed mt-1 flex justify-center items-center gap-x-2`}>
                                    <p className = "text-lg text-center">一日平均時間 :</p>
                                    <p className = "text-rose-600 text-2xl">{toDoSummary.aveToDoHour}</p>
                                    <p>時間</p>
                                    <p className = "text-rose-600 text-2xl">{toDoSummary.aveToDoMin}</p>
                                    <p>分</p>
                                </div>

                                <div className = "md:hidden mt-5 flex justify-center items-center">
                                    <div className = {`text-center border-r-2 ${selectedColor == "blue" && "border-sky-400"} ${selectedColor == "whiteBlack" && "border-gray-400"} ${selectedColor == "pink" && "border-pink-400"} border-dashed pr-4`}>
                                        <p className = {`border-b-2 pb-2 ${selectedColor == "blue" && "border-sky-400"} ${selectedColor == "whiteBlack" && "border-gray-400"} ${selectedColor == "pink" && "border-pink-400"} border-dashed`}>長くできた日</p>
                                        {toDoSummary.long1stDate !== "" && 
                                            <div className = "mt-2">
                                                <p className = "text-yellow-600 text-lg">1位</p>
                                                <p className = "mt-1">{formatDate(toDoSummary.long1stDate)}</p>
                                                <div className="flex justify-center items-center gap-x-1">
                                                    <p className = "text-lg text-rose-600">{toDoSummary.long1stHour}</p>
                                                    <p>時間</p>
                                                    <p className = "text-lg text-rose-600">{toDoSummary.long1stMin}</p>
                                                    <p>分</p>
                                                </div>
                                            </div>
                                        }
                                        {toDoSummary.long2ndDate !== "" &&
                                            <div className = "mt-2">
                                                <p className = "text-slate-600 text-lg">2位</p>
                                                <p className = "mt-1">{formatDate(toDoSummary.long2ndDate)}</p>
                                                <div className="flex justify-center items-center gap-x-1">
                                                    <p className = "text-lg text-rose-600">{toDoSummary.long2ndHour}</p>
                                                    <p>時間</p>
                                                    <p className = "text-lg text-rose-600">{toDoSummary.long2ndMin}</p>
                                                    <p>分</p>
                                                </div>
                                            </div>
                                        }
                                        {toDoSummary.long3rdDate !== "" &&
                                            <div className = "mt-2">
                                                <p className = "text-rose-800 text-lg">3位</p>
                                                <p className = "mt-1">{formatDate(toDoSummary.long3rdDate)}</p>
                                                <div className="flex justify-center items-center gap-x-1">
                                                    <p className = "text-lg text-rose-600">{toDoSummary.long3rdHour}</p>
                                                    <p>時間</p>
                                                    <p className = "text-lg text-rose-600">{toDoSummary.long3rdMin}</p>
                                                    <p>分</p>
                                                </div>
                                            </div>
                                        }
                                    </div>
                                    <div className = "text-center pl-4">
                                        <p className = {`border-b-2 pb-2 ${selectedColor == "blue" && "border-sky-400"} ${selectedColor == "whiteBlack" && "border-gray-400"} ${selectedColor == "pink" && "border-pink-400"} border-dashed`}>短かった日</p>
                                        {toDoSummary.short1stDate !== "" &&
                                            <div className = "mt-2">
                                                <p className = "text-yellow-600 text-lg">1位</p>
                                                <p className = "mt-1">{formatDate(toDoSummary.short1stDate)}</p>
                                                <div className="flex justify-center items-center gap-x-1">
                                                    <p className = "text-lg text-sky-600">{toDoSummary.short1stHour}</p>
                                                    <p>時間</p>
                                                    <p className = "text-lg text-sky-600">{toDoSummary.short1stMin}</p>
                                                    <p>分</p>
                                                </div>
                                            </div>
                                        }
                                        {toDoSummary.short2ndDate !== "" &&
                                            <div className = "mt-2">
                                                <p className = "text-slate-600 text-lg">2位</p>
                                                <p className = "mt-1">{formatDate(toDoSummary.short2ndDate)}</p>
                                                <div className="flex justify-center items-center gap-x-1">
                                                    <p className = "text-lg text-sky-600">{toDoSummary.short2ndHour}</p>
                                                    <p>時間</p>
                                                    <p className = "text-lg text-sky-600">{toDoSummary.short2ndMin}</p>
                                                    <p>分</p>
                                                </div>
                                            </div>
                                        }
                                        {toDoSummary.short3rdDate !== "" &&
                                            <div className = "mt-2">
                                                <p className = "text-rose-800 text-lg">3位</p>
                                                <p className = "mt-1">{formatDate(toDoSummary.short3rdDate)}</p>
                                                <div className="flex justify-center items-center gap-x-1">
                                                    <p className = "text-lg text-sky-600">{toDoSummary.short3rdHour}</p>
                                                    <p>時間</p>
                                                    <p className = "text-lg text-sky-600">{toDoSummary.short3rdMin}</p>
                                                    <p>分</p>
                                                </div>
                                            </div>
                                        }
                                    </div>
                                </div>

                                <div className = "hidden md:flex mt-5 justify-center items-center">
                                    <div className = {`text-center border-r-2 ${selectedColor == "blue" && "border-sky-400"} ${selectedColor == "whiteBlack" && "border-gray-400"} ${selectedColor == "pink" && "border-pink-400"} border-dashed pr-6`}>
                                        <p className = {`border-b-2 pb-2 ${selectedColor == "blue" && "border-sky-400"} ${selectedColor == "whiteBlack" && "border-gray-400"} ${selectedColor == "pink" && "border-pink-400"} border-dashed`}>長くできた日</p>
                                        {toDoSummary.long1stDate !== "" &&
                                            <div className = "mt-2">
                                                <p className = "text-yellow-600 text-lg">1位</p>
                                                <div className = "flex justify-center items-center mt-1 gap-x-6">
                                                    <p className = "">{formatDate(toDoSummary.long1stDate)}</p>
                                                    <div className="flex justify-center items-center gap-x-1">
                                                        <p className = "text-lg text-rose-600">{toDoSummary.long1stHour}</p>
                                                        <p>時間</p>
                                                        <p className = "text-lg text-rose-600">{toDoSummary.long1stMin}</p>
                                                        <p>分</p>
                                                    </div>
                                                </div>
                                            </div>
                                        }
                                        {toDoSummary.long2ndDate !== "" &&
                                            <div className = "mt-2">
                                                <p className = "text-slate-600 text-lg">2位</p>
                                                <div className = "flex justify-center items-center mt-1 gap-x-6">
                                                    <p className = "">{formatDate(toDoSummary.long2ndDate)}</p>
                                                    <div className="flex justify-center items-center gap-x-1">
                                                        <p className = "text-lg text-rose-600">{toDoSummary.long2ndHour}</p>
                                                        <p>時間</p>
                                                        <p className = "text-lg text-rose-600">{toDoSummary.long2ndMin}</p>
                                                        <p>分</p>
                                                    </div>
                                                </div>
                                            </div>
                                        }
                                        {toDoSummary.long3rdDate !== "" &&
                                            <div className = "mt-2">
                                                <p className = "text-rose-800 text-lg">3位</p>
                                                <div className = "flex justify-center items-center mt-1 gap-x-6">
                                                    <p className = "">{formatDate(toDoSummary.long3rdDate)}</p>
                                                    <div className="flex justify-center items-center gap-x-1">
                                                        <p className = "text-lg text-rose-600">{toDoSummary.long3rdHour}</p>
                                                        <p>時間</p>
                                                        <p className = "text-lg text-rose-600">{toDoSummary.long3rdMin}</p>
                                                        <p>分</p>
                                                    </div>
                                                </div>
                                            </div>
                                        }
                                    </div>
                                    <div className = "text-center pl-6">
                                        <p className = {`border-b-2 pb-2 ${selectedColor == "blue" && "border-sky-400"} ${selectedColor == "whiteBlack" && "border-gray-400"} ${selectedColor == "pink" && "border-pink-400"} border-dashed`}>短かった日</p>
                                        {toDoSummary.short1stDate !== "" &&
                                            <div className = "mt-2">
                                                <p className = "text-yellow-600 text-lg">1位</p>
                                                <div className = "flex justify-center items-center mt-1 gap-x-6">
                                                    <p className = "">{formatDate(toDoSummary.short1stDate)}</p>
                                                    <div className="flex justify-center items-center gap-x-1">
                                                        <p className = "text-lg text-sky-600">{toDoSummary.short1stHour}</p>
                                                        <p>時間</p>
                                                        <p className = "text-lg text-sky-600">{toDoSummary.short1stMin}</p>
                                                        <p>分</p>
                                                    </div>
                                                </div>
                                            </div>
                                        }
                                        {toDoSummary.short2ndDate !== "" &&
                                            <div className = "mt-2">
                                                <p className = "text-slate-600 text-lg">2位</p>
                                                <div className = "flex justify-center items-center mt-1 gap-x-6">
                                                    <p className = "">{formatDate(toDoSummary.short2ndDate)}</p>
                                                    <div className="flex justify-center items-center gap-x-1">
                                                        <p className = "text-lg text-sky-600">{toDoSummary.short2ndHour}</p>
                                                        <p>時間</p>
                                                        <p className = "text-lg text-sky-600">{toDoSummary.short2ndMin}</p>
                                                        <p>分</p>
                                                    </div>
                                                </div>
                                            </div>
                                        }
                                        {toDoSummary.short3rdDate !== "" &&
                                            <div className = "mt-2">
                                                <p className = "text-rose-800 text-lg">3位</p>
                                                <div className = "flex justify-center items-center mt-1 gap-x-6">
                                                    <p className = "">{formatDate(toDoSummary.short3rdDate)}</p>
                                                    <div className="flex justify-center items-center gap-x-1">
                                                        <p className = "text-lg text-sky-600">{toDoSummary.short3rdHour}</p>
                                                        <p>時間</p>
                                                        <p className = "text-lg text-sky-600">{toDoSummary.short3rdMin}</p>
                                                        <p>分</p>
                                                    </div>
                                                </div>
                                            </div>
                                        }
                                    </div>
                                </div>
                            </div>

                            {graph ?
                                // 開いてるとき
                                // むずいから一番最後に
                                <div>
                                    <ToDoTimeGraph graphData = {graphData}/>
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

export default SummaryToDo