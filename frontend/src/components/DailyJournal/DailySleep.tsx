import { useEffect, useState } from "react"
import { useAppDispatch, useAppSelector } from "../../hooks/ReduxHooks"
import { changeGetUpHour, changeGetUpMin, changeGoBedHour, changeGoBedMin } from "../../store/dailyJournal"
import axios from "axios"
import calcDays from "../../func/calcDays"

interface YestardaySleepInit {
    goBedHour: number;
    goBedMin: number;
}
interface SumSleepInit {
    hour: number;
    min: number;
}

const DailySleep = () => {

    const { targetDate, getUpHour, getUpMin, goBedHour, goBedMin } = useAppSelector((state) => state.dailyJournal)
    const dispatch = useAppDispatch()
    const [open, setOpen] = useState(true)
    const selectedColor = useAppSelector((state) => state.color.color)
    const { userId } = useAppSelector((state) => state.login)
    const [yestardaySleep, setYestardaySleep] = useState<YestardaySleepInit>({
        goBedHour: 23,
        goBedMin: 0
    })
    const [sumSleep, setSumSleep] = useState<SumSleepInit>({
        hour: 0,
        min: 0
    })

    useEffect(() => {
        if (!yestardaySleep) return
        const yesGoBedHour = yestardaySleep.goBedHour - 24
        if (getUpMin >= yestardaySleep.goBedMin) {
            setSumSleep({ hour: getUpHour - yesGoBedHour, min: getUpMin - yestardaySleep.goBedMin})
        } else {
            setSumSleep({ hour: getUpHour - yesGoBedHour - 1, min: getUpMin + 60 - yestardaySleep.goBedMin})
        }
    }, [getUpHour, getUpMin, yestardaySleep])

    useEffect(() => {
        // 前の日の寝た時間を記録する
        const yestarday = calcDays(targetDate, 1, "-")
        const getYestardaySleep = async () => {
            try {
                const res = await axios.get("/api/dailyJournal/getYestardaySleepTime", {
                    params: {
                        userId: userId,
                        targetDate: yestarday
                    }
                })
                if (res.data && res.data.length > 0) {
                    setYestardaySleep(res.data[0])
                }
            } catch (e) {
                console.log("getYestardaySleepでエラー", e)
            }
        }
        getYestardaySleep()
    }, [targetDate, userId])

    const changeSleepTime = (text: string, type: string) => {
        switch (type) {
            case "getUpHour":
                dispatch(changeGetUpHour(text))
                break
            case "getUpMin":
                dispatch(changeGetUpMin(text))
                break
            case "goBedHour":
                dispatch(changeGoBedHour(text))
                break
            case "goBedMin":
                dispatch(changeGoBedMin(text))
                break
            default:
                return
        }
    }

    return (
        <div className = {`border-2 ${selectedColor !== "pink" && "border-gray-400"} ${selectedColor == "pink" && "border-pink-300"} rounded-2xl shadow-lg py-4 px-2`}>
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

                <h2 className = "text-2xl text-gray-700">すいみん</h2>
            </div>
            {/* ここから下が睡眠時間の管理 */}
            {open &&
                <div>
                    <div className = {`md:flex justify-center items-center md:divide-x-2 divide-dashed ${selectedColor !== "pink" && "divide-gray-500/80"} ${selectedColor == "pink" && "divide-pink-500/80"}`}>
                        <div className = "md:pr-6  mt-4 ml-3 flex justify-start items-center gap-x-4 text-xl">
                            <p>起床時間 :</p>
                            <div className = "flex justify-start items-center gap-x-3">
                                <div>
                                    <input 
                                        className = {`border-2 rounded-md ${selectedColor !== "pink" && "border-gray-500"} ${selectedColor == "pink" && "border-pink-400/90"} px-2 w-12 hover:border-blue-500 transition duration-100`}
                                        value = {getUpHour}
                                        onChange = {(e) => changeSleepTime(e.target.value, "getUpHour")}
                                    />
                                </div>
                                <div>:</div>
                                <div>
                                    <input 
                                        className = {`border-2 rounded-md ${selectedColor !== "pink" && "border-gray-500"} ${selectedColor == "pink" && "border-pink-400/90"} px-2 w-12 hover:border-blue-500 transition duration-100`}
                                        value = {getUpMin}
                                        onChange = {(e) => changeSleepTime(e.target.value, "getUpMin")}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className = "md:pl-6 mt-4 ml-3 flex justify-start items-center gap-x-4 text-xl">
                            <p>就寝時間 :</p>
                            <div className = "flex justify-start items-center gap-x-3">
                                <div>
                                    <input 
                                        className = {`border-2 rounded-md ${selectedColor !== "pink" && "border-gray-500"} ${selectedColor == "pink" && "border-pink-400/90"} px-2 w-12 hover:border-blue-500 transition duration-100`}
                                        value = {goBedHour}
                                        onChange = {(e) => changeSleepTime(e.target.value, "goBedHour")}
                                    />
                                </div>
                                <div>:</div>
                                <div>
                                    <input 
                                        className = {`border-2 rounded-md ${selectedColor !== "pink" && "border-gray-500"} ${selectedColor == "pink" && "border-pink-400/90"} px-2 w-12 hover:border-blue-500 transition duration-100`}
                                        value = {goBedMin}
                                        onChange = {(e) => changeSleepTime(e.target.value, "goBedMin")}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div className = {`py-1 px-2 bg-rose-100 rounded-2xl shadow-md mt-4 ml-2 flex justify-center items-center gap-x-4 text-xl`}>
                        <p>合計睡眠時間 :</p>
                        <div className = "flex justify-start items-center gap-x-3">
                            <div>
                                {/* 前の日のものを取得して計算 */}
                                {sumSleep.hour}時間 {sumSleep.min}分
                            </div>
                        </div>
                    </div>
                </div>
            }
        

        </div>
    )
}

export default DailySleep