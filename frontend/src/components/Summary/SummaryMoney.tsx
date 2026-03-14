import { useEffect, useState } from "react"
import axios from "axios"
import { nowYearMonthDate } from "../../constant/date"
import { useAppSelector, useAppDispatch } from "../../hooks/ReduxHooks"
import { setMoneyNumberOfDay, setMoneySummary, setMoneySummaryInit } from "../../store/summary"
import { format } from "date-fns"
import MoneyInvestmentGraph from "./Graph/MoneyInvestmentGraph"
import MoneyWasteGraph from "./Graph/MoneyWasteGraph"
import MoneyConsumptionGraph from "./Graph/MoneyConsumptionGraph"
import MoneyUseSumGraph from "./Graph/MoneyUseSumGraph"

const SummaryMoney = () => {

    const [open, setOpen] = useState(true)
    const [graph, setGraph] = useState(false)
    const dispatch = useAppDispatch()
    const option = [3, 5, 7, 10, 15, 20, 30, 50, 100, 300, 500, 1000]
    const selectedColor = useAppSelector((state) => state.color.color)
    const { userId } = useAppSelector((state) => state.login)
    const { moneyNumberOfDay, moneySummary } = useAppSelector((state) => state.summary)

    const [investmentData, setInvestmentData] = useState<{ targetDate: string; investment: number; }[]>([])
    const [wasteData, setWasteData] = useState<{ targetDate: string; waste: number; }[]>([])
    const [consumptionData, setConsumptionData] = useState<{ targetDate: string; consumption: number; }[]>([])
    const [useSumData, setUseSumData] = useState<{ targetDate: string; useSum: number; }[]>([])

    useEffect(() => {
        const getMoneyData = async () => {
            try {
                const res = await axios.get("/api/summary/getMoneyData", {
                    params: {
                        userId: userId,
                        targetDate: nowYearMonthDate,
                        moneyNumberOfDay: moneyNumberOfDay
                    }
                })
                if (res.data.length == 0) return dispatch(setMoneySummaryInit())

                const investmentArray: number[] = res.data.map((data: { targetDate: string; moneyInvestment: number; moneyWaste: number; moneyConsumption: number; moneyUseSum: number; }) => data.moneyInvestment)
                const sumInvestment = investmentArray.reduce((sum: number, count: number) => sum + count, 0)
                const minInvestment = Math.min(...investmentArray)
                const maxInvestment = Math.max(...investmentArray)
                const aveInvestment = Math.trunc(sumInvestment / res.data.length)
                
                const wasteArray: number[] = res.data.map((data: { targetDate: string; moneyInvestment: number; moneyWaste: number; moneyConsumption: number; moneyUseSum: number; }) => data.moneyWaste)
                const sumWaste = wasteArray.reduce((sum: number, count: number) => sum + count, 0)
                const minWaste = Math.min(...wasteArray)
                const maxWaste = Math.max(...wasteArray)
                const aveWaste = Math.trunc(sumWaste / res.data.length)

                const consumptionArray: number[] = res.data.map((data: { targetDate: string; moneyInvestment: number; moneyWaste: number; moneyConsumption: number; moneyUseSum: number; }) => data.moneyConsumption)
                const sumConsumption = consumptionArray.reduce((sum: number, count: number) => sum + count, 0)
                const minConsumption = Math.min(...consumptionArray)
                const maxConsumption = Math.max(...consumptionArray)
                const aveConsumption = Math.trunc(sumConsumption / res.data.length)

                // グラフ用のstate更新
                setInvestmentData(res.data.map((_data: { targetDate: string; moneyInvestment: number; moneyWaste: number; moneyConsumption: number; moneyUseSum: number; }) => {
                    return {
                        targetDate: format(_data.targetDate, "yyyy-MM-dd"),
                        investment: _data.moneyInvestment
                    }
                }))
                setWasteData(res.data.map((_data: { targetDate: string; moneyInvestment: number; moneyWaste: number; moneyConsumption: number; moneyUseSum: number; }) => {
                    return {
                        targetDate: format(_data.targetDate, "yyyy-MM-dd"),
                        waste: _data.moneyWaste
                    }
                }))
                setConsumptionData(res.data.map((_data: { targetDate: string; moneyInvestment: number; moneyWaste: number; moneyConsumption: number; moneyUseSum: number; }) => {
                    return {
                        targetDate: format(_data.targetDate, "yyyy-MM-dd"),
                        consumption: _data.moneyConsumption
                    }
                }))
                setUseSumData(res.data.map((_data: { targetDate: string; moneyInvestment: number; moneyWaste: number; moneyConsumption: number; moneyUseSum: number; }) => {
                    return {
                        targetDate: format(_data.targetDate, "yyyy-MM-dd"),
                        useSum: _data.moneyUseSum
                    }
                }))

                dispatch(setMoneySummary({
                    aveInvestment: aveInvestment,
                    aveWaste: aveWaste,
                    aveConsumption: aveConsumption,
                    maxInvestment: maxInvestment,
                    maxWaste: maxWaste,
                    maxConsumption: maxConsumption,
                    minInvestment: minInvestment,
                    minWaste: minWaste,
                    minConsumption: minConsumption,
                    sumInvestment: sumInvestment,
                    sumWaste: sumWaste,
                    sumConsumption: sumConsumption,
                    sumUseMoney: sumInvestment + sumWaste + sumConsumption
                }))

            } catch(e) {
                console.log("getMoneyDataでエラー", e)
            }
        }
        getMoneyData()
    }, [userId, moneyNumberOfDay, dispatch])

    const changeMoney = (value: string) => {
        dispatch(setMoneyNumberOfDay(Number(value)))
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
                <h2 className = "text-2xl text-gray-700">お金の詳細</h2>
            </div>

            {/* ここから下がルーティーンの管理 */}
            {open &&
                <div className = "mt-4">

                    <div className = "flex justify-center items-center gap-x-2">
                        <p>過去</p>
                        <div>
                            <select
                                data-testid = "select-money-days"
                                className = {`px-2 w-20 text-center border-2 ${selectedColor !== "pink" && "border-gray-400/90"} ${selectedColor == "pink" && "border-pink-300"} rounded-lg shadow-lg hover:border-sky-400 transition duration-200`}
                                value = {moneyNumberOfDay}
                                onChange = {(e) => changeMoney(e.target.value)}
                            >
                                {option.map((opt) => <option key = {opt} value = {opt}>{opt}</option>)}
                            </select>
                        </div>
                        <p>日間</p>
                    </div>

                    {!Object.values(moneySummary).every((value) =>  value == 0) ? (
                        <div>
                            <div className = {`mt-4 border-b-2 pb-6 ${selectedColor !== "pink" && "border-gray-400"} ${selectedColor == "pink" && "border-pink-400"} border-dashed`}>
                                <div className = "md:grid grid-cols-2 ">
                                    <div className = {`md:mt-4 md:pr-2 md:border-r-2 ${selectedColor !== "pink" && "border-gray-400"} ${selectedColor == "pink" && "border-pink-400"} border-dashed`}>
                                        <p className = "text-center text-lg">過去{moneyNumberOfDay}日間のお金の使い方は</p>
                                        <div className = "grid grid-cols-4 mx-3 mt-3">
                                            <div className = {`border-b-2 border-r-2 border-dashed ${selectedColor !== "pink" && "border-gray-300"} ${selectedColor == "pink" && "border-pink-300"} text-center py-1`}></div>
                                            <div className = {`border-b-2 border-r-2 border-dashed ${selectedColor !== "pink" && "border-gray-300"} ${selectedColor == "pink" && "border-pink-300"} text-center py-1`}>投資</div>
                                            <div className = {`border-b-2 border-r-2 border-dashed  ${selectedColor !== "pink" && "border-gray-300"} ${selectedColor == "pink" && "border-pink-300"} text-center py-1`}>浪費</div>
                                            <div className = {`border-b-2 border-dashed ${selectedColor !== "pink" && "border-gray-300"} ${selectedColor == "pink" && "border-pink-300"} text-center py-1`}>消費</div>
                                            <div className = {`border-b-2 border-r-2 border-dashed ${selectedColor !== "pink" && "border-gray-300"} ${selectedColor == "pink" && "border-pink-300"} text-center py-1`}>平均</div>
                                            <div className = {`border-b-2 border-r-2 border-dashed ${selectedColor !== "pink" && "border-gray-300"} ${selectedColor == "pink" && "border-pink-300"} text-center py-1`}>{moneySummary.aveInvestment}</div>
                                            <div className = {`border-b-2 border-r-2 border-dashed ${selectedColor !== "pink" && "border-gray-300"} ${selectedColor == "pink" && "border-pink-300"} text-center py-1`}>{moneySummary.aveWaste}</div>
                                            <div className = {`border-b-2 text-center border-dashed ${selectedColor !== "pink" && "border-gray-300"} ${selectedColor == "pink" && "border-pink-300"} py-1`}>{moneySummary.aveConsumption}</div>
                                            <div className = {`border-b-2 border-r-2 border-dashed ${selectedColor !== "pink" && "border-gray-300"} ${selectedColor == "pink" && "border-pink-300"} text-center py-1`}>最大</div>
                                            <div className = {`border-b-2 border-r-2 border-dashed ${selectedColor !== "pink" && "border-gray-300"} ${selectedColor == "pink" && "border-pink-300"} text-center py-1`}>{moneySummary.maxInvestment}</div>
                                            <div className = {`border-b-2 border-r-2 border-dashed ${selectedColor !== "pink" && "border-gray-300"} ${selectedColor == "pink" && "border-pink-300"} text-center py-1`}>{moneySummary.maxWaste}</div>
                                            <div className = {`border-b-2 text-center border-dashed ${selectedColor !== "pink" && "border-gray-300"} ${selectedColor == "pink" && "border-pink-300"} py-1`}>{moneySummary.maxConsumption}</div>
                                            <div className = {`border-r-2 text-center border-dashed ${selectedColor !== "pink" && "border-gray-300"} ${selectedColor == "pink" && "border-pink-300"} py-1`}>最小</div>
                                            <div className = {`border-r-2 text-center border-dashed ${selectedColor !== "pink" && "border-gray-300"} ${selectedColor == "pink" && "border-pink-300"} py-1`}>{moneySummary.minInvestment}</div>
                                            <div className = {`border-r-2 text-center border-dashed ${selectedColor !== "pink" && "border-gray-300"} ${selectedColor == "pink" && "border-pink-300"} py-1`}>{moneySummary.minWaste}</div>
                                            <div className = "text-center py-1">{moneySummary.minConsumption}</div>
                                        </div>
                                    </div>

                                    <div className = "md:pl-2">
                                        <p className = "text-center mt-4 text-lg">過去{moneyNumberOfDay}日間使ったお金の合計は</p>
                                        <div className = {`border-2 px-3 py-2 ${selectedColor == "blue" && "border-sky-300 bg-sky-50"} ${selectedColor == "whiteBlack" && "border-gray-400 bg-gray-50"} ${selectedColor == "pink" && "border-pink-300 bg-pink-50"} rounded-xl shadow-lg mx-2 mt-6`}>
                                            <div className = {`flex justify-center items-center border-b-2 py-3 ${selectedColor == "blue" && "border-sky-400"} ${selectedColor == "whiteBlack" && "border-gray-400"} ${selectedColor == "pink" && "border-pink-400"} border-dashed gap-x-3`}>
                                                <p className = {`text-lg ${selectedColor == "blue" && "text-sky-500"} ${selectedColor == "whiteBlack" && "text-gray-500"} ${selectedColor == "pink" && "text-pink-500"}`}>投資 :</p>
                                                <div className = {`text-lg ${selectedColor == "blue" && "text-sky-500"} ${selectedColor == "whiteBlack" && "text-gray-500"} ${selectedColor == "pink" && "text-pink-500"}`}>
                                                    {moneySummary.sumInvestment}
                                                </div>
                                                <p className = {`text-lg ${selectedColor == "blue" && "text-sky-500"} ${selectedColor == "whiteBlack" && "text-gray-500"} ${selectedColor == "pink" && "text-pink-500"}`}>円</p>
                                            </div>

                                            <div className = {`flex justify-center items-center border-b-2 py-3 ${selectedColor == "blue" && "border-sky-400"} ${selectedColor == "whiteBlack" && "border-gray-400"} ${selectedColor == "pink" && "border-pink-400"} border-dashed gap-x-3`}>
                                                <p className = {`text-lg ${selectedColor == "blue" && "text-sky-500"} ${selectedColor == "whiteBlack" && "text-gray-500"} ${selectedColor == "pink" && "text-pink-500"}`}>浪費 :</p>
                                                <div className = {`text-lg ${selectedColor == "blue" && "text-sky-500"} ${selectedColor == "whiteBlack" && "text-gray-500"} ${selectedColor == "pink" && "text-pink-500"}`}>
                                                    {moneySummary.sumWaste}
                                                </div>
                                                <p className = {`text-lg ${selectedColor == "blue" && "text-sky-500"} ${selectedColor == "whiteBlack" && "text-gray-500"} ${selectedColor == "pink" && "text-pink-500"}`}>円</p>
                                            </div>

                                            <div className = "flex justify-center items-center py-3 border-gray-400 border-dashed gap-x-3">
                                                <p className = {`text-lg ${selectedColor == "blue" && "text-sky-500"} ${selectedColor == "whiteBlack" && "text-gray-500"} ${selectedColor == "pink" && "text-pink-500"}`}>消費 :</p>
                                                <div className = {`text-lg ${selectedColor == "blue" && "text-sky-500"} ${selectedColor == "whiteBlack" && "text-gray-500"} ${selectedColor == "pink" && "text-pink-500"}`}>
                                                    {moneySummary.sumConsumption}
                                                </div>
                                                <p className = {`text-lg ${selectedColor == "blue" && "text-sky-500"} ${selectedColor == "whiteBlack" && "text-gray-500"} ${selectedColor == "pink" && "text-pink-500"}`}>円</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className = "flex justify-center mt-5 md:mt-7">
                                    <p className = "px-8 py-2 bg-red-500 text-white rounded-xl shadow-lg text-xl">合計金額 : {moneySummary.sumUseMoney}円</p>
                                </div>
                            </div>

                            {graph ?
                                // 開いてるとき
                                // むずいから一番最後に
                                <div>
                                    <div className = "mt-6">
                                        <p className = "text-2xl text-center">投資のデータ</p>
                                        <MoneyInvestmentGraph investmentData={investmentData}/>
                                    </div>
                                    <div className = "mt-6">
                                        <p className = "text-2xl text-center">浪費のデータ</p>
                                        <MoneyWasteGraph wasteData={wasteData}/>
                                    </div>
                                    <div className = "mt-6">
                                        <p className = "text-2xl text-center">消費のデータ</p>
                                        <MoneyConsumptionGraph consumptionData={consumptionData}/>
                                    </div>
                                    <div className = "mt-6">
                                        <p className = "text-2xl text-center">合計金額のデータ</p>
                                        <MoneyUseSumGraph useSumData={useSumData}/>
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

export default SummaryMoney