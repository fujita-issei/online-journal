import { useEffect, useState } from "react"
import { useAppDispatch, useAppSelector } from "../../hooks/ReduxHooks"
import getDataForSummary from "../../func/getDataForSummary"
import getDataForSumYestardaySleep from "../../func/getDataForSumYestardaySleep"
import calcSummaryState from "../../func/calcSummaryState"
import { setMonthSummary } from "../../store/monthJournal"

const MonthSummary = ({ renderingTrigger }: { renderingTrigger: number }) => {

    const [open, setOpen] = useState(true)
    const selectedColor = useAppSelector((state) => state.color.color)
    const { summary, targetDate } = useAppSelector((state) => state.monthJournal)
    const { userId } = useAppSelector((state) => state.login)
    const dispatch = useAppDispatch()
    const [isFetched, setIsFetched] = useState(true)

    useEffect(() => {
        // 初回レンダリング時のみ、DBからデータを取ってきて、統計情報を計算
        // それをstateに格納
        if (!userId || !targetDate) return
        const calcSummaryData = async() => {
            // 何日か前かを引数で渡すために、月の長さを特定する
            const [year, month] = targetDate.split("-").map(Number)
            const numberOfDays = new Date(year, month, 0).getDate()
            // targetDateの月末日を用意する
            const lastDay = new Date(year, month, 0)
            const targetDateLastDay = lastDay.getFullYear() + "-" + String(lastDay.getMonth() + 1).padStart(2, "0") + "-" + String(lastDay.getDate()).padStart(2, "0")
            const data = await getDataForSummary(userId, targetDateLastDay, numberOfDays)
            const yestardaySleepData = await getDataForSumYestardaySleep(userId, targetDateLastDay, numberOfDays)
            const summaryData = calcSummaryState(data, yestardaySleepData, targetDateLastDay, numberOfDays)
            if (summaryData.length > 0) {
                dispatch(setMonthSummary(summaryData))
                setIsFetched(true)
            } else {
                setIsFetched(false)
            }
        }
        calcSummaryData()
    }, [userId, targetDate, dispatch, renderingTrigger])

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
                <h2 className = "text-2xl text-gray-700">今月の進捗</h2>
            </div>

            {/* ここから下がルーティーンの管理 */}
            {open && isFetched && 
                <div className = "mt-4">

                    <div className = "md:flex justify-center items-center my-2">

                        <div className = "md:pr-6">
                            <div className = {`border-2 rounded-xl shadow-lg py-3 mx-2 px-4 ${selectedColor == "blue" && "border-sky-300 bg-sky-50"} ${selectedColor == "whiteBlack" && "border-gray-400/90 bg-gray-50"} ${selectedColor == "pink" && "border-pink-300 bg-pink-50"}`}>
                                <p className = {`mb-1 text-lg ${selectedColor == "blue" && "text-sky-500"} ${selectedColor == "whiteBlack" && "text-gray-600"} ${selectedColor == "pink" && "text-pink-500"} `}>平均起床時間 : {summary.getUpHour} 時 {summary.getUpMin} 分</p>
                                <p className = {`mb-1 text-lg ${selectedColor == "blue" && "text-sky-500"} ${selectedColor == "whiteBlack" && "text-gray-600"} ${selectedColor == "pink" && "text-pink-500"}`}>平均就寝時間 : {summary.goBedHour} 時 {summary.goBedMin} 分</p>
                                {summary.sumSleepHour == 0 && summary.sumSleepMin == 0 ? (
                                    <p className = "text-center text-xl text-rose-500">平均睡眠時間 : データが不足しています</p>
                                ) : (
                                    <p className = "text-center text-xl text-rose-500">平均睡眠時間 : {summary.sumSleepHour} 時 {summary.sumSleepMin} 分</p>
                                )}
                            </div>

                            <div className = "mt-5 ml-2 flex justify-start items-center gap-x-2">
                                <div>
                                    <svg className = "size-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z" />
                                    </svg>
                                </div>
                                <p className = "text-lg">今月やるべきことをやった時間</p>
                            </div>
                            <div className = "text-center mt-1 text-2xl text-rose-500">
                                {summary.toDoTimeHour} 時間 {summary.toDoTimeMin} 分
                            </div>

                            <div className = "mt-5 ml-2 flex justify-start items-center gap-x-2">
                                <div>
                                    <svg className = "size-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z" />
                                    </svg>
                                </div>
                                <p className = "text-lg">達成したルーティーンの数</p>
                            </div>
                            <div className = "flex justify-center items-end gap-x-2 mt-1">
                                <p className = "text-2xl text-rose-500">{summary.routineDone} 個</p>
                                <p className = "text-2xl">/</p>
                                <p className = "text-gray-400">{summary.routineAll} 個</p>
                            </div>

                            <div className = "mt-5 ml-2 flex justify-start items-center gap-x-2">
                                <div>
                                    <svg className = "size-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z" />
                                    </svg>
                                </div>
                                <p className = "text-lg">達成したToDoの数</p>
                            </div>
                            <div className = "flex justify-center items-end gap-x-2 mt-1">
                                <p className = "text-2xl text-rose-500">{summary.toDoDone} 個</p>
                                <p className = "text-2xl">/</p>
                                <p className = "text-gray-400">{summary.toDoAll} 個</p>
                            </div>
                        </div>

                        <div className = {`md:pl-6 md:border-l-2 ${selectedColor == "blue" && "border-sky-400/90"} ${selectedColor == "whiteBlack" && "border-gray-400"} ${selectedColor == "pink" && "border-pink-400/90"} border-dashed`}>
                            <div className = "mt-5 ml-2 flex justify-start items-center gap-x-2">
                                <div>
                                    <svg className = "size-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z" />
                                    </svg>
                                </div>
                                <p className = "text-lg">やらなかったNGリストの数</p>
                            </div>
                            <div className = "flex justify-center items-end gap-x-2 mt-1">
                                <p className = "text-2xl text-rose-500">{summary.NGDone} 個</p>
                                <p className = "text-2xl">/</p>
                                <p className = "text-gray-400">{summary.NGAll} 個</p>
                            </div>

                            <div className = "mt-5 ml-2 flex justify-start items-center gap-x-2">
                                <div>
                                    <svg className = "size-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z" />
                                    </svg>
                                </div>
                                <p className = "text-lg">書いたジャーナルの文字数合計</p>
                            </div>
                            <div className = "text-center mt-1 text-2xl text-rose-500">
                                {summary.journalAllCount} 文字
                            </div>


                            <div className = {`border-2 px-3 py-2 ${selectedColor == "blue" && "border-sky-300 bg-sky-50"} ${selectedColor == "whiteBlack" && "border-gray-400 bg-gray-50"} ${selectedColor == "pink" && "border-pink-300 bg-pink-50"} rounded-xl shadow-lg mx-2 mt-6`}>
                                <div className = {`flex justify-center items-center border-b-2 py-3 ${selectedColor == "blue" && "border-sky-400"} ${selectedColor == "whiteBlack" && "border-gray-400"} ${selectedColor == "pink" && "border-pink-400"} border-dashed gap-x-3`}>
                                    <p className = {`text-lg ${selectedColor == "blue" && "text-sky-500"} ${selectedColor == "whiteBlack" && "text-gray-600"} ${selectedColor == "pink" && "text-pink-500"}`}>投資 :</p>
                                    <div className = {`text-lg ${selectedColor == "blue" && "text-sky-500"} ${selectedColor == "whiteBlack" && "text-gray-600"} ${selectedColor == "pink" && "text-pink-500"}`}>
                                        {summary.moneyInvestment}
                                    </div>
                                    <p className = {`text-lg ${selectedColor == "blue" && "text-sky-500"} ${selectedColor == "whiteBlack" && "text-gray-600"} ${selectedColor == "pink" && "text-pink-500"}`}>円</p>
                                </div>

                                <div className = {`flex justify-center items-center border-b-2 py-3 ${selectedColor == "blue" && "border-sky-400"} ${selectedColor == "whiteBlack" && "border-gray-400"} ${selectedColor == "pink" && "border-pink-400"} border-dashed gap-x-3`}>
                                    <p className = {`text-lg ${selectedColor == "blue" && "text-sky-500"} ${selectedColor == "whiteBlack" && "text-gray-600"} ${selectedColor == "pink" && "text-pink-500"}`}>浪費 :</p>
                                    <div className = {`text-lg ${selectedColor == "blue" && "text-sky-500"} ${selectedColor == "whiteBlack" && "text-gray-600"} ${selectedColor == "pink" && "text-pink-500"}`}>
                                        {summary.moneyWaste}
                                    </div>
                                    <p className = {`text-lg ${selectedColor == "blue" && "text-sky-500"} ${selectedColor == "whiteBlack" && "text-gray-600"} ${selectedColor == "pink" && "text-pink-500"}`}>円</p>
                                </div>

                                <div className = "flex justify-center items-center py-3 gap-x-3">
                                    <p className = {`text-lg ${selectedColor == "blue" && "text-sky-500"} ${selectedColor == "whiteBlack" && "text-gray-600"} ${selectedColor == "pink" && "text-pink-500"}`}>消費 :</p>
                                    <div className = {`text-lg ${selectedColor == "blue" && "text-sky-500"} ${selectedColor == "whiteBlack" && "text-gray-600"} ${selectedColor == "pink" && "text-pink-500"}`}>
                                        {summary.moneyConsumption}
                                    </div>
                                    <p className = {`text-lg ${selectedColor == "blue" && "text-sky-500"} ${selectedColor == "whiteBlack" && "text-gray-600"} ${selectedColor == "pink" && "text-pink-500"}`}>円</p>
                                </div>
                            </div>

                            <div className = "flex justify-center mt-5">
                                <p className = "px-8 py-2 bg-red-500 text-white rounded-xl shadow-lg text-xl">合計金額 : {summary.moneyUseSum}円</p>
                            </div>
                        </div>

                    </div>
                </div>
            }

            {open && !isFetched && 
                <div className = {`${selectedColor !== "pink" && "text-gray-600"} ${selectedColor == "pink" && "text-pink-500"} text-center my-4 text-xl`}>
                    <p className = "mb-2">サマリーを出すための</p>
                    <p>データが足りません</p>
                </div>
            }
        </div>
        
    )
}

export default MonthSummary