import { useEffect, useState } from "react"
import { useAppDispatch, useAppSelector } from "../../hooks/ReduxHooks"
import axios from "axios"
import { nowYearMonthDate } from "../../constant/date"
import { setListNumberOfDay, setListSummary, setListSummaryInit } from "../../store/summary"
import type { NGListInitStateInterface } from "../../constant/NGListInitState"
import ListGraphPieChart from "./Graph/ListGraphPieChart"
import ListGraphAhieve from "./Graph/ListGraphAhieve"
import ListGraphDaily from "./Graph/ListGraphDaily"

const listSummaryInit = {
    listDone: 0,
    listAll: 0,
    achievementHighest: "",
    achievementLowest: ""
}

const SummaryNG = () => {

    const [open, setOpen] = useState(true)
    const [graph, setGraph] = useState(false)
    const [graphData, setGraphData] = useState<{ name: string; rate: number }[]>([])
    const [dailyGraph, setDailyGraph] = useState<{ date: string; rate: number}[]>([])
    const option = [3, 5, 7, 10, 15, 20, 30, 50, 100, 300, 500, 1000]
    const selectedColor = useAppSelector((state) => state.color.color)
    const dispatch = useAppDispatch()
    const { userId } = useAppSelector((state) => state.login)
    const { listNumberOfDay, listSummary } = useAppSelector((state) => state.summary)

    useEffect(() => {
        const getListData = async () => {
            try {
                const res = await axios.get("/api/summary/getListData", {
                    params: {
                        userId: userId,
                        targetDate: nowYearMonthDate,
                        listNumberOfDay: listNumberOfDay
                    }
                })
                if (res.data.length == 0) return dispatch(setListSummaryInit())
                let listDone = 0
                let listAll = 0
                const selectedListName: string[] = []
                const selectedListDone: number[] = []
                const selectedListAll: number[] = []
                for (let i = 0; i < res.data.length; i++) {
                    listDone += res.data[i].importListCheck.filter((item: boolean) => item).length + res.data[i].addListCheck.filter((item: boolean) => item).length
                    listAll += res.data[i].importListCheck.length + res.data[i].addListCheck.length

                    res.data[i].addList.forEach((_list: string, index: number) => {
                        if (selectedListName.includes(_list)) {
                            const _index = selectedListName.indexOf(_list)
                            selectedListAll[_index] ++
                            if (res.data[i].addListCheck[index]) {
                                selectedListDone[_index] ++
                            }
                        } else {
                            selectedListName.push(_list)
                            selectedListAll.push(1)
                            if (res.data[i].addListCheck[index]) {
                                selectedListDone.push(1)
                            } else {
                                selectedListDone.push(0)
                            }
                        }
                    })

                    res.data[i].importList.forEach((_list: NGListInitStateInterface, index: number) => {
                        _list.list.map((item: string) => {
                            if (selectedListName.includes(item)) {
                                const _index = selectedListName.indexOf(item)
                                selectedListAll[_index] ++
                                if (res.data[i].importListCheck[index]) {
                                    selectedListDone[_index] ++
                                }
                            } else {
                                selectedListName.push(item)
                                selectedListAll.push(1)
                                if (res.data[i].importListCheck[index]) {
                                    selectedListDone.push(1)
                                } else {
                                    selectedListDone.push(0)
                                }
                            }
                        })
                    })
                }

                setGraphData(selectedListName.map((name, i) => {
                    const done = selectedListDone[i]
                    const all = selectedListAll[i]
                    const rate = all === 0 ? 0 : Math.round((done / all) * 100)
                    return {
                        name: name,
                        rate: rate
                    }
                }))

                setDailyGraph(res.data.reverse()
                    .filter((item: { targetDate: string; importList: NGListInitStateInterface[]; importListCheck: boolean[]; addList: string[]; addListCheck: boolean[] }) => {
                        return item.importListCheck.length + item.addListCheck.length > 0
                    })
                    .map((_data: { targetDate: string; importList: NGListInitStateInterface[]; importListCheck: boolean[]; addList: string[]; addListCheck: boolean[] }) => {
                        const dateStr = new Date(_data.targetDate)
                        const displayDate = `${dateStr.getFullYear()}/${dateStr.getMonth() + 1}/${dateStr.getDate()}`;
                        const done = _data.importListCheck.filter((item: boolean) => item).length + _data.addListCheck.filter((item: boolean) => item).length 
                        const all = _data.importListCheck.length + _data.addListCheck.length
                        const rate = Math.round((done / all) * 100)
                        return {
                            date: displayDate,
                            rate: rate
                        }
                    })
                )

                let highestName = ""
                let lowestName = ""
                let highestRate = -1
                let lowestRate = 2

                for(let i=0; i < selectedListName.length; i++) {
                    if (selectedListAll[i] == 0) continue
                    const rate = selectedListDone[i] / selectedListAll[i]
                    if (rate > highestRate) {
                        highestName = selectedListName[i]
                        highestRate = rate
                    }
                    if (rate < lowestRate) {
                        lowestName = selectedListName[i]
                        lowestRate = rate
                    }
                }

                const payload = {
                    listDone: listDone,
                    listAll: listAll,
                    achievementHighest: highestName,
                    achievementLowest: lowestName
                }

                dispatch(setListSummary(payload))
            } catch(e) {
                console.log("getListDataでエラー", e)
            }
        }
        getListData()
    }, [userId, listNumberOfDay, dispatch])

    const changeList = (value: string) => {
        dispatch(setListNumberOfDay(Number(value)))
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
                <h2 className = "text-2xl text-gray-700">禁止リストの詳細</h2>
            </div>

            {/* ここから下がルーティーンの管理 */}
            {open &&
                <div className = "mt-4">

                    <div className = "flex justify-center items-center gap-x-2">
                        <p>過去</p>
                        <div>
                            <select
                                data-testid = "select-list-days"
                                className = {`px-2 w-20 text-center border-2 ${selectedColor !== "pink" && "border-gray-400/90"} ${selectedColor == "pink" && "border-pink-300"} rounded-lg shadow-lg hover:border-sky-400 transition duration-200`}
                                value = {listNumberOfDay}
                                onChange = {(e) => changeList(e.target.value)}
                            >
                                {option.map((opt) => <option key = {opt} value = {opt}>{opt}</option>)}
                            </select>
                        </div>
                        <p>日間</p>
                    </div>

                    {JSON.stringify(listSummary) !== JSON.stringify(listSummaryInit) ? (
                        <div>
                            {/* 円グラフ(最後に進める) */}
                            <div>
                                <ListGraphPieChart/>
                            </div>

                            <div className = "flex justify-center items-center text-lg gap-x-2">
                                <p>過去{listNumberOfDay}日間で</p>
                                <p className = "text-rose-600 text-2xl">{listSummary.listDone}</p>
                                <p>/</p>
                                <p>{listSummary.listAll}個</p>
                            </div>
                            <p className = "text-center mt-2 text-gray-500">の禁止した行為をしていません。</p>

                            <div className = {`md:hidden mt-4 border-2 ${selectedColor !== "pink" && "border-gray-400/90"} ${selectedColor == "pink" && "border-pink-300"} rounded-lg shadow-lg mx-1 py-4 px-3`}>
                                <div className = {`border-b-2 pb-3 ${selectedColor !== "pink" && "border-gray-400"} ${selectedColor == "pink" && "border-pink-400"} border-dashed`}>
                                    <p className = "text-center text-md">最も達成率が高い :</p>
                                    <p className = "text-center text-rose-400 mt-2 text-lg">{listSummary.achievementHighest}</p>
                                </div>
                                <div className = "pt-3">
                                    <p className = "text-center text-md">最も達成率が低い :</p>
                                    <p className = "text-center text-rose-400 mt-2 text-lg">{listSummary.achievementLowest}</p>
                                </div>
                            </div>

                            <div className = {`hidden md:flex justify-center items-center mt-4 border-2 ${selectedColor !== "pink" && "border-gray-400/90"} ${selectedColor == "pink" && "border-pink-300"} rounded-lg shadow-lg mx-1 py-4 px-3`}>
                                <div className = {`pr-8 border-r-2 ${selectedColor !== "pink" && "border-gray-400"} ${selectedColor == "pink" && "border-pink-400"} border-dashed`}>
                                    <p className = "text-center text-md">最も達成率が高い :</p>
                                    <p className = "text-center text-rose-400 mt-2 text-lg">{listSummary.achievementHighest}</p>
                                </div>
                                <div className = "pl-8">
                                    <p className = "text-center text-md">最も達成率が低い :</p>
                                    <p className = "text-center text-rose-400 mt-2 text-lg">{listSummary.achievementLowest}</p>
                                </div>
                            </div>

                            {graph ?
                                // 開いてるとき
                                // むずいから一番最後に
                                <div>
                                    <div>
                                        <ListGraphAhieve chartData = {graphData}/>
                                    </div>
                                    <div>
                                        <ListGraphDaily chartData = {dailyGraph}/>
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

export default SummaryNG