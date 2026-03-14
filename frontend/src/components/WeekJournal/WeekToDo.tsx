import { useState } from "react"
import { useAppDispatch, useAppSelector } from "../../hooks/ReduxHooks"
import { changeWeekToDo, changeWeekToDoImportant, deleteWeekToDo, plusWeekToDo, toggleWeekToDoCheck } from "../../store/weekJournal"

const WeekToDo = () => {

    const [open, setOpen] = useState(true)
    const dispatch = useAppDispatch()
    const { toDo, toDoCheck, toDoImportant } = useAppSelector((state) => state.weekJournal)
    const selectedColor = useAppSelector((state) => state.color.color)


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
                <h2 className = "text-2xl text-gray-700">今週達成したいこと</h2>
            </div>

            {/* ここから下がルーティーンの管理 */}
            {open &&
                <div className = "mt-4">

                    <div className = "block md:grid grid-cols-2 justify-center items-center">
                        {toDo.map((_toDo, i) => {
                            return (
                                <div key = {i} className = "md:pl-4 flex justify-start items-center gap-x-3 mx-2 mt-6">
                                    <div>
                                        <input 
                                            data-testid = {`checkbox-${i}`}
                                            type = "checkbox"
                                            className = "border size-6 cursor-pointer"
                                            checked = {toDoCheck[i]}
                                            onChange = {() => dispatch(toggleWeekToDoCheck(i))}
                                        />
                                        <div 
                                            data-testid = {`delete-button-${i}`}
                                            className = {`mt-4 cursor-pointer ${selectedColor !== "pink" && "bg-gray-200 hover:bg-gray-300 hover:text-gray-700"} ${selectedColor == "pink" && "bg-pink-200 hover:bg-pink-300 hover:text-pink-700"} p-0.5 rounded-lg shadow-sm hover:scale-110 transition duration-200`}
                                            onClick = {() => dispatch(deleteWeekToDo(i))}
                                        >
                                            <svg className = {`size-5 ${selectedColor == "pink" && "text-pink-600"}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                            </svg>
                                        </div>
                                    </div>

                                    <div className = {`border-l-2 pl-3 ${selectedColor == "blue" && "border-sky-400"} ${selectedColor == "whiteBlack" && "border-gray-500"} ${selectedColor == "pink" && "border-pink-400"} border-dashed`}>
                                        <textarea 
                                            data-testid = {`input-${i}`}
                                            className = {`md:w-68  border-2 w-60 px-2 py-0.5 ${selectedColor !== "pink" && "border-gray-400/90"} ${selectedColor == "pink" && "border-pink-300"} rounded-xl shadow-lg hover:border-sky-400 transition duration-200`}
                                            rows = {2}
                                            value = {_toDo}
                                            onChange = {(e) => dispatch(changeWeekToDo({ text: e.target.value, i: i}))}
                                        />
                                        <div className = "flex justify-center items-center gap-x-2 mt-2">
                                            <p className = "mr-2 border px-1 py-0.5 border-rose-500 bg-rose-500 rounded-lg shadow-lg text-white">重要度</p>
                                            <div
                                                data-testid = {`important2-${i}`}
                                                className = {`text-red-200/80 cursor-pointer text-2xl hover:text-red-300 hover:scale-110 transition duration-200 ${toDoImportant[i] == 2 && "text-red-800"}`}
                                                onClick = {() => dispatch(changeWeekToDoImportant({ value: 2, i: i}))}
                                            >
                                                ◎
                                            </div>
                                            <div 
                                                data-testid = {`important1-${i}`}
                                                className = {`text-rose-200/80 cursor-pointer text-2xl hover:text-rose-300 hover:scale-110 transition duration-200 ${toDoImportant[i] == 1 && "text-rose-800"}`}
                                                onClick = {() => dispatch(changeWeekToDoImportant({ value: 1, i: i}))}
                                            >
                                                ⚪︎
                                            </div>
                                            <div 
                                                data-testid = {`important0-${i}`}
                                                className = {`text-sky-200/80 cursor-pointer text-2xl hover:text-sky-300 hover:scale-110 transition duration-200 ${toDoImportant[i] == 0 && "text-sky-800"}`}
                                                onClick = {() => dispatch(changeWeekToDoImportant({ value: 0, i: i}))}
                                            >
                                                △
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                    

                    <div className = "flex justify-center mt-6 mb-2">
                        <svg onClick = {() => dispatch(plusWeekToDo())} className = {`size-10 cursor-pointer text-rose-500 ${selectedColor !== "pink" && "bg-gray-100 hover:bg-gray-200"} ${selectedColor == "pink" && "bg-pink-100 hover:bg-pink-200"} rounded-md shadow-lg hover:text-rose-600 hover:scale-110 transition duration-200`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                        </svg>
                    </div>

                </div>
            }
        </div>
    )
}

export default WeekToDo