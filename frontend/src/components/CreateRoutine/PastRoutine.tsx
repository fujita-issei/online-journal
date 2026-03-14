import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAppDispatch, useAppSelector } from "../../hooks/ReduxHooks"
import axios from "axios"
import { setEditState, setRoutineInit } from "../../store/routine"
import type { RoutineInitState } from "../../constant/routineInitState"
import formatDate from "../../func/formatDate"


type Props = {
    _routine: RoutineInitState;
    getRoutineList: () => void;
}

const PastRoutine = ({_routine, getRoutineList}: Props) => {

    const navigate = useNavigate()
    const [btn, setBtn] = useState(false)
    const dispatch = useAppDispatch()
    const selectedColor = useAppSelector((state) => state.color.color)

    const deleteRoutine = async () => {
        try {
            await axios.delete("/api/routine/delete", {
                params: {
                    routineId: _routine.routineId
                }
            })
            getRoutineList()
            dispatch(setRoutineInit())
            setBtn(false)
            window.scrollTo(0, 0)
        } catch (e) {
            console.error("エラー", e)
        }
    }

    const editRoutine = async () => {
        dispatch(setEditState({ 
            routineId : _routine.routineId, 
            routineName: _routine.routineName, 
            targetTimeHour: _routine.targetTimeHour, 
            targetTimeMin: _routine.targetTimeMin, 
            routine: _routine.routine,
            routineTime: _routine.routineTime,
            createdAt: _routine.createdAt,
            updatedAt: _routine.updatedAt
        }))
        navigate("/createRoutine/edit")
    }

    return (
        <div>
            <div className = {`mt-6 border-2 ${selectedColor == "blue" && "border-sky-500"} ${selectedColor == "whiteBlack" && "border-gray-500"} ${selectedColor == "pink" && "border-pink-500"} shadow-xl rounded-2xl shadow-lx`}>
                <p className = {`py-2 truncate px-4 text-lg text-center ${selectedColor == "blue" && "bg-sky-500"} ${selectedColor == "whiteBlack" && "bg-gray-500"} ${selectedColor == "pink" && "bg-pink-500"} text-white rounded-t-xl rounded-b-md shadow-lg`}>
                    {_routine.routineName !== "" ?  _routine.routineName : "タイトル無し"}
                </p>
                <div className = {`my-4 border-b-2 pb-4 mx-4 border-dashed ${selectedColor == "blue" && "border-sky-400"} ${selectedColor == "whiteBlack" && "border-gray-400"} ${selectedColor == "pink" && "border-pink-400"}`}>
                    {_routine.routine.map((item, i) => {
                        if (i != 0) {
                            return (
                            <div key = {i}>
                                <div className = "flex justify-center my-1">
                                    <svg className = {`size-8 ${selectedColor == "blue" && "text-sky-500"} ${selectedColor == "whiteBlack" && "text-gray-500"} ${selectedColor == "pink" && "text-pink-500"}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 5.25 7.5 7.5 7.5-7.5m-15 6 7.5 7.5 7.5-7.5" />
                                    </svg>
                                </div>

                                <div className = "flex justify-between items-center min-w-0 gap-x-2">
                                    <p className = "truncate">{item}</p>
                                    <p className = {`shrink-0 whitespace-nowrap border-l-2 pl-2 border-dashed ${selectedColor == "blue" && "border-sky-400"} ${selectedColor == "whiteBlack" && "border-gray-400"} ${selectedColor == "pink" && "border-pink-400"} `}>
                                        所要時間 : {_routine.routineTime[i]}分
                                    </p>
                                </div>
                            </div>
                            )
                        } else {
                            return (
                                <div key = {i}>
                                    <div className = "flex justify-between items-center min-w-0 gap-x-2">
                                        <p className = "truncate">{item}</p>
                                        <p className = {`shrink-0 whitespace-nowrap border-l-2 pl-2 border-dashed ${selectedColor == "blue" && "border-sky-400"} ${selectedColor == "whiteBlack" && "border-gray-400"} ${selectedColor == "pink" && "border-pink-400"} `}>
                                            所要時間 : {_routine.routineTime[i]}分
                                        </p>
                                    </div>
                                </div>
                            )
                        }
                    })}
                </div>

                <div className = {`border-b-2 text-center mx-4 border-dashed pb-4 ${selectedColor == "blue" && "border-sky-400"} ${selectedColor == "whiteBlack" && "border-gray-400"} ${selectedColor == "pink" && "border-pink-400 text-pink-600"}`}>
                    <div className = {`border-2 py-2 ${selectedColor == "blue" && "border-sky-300 bg-sky-50"} ${selectedColor == "whiteBlack" && "border-gray-400 bg-gray-50"} ${selectedColor == "pink" && "border-pink-300 bg-pink-50"} rounded-xl shadow-lg`}>
                        <p className = "text-xl mb-2">目標完了時間 : {_routine.targetTimeHour}時間 {_routine.targetTimeMin}分</p>
                        <p>最終更新日時 : {formatDate(_routine.updatedAt)}</p>
                    </div>
                </div>

                <div className = "my-6 flex justify-center items-center gap-x-10">
                    <button
                        data-testid = "edit-button"
                        className = {`border-2 cursor-pointer text-white rounded-xl shadow-lg px-4 py-2 ${selectedColor == "blue" && "border-sky-500 bg-sky-500 hover:border-sky-600 hover:bg-sky-600"} ${selectedColor == "whiteBlack" && "border-gray-500 bg-gray-500 hover:border-gray-600 hover:bg-gray-600"} ${selectedColor == "pink" && "border-pink-500 bg-pink-500 hover:border-pink-600 hover:bg-pink-600"} hover:scale-110 transition duration-300`}
                        onClick = {() => editRoutine()}
                    >
                        編集
                    </button>
                    <button
                        data-testid = "delete-button1"
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
                    className = {`relative cursor-pointer bg-white rounded-lg shadow-lg py-6 px-6 w-11/12 h-60 flex flex-col items-center text-lg transition-opacity duration-300 ${btn ? "opacity-100" : "opacity-0"}`}
                >
                    <p className = "mb-1 w-60 md:w-80 truncate">{_routine.routineName}</p>
                    <p className = "mb-3">というルーティーンを削除します</p>
                    <p className = "text-xl">本当によろしいですか？</p>
                    <div className = "flex justify-center items-center mt-8 gap-x-8">
                        <button
                            data-testid = "delete-button2"
                            className = "bg-red-500 cursor-pointer px-4 py-2 rounded-xl shadow-lg text-white border-2 border-red-500 hover:border-red-600 hover:bg-red-600 hover:scale-110 transition duration-200"
                            onClick = {() => deleteRoutine()}
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

export default PastRoutine