import { useState } from "react"
import { useAppDispatch, useAppSelector } from "../../hooks/ReduxHooks"
import { changeYearJournal, deleteYearJournal, plusYearJournal } from "../../store/yearJournal"

const YearJournal = () => {

    const [open, setOpen] = useState(true)
    const dispatch = useAppDispatch()
    const { journal, journalCount, journalLastEditTime } = useAppSelector((state) => state.yearJournal)
    const selectedColor = useAppSelector((state) => state.color.color)

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
                <h2 className = "text-2xl text-gray-700">ジャーナル記述欄</h2>
            </div>

            {/* ここから下がルーティーンの管理 */}
            {open &&
                <div className = "mt-4">

                    {journal.map((_journal, i) => {
                        return (
                            <div key = {i} className = {`border-2 px-2 py-1 ${selectedColor == "blue" && "border-sky-300 bg-sky-50"} ${selectedColor == "whiteBlack" && "border-gray-400/80 bg-gray-50"} ${selectedColor == "pink" && "border-pink-300 bg-pink-50"} rounded-xl shadow-lg mt-6`}>
                                <div className = "flex justify-between items-center">
                                    <p className = {`ml-2 ${selectedColor !== "whiteBlack" && "text-gray-500"} ${selectedColor == "whiteBlack" && "text-gray-600"}`}>文字数 : {journalCount[i]}</p>
                                    <div 
                                        data-testid = {`journal-delete-${i}`}
                                        className = {`${selectedColor !== "pink" && "bg-gray-200 hover:bg-gray-300 hover:text-gray-700"} ${selectedColor == "pink" && "bg-pink-200 text-pink-600 hover:bg-pink-300 hover:text-pink-700"} cursor-pointer mr-2 mt-1 p-0.5 rounded-lg shadow-sm hover:scale-110 transition duration-200`}
                                        onClick = {() => dispatch(deleteYearJournal(i))}
                                    >
                                        <svg className = "size-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                        </svg>
                                    </div>
                                </div>

                                <div className = "mt-2">
                                    <textarea 
                                        data-testid = {`journal-textarea-${i}`}
                                        className = {`hidden md:block w-full border-2 ${selectedColor !== "pink" && "border-gray-400"} ${selectedColor == "pink" && "border-pink-300"} rounded-xl shadow-lg px-2`}
                                        rows = {5}
                                        value = {_journal}
                                        onChange = {(e) => dispatch(changeYearJournal({ text: e.target.value, i: i }))}
                                    />
                                    <textarea 
                                        className = {`md:hidden w-full border-2 ${selectedColor !== "pink" && "border-gray-400"} ${selectedColor == "pink" && "border-pink-300"} rounded-xl shadow-lg px-2`}
                                        rows = {8}
                                        value = {_journal}
                                        onChange = {(e) => dispatch(changeYearJournal({ text: e.target.value, i: i }))}
                                    />
                                </div>
                                <p className = {`md:hidden ml-2 mt-1 ${selectedColor !== "whiteBlack" && "text-gray-500"} ${selectedColor == "whiteBlack" && "text-gray-600"}`}>
                                    最終更新日 :
                                </p>
                                <p className = {`md:hidden ml-2 ${selectedColor !== "whiteBlack" && "text-gray-500"} ${selectedColor == "whiteBlack" && "text-gray-600"}`}>
                                    {journalLastEditTime[i]}
                                </p>
                                <div className = "hidden md:flex justify-start items-end ml-2 my-1 gap-x-2">
                                    <p className = {`ml-2 mt-1 ${selectedColor !== "whiteBlack" && "text-gray-500"} ${selectedColor == "whiteBlack" && "text-gray-600"}`}>
                                        最終更新日 :
                                    </p>
                                    <p className = {`ml-2 ${selectedColor !== "whiteBlack" && "text-gray-500"} ${selectedColor == "whiteBlack" && "text-gray-600"}`}>
                                        {journalLastEditTime[i]}
                                    </p>
                                </div>
                            </div>
                        )
                    })}

                    {/* ジャーナルを追加するボタン */}
                    <div className = "mt-4 flex flex-col items-center justify-center">
                        <svg onClick = {() => dispatch(plusYearJournal())} className = "size-10 cursor-pointer text-white p-1 rounded-xl shadow-lg bg-red-400 hover:bg-red-500 hover:scale-110 transition duration-200" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                        </svg>
                    </div>

                </div>
            }
        </div>
    )
}

export default YearJournal