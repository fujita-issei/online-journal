import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAppDispatch, useAppSelector } from "../../hooks/ReduxHooks"
import type { DailyJournalInitState } from "../../constant/dailyJournalInitState"
import dateToYearMonthDate from "../../func/DateToYearMonthDate"
import axios from "axios"
import { setCurrentDailyJournal } from "../../store/dailyJournal"

interface Props {
    journal: DailyJournalInitState,
    handleDeleteSuccess: () => void
}

const DispDaily = ({ journal, handleDeleteSuccess }: Props) => {

    const navigate = useNavigate()
    const dispatch = useAppDispatch()
    const [btn, setBtn] = useState(false)
    const selectedColor = useAppSelector((state) => state.color.color)
    const [isOpen, setIsOpen] = useState(false)
    const [toDoTime, setToDoTime] = useState<number[]>([])

    // やることやった時間を計算
    useEffect(() => {
        const filteredToDoTimeCheck = journal.toDoTimeCheck.filter((item) => {
            return item
        })
        const time = filteredToDoTimeCheck.length * 30
        const hour = Math.trunc(time / 60)
        const min = time - (Math.trunc(time / 60) * 60)
        setToDoTime([hour, min])
    }, [journal.toDoTimeCheck])

    const deleteJournal = async () => {
        // DBにあるこの日付のものを削除
        try {
            await axios.delete("/api/dailyJournal/deleteTodayJournal", {
                params: {
                    userId: journal.userId,
                    targetDate: journal.targetDate
                }
            })
            setBtn(false)
            handleDeleteSuccess()
            window.scrollTo(0, 0)
        } catch (e) {
            console.log("deleteJournalでエラー", e)
        }
    }

    const editJournal = () => {
        // stateを設定
        dispatch(setCurrentDailyJournal(journal))
        localStorage.setItem("dailyJournalDate", journal.targetDate)
        navigate(`/createJournal/daily`)
    }

    return (
        <div>

            <div className = {`mt-4 border-2 ${selectedColor == "blue" && "border-sky-400"} ${selectedColor == "whiteBlack" && "border-gray-500"} ${selectedColor == "pink" && "border-pink-400"} rounded-xl shadow-xl`}>
                <div className = {`text-center ${selectedColor == "blue" && "bg-sky-400"} ${selectedColor == "whiteBlack" && "bg-gray-500"} ${selectedColor == "pink" && "bg-pink-400"} rounded-t-lg rounded-b-md py-3`}>
                    <p className = "text-white text-lg">{dateToYearMonthDate(journal.targetDate)[0]}年 {dateToYearMonthDate(journal.targetDate)[1]}月 {dateToYearMonthDate(journal.targetDate)[2]}日</p>
                </div>

                {isOpen ? (
                    <div className = {`mx-4 pb-4 border-b-2 border-dashed ${selectedColor == "blue" && "border-sky-400"} ${selectedColor == "blackWhite" && "border-gray-400"} ${selectedColor == "pink" && "border-pink-400"}`}>
                        {/* 睡眠時間 */}
                        <div className = {`mt-4 border-2 py-2 rounded-lg shadow-lg ${selectedColor == "blue" && "text-gray-600 border-gray-200 bg-gray-50"} ${selectedColor == "whiteBlack" && "border-gray-200 bg-gray-5 text-gray-600"} ${selectedColor == "pink" && "text-pink-600 border-pink-200 bg-pink-50"}`}>
                            <p className = {`text-center text-xl border-b-2 border-dashed mx-4 pb-2 ${selectedColor !== "pink" && "border-gray-400"} ${selectedColor == "pink" && "border-pink-400"}`}>睡眠</p>
                            <div className = "ml-6 text-lg flex justify-start items-center mt-3">
                                <p className = "mr-3">起きた時間 : </p>
                                <p className = "mr-1 text-red-600">{journal.getUpHour}</p>
                                <p className = "mr-1">時</p>
                                <p className = "mr-1 text-red-600">{journal.getUpMin}</p>
                                <p>分</p>
                            </div>
                            <div className = "ml-6 text-lg flex justify-start items-center mt-2">
                                <p className = "mr-3">寝た時間 : </p>
                                <p className = "mr-1 text-red-600">{journal.goBedHour}</p>
                                <p className = "mr-1">時</p>
                                <p className = "mr-1 text-red-600">{journal.goBedMin}</p>
                                <p>分</p>
                            </div>
                        </div>
                        {/* ルーティーン */}
                        {journal.routine.length !== 0 && 
                            <div className = {`mt-4 border-2 py-2 rounded-lg shadow-lg ${selectedColor == "blue" && "text-gray-600 border-gray-200 bg-gray-50"} ${selectedColor == "whiteBlack" && "border-gray-200 bg-gray-5 text-gray-600"} ${selectedColor == "pink" && "text-pink-600 border-pink-200 bg-pink-50"}`}>
                                <p className = {`text-center text-xl mb-3 border-b-2 border-dashed mx-4 pb-2 ${selectedColor !== "pink" && "border-gray-400"} ${selectedColor == "pink" && "border-pink-400"}`}>ルーティーン</p>
                                {journal.routine.map((_routine, i) => {
                                    return (
                                        <div key = {i} className = "ml-4 flex justify-start items-center">
                                            {journal.routineCheck[i] ? (
                                                <div className = "text-xl text-red-600">
                                                    ⚪︎
                                                </div>
                                            ) : (
                                                <div className = "text-xl text-sky-600">
                                                    ×
                                                </div>
                                            )}
                                            <p className = "ml-3 text-lg truncate pr-4">{_routine.routineName}</p>
                                        </div>
                                    )
                                })}
                            </div>
                        }
                        {/* やるべきこと */}
                        <div className = {`mt-4 border-2 py-2 rounded-lg shadow-lg ${selectedColor == "blue" && "text-gray-600 border-gray-200 bg-gray-50"} ${selectedColor == "whiteBlack" && "border-gray-200 bg-gray-5 text-gray-600"} ${selectedColor == "pink" && "text-pink-600 border-pink-200 bg-pink-50"}`}>
                            <p className = {`text-center text-xl mb-3 border-b-2 border-dashed mx-4 pb-2 ${selectedColor !== "pink" && "border-gray-400"} ${selectedColor == "pink" && "border-pink-400"}`}>やるべきことの記録</p>
                            <div className = "ml-6 text-lg flex justify-start items-center my-3">
                                <p className = "mr-3">取り組んだ時間 : </p>
                                <p className = "mr-1 text-red-600">{toDoTime[0]}</p>
                                <p className = "mr-1">時間</p>
                                <p className = "mr-1 text-red-600">{toDoTime[1]}</p>
                                <p>分</p>
                            </div>
                            {journal.toDoList
                                .filter((toDo) => toDo.length > 0)
                                .map((toDo, i) => {
                                    return (
                                        <div key = {i} className = "ml-4 flex justify-start items-center">
                                            {journal.toDoListCheck[i] ? (
                                                <div className = "text-xl text-red-600">
                                                    ⚪︎
                                                </div>
                                            ) : (
                                                <div className = "text-xl text-sky-600">
                                                    ×
                                                </div>
                                            )}
                                            <p className = "ml-3 text-lg truncate pr-4">{toDo}</p>
                                        </div>
                                    )
                            })}
                        </div>
                        {/* 禁止事項リスト */}
                        {journal.importList.length + journal.addList.filter((list) => list.length > 0).length > 0 &&
                            <div className = {`mt-4 border-2 py-2 rounded-lg shadow-lg ${selectedColor == "blue" && "text-gray-600 border-gray-200 bg-gray-50"} ${selectedColor == "whiteBlack" && "border-gray-200 bg-gray-5 text-gray-600"} ${selectedColor == "pink" && "text-pink-600 border-pink-200 bg-pink-50"}`}>
                                <p className = {`text-center text-xl mb-3 border-b-2 border-dashed mx-4 pb-2 ${selectedColor !== "pink" && "border-gray-400"} ${selectedColor == "pink" && "border-pink-400"}`}>禁止事項リスト</p>
                                {journal.importList.map((list, i) => {
                                    return (
                                        <div key = {i} className = "ml-4 flex justify-start items-center">
                                            {journal.importListCheck[i] ? (
                                                <div className = "text-xl text-red-600">
                                                    ⚪︎
                                                </div>
                                            ) : (
                                                <div className = "text-xl text-sky-600">
                                                    ×
                                                </div>
                                            )}
                                            <p className = "ml-3 text-lg truncate pr-4">{list.listName}</p>
                                        </div>
                                    )
                                })}
                                {journal.addList
                                    .filter((list) => list.length > 0)
                                    .map((list, i) => {
                                        return (
                                            <div key = {i} className = "ml-4 flex justify-start items-center">
                                                {journal.importListCheck[i] ? (
                                                    <div className = "text-xl text-red-600">
                                                        ⚪︎
                                                    </div>
                                                ) : (
                                                    <div className = "text-xl text-sky-600">
                                                        ×
                                                    </div>
                                                )}
                                                <p className = "ml-3 text-lg truncate pr-4">{list}</p>
                                            </div>
                                        )
                                })}
                            </div>
                        }
                        {/* ジャーナルについて */}
                        {journal.journal.filter((_journal) => _journal.length > 0).length > 0 &&
                            <div className = {`mt-4 border-2 py-2 rounded-lg shadow-lg ${selectedColor == "blue" && "text-gray-600 border-gray-200 bg-gray-50"} ${selectedColor == "whiteBlack" && "border-gray-200 bg-gray-5 text-gray-600"} ${selectedColor == "pink" && "text-pink-600 border-pink-200 bg-pink-50"}`}>
                                <p className = {`text-center text-xl mb-3 border-b-2 border-dashed mx-4 pb-2 ${selectedColor !== "pink" && "border-gray-400"} ${selectedColor == "pink" && "border-pink-400"}`}>ジャーナル</p>
                                {journal.journal
                                    .filter((_journal) => _journal.length > 0)
                                    .map((_journal, i) => {
                                    return (
                                        <div key = {i} className = "mt-3 mx-3">
                                            <p className = "line-clamp-3 break-all mb-1">{_journal}</p>
                                            <div className = "flex justtify-start items-center gap-x-5">
                                                <p className = {`${selectedColor !== "pink" && "text-gray-400"} ${selectedColor == "pink" && "text-pink-400"}`}>
                                                    {journal.journalCount[i]}文字
                                                </p>
                                                <p className = {`${selectedColor !== "pink" && "text-gray-400"} ${selectedColor == "pink" && "text-pink-400"}`}>
                                                    {journal.journalLastEditTime[i]}
                                                </p>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        }
                        {/* お金 */}
                        <div className = {`mt-4 border-2 py-2 rounded-lg shadow-lg ${selectedColor == "blue" && "text-gray-600 border-gray-200 bg-gray-50"} ${selectedColor == "whiteBlack" && "border-gray-200 bg-gray-5 text-gray-600"} ${selectedColor == "pink" && "text-pink-600 border-pink-200 bg-pink-50"}`}>
                                <p className = {`text-center text-xl border-b-2 border-dashed mx-4 pb-2 ${selectedColor !== "pink" && "border-gray-400"} ${selectedColor == "pink" && "border-pink-400"}`}>お金</p>
                                <div className = "mt-3 flex justify-start items-center mx-4 text-lg">
                                    <p className = "mr-3">投資 :</p>
                                    <p className = "mr-1 text-red-600">{journal.moneyInvestment}</p>
                                    <p>円</p>
                                </div>
                                <div className = "mt-3 flex justify-start items-center mx-4 text-lg">
                                    <p className = "mr-3">浪費 :</p>
                                    <p className = "mr-1 text-red-600">{journal.moneyWaste}</p>
                                    <p>円</p>
                                </div>
                                <div className = "mt-3 flex justify-start items-center mx-4 text-lg">
                                    <p className = "mr-3">消費 :</p>
                                    <p className = "mr-1 text-red-600">{journal.moneyConsumption}</p>
                                    <p>円</p>
                                </div>
                                <div className = "bg-red-500 rounded-lg shadow-lg mx-6 text-white py-2 my-4 flex justify-center items-center text-lg">
                                    <p className = "mr-3">合計金額 :</p>
                                    <p className = "mr-1">{journal.moneyUseSum}</p>
                                    <p>円</p>
                                </div>
                        </div>
                        {/* 閉じるUI */}
                        <div className = {`mx-4`}>
                        <div 
                            className = {`mx-auto cursor-pointer w-fit flex justify-center items-center mt-4 p-1 rounded-full ${selectedColor !== "pink" && "bg-gray-200 hover:bg-gray-300"} ${selectedColor == "pink" && "bg-pink-200 hover:bg-pink-300"} transition duration-200`}
                            onClick = {() => {
                                setIsOpen((prev) => !prev)
                            }}
                        >
                            <svg className = {`rotate-180 size-8 ${selectedColor == "blue" && "text-green-500 hover:text-green-700"} ${selectedColor == "whiteBlack" && "text-gray-600 hover:text-gray-700"} ${selectedColor == "pink" && "text-pink-500 hover:text-pink-700"} transition duration-200`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                            </svg>
                        </div>
                    </div>
                    </div>
                ) : (
                    <div className = {`mx-4 pb-4 border-b-2 border-dashed ${selectedColor == "blue" && "border-sky-400"} ${selectedColor == "blackWhite" && "border-gray-400"} ${selectedColor == "pink" && "border-pink-400"}`}>
                        <div 
                            className = {`mx-auto cursor-pointer w-fit flex justify-center items-center mt-4 p-1 rounded-full ${selectedColor !== "pink" && "bg-gray-200 hover:bg-gray-300"} ${selectedColor == "pink" && "bg-pink-200 hover:bg-pink-300"} transition duration-200`}
                            onClick = {() => {
                                setIsOpen((prev) => !prev)
                            }}
                        >
                            <svg className = {`size-8 ${selectedColor == "blue" && "text-green-500 hover:text-green-700"} ${selectedColor == "whiteBlack" && "text-gray-600 hover:text-gray-700"} ${selectedColor == "pink" && "text-pink-500 hover:text-pink-700"} transition duration-200`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                            </svg>
                        </div>
                    </div>
                )}

                <div className = "my-3 flex justify-center items-center gap-x-10">
                    <button
                        data-testid = "edit-button"
                        className = {`border-2 cursor-pointer text-white rounded-xl shadow-lg px-4 py-2 ${selectedColor == "blue" && "border-sky-500 bg-sky-500 hover:border-sky-600 hover:bg-sky-600"} ${selectedColor == "whiteBlack" && "border-gray-500 bg-gray-500 hover:border-gray-600 hover:bg-gray-600"} ${selectedColor == "pink" && "border-pink-500 bg-pink-500 hover:border-pink-600 hover:bg-pink-600"} hover:scale-110 transition duration-300`}
                        onClick = {() => editJournal()}
                    >
                        編集
                    </button>
                    <button
                        data-testid = "reset1"
                        className = {`border-2 cursor-pointer rounded-xl shadow-lg px-4 py-2 ${selectedColor == "blue" && "border-sky-500 text-sky-500 hover:border-sky-600"} ${selectedColor == "whiteBlack" && "border-gray-500 text-gray-500 hover:border-gray-600"} ${selectedColor == "pink" && "border-pink-500 text-pink-500 hover:border-pink-600"} hover:scale-110 transition duration-300`}
                        onClick = {() => setBtn(true)}
                    >
                        削除
                    </button>
                </div>
            </div>

            {/* リセットボタンを押したら、確認用のモーダルを表示 */}
            <div
                className = {`fixed inset-0 z-50 flex justify-center items-center transition-opacity duration-300 ${btn ? "opacity-100" : "opacity-0 pointer-events-none"}`}
            >
                {/* 背景フィルター */}
                <div
                    onClick = {() => setBtn(false)}
                    className = "absolute inset-0 bg-black/50 cursor-pointer"
                ></div>

                {/* 表示される確認パネル */}
                <div
                    onClick = {(e) => e.stopPropagation()}
                    className = {`relative bg-white rounded-lg shadow-lg py-6 px-6 w-11/12 h-60 flex flex-col items-center text-lg transition-opacity duration-300 ${btn ? "opacity-100" : "opacity-0"}`}
                >
                    <p className = "mb-1">{dateToYearMonthDate(journal.targetDate)[0]}年 {dateToYearMonthDate(journal.targetDate)[1]}月 {dateToYearMonthDate(journal.targetDate)[2]}日</p>
                    <p className = "mb-3">この日のジャーナルを削除します</p>
                    <p className = "text-xl">本当によろしいですか？</p>
                    <div className = "flex justify-center items-center mt-8 gap-x-8">
                        <button
                            data-testid = "reset2"
                            className = "bg-red-500 cursor-pointer px-4 py-2 rounded-xl shadow-lg text-white border-2 border-red-500 hover:border-red-600 hover:bg-red-600 hover:scale-110 transition duration-200"
                            onClick = {() => deleteJournal()}
                        >
                            削除する
                        </button>
                        <button
                            className = "border-2 cursor-pointer border-red-500 px-6 py-2 rounded-xl shadow-lg hover:border-red-600 hover:scale-110 transition duration-200"
                            onClick  = {() => setBtn(false)}
                        >
                            戻る
                        </button>
                    </div>
                </div>
            </div>

        </div>
        
    )
}

export default DispDaily