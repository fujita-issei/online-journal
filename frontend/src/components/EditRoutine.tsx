import { useEffect, useState } from "react"
import { useAppDispatch, useAppSelector } from "../hooks/ReduxHooks"
import { setSelectedMenu } from "../store/Menu"
import RoutineList from "./EditRoutine/RoutineList"
import { useNavigate } from "react-router-dom"
import { changeRoutineName, changeTargetTimeHour, changeTargetTimeMin, plusAfterRoutine, plusBeforeRoutine, setRoutineInit} from "../store/routine"
import axios from "axios"

const EditRoutine = () => {

    const dispatch = useAppDispatch()
    const navigate = useNavigate()
    const [btn, setBtn] = useState(false)
    const { routineId, routineName, targetTimeHour, targetTimeMin, routine, routineTime } = useAppSelector((state) => state.routine)
    const { userId } = useAppSelector((state) => state.login)
    const selectedColor = useAppSelector((state) => state.color.color)

    useEffect(() => {
        localStorage.setItem("currentPage", "ルーティーンを作成")
        dispatch(setSelectedMenu("ルーティーンを作成"))
    }, [dispatch])

    const deleteRoutine = async () => {
        try {
            await axios.delete("/api/routine/delete", {
                params: {
                    routineId: routineId
                }
            })
            setBtn(false)
            window.scrollTo(0, 0)
            setBtn(false)
            dispatch(setRoutineInit())
            navigate("/createRoutine")
        } catch (e) {
            console.error(e)
        }
    }

    const saveRoutine = async () => {
        // httpリクエストを送って、DBに保存する。
        try {
            await axios.post("/api/routine/save", {
                routineId: routineId,
                userId: userId,
                routineName: routineName,
                targetTimeHour: targetTimeHour,
                targetTimeMin: targetTimeMin,
                routine: routine,
                routineTime: routineTime
            })
            dispatch(setRoutineInit())
            navigate("/createRoutine")
        } catch (e) {
            console.log("saveRoutineでエラー", e)
        }
    }

    return (
        <div className = {`mt-4 border-2 mx-3 py-6 px-3 rounded-2xl shadow-lg bg-white border-dashed ${selectedColor !== "pink" && "border-gray-500"} ${selectedColor == "pink" && "border-pink-500"}`}>

            <div className = "md:flex justify-center items-center gap-x-8">
                <div className = "pl-2 flex justify-start items-center gap-x-2 mb-4 text-lg">
                    <p>名前 :</p>
                    <div>
                        <input 
                            className = {`border-2 px-2 py-0.5 w-60 ${selectedColor !== "pink" && "border-gray-400/90"} ${selectedColor == "pink" && "border-pink-300"} rounded-lg shadow-lg hover:border-sky-400 transition duration-200`}
                            placeholder = "ルーティーン名を入力"
                            value = {routineName}
                            onChange = {(e) => dispatch(changeRoutineName(e.target.value))}
                        />
                    </div>
                </div>

                <div className = {`md:border-b-0 pl-2 text-lg flex justify-start items-center gap-x-2 border-b-2 pb-4 ${selectedColor == "blue" && "border-sky-500"} ${selectedColor == "whiteBlack" && "border-gray-500"} ${selectedColor == "pink" && "border-pink-500"} border-dashed`}>
                    <p>目標完了時間 :</p>
                    <div>
                        <input 
                            className = {`border-2 px-2 py-0.5 w-12 ${selectedColor !== "pink" && "border-gray-400"} ${selectedColor == "pink" && "border-pink-300"} rounded-lg shadow-lg hover:border-sky-400 transition duration-200`}
                            value = {targetTimeHour}
                            onChange = {(e) => dispatch(changeTargetTimeHour(e.target.value))}
                        />
                    </div>
                    <p>時間</p>
                    <div>
                        <input 
                            className = {`border-2 px-2 py-0.5 w-12 ${selectedColor !== "pink" && "border-gray-400"} ${selectedColor == "pink" && "border-pink-300"} rounded-lg shadow-lg hover:border-sky-400 transition duration-200`}
                            value = {targetTimeMin}
                            onChange = {(e) => dispatch(changeTargetTimeMin(e.target.value))}
                        />
                    </div>
                    <p>分</p>
                </div>
            </div>
            

            <div className = "flex justify-center mx-2 my-4">
                <svg data-testid = "before-button" onClick = {() => dispatch(plusBeforeRoutine())} className = {`size-10 cursor-pointer text-rose-500 ${selectedColor !== "pink" && "bg-gray-100 hover:bg-gray-200"} ${selectedColor == "pink" && "bg-pink-100 hover:bg-pink-200"} rounded-md shadow-lg hover:text-rose-600 hover:scale-110 transition duration-200`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
            </div>

            {/* ここから下がルーティーン入力欄 */}
            {routine.map((_routine, i) => {
                if (i === 0) {
                    return (
                        <div className = "mt-6" key = {i}>
                            <RoutineList routineName = {_routine} routineTime = {routineTime[0]} i = {i} />
                        </div>
                        
                    )
                } else {
                    return (
                        <div key = {i}>
                            {/* 矢印 */}
                            <div className = "flex justify-center">
                                <svg className = {`size-10 ${selectedColor == "blue" && "text-sky-500"} ${selectedColor == "whiteBlack" && "text-gray-500"} ${selectedColor == "pink" && "text-pink-500"}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 5.25 7.5 7.5 7.5-7.5m-15 6 7.5 7.5 7.5-7.5" />
                                </svg>
                            </div>
                            <RoutineList routineName = {_routine} routineTime = {routineTime[i]} i = {i} />
                        </div>
                    )
                }
            })}

            <div className = {`flex justify-center border-b-2 pb-6 border-dashed ${selectedColor == "blue" && "border-sky-400"} ${selectedColor == "whiteBlack" && "border-gray-500/90"} ${selectedColor == "pink" && "border-pink-400"} mx-2 mb-6`}>
                <svg data-testid = "after-button" onClick = {() => dispatch(plusAfterRoutine())} className = {`size-10 cursor-pointer text-rose-500 ${selectedColor !== "pink" && "bg-gray-100 hover:bg-gray-200"} ${selectedColor == "pink" && "bg-pink-100 hover:bg-pink-200"} rounded-md shadow-lg hover:text-rose-600 hover:scale-110 transition duration-200`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
            </div>

            {/* ボタン */}
            <div className = "mb-4 flex justify-center items-center gap-x-10">
                <button
                    data-testid = "save-button"
                    className = {`border-2 text-white rounded-xl shadow-lg px-4 py-2 ${selectedColor == "blue" && "border-sky-500 bg-sky-500 hover:border-sky-600 hover:bg-sky-600"} ${selectedColor == "whiteBlack" && "border-gray-500 bg-gray-500 hover:border-gray-600 hover:bg-gray-600"} ${selectedColor == "pink" && "border-pink-500 bg-pink-500 hover:border-pink-600 hover:bg-pink-600"} hover:scale-110 transition duration-300`}
                    onClick = {() => saveRoutine()}
                >
                    保存
                </button>
                <button
                    data-testid = "reset1"
                    className = {`border-2 rounded-xl shadow-lg px-4 py-2 ${selectedColor == "blue" && "border-sky-500 text-sky-500 hover:border-sky-600"} ${selectedColor == "whiteBlack" && "border-gray-500 text-gray-500 hover:border-gray-600"} ${selectedColor == "pink" && "border-pink-500 text-pink-500 hover:border-pink-600"} hover:scale-110 transition duration-300`}
                    onClick = {() => setBtn(true)}
                >
                    リセット
                </button>
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
                    <p className = "mb-1 w-60 md:w-80 truncate">{routineName}</p>
                    <p className = "mb-3">というルーティーンを削除します</p>
                    <p className = "text-xl">本当によろしいですか？</p>
                    <div className = "flex justify-center items-center mt-8 gap-x-8">
                        <button
                            data-testid = "reset2"
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

export default EditRoutine