import { useEffect, useState } from "react"
import { useAppDispatch, useAppSelector } from "../../hooks/ReduxHooks"
import axios from "axios"
import { nowYearMonthDate } from "../../constant/date"
import { format } from "date-fns"
import { setJournalNumberOfDay, setJournalSummary, setJournalSummaryInit } from "../../store/summary"
import formatDate from "../../func/formatDate"
import JournalCountGraph from "./Graph/JournalCountGraph"

const journalSummaryInit = {
    sumJournalCount: 0,
    aveJournalCount: 0,
    long1stDate: "",
    long1stCount: 0,
    long2ndDate: "",
    long2ndCount: 0,
    long3rdDate: "",
    long3rdCount: 0,
    short1stDate: "",
    short1stCount: 0,
    short2ndDate: "",
    short2ndCount: 0,
    short3rdDate: "",
    short3rdCount: 0
}

const SummaryJournal = () => {

    const [open, setOpen] = useState(true)
    const [graph, setGraph] = useState(false)
    const [graphData, setGraphData] = useState<{ targetDate: string; journalCount: number; }[]>([])
    const dispatch = useAppDispatch()
    const option = [3, 5, 7, 10, 15, 20, 30, 50, 100, 300, 500, 1000]
    const selectedColor = useAppSelector((state) => state.color.color)
    const { userId } = useAppSelector((state) => state.login)
    const { journalNumberOfDay, journalSummary } = useAppSelector((state) => state.summary)

    useEffect(() => {
        const getJournalData = async () => {
            try {
                const res = await axios.get("/api/summary/getJournalData", {
                    params: {
                        userId: userId,
                        targetDate: nowYearMonthDate,
                        journalNumberOfDay: journalNumberOfDay
                    }
                })
                if (res.data.length == 0) return dispatch(setJournalSummaryInit())
                const tidiedUpData = res.data.map((_data: { targetDate: string; journalCount: number[]; }) => {
                    return {
                        targetDate: format(_data.targetDate, "yyyy-MM-dd"),
                        journalCount: _data.journalCount.reduce((sum: number, element: number) => sum + element, 0)
                    }
                })

                const payload = {
                    sumJournalCount: 0,
                    aveJournalCount: 0,
                    long1stDate: "",
                    long1stCount: 0,
                    long2ndDate: "",
                    long2ndCount: 0,
                    long3rdDate: "",
                    long3rdCount: 0,
                    short1stDate: "",
                    short1stCount: 0,
                    short2ndDate: "",
                    short2ndCount: 0,
                    short3rdDate: "",
                    short3rdCount: 0
                }

                tidiedUpData.forEach((data: { targetDate: string; journalCount: number; }) => {
                    payload.sumJournalCount += data.journalCount
                })

                // journalCountが大きい順に並び替える
                const rearrangeData: { targetDate: string; journalCount: number; }[] = [...tidiedUpData].sort((a, b) => b.journalCount - a.journalCount);
                if (rearrangeData.length >= 1) {
                    payload.long1stDate = rearrangeData[0].targetDate
                    payload.long1stCount = rearrangeData[0].journalCount
                }
                if (rearrangeData.length >= 2) {
                    payload.long2ndDate = rearrangeData[1].targetDate
                    payload.long2ndCount = rearrangeData[1].journalCount
                }
                if (rearrangeData.length >= 3) {
                    payload.long3rdDate = rearrangeData[2].targetDate
                    payload.long3rdCount = rearrangeData[2].journalCount
                }

                if (rearrangeData.length >= 1) {
                    payload.short1stDate = rearrangeData[rearrangeData.length - 1].targetDate
                    payload.short1stCount = rearrangeData[rearrangeData.length - 1].journalCount
                }
                if (rearrangeData.length >= 2) {
                    payload.short2ndDate = rearrangeData[rearrangeData.length - 2].targetDate
                    payload.short2ndCount = rearrangeData[rearrangeData.length - 2].journalCount
                }
                if (rearrangeData.length >= 3) {
                    payload.short3rdDate = rearrangeData[rearrangeData.length - 3].targetDate
                    payload.short3rdCount = rearrangeData[rearrangeData.length - 3].journalCount
                }

                const dataLength = tidiedUpData.length
                payload.aveJournalCount = Math.trunc(payload.sumJournalCount / dataLength)

                // グラフ用にデータをセットする
                setGraphData(tidiedUpData)

                dispatch(setJournalSummary(payload))

            } catch (e) {
                console.log("getJournalDataでエラー", e)
            }
        }
        getJournalData()
    }, [userId, dispatch, journalNumberOfDay])

    const changeJournal = (value: string) => {
        dispatch(setJournalNumberOfDay(Number(value)))
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
                <h2 className = "text-2xl text-gray-700">ジャーナルの詳細</h2>
            </div>

            {/* ここから下がルーティーンの管理 */}
            {open &&
                <div className = "mt-4">

                    <div className = "flex justify-center items-center gap-x-2">
                        <p>過去</p>
                        <div>
                            <select
                                data-testid = "select-journal-days"
                                className = {`px-2 w-20 text-center border-2 ${selectedColor !== "pink" && "border-gray-400/90"} ${selectedColor == "pink" && "border-pink-300"} rounded-lg shadow-lg hover:border-sky-400 transition duration-200`}
                                value = {journalNumberOfDay}
                                onChange = {(e) => changeJournal(e.target.value)}
                            >
                                {option.map((opt) => <option key = {opt} value = {opt}>{opt}</option>)}
                            </select>
                        </div>
                        <p>日間</p>
                    </div>

                    {JSON.stringify(journalSummary) !== JSON.stringify(journalSummaryInit) ? (
                        <div>
                            <div className = "text-center mt-4">
                                <p className = "text-lg">あなたの過去{journalNumberOfDay}日間の合計文字数は</p>
                                <div className = "mt-1 flex justify-center items-center gap-x-2">
                                    <p className = "mt-1 text-2xl text-rose-600">{journalSummary.sumJournalCount}</p>
                                    <p className = "mt-1 text-2xl">文字</p>
                                </div>
                                <p className = "mt-2 text-lg">です</p>
                                <div className = "mt-2 flex justify-center items-center gap-x-2">
                                    <p className = "mt-1 text-lg">平均文字数は</p>
                                    <p className = "mt-1 text-2xl text-rose-600">{journalSummary.aveJournalCount}</p>
                                    <p className = "mt-1 text-lg">文字です</p>
                                </div>
                            </div>

                            <div className = {`mt-6 flex justify-center items-center border-2 py-4 px-2 ${selectedColor == "blue" && "bg-sky-50 border-sky-400"} ${selectedColor == "whiteBlack" && "bg-gray-50 border-gray-400"} ${selectedColor == "pink" && "bg-pink-50 border-pink-400 text-pink-700"} border-dashed rounded-xl shadow-xl`}>
                                    <div className = {`md:hidden  text-center border-r-2 ${selectedColor == "blue" && "border-sky-400"} ${selectedColor == "whiteBlack" && "border-gray-400"} ${selectedColor == "pink" && "border-pink-400"} border-dashed pr-4`}>
                                        <p className = {`border-b-2 pb-2 ${selectedColor == "blue" && "border-sky-400"} ${selectedColor == "whiteBlack" && "border-gray-400"} ${selectedColor == "pink" && "border-pink-400"} border-dashed`}>長く書いた日</p>
                                        {journalSummary.long1stDate !== "" &&
                                            <div className = "mt-2">
                                                <p className = "text-yellow-600 text-lg">1位</p>
                                                <p className = "mt-1">{formatDate(journalSummary.long1stDate)}</p>
                                                <div className="flex justify-center items-center gap-x-1">
                                                    <p className = "text-xl text-rose-600">{journalSummary.long1stCount}</p>
                                                    <p>文字</p>
                                                </div>
                                            </div>
                                        }
                                        {journalSummary.long2ndDate !== "" &&
                                            <div className = "mt-2">
                                                <p className = "text-slate-600 text-lg">2位</p>
                                                <p className = "mt-1">{formatDate(journalSummary.long2ndDate)}</p>
                                                <div className="flex justify-center items-center gap-x-1">
                                                    <p className = "text-xl text-rose-600">{journalSummary.long2ndCount}</p>
                                                    <p>文字</p>
                                                </div>
                                            </div>
                                        }
                                        {journalSummary.long3rdDate !== "" &&
                                            <div className = "mt-2">
                                                <p className = "text-rose-800 text-lg">3位</p>
                                                <p className = "mt-1">{formatDate(journalSummary.long3rdDate)}</p>
                                                <div className="flex justify-center items-center gap-x-1">
                                                    <p className = "text-xl text-rose-600">{journalSummary.long3rdCount}</p>
                                                    <p>文字</p>
                                                </div>
                                            </div>
                                        }
                                    </div>

                                    <div className = {`hidden md:block  text-center border-r-2 ${selectedColor == "blue" && "border-sky-400"} ${selectedColor == "whiteBlack" && "border-gray-400"} ${selectedColor == "pink" && "border-pink-400"} border-dashed pr-6`}>
                                        <p className = {`border-b-2 pb-2 ${selectedColor == "blue" && "border-sky-400"} ${selectedColor == "whiteBlack" && "border-gray-400"} ${selectedColor == "pink" && "border-pink-400"} border-dashed`}>長く書いた日</p>
                                        {journalSummary.long1stDate !== "" &&
                                            <div className = "mt-2">
                                                <p className = "text-yellow-600 text-lg">1位</p>
                                                <div className = "flex justify-center items-center gap-x-6">
                                                    <p className = "">{formatDate(journalSummary.long1stDate)}</p>
                                                    <div className="flex justify-center items-center gap-x-1">
                                                        <p className = "text-xl text-rose-600">{journalSummary.long1stCount}</p>
                                                        <p>文字</p>
                                                    </div>
                                                </div>
                                            </div>
                                        }
                                        {journalSummary.long2ndDate !== "" &&
                                            <div className = "mt-2">
                                                <p className = "text-slate-600 text-lg">2位</p>
                                                <div className = "flex justify-center items-center gap-x-6">
                                                    <p className = "">{formatDate(journalSummary.long2ndDate)}</p>
                                                    <div className="flex justify-center items-center gap-x-1">
                                                        <p className = "text-xl text-rose-600">{journalSummary.long2ndCount}</p>
                                                        <p>文字</p>
                                                    </div>
                                                </div>
                                            </div>
                                        }
                                        {journalSummary.long3rdDate !== "" &&
                                            <div className = "mt-2">
                                                <p className = "text-rose-800 text-lg">3位</p>
                                                <div className = "flex justify-center items-center gap-x-6">
                                                    <p className = "">{formatDate(journalSummary.long3rdDate)}</p>
                                                    <div className="flex justify-center items-center gap-x-1">
                                                        <p className = "text-xl text-rose-600">{journalSummary.long3rdCount}</p>
                                                        <p>文字</p>
                                                    </div>
                                                </div>
                                            </div>
                                        }
                                    </div>

                                    <div className = "md:hidden  text-center pl-4">
                                        <p className = {`border-b-2 pb-2 ${selectedColor == "blue" && "border-sky-400"} ${selectedColor == "whiteBlack" && "border-gray-400"} ${selectedColor == "pink" && "border-pink-400"} border-dashed`}>短かった日</p>
                                        {journalSummary.short1stDate !== "" &&
                                            <div className = "mt-2">
                                                <p className = "text-yellow-600 text-lg">1位</p>
                                                <p className = "mt-1">{formatDate(journalSummary.short1stDate)}</p>
                                                <div className="flex justify-center items-center gap-x-1">
                                                    <p className = "text-xl text-sky-600">{journalSummary.short1stCount}</p>
                                                    <p>文字</p>
                                                </div>
                                            </div>
                                        }
                                        {journalSummary.short2ndDate !== "" &&
                                            <div className = "mt-2">
                                                <p className = "text-slate-600 text-lg">2位</p>
                                                <p className = "mt-1">{formatDate(journalSummary.short2ndDate)}</p>
                                                <div className="flex justify-center items-center gap-x-1">
                                                    <p className = "text-xl text-sky-600">{journalSummary.short2ndCount}</p>
                                                    <p>文字</p>
                                                </div>
                                            </div>
                                        }
                                        {journalSummary.short3rdDate !== "" &&
                                            <div className = "mt-2">
                                                <p className = "text-rose-800 text-lg">3位</p>
                                                <p className = "mt-1">{formatDate(journalSummary.short3rdDate)}</p>
                                                <div className="flex justify-center items-center gap-x-1">
                                                    <p className = "text-xl text-sky-600">{journalSummary.short3rdCount}</p>
                                                    <p>文字</p>
                                                </div>
                                            </div>
                                        }
                                    </div>

                                    <div className = "hidden md:block  text-center pl-6">
                                        <p className = {`border-b-2 pb-2 ${selectedColor == "blue" && "border-sky-400"} ${selectedColor == "whiteBlack" && "border-gray-400"} ${selectedColor == "pink" && "border-pink-400"} border-dashed`}>短かった日</p>
                                        {journalSummary.short1stDate !== "" &&
                                            <div className = "mt-2">
                                                <p className = "text-yellow-600 text-lg">1位</p>
                                                <div className = "flex justify-center items-center gap-x-6">
                                                    <p className = "">{formatDate(journalSummary.short1stDate)}</p>
                                                    <div className="flex justify-center items-center gap-x-1">
                                                        <p className = "text-xl text-sky-600">{journalSummary.short1stCount}</p>
                                                        <p>文字</p>
                                                    </div>
                                                </div>
                                            </div>
                                        }
                                        {journalSummary.short2ndDate !== "" &&
                                            <div className = "mt-2">
                                                <p className = "text-slate-600 text-lg">2位</p>
                                                <div className = "flex justify-center items-center gap-x-6">
                                                    <p className = "">{formatDate(journalSummary.short2ndDate)}</p>
                                                    <div className="flex justify-center items-center gap-x-1">
                                                        <p className = "text-xl text-sky-600">{journalSummary.short2ndCount}</p>
                                                        <p>文字</p>
                                                    </div>
                                                </div>
                                            </div>
                                        }
                                        {journalSummary.short3rdDate !== "" &&
                                            <div className = "mt-2">
                                                <p className = "text-rose-800 text-lg">3位</p>
                                                <div className = "flex justify-center items-center gap-x-6">
                                                    <p className = "">{formatDate(journalSummary.short3rdDate)}</p>
                                                    <div className="flex justify-center items-center gap-x-1">
                                                        <p className = "text-xl text-sky-600">{journalSummary.short3rdCount}</p>
                                                        <p>文字</p>
                                                    </div>
                                                </div>
                                            </div>
                                        }
                                    </div>
                            </div>

                            {graph ?
                                // 開いてるとき
                                // むずいから一番最後に
                                <div>
                                    <JournalCountGraph graphData = {graphData}/>
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

export default SummaryJournal