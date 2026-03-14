import { useState } from "react"
import { useAppDispatch, useAppSelector } from "../../hooks/ReduxHooks"
import { changeEndToDoHour, changeEndToDoMin, changeStartToDoHour, changeStartToDoMin, changeToDo, changeToDoTimeHour, changeToDoTimeMin, channgeToDoImportant, deleteToDoList, plusToDoList, toggleToDoListCheck, toggleToDoTimeCheck } from "../../store/dailyJournal"

const DailyToDo = () => {

    const dispatch = useAppDispatch()
    const [open, setOpen] = useState(true)
    const { toDoTimeCheck, toDoTimeHour, toDoTimeMin, startToDoHour, startToDoMin, endToDoHour, endToDoMin, toDoList, toDoListCheck, toDoListImportant } = useAppSelector((state) => state.dailyJournal)
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
                <h2 className = "text-2xl text-gray-700">やることリスト</h2>
            </div>

            {/* ここから下がルーティーンの管理 */}
            {open &&
                <div className = "mt-4">
                    <div className = "md:flex justify-center items-start gap-x-6">
                        <div className = "">
                            <div className = "md:ml-6 flex justify-start items-center gap-x-3 ml-3">
                                <h2 className = "text-rose-600">
                                    取り組みたい合計時間 : 
                                </h2>
                                <div>
                                    <input 
                                        className = {`border-2 ${selectedColor !== "pink" && "border-gray-400"} ${selectedColor == "pink" && "border-pink-300"} rounded-lg px-2 w-10 hover:border-blue-500 transition duration-100`}
                                        value = {toDoTimeHour}
                                        onChange = {(e) => dispatch(changeToDoTimeHour(e.target.value))}
                                    />
                                </div>
                                <div>
                                    :
                                </div>
                                <div>
                                    <input 
                                        className = {`border-2 ${selectedColor !== "pink" && "border-gray-400"} ${selectedColor == "pink" && "border-pink-300"} rounded-lg px-2 w-10 hover:border-blue-500 transition duration-100`}
                                        value = {toDoTimeMin}
                                        onChange = {(e) => dispatch(changeToDoTimeMin(e.target.value))}
                                    />
                                </div>
                            </div>

                            <div className = {`md:px-6 px-1 py-2 border-2 ${selectedColor !== "pink" && "border-gray-300"} ${selectedColor == "pink" && "border-pink-300"} rounded-2xl shadow-lg mt-4`}>
                                <h2 className = "text-center">やるべきことをする時間</h2>
                                <div className = "flex justify-center items-center mt-3 gap-x-3">
                                    <div className = "flex justify-center items-center gap-x-1">
                                        <p>開始</p>
                                        <div>
                                            <input 
                                                className = {`border-2 ${selectedColor !== "pink" && "border-gray-400"} ${selectedColor == "pink" && "border-pink-300"} rounded-lg px-1 w-8 hover:border-blue-500 transition duration-100`}
                                                value = {startToDoHour}
                                                onChange = {(e) => dispatch(changeStartToDoHour(e.target.value))}
                                            />
                                        </div>
                                        <div>:</div>
                                        <div>
                                            <input 
                                                className = {`border-2 ${selectedColor !== "pink" && "border-gray-400"} ${selectedColor == "pink" && "border-pink-300"} rounded-lg px-1 w-8 hover:border-blue-500 transition duration-100`}
                                                value = {startToDoMin}
                                                onChange = {(e) => dispatch(changeStartToDoMin(e.target.value))}
                                            />
                                        </div>
                                    </div>
                                    <div className = {`text-3xl`}>
                                        ~
                                    </div>
                                    <div className = "flex justify-center items-center gap-x-1">
                                        <p>終了</p>
                                        <div>
                                            <input 
                                                className = {`border-2 ${selectedColor !== "pink" && "border-gray-400"} ${selectedColor == "pink" && "border-pink-300"} rounded-lg px-1 w-8 hover:border-blue-500 transition duration-100`}
                                                value = {endToDoHour}
                                                onChange = {(e) => dispatch(changeEndToDoHour(e.target.value))}
                                            />
                                        </div>
                                        <div>:</div>
                                        <div>
                                            <input 
                                                className = {`border-2 ${selectedColor !== "pink" && "border-gray-400"} ${selectedColor == "pink" && "border-pink-300"} rounded-lg px-1 w-8 hover:border-blue-500 transition duration-100`}
                                                value = {endToDoMin}
                                                onChange = {(e) => dispatch(changeEndToDoMin(e.target.value))}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div>
                                {/* 時間のチェックボックス */}
                                <div className = {`md:px-6  flex flex-col items-center justify-center mt-4 border-2 ${selectedColor !== "pink" && "border-gray-300"} ${selectedColor == "pink" && "border-pink-300"} rounded-2xl shadow-lg py-2`}>
                                    <div>
                                        30分ごとにチェック
                                    </div>
                                    <div className = "border-2 border-red-400 rounded-2xl shadow-lg py-4 my-3">
                                        <div className = "mt-2 flex justify-center items-center px-3 pb-1.5 gap-x-2">
                                            <div className = "flex justify-center items-center gap-x-1">
                                                <div 
                                                    className = {`border-2 cursor-pointer size-4 rounded-full shadow-md ${toDoTimeCheck[0] ? "border-red-500 bg-red-500" : "border-gray-400 border-dashed hover:border-gray-500 hover:scale-105 transition duration-100"}`}
                                                    onClick = {() => dispatch(toggleToDoTimeCheck(0))}
                                                ></div>
                                                <div 
                                                    className = {`border-2 cursor-pointer size-4 rounded-full shadow-md ${toDoTimeCheck[1] ? "border-red-500 bg-red-500" : "border-gray-400 border-dashed hover:border-gray-500 hover:scale-105 transition duration-100"}`}
                                                    onClick = {() => dispatch(toggleToDoTimeCheck(1))}
                                                ></div>
                                            </div>
                                            <div className = {`border-r-2 h-4 ${selectedColor !== "pink" && "border-gray-500"} ${selectedColor == "pink" && "border-pink-500"}`}></div>
                                            <div className = "flex justify-center items-center gap-x-1">
                                                <div 
                                                    className = {`border-2 cursor-pointer size-4 rounded-full shadow-md ${toDoTimeCheck[2] ? "border-red-500 bg-red-500" : "border-gray-400 border-dashed hover:border-gray-500 hover:scale-105 transition duration-100"}`}
                                                    onClick = {() => dispatch(toggleToDoTimeCheck(2))}
                                                ></div>
                                                <div 
                                                    className = {`border-2 cursor-pointer size-4 rounded-full shadow-md ${toDoTimeCheck[3] ? "border-red-500 bg-red-500" : "border-gray-400 border-dashed hover:border-gray-500 hover:scale-105 transition duration-100"}`}
                                                    onClick = {() => dispatch(toggleToDoTimeCheck(3))}
                                                ></div>
                                            </div>
                                            <div className = {`border-r-2 h-4 ${selectedColor !== "pink" && "border-gray-500"} ${selectedColor == "pink" && "border-pink-500"}`}></div>
                                            <div className = "flex justify-center items-center gap-x-1">
                                                <div 
                                                    className = {`border-2 cursor-pointer size-4 rounded-full shadow-md ${toDoTimeCheck[4] ? "border-red-500 bg-red-500" : "border-gray-400 border-dashed hover:border-gray-500 hover:scale-105 transition duration-100"}`}
                                                    onClick = {() => dispatch(toggleToDoTimeCheck(4))}
                                                ></div>
                                                <div 
                                                    className = {`border-2 cursor-pointer size-4 rounded-full shadow-md ${toDoTimeCheck[5] ? "border-red-500 bg-red-500" : "border-gray-400 border-dashed hover:border-gray-500 hover:scale-105 transition duration-100"}`}
                                                    onClick = {() => dispatch(toggleToDoTimeCheck(5))}
                                                ></div>
                                            </div>
                                            <div className = {`border-r-2 h-4 ${selectedColor !== "pink" && "border-gray-500"} ${selectedColor == "pink" && "border-pink-500"}`}></div>
                                            <div className = "flex justify-center items-center gap-x-1">
                                                <div 
                                                    className = {`border-2 cursor-pointer size-4 rounded-full shadow-md ${toDoTimeCheck[6] ? "border-red-500 bg-red-500" : "border-gray-400 border-dashed hover:border-gray-500 hover:scale-105 transition duration-100"}`}
                                                    onClick = {() => dispatch(toggleToDoTimeCheck(6))}
                                                ></div>
                                                <div 
                                                    className = {`border-2 cursor-pointer size-4 rounded-full shadow-md ${toDoTimeCheck[7] ? "border-red-500 bg-red-500" : "border-gray-400 border-dashed hover:border-gray-500 hover:scale-105 transition duration-100"}`}
                                                    onClick = {() => dispatch(toggleToDoTimeCheck(7))}
                                                ></div>
                                            </div>
                                            <div className = {`border-r-2 h-4 ${selectedColor !== "pink" && "border-gray-500"} ${selectedColor == "pink" && "border-pink-500"}`}></div>
                                            <div className = "flex justify-center items-center gap-x-1">
                                                <div 
                                                    className = {`border-2 cursor-pointer size-4 rounded-full shadow-md ${toDoTimeCheck[8] ? "border-red-500 bg-red-500" : "border-gray-400 border-dashed hover:border-gray-500 hover:scale-105 transition duration-100"}`}
                                                    onClick = {() => dispatch(toggleToDoTimeCheck(8))}
                                                ></div>
                                                <div 
                                                    className = {`border-2 cursor-pointer size-4 rounded-full shadow-md ${toDoTimeCheck[9] ? "border-red-500 bg-red-500" : "border-gray-400 border-dashed hover:border-gray-500 hover:scale-105 transition duration-100"}`}
                                                    onClick = {() => dispatch(toggleToDoTimeCheck(9))}
                                                ></div>
                                            </div>       
                                        </div>

                                        <div className = "mt-2 flex justify-center items-center px-3 py-1.5 gap-x-2">
                                            <div className = "flex justify-center items-center gap-x-1">
                                                <div 
                                                    className = {`border-2 cursor-pointer size-4 rounded-full shadow-md ${toDoTimeCheck[10] ? "border-red-500 bg-red-500" : "border-gray-400 border-dashed hover:border-gray-500 hover:scale-105 transition duration-100"}`}
                                                    onClick = {() => dispatch(toggleToDoTimeCheck(10))}
                                                ></div>
                                                <div 
                                                    className = {`border-2 cursor-pointer size-4 rounded-full shadow-md ${toDoTimeCheck[11] ? "border-red-500 bg-red-500" : "border-gray-400 border-dashed hover:border-gray-500 hover:scale-105 transition duration-100"}`}
                                                    onClick = {() => dispatch(toggleToDoTimeCheck(11))}
                                                ></div>
                                            </div>
                                            <div className = {`border-r-2 h-4 ${selectedColor !== "pink" && "border-gray-500"} ${selectedColor == "pink" && "border-pink-500"}`}></div>
                                            <div className = "flex justify-center items-center gap-x-1">
                                                <div 
                                                    className = {`border-2 cursor-pointer size-4 rounded-full shadow-md ${toDoTimeCheck[12] ? "border-red-500 bg-red-500" : "border-gray-400 border-dashed hover:border-gray-500 hover:scale-105 transition duration-100"}`}
                                                    onClick = {() => dispatch(toggleToDoTimeCheck(12))}
                                                ></div>
                                                <div 
                                                    className = {`border-2 cursor-pointer size-4 rounded-full shadow-md ${toDoTimeCheck[13] ? "border-red-500 bg-red-500" : "border-gray-400 border-dashed hover:border-gray-500 hover:scale-105 transition duration-100"}`}
                                                    onClick = {() => dispatch(toggleToDoTimeCheck(13))}
                                                ></div>
                                            </div>
                                            <div className = {`border-r-2 h-4 ${selectedColor !== "pink" && "border-gray-500"} ${selectedColor == "pink" && "border-pink-500"}`}></div>
                                            <div className = "flex justify-center items-center gap-x-1">
                                                <div 
                                                    className = {`border-2 cursor-pointer size-4 rounded-full shadow-md ${toDoTimeCheck[14] ? "border-red-500 bg-red-500" : "border-gray-400 border-dashed hover:border-gray-500 hover:scale-105 transition duration-100"}`}
                                                    onClick = {() => dispatch(toggleToDoTimeCheck(14))}
                                                ></div>
                                                <div 
                                                    className = {`border-2 cursor-pointer size-4 rounded-full shadow-md ${toDoTimeCheck[15] ? "border-red-500 bg-red-500" : "border-gray-400 border-dashed hover:border-gray-500 hover:scale-105 transition duration-100"}`}
                                                    onClick = {() => dispatch(toggleToDoTimeCheck(15))}
                                                ></div>
                                            </div>
                                            <div className = {`border-r-2 h-4 ${selectedColor !== "pink" && "border-gray-500"} ${selectedColor == "pink" && "border-pink-500"}`}></div>
                                            <div className = "flex justify-center items-center gap-x-1">
                                                <div 
                                                    className = {`border-2 cursor-pointer size-4 rounded-full shadow-md ${toDoTimeCheck[16] ? "border-red-500 bg-red-500" : "border-gray-400 border-dashed hover:border-gray-500 hover:scale-105 transition duration-100"}`}
                                                    onClick = {() => dispatch(toggleToDoTimeCheck(16))}
                                                ></div>
                                                <div 
                                                    className = {`border-2 cursor-pointer size-4 rounded-full shadow-md ${toDoTimeCheck[17] ? "border-red-500 bg-red-500" : "border-gray-400 border-dashed hover:border-gray-500 hover:scale-105 transition duration-100"}`}
                                                    onClick = {() => dispatch(toggleToDoTimeCheck(17))}
                                                ></div>
                                            </div>
                                            <div className = {`border-r-2 h-4 ${selectedColor !== "pink" && "border-gray-500"} ${selectedColor == "pink" && "border-pink-500"}`}></div>
                                            <div className = "flex justify-center items-center gap-x-1">
                                                <div 
                                                    className = {`border-2 cursor-pointer size-4 rounded-full shadow-md ${toDoTimeCheck[18] ? "border-red-500 bg-red-500" : "border-gray-400 border-dashed hover:border-gray-500 hover:scale-105 transition duration-100"}`}
                                                    onClick = {() => dispatch(toggleToDoTimeCheck(18))}
                                                ></div>
                                                <div 
                                                    className = {`border-2 cursor-pointer size-4 rounded-full shadow-md ${toDoTimeCheck[19] ? "border-red-500 bg-red-500" : "border-gray-400 border-dashed hover:border-gray-500 hover:scale-105 transition duration-100"}`}
                                                    onClick = {() => dispatch(toggleToDoTimeCheck(19))}
                                                ></div>
                                            </div>       
                                        </div>

                                        <div className = "mt-2 flex justify-center items-center px-3 py-1.5 gap-x-2">
                                            <div className = "flex justify-center items-center gap-x-1">
                                                <div 
                                                    className = {`border-2 cursor-pointer size-4 rounded-full shadow-md ${toDoTimeCheck[20] ? "border-red-500 bg-red-500" : "border-gray-400 border-dashed hover:border-gray-500 hover:scale-105 transition duration-100"}`}
                                                    onClick = {() => dispatch(toggleToDoTimeCheck(20))}
                                                ></div>
                                                <div 
                                                    className = {`border-2 cursor-pointer size-4 rounded-full shadow-md ${toDoTimeCheck[21] ? "border-red-500 bg-red-500" : "border-gray-400 border-dashed hover:border-gray-500 hover:scale-105 transition duration-100"}`}
                                                    onClick = {() => dispatch(toggleToDoTimeCheck(21))}
                                                ></div>
                                            </div>
                                            <div className = {`border-r-2 h-4 ${selectedColor !== "pink" && "border-gray-500"} ${selectedColor == "pink" && "border-pink-500"}`}></div>
                                            <div className = "flex justify-center items-center gap-x-1">
                                                <div 
                                                    className = {`border-2 cursor-pointer size-4 rounded-full shadow-md ${toDoTimeCheck[22] ? "border-red-500 bg-red-500" : "border-gray-400 border-dashed hover:border-gray-500 hover:scale-105 transition duration-100"}`}
                                                    onClick = {() => dispatch(toggleToDoTimeCheck(22))}
                                                ></div>
                                                <div 
                                                    className = {`border-2 cursor-pointer size-4 rounded-full shadow-md ${toDoTimeCheck[23] ? "border-red-500 bg-red-500" : "border-gray-400 border-dashed hover:border-gray-500 hover:scale-105 transition duration-100"}`}
                                                    onClick = {() => dispatch(toggleToDoTimeCheck(23))}
                                                ></div>
                                            </div>
                                            <div className = {`border-r-2 h-4 ${selectedColor !== "pink" && "border-gray-500"} ${selectedColor == "pink" && "border-pink-500"}`}></div>
                                            <div className = "flex justify-center items-center gap-x-1">
                                                <div 
                                                    className = {`border-2 cursor-pointer size-4 rounded-full shadow-md ${toDoTimeCheck[24] ? "border-red-500 bg-red-500" : "border-gray-400 border-dashed hover:border-gray-500 hover:scale-105 transition duration-100"}`}
                                                    onClick = {() => dispatch(toggleToDoTimeCheck(24))}    
                                                ></div>
                                                <div 
                                                    className = {`border-2 cursor-pointer size-4 rounded-full shadow-md ${toDoTimeCheck[25] ? "border-red-500 bg-red-500" : "border-gray-400 border-dashed hover:border-gray-500 hover:scale-105 transition duration-100"}`}
                                                    onClick = {() => dispatch(toggleToDoTimeCheck(25))}    
                                                ></div>
                                            </div>
                                            <div className = {`border-r-2 h-4 ${selectedColor !== "pink" && "border-gray-500"} ${selectedColor == "pink" && "border-pink-500"}`}></div>
                                            <div className = "flex justify-center items-center gap-x-1">
                                                <div 
                                                    className = {`border-2 cursor-pointer size-4 rounded-full shadow-md ${toDoTimeCheck[26] ? "border-red-500 bg-red-500" : "border-gray-400 border-dashed hover:border-gray-500 hover:scale-105 transition duration-100"}`}
                                                    onClick = {() => dispatch(toggleToDoTimeCheck(26))}    
                                                ></div>
                                                <div 
                                                    className = {`border-2 cursor-pointer size-4 rounded-full shadow-md ${toDoTimeCheck[27] ? "border-red-500 bg-red-500" : "border-gray-400 border-dashed hover:border-gray-500 hover:scale-105 transition duration-100"}`}
                                                    onClick = {() => dispatch(toggleToDoTimeCheck(27))}    
                                                ></div>
                                            </div>
                                            <div className = {`border-r-2 h-4 ${selectedColor !== "pink" && "border-gray-500"} ${selectedColor == "pink" && "border-pink-500"}`}></div>
                                            <div className = "flex justify-center items-center gap-x-1">
                                                <div 
                                                    className = {`border-2 cursor-pointer size-4 rounded-full shadow-md ${toDoTimeCheck[28] ? "border-red-500 bg-red-500" : "border-gray-400 border-dashed hover:border-gray-500 hover:scale-105 transition duration-100"}`}
                                                    onClick = {() => dispatch(toggleToDoTimeCheck(28))}
                                                ></div>
                                                <div 
                                                    className = {`border-2 cursor-pointer size-4 rounded-full shadow-md ${toDoTimeCheck[29] ? "border-red-500 bg-red-500" : "border-gray-400 border-dashed hover:border-gray-500 hover:scale-105 transition duration-100"}`}
                                                    onClick = {() => dispatch(toggleToDoTimeCheck(29))}
                                                ></div>
                                            </div>       
                                        </div>

                                        <div className = "mt-2 flex justify-center items-center px-3 py-1.5 gap-x-2">
                                            <div className = "flex justify-center items-center gap-x-1">
                                                <div 
                                                    className = {`border-2 cursor-pointer size-4 rounded-full shadow-md ${toDoTimeCheck[30] ? "border-red-500 bg-red-500" : "border-gray-400 border-dashed hover:border-gray-500 hover:scale-105 transition duration-100"}`}
                                                    onClick = {() => dispatch(toggleToDoTimeCheck(30))}
                                                ></div>
                                                <div 
                                                    className = {`border-2 cursor-pointer size-4 rounded-full shadow-md ${toDoTimeCheck[31] ? "border-red-500 bg-red-500" : "border-gray-400 border-dashed hover:border-gray-500 hover:scale-105 transition duration-100"}`}
                                                    onClick = {() => dispatch(toggleToDoTimeCheck(31))}
                                                ></div>
                                            </div>
                                            <div className = {`border-r-2 h-4 ${selectedColor !== "pink" && "border-gray-500"} ${selectedColor == "pink" && "border-pink-500"}`}></div>
                                            <div className = "flex justify-center items-center gap-x-1">
                                                <div 
                                                    className = {`border-2 cursor-pointer size-4 rounded-full shadow-md ${toDoTimeCheck[32] ? "border-red-500 bg-red-500" : "border-gray-400 border-dashed hover:border-gray-500 hover:scale-105 transition duration-100"}`}
                                                    onClick = {() => dispatch(toggleToDoTimeCheck(32))}
                                                ></div>
                                                <div 
                                                    className = {`border-2 cursor-pointer size-4 rounded-full shadow-md ${toDoTimeCheck[33] ? "border-red-500 bg-red-500" : "border-gray-400 border-dashed hover:border-gray-500 hover:scale-105 transition duration-100"}`}
                                                    onClick = {() => dispatch(toggleToDoTimeCheck(33))}
                                                ></div>
                                            </div>
                                            <div className = {`border-r-2 h-4 ${selectedColor !== "pink" && "border-gray-500"} ${selectedColor == "pink" && "border-pink-500"}`}></div>
                                            <div className = "flex justify-center items-center gap-x-1">
                                                <div 
                                                    className = {`border-2 cursor-pointer size-4 rounded-full shadow-md ${toDoTimeCheck[34] ? "border-red-500 bg-red-500" : "border-gray-400 border-dashed hover:border-gray-500 hover:scale-105 transition duration-100"}`}
                                                    onClick = {() => dispatch(toggleToDoTimeCheck(34))}
                                                ></div>
                                                <div 
                                                    className = {`border-2 cursor-pointer size-4 rounded-full shadow-md ${toDoTimeCheck[35] ? "border-red-500 bg-red-500" : "border-gray-400 border-dashed hover:border-gray-500 hover:scale-105 transition duration-100"}`}
                                                    onClick = {() => dispatch(toggleToDoTimeCheck(35))}
                                                ></div>
                                            </div>
                                            <div className = {`border-r-2 h-4 ${selectedColor !== "pink" && "border-gray-500"} ${selectedColor == "pink" && "border-pink-500"}`}></div>
                                            <div className = "flex justify-center items-center gap-x-1">
                                                <div 
                                                    className = {`border-2 cursor-pointer size-4 rounded-full shadow-md ${toDoTimeCheck[36] ? "border-red-500 bg-red-500" : "border-gray-400 border-dashed hover:border-gray-500 hover:scale-105 transition duration-100"}`}
                                                    onClick = {() => dispatch(toggleToDoTimeCheck(36))}
                                                ></div>
                                                <div 
                                                    className = {`border-2 cursor-pointer size-4 rounded-full shadow-md ${toDoTimeCheck[37] ? "border-red-500 bg-red-500" : "border-gray-400 border-dashed hover:border-gray-500 hover:scale-105 transition duration-100"}`}
                                                    onClick = {() => dispatch(toggleToDoTimeCheck(37))}
                                                ></div>
                                            </div>
                                            <div className = {`border-r-2 h-4 ${selectedColor !== "pink" && "border-gray-500"} ${selectedColor == "pink" && "border-pink-500"}`}></div>
                                            <div className = "flex justify-center items-center gap-x-1">
                                                <div 
                                                    className = {`border-2 cursor-pointer size-4 rounded-full shadow-md ${toDoTimeCheck[38] ? "border-red-500 bg-red-500" : "border-gray-400 border-dashed hover:border-gray-500 hover:scale-105 transition duration-100"}`}
                                                    onClick = {() => dispatch(toggleToDoTimeCheck(38))}
                                                ></div>
                                                <div 
                                                    className = {`border-2 cursor-pointer size-4 rounded-full shadow-md ${toDoTimeCheck[39] ? "border-red-500 bg-red-500" : "border-gray-400 border-dashed hover:border-gray-500 hover:scale-105 transition duration-100"}`}
                                                    onClick = {() => dispatch(toggleToDoTimeCheck(39))}
                                                ></div>
                                            </div>       
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div>
                            {/* 本命のチェックボックス */}
                            <div className = "mt-6 md:mt-2">
                                <p className = "text-2xl mb-8 text-center">今日のやることリスト</p>
                                {toDoList.map((toDo, i) => {
                                    return (
                                        <div key = {i} className = {`mt-4 flex justify-start items-center gap-x-4 pb-4 ${i + 1 !== toDoList.length && selectedColor !== "pink" && "border-b-2 border-dashed border-gray-300"} ${i + 1 !== toDoList.length && selectedColor == "pink" && "border-b-2 border-dashed border-pink-300"}`}>
                                            <div>
                                                <input 
                                                    data-testid={`toggle-check-${i}`}
                                                    type = "checkbox"
                                                    className = "size-6 ml-0.5 cursor-pointer"
                                                    checked = {toDoListCheck[i]}
                                                    onChange = {() => dispatch(toggleToDoListCheck(i))}
                                                />

                                                <div 
                                                    data-testid={`delete-routine-${i}`}
                                                    className = {`mt-2.5 cursor-pointer ${selectedColor !== "pink" && "bg-gray-200 hover:bg-gray-300 hover:text-gray-700"} ${selectedColor == "pink" && "bg-pink-200 hover:bg-pink-300 text-pink-600 hover:text-pink-700"} p-0.5 rounded-lg shadow-sm hover:scale-110 transition duration-200`}
                                                    onClick = {() => dispatch(deleteToDoList(i))}
                                                >
                                                    <svg className = "size-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                                    </svg>
                                                </div>
                                            </div>

                                            <div className = {`border-l-2 pl-4 ${selectedColor !== "pink" && "border-gray-500"} ${selectedColor == "pink" && "border-pink-500"} border-dashed`}>
                                                <div>
                                                    <input
                                                        data-testid={`input-text-${i}`}
                                                        className = {`md:w-64 border-2 w-60 rounded-lg shadow-lg ${selectedColor !== "pink" && "border-gray-400"} ${selectedColor == "pink" && "border-pink-300"} px-2 py-0.5`}
                                                        value = {toDoList[i]}
                                                        onChange = {(e) => dispatch(changeToDo({text: e.target.value, i: i}))}
                                                    />
                                                </div>

                                                <div className = "flex justify-center items-center gap-x-2 mt-2">
                                                    <p className = "mr-2 border px-1 py-0.5 border-rose-500 bg-rose-500 rounded-lg shadow-lg text-white">重要度</p>
                                                    <div 
                                                        data-testid={`important-2-${i}`}
                                                        className = {`text-red-200/80 cursor-pointer text-2xl hover:text-red-300 hover:scale-110 transition duration-200 ${toDoListImportant[i] == 2 && "text-red-800"}`}
                                                        onClick = {() => dispatch(channgeToDoImportant({ value: 2, i: i }))}
                                                    >
                                                        ◎
                                                    </div>
                                                    <div 
                                                        data-testid={`important-1-${i}`}
                                                        className = {`text-rose-200/80 cursor-pointer text-2xl hover:text-rose-300 hover:scale-110 transition duration-200 ${toDoListImportant[i] == 1 && "text-rose-800"}`}
                                                        onClick = {() => dispatch(channgeToDoImportant({ value: 1, i: i }))}
                                                    >
                                                        ⚪︎
                                                    </div>
                                                    <div 
                                                        data-testid={`important-0-${i}`}
                                                        className = {`text-sky-200/80 cursor-pointer text-2xl hover:text-sky-300 hover:scale-110 transition duration-200 ${toDoListImportant[i] == 0 && "text-sky-800"}`}
                                                        onClick = {() => dispatch(channgeToDoImportant({ value: 0, i: i }))}
                                                    >
                                                        △
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>

                            {/* toDoListを追加するボタン */}
                            <div 
                                className = "mt-2 flex flex-col items-center justify-center"
                            >
                                <svg onClick = {() => dispatch(plusToDoList())} className = "size-10 cursor-pointer text-white p-1 rounded-xl shadow-lg bg-red-400 hover:bg-red-500 hover:scale-110 transition duration-200" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                </svg>
                            </div>
                        </div>
                        
                    </div>
                </div>
            }
        </div>
    )
}

export default DailyToDo