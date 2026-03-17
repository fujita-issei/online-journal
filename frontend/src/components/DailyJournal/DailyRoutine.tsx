import { useEffect, useState } from "react"
import { useAppDispatch, useAppSelector } from "../../hooks/ReduxHooks"
import { addRoutine, deleteRoutine, toggleRoutineCheck } from "../../store/dailyJournal"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { setRoutineInit } from "../../store/routine"
import * as wanakana from "wanakana"
import type { RoutineInitState } from "../../constant/routineInitState"
import checkJournalWritten from "../../func/checkJournalWritten"

const DailyRoutine = () => {

    const dispatch = useAppDispatch()
    const [open, setOpen] = useState(true)
    const [inputText, setInputText] = useState("") // 入力欄に何を入力したのか
    const [allRoutine, setAllRoutine] = useState<RoutineInitState[]>([]) // 全ての作成したルーティーン。httpリクエストで取ってくる
    const [filteredRoutine, setFilteredRoutine] = useState<RoutineInitState[]>([])
    const [filterOpen, setFilterOpen] = useState(false)
    const [routineOpen, setRoutineOpen] = useState<boolean[]>([])
    const navigate = useNavigate()
    const dailyJournal = useAppSelector((state) => state.dailyJournal)
    const { targetDate, getUpHour, getUpMin, goBedHour, goBedMin, routine, routineCheck, toDoTimeHour, toDoTimeMin, startToDoHour, startToDoMin, endToDoHour, endToDoMin, toDoTimeCheck, toDoList, toDoListCheck, toDoListImportant, importList, importListCheck, addList, addListCheck, journal, journalCount, journalLastEditTime, moneyInvestment, moneyWaste, moneyConsumption, moneyUseSum } = useAppSelector((state) => state.dailyJournal)
    const selectedColor = useAppSelector((state) => state.color.color)
    const { userId } = useAppSelector((state) => state.login)

    useEffect(() => {
        // DBから全てのroutineを取得して、それをallRoutineに入れる
        const getAllRoutine = async () => {
            try {
                const res = await axios.get("/api/routine/get", {
                    params: {
                        userId: userId
                    }
                })
                setAllRoutine(res.data)
            } catch(e) {
                console.log("getAllRoutineでエラー", e)
            }
        }
        if (userId) getAllRoutine()
    }, [userId])

    // routineOpenをリロードしても、リストの数が矛盾しないようにする
    useEffect(() => {
        routine.map(() => {
            setRoutineOpen((prev) => [...prev, false])
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const createRoutine = async () => {
        // 今の日付のものを保存して、routineのstateをInitにしてページ移動
        try {
            await axios.post("/api/dailyJournal/saveTodayJournal", {
                userId: userId,
                targetDate: targetDate,
                getUpHour: getUpHour,
                getUpMin: getUpMin,
                goBedHour: goBedHour,
                goBedMin: goBedMin, 
                routine: routine,
                routineCheck: routineCheck,
                toDoTimeHour: toDoTimeHour,
                toDoTimeMin: toDoTimeMin,
                startToDoHour: startToDoHour,
                startToDoMin: startToDoMin,
                endToDoHour: endToDoHour,
                endToDoMin: endToDoMin,
                toDoTimeCheck: toDoTimeCheck,
                toDoList: toDoList,
                toDoListCheck: toDoListCheck,
                toDoListImportant: toDoListImportant,
                importList: importList,
                importListCheck: importListCheck,
                addList: addList,
                addListCheck: addListCheck,
                journal: journal,
                journalCount: journalCount,
                journalLastEditTime: journalLastEditTime,
                moneyInvestment: moneyInvestment,
                moneyWaste: moneyWaste,
                moneyConsumption: moneyConsumption,
                moneyUseSum: moneyUseSum,
                isWritten: !checkJournalWritten(dailyJournal)
            })
            dispatch(setRoutineInit())
            window.scrollTo(0, 0)
            navigate("/createRoutine")
        } catch(e) {
            console.log("createRoutineでエラー", e)
        }
    }

    const interpretText = (text: string) => {
        if (!text) return ""
        // 全角英数を半角に
        const halfText = text.replace(/[Ａ-Ｚａ-ｚ０-９]/g, (s) => {
            return String.fromCharCode(s.charCodeAt(0) - 0xFEE0)
        })
        const katakanaText = wanakana.toKatakana(halfText, { passRomaji: true })
        return katakanaText.toUpperCase()
    }

    const changeInputText = (text: string) => {
        setInputText(text)
        if (text == "") {
            setFilteredRoutine([])
            setFilterOpen(false)
            return
        }
        // filter処理をする
        const filteredList = allRoutine.filter((_routine) => {
            // すでにroutineにあるものは除外
            const isAlready = routine.some((item) => item.routineId == _routine.routineId)
            if (isAlready) {
                return false
            }
            const newRoutineName = interpretText(_routine.routineName)
            const newInputText = interpretText(text)
            return newRoutineName.includes(newInputText)
        })
        setFilteredRoutine(filteredList);
        setFilterOpen(true)
    }

    const selectRoutine = (routine: RoutineInitState) => {
        dispatch(addRoutine(routine))
        setInputText("")
        setFilterOpen(false)
        setRoutineOpen((prev) => [...prev, false])
    }

    const deleteOneRoutine = (routineId: string, i: number) => {
        // propsで渡す。それでroutine, routineCheckを消す。routineOpenも消す
        dispatch(deleteRoutine({ routineId, i }))
        setRoutineOpen((prev) => 
            prev.filter((isOpen, index) => {
                return i !== index
            })
        )
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
                <h2 className = "text-2xl text-gray-700">今日のルーティーン</h2>
            </div>

            {/* ここから下がルーティーンの管理 */}
            {open &&
                <div className = "mt-4">
                    <div className = "md:flex justify-center items-center gap-x-8">
                        <div className= "md:w-1/2">
                            <div className = "flex justify-center items-center gap-x-2">
                                <div className = "pt-1">
                                    <svg className = "size-7 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 6.878V6a2.25 2.25 0 0 1 2.25-2.25h7.5A2.25 2.25 0 0 1 18 6v.878m-12 0c.235-.083.487-.128.75-.128h10.5c.263 0 .515.045.75.128m-12 0A2.25 2.25 0 0 0 4.5 9v.878m13.5-3A2.25 2.25 0 0 1 19.5 9v.878m0 0a2.246 2.246 0 0 0-.75-.128H5.25c-.263 0-.515.045-.75.128m15 0A2.25 2.25 0 0 1 21 12v6a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 18v-6c0-.98.626-1.813 1.5-2.122" />
                                    </svg>
                                </div>
                                <p className = "text-lg">作成したルーティーンを使う</p>
                            </div>

                            <div className = "">
                                <div className = "mt-3 flex justify-center items-center gap-x-3">
                                    <div className = "w-9/12 relative">
                                        <input 
                                            className = {`border-2 ${selectedColor !== "pink" && "border-gray-400"} ${selectedColor == "pink" && "border-pink-300"} rounded-lg shadow-md w-full py-1 px-2 hover:border-blue-500 transition duration-100`}
                                            placeholder = "作ったルーティーン名を入力"
                                            value = {inputText}
                                            onChange = {(e) => changeInputText(e.target.value)}
                                        />
                                        {filterOpen && inputText.length > 0 && (
                                            <ul className = "absolute top-full left-0 min-w-full w-max max-w-xs sm:max-w-sm md:max-w-md mt-1 border-2 border-red-500 rounded-lg shadow-lg py-4 bg-white max-h-60 overflow-y-auto z-50">
                                                {filteredRoutine.length > 0 ? (
                                                    filteredRoutine.map((routine, i) => {
                                                        return (
                                                            <li 
                                                                key = {routine.routineId}
                                                                onClick = {() => selectRoutine(routine)}
                                                            >
                                                                <div className = {`${i !== filteredRoutine.length - 1 ? "border-b-2 pb-2 mb-2 border-dashed border-gray-600" : "pb-2"} px-6 mx-2 flex justify-start items-center hover:bg-gray-100 cursor-pointer hover:rounded-md hover:shadow-lg transition-all duration-200`}>
                                                                    <div className = "pr-2 border-r-2 border-gray-500 border-dashed flex-1 min-w-0">
                                                                        <p className = "truncate">{routine.routineName}</p>
                                                                    </div>
                                                                    <div className = "pl-2 whitespace-nowrap flex-shrink-0">
                                                                        <p>{routine.targetTimeHour} 時間 {routine.targetTimeMin} 分</p>
                                                                    </div>
                                                                </div>
                                                            </li>
                                                        )
                                                    })) : 
                                                    (
                                                        <div>
                                                            <p>候補が見つかりませんでした。</p>
                                                        </div>
                                                    )
                                                }
                                            </ul>
                                        )}
                                    </div>
                                    <div
                                        data-testid="clear-button"
                                        className = {`${selectedColor !== "pink" && "bg-gray-300 hover:bg-gray-400"} ${selectedColor == "pink" && "bg-pink-300 hover:bg-pink-400"} cursor-pointer rounded-full p-1 transition duration-200`}
                                        onClick = {() => {
                                            setInputText("")
                                            setFilterOpen(false)
                                        }}
                                    >
                                        <svg className = {`size-7 ${selectedColor == "pink" && "text-pink-600"}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div 
                            className = "md:w-5/12 md:mt-0  border-2 border-rose-400 rounded-2xl bg-rose-200 shadow-md mx-4 py-0.5 mt-5 flex justify-center items-center gap-x-2 hover:scale-105 hover:text-gray-600 hover:bg-rose-300 hover:border-rose-500 hover:cursor-pointer transition duration-200"
                            onClick = {() => createRoutine()}
                        >
                            <div>
                                <svg className = "size-6 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
                                </svg>
                            </div>
                            <p className = "text-lg">
                                新たにルーティーンを作成
                            </p>
                        </div>
                    </div>

                    {/* md以上版。これをマップで繰り返させる */}
                    <div className = "md:grid grid-cols-2 justify-center items-center gap-x-6 mt-6">
                        {routine.map((_routine, i) => {
                            return (
                                <div className = {`mt-4 border-2 ${selectedColor !== "pink" && "border-gray-300"} ${selectedColor == "pink" && "border-pink-300"} text-center rounded-2xl shadow-lg`} key = {_routine.routineId}>
                                    <div className = {`flex justify-between items-center ml-4 mr-6 mb-3 border-b-2 border-dashed ${selectedColor !== "pink" && "border-gray-300"} ${selectedColor == "pink" && "border-pink-300"}`}>
                                        <div className = "flex-1 min-w-0 text-left mr-2">
                                            <p className = "text-lg truncate">{_routine.routineName}</p>
                                        </div>
                                        <div 
                                            data-testid={`delete-button-${i}`}
                                            className = {` whitespace-nowrap flex-shrink-0 cursor-pointer ${selectedColor !== "pink" && "bg-gray-200 hover:bg-gray-300 hover:text-gray-700"} ${selectedColor == "pink" && "bg-pink-200 hover:bg-pink-300 hover:text-pink-700"} mr-4 mt-0.5 p-0.5 rounded-lg shadow-sm hover:scale-110 transition duration-200`}
                                            onClick = {() => deleteOneRoutine(_routine.routineId, i)}
                                        >
                                            <svg className = {`size-5 ${selectedColor == "pink" && "text-pink-600"}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                            </svg>
                                        </div>
                                        <div className = "pt-2 whitespace-nowrap flex-shrink-0">
                                            <input 
                                                type = "checkbox"
                                                checked={routineCheck[i]}
                                                className = "size-5 cursor-pointer"
                                                onChange = {() => dispatch(toggleRoutineCheck(i))}
                                            />
                                        </div>
                                    </div>

                                    {routineOpen[i] ? (
                                        <div>
                                            <div>
                                                <p className = {`text-2xl  ${selectedColor == "blue" && "text-sky-500"} ${selectedColor == "whiteBlack" && "text-gray-500"} ${selectedColor == "pink" && "text-pink-500"}`}>目標 : {_routine.targetTimeHour} 時間 {_routine.targetTimeMin} 分</p>
                                            </div>
                                            <div className = {`mb-4 mt-6 mx-4`}>
                                                {_routine.routine.map((item, index) => {
                                                    if (index != 0) {
                                                        return (
                                                        <div key = {index}>
                                                            <div className = "flex justify-center my-1">
                                                                <svg className = {`size-8 ${selectedColor == "blue" && "text-sky-500"} ${selectedColor == "whiteBlack" && "text-gray-500"} ${selectedColor == "pink" && "text-pink-500"}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 5.25 7.5 7.5 7.5-7.5m-15 6 7.5 7.5 7.5-7.5" />
                                                                </svg>
                                                            </div>

                                                            <div className = "flex justify-between items-center">
                                                                <p>{item}</p>
                                                                <p className = {`border-l-2 pl-2 border-dashed ${selectedColor == "blue" && "border-sky-400"} ${selectedColor == "whiteBlack" && "border-gray-400"} ${selectedColor == "pink" && "border-pink-400"} `}>所要時間 : {_routine.routineTime[index]}分</p>
                                                            </div>
                                                        </div>
                                                        )
                                                    } else {
                                                        return (
                                                            <div key = {index}>
                                                                <div className = "flex justify-between items-center">
                                                                    <p>{item}</p>
                                                                    <p className = {`border-l-2 pl-2 border-dashed ${selectedColor == "blue" && "border-sky-400"} ${selectedColor == "whiteBlack" && "border-gray-400"} ${selectedColor == "pink" && "border-pink-400"} `}>所要時間 : {_routine.routineTime[index]}分</p>
                                                                </div>
                                                            </div>
                                                        )
                                                    }
                                                })}
                                            </div>
                                            <div 
                                                className = {`mb-2 cursor-pointer inline-block p-1 rounded-full ${selectedColor !== "pink" && "bg-gray-200 hover:bg-gray-300"} ${selectedColor == "pink" && "bg-pink-200 hover:bg-pink-300"} transition duration-200`}
                                                onClick = {() => {
                                                    setRoutineOpen((prev) => 
                                                        prev.map((isOpen, index) => (index == i ? !isOpen : isOpen))
                                                    )
                                                }}
                                            >
                                                <svg className = {`size-8 rotate-180 ${selectedColor == "blue" && "text-green-500 hover:text-green-700"} ${selectedColor == "whiteBlack" && "text-gray-600 hover:text-gray-700"} ${selectedColor == "pink" && "text-pink-500 hover:text-pink-700"} transition duration-200`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                                                </svg>
                                            </div>
                                        </div>
                                    ) : (
                                        <div 
                                            className = {`inline-block cursor-pointer p-1 rounded-full ${selectedColor !== "pink" && "bg-gray-200 hover:bg-gray-300"} ${selectedColor == "pink" && "bg-pink-200 hover:bg-pink-300"} transition duration-200`}
                                            onClick = {() => {
                                                setRoutineOpen((prev) => 
                                                    prev.map((isOpen, index) => (index == i ? !isOpen : isOpen))
                                                )
                                            }}
                                        >
                                            <svg className = {`size-8 ${selectedColor == "blue" && "text-green-500 hover:text-green-700"} ${selectedColor == "whiteBlack" && "text-gray-600 hover:text-gray-700"} ${selectedColor == "pink" && "text-pink-500 hover:text-pink-700"} transition duration-200`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                                            </svg>
                                        </div>
                                    )}
                                    
                                </div>
                            )
                        })}
                    </div>
                    
                </div>
            }
        </div>
    )
}

export default DailyRoutine