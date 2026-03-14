import { useNavigate } from "react-router-dom"
import type { YearJournalInitState } from "../../constant/yearJournalInitState"
import { useAppDispatch, useAppSelector } from "../../hooks/ReduxHooks"
import { useState } from "react"
import axios from "axios"
import { setCurrentYear } from "../../store/yearJournal"

interface Props {
    journal: YearJournalInitState,
    handleDeleteSuccess: () => void
}

const DispYear = ({ journal, handleDeleteSuccess }: Props) => {
    
    const navigate = useNavigate()
    const dispatch = useAppDispatch()
    const [btn, setBtn] = useState(false)
    const selectedColor = useAppSelector((state) => state.color.color)
    const [isOpen, setIsOpen] = useState(false)

    const deleteJournal = async () => {
        // DBにあるこの日付のものを削除
        try {
            await axios.delete("/api/yearJournal/deleteYearJournal", {
                params: {
                    userId: journal.userId,
                    targetDate: journal.targetDate + "-01-01"
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
        dispatch(setCurrentYear(journal))
        localStorage.setItem("yearJournalDate", journal.targetDate)
        navigate(`/createJournal/year`)
    }


    return (
        <div>

            <div className = {`mt-4 border-2 ${selectedColor == "blue" && "border-sky-400"} ${selectedColor == "whiteBlack" && "border-gray-500"} ${selectedColor == "pink" && "border-pink-400"} rounded-xl shadow-xl`}>
                <div className = {`text-center ${selectedColor == "blue" && "bg-sky-400"} ${selectedColor == "whiteBlack" && "bg-gray-500"} ${selectedColor == "pink" && "bg-pink-400"} rounded-t-lg rounded-b-md py-3`}>
                    <p className = "text-white text-lg">{journal.targetDate}年</p>
                </div>

                {isOpen ? (
                    <div className = {`mx-4 pb-4 border-b-2 border-dashed ${selectedColor == "blue" && "border-sky-400"} ${selectedColor == "blackWhite" && "border-gray-400"} ${selectedColor == "pink" && "border-pink-400"}`}>
                        {/* やるべきこと */}
                        {journal.toDo.filter((_toDo) => _toDo.length !== 0).length >0 &&
                            <div className = {`mt-4 border-2 py-2 rounded-lg shadow-lg ${selectedColor == "blue" && "text-gray-600 border-gray-200 bg-gray-50"} ${selectedColor == "whiteBlack" && "border-gray-200 bg-gray-5 text-gray-600"} ${selectedColor == "pink" && "text-pink-600 border-pink-200 bg-pink-50"}`}>
                                <p className = {`text-center text-xl mb-3 border-b-2 border-dashed mx-4 pb-2 ${selectedColor !== "pink" && "border-gray-400"} ${selectedColor == "pink" && "border-pink-400"}`}>やるべきことの記録</p>
                                {journal.toDo
                                    .filter((_toDo) => _toDo.length !== 0)
                                    .map((_toDo, i) => {
                                        return (
                                            <div key = {i} className = "ml-4 flex justify-start items-center">
                                                {journal.toDoCheck[i] ? (
                                                    <div className = "text-xl text-red-600">
                                                        ⚪︎
                                                    </div>
                                                ) : (
                                                    <div className = "text-xl text-sky-600">
                                                        ×
                                                    </div>
                                                )}
                                                <p className = "ml-3 text-lg truncate pr-4">{_toDo}</p>
                                            </div>
                                        )
                                })}
                            </div>
                        }
                        {/* ジャーナルについて */}
                        {journal.journal.filter((_journal) => _journal.length !== 0).length > 0 &&
                            <div className = {`mt-4 border-2 py-2 rounded-lg shadow-lg ${selectedColor == "blue" && "text-gray-600 border-gray-200 bg-gray-50"} ${selectedColor == "whiteBlack" && "border-gray-200 bg-gray-5 text-gray-600"} ${selectedColor == "pink" && "text-pink-600 border-pink-200 bg-pink-50"}`}>
                                <p className = {`text-center text-xl mb-3 border-b-2 border-dashed mx-4 pb-2 ${selectedColor !== "pink" && "border-gray-400"} ${selectedColor == "pink" && "border-pink-400"}`}>ジャーナル</p>
                                {journal.journal
                                    .filter((_journal) => _journal.length !== 0)
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
                        {/* サマリー */}
                        {/* {!Object.values(journal.summary).every((value) =>  value == 0) &&
                            <div className = {`mt-4 border-2 py-2 rounded-lg shadow-lg ${selectedColor == "blue" && "text-gray-600 border-gray-200 bg-gray-50"} ${selectedColor == "whiteBlack" && "border-gray-200 bg-gray-5 text-gray-600"} ${selectedColor == "pink" && "text-pink-600 border-pink-200 bg-pink-50"}`}>
                                <p className = {`text-center text-xl mb-3 border-b-2 border-dashed mx-4 pb-2 ${selectedColor !== "pink" && "border-gray-400"} ${selectedColor == "pink" && "border-pink-400"}`}>サマリーデータ</p>
                                <div className  = "ml-5">
                                    <p className = {`mb-1 text-lg ${selectedColor !== "pink" && "text-gray-600"} ${selectedColor == "pink" && "text-pink-500"} `}>平均起床時間 : {journal.summary.getUpHour} 時 {journal.summary.getUpMin} 分</p>
                                    <p className = {`mb-1 text-lg ${selectedColor !== "pink" && "text-gray-600"} ${selectedColor == "pink" && "text-pink-500"}`}>平均就寝時間 : {journal.summary.goBedHour} 時 {journal.summary.goBedMin} 分</p>
                                    {journal.summary.sumSleepHour == 0 && journal.summary.sumSleepMin == 0 ? (
                                        <p className = "text-xl text-rose-500">平均睡眠時間 : データが不足しています</p>
                                    ) : (
                                        <p className = "text-xl text-rose-500">平均睡眠時間 : {journal.summary.sumSleepHour} 時 {journal.summary.sumSleepMin} 分</p>
                                    )}
                                </div>
                                <div>

                                </div>
                            </div>
                        } */}
                        {/* 閉じるUI */}
                        <div className = {`mx-4`}>
                            <div 
                                className = {`mx-auto cursor-pointer relative z-10 w-fit flex justify-center items-center mt-4 p-1 rounded-full ${selectedColor !== "pink" && "bg-gray-200 hover:bg-gray-300"} ${selectedColor == "pink" && "bg-pink-200 hover:bg-pink-300"} transition duration-200`}
                                onClick = {(e) => {
                                    e.stopPropagation();
                                    setIsOpen((prev) => !prev)
                                }}
                            >
                                <svg className = {`pointer-events-none rotate-180 size-8 ${selectedColor == "blue" && "text-green-500 hover:text-green-700"} ${selectedColor == "whiteBlack" && "text-gray-600 hover:text-gray-700"} ${selectedColor == "pink" && "text-pink-500 hover:text-pink-700"} transition duration-200`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                                </svg>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className = {`mx-4 pb-4 border-b-2 border-dashed ${selectedColor == "blue" && "border-sky-400"} ${selectedColor == "whiteBlack" && "border-gray-400"} ${selectedColor == "pink" && "border-pink-400"}`}>
                        <div 
                            className = {`mx-auto cursor-pointer relative z-10  w-fit flex justify-center items-center mt-4 p-1 rounded-full ${selectedColor !== "pink" && "bg-gray-200 hover:bg-gray-300"} ${selectedColor == "pink" && "bg-pink-200 hover:bg-pink-300"} transition duration-200`}
                            onClick = {(e) => {
                                e.stopPropagation();
                                setIsOpen((prev) => !prev)
                            }}
                        >
                            <svg className = {`size-8 pointer-events-none ${selectedColor == "blue" && "text-green-500 hover:text-green-700"} ${selectedColor == "whiteBlack" && "text-gray-600 hover:text-gray-700"} ${selectedColor == "pink" && "text-pink-500 hover:text-pink-700"} transition duration-200`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
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
                    className = {`relative bg-white rounded-lg shadow-lg py-6 px-6 w-11/12 h-68 flex flex-col items-center text-lg transition-opacity duration-300 ${btn ? "opacity-100" : "opacity-0"}`}
                >
                    <p className = "mb-1">{journal.targetDate}年</p>
                    <p className = "mb-3">この週のジャーナルを削除します</p>
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

export default DispYear