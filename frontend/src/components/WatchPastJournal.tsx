import { useEffect, useState } from "react"
import { useAppDispatch, useAppSelector } from "../hooks/ReduxHooks"
import { setSelectedMenu } from "../store/Menu"
import DispDaily from "./WatchPastJournal/DispDaily"
import axios from "axios"
import { setDateInput, setJournal, setMonthInput, setPage, setSelected, setUpOrDown, setYearInput } from "../store/watchPastJournal"
import type { DailyJournalInitState } from "../constant/dailyJournalInitState"
import { format } from "date-fns"
import type { WeekJournalInitState } from "../constant/weekJournalInitState"
import type { MonthJournalInitState } from "../constant/monthJournalInitState"
import type { YearJournalInitState } from "../constant/yearJournalInitState"
import DispWeek from "./WatchPastJournal/DispWeek"
import DispMonth from "./WatchPastJournal/DispMonth"
import DispYear from "./WatchPastJournal/DispYear"

const WatchPastJournal = () => {

    const dispatch = useAppDispatch()
    const radioBtn = ["日別", "週別", "月別", "年別"]
    const updown = ["降順", "昇順"]
    const selectedColor = useAppSelector((state) => state.color.color)
    const { selected, upOrDown, dateInput, monthInput, yearInput, page, journal } = useAppSelector((state) => state.watchPastJournal)
    const { userId } = useAppSelector((state) => state.login) 
    const [maxPage, setMaxPage] = useState(0)

    useEffect(() => {
        localStorage.setItem("currentPage", "過去のジャーナルを見る")
        dispatch(setSelectedMenu("過去のジャーナルを見る"))
        dispatch(setPage(0))
    }, [dispatch])

    // 入力情報とpageを頼りに、DBからジャーナルを取得
    const getPastData = async () => {
            try {
                switch (selected) {
                    case "日別": {
                        const res = await axios.get("/api/watchPastJournal/getDailyJournal", {
                            params: {
                                userId: userId,
                                upOrDown: upOrDown,
                                date: dateInput,
                                month: monthInput,
                                year: yearInput,
                            }
                        })
                        const tidiedUpData = res.data
                            .filter((_data: DailyJournalInitState, index: number) => {
                                return page * 20 <= index && index < (page + 1) * 20
                            })
                            .map((_data: DailyJournalInitState) => {
                                return {
                                    ..._data,
                                    targetDate: format(_data.targetDate, "yyyy-MM-dd")
                                }
                            })
                        // 最大のページ数を計算
                        setMaxPage(Math.ceil(res.data.length / 20) - 1)
                        dispatch(setJournal(tidiedUpData))
                        break
                    }
                    case "週別": {
                        const res = await axios.get("/api/watchPastJournal/getWeekJournal", {
                            params: {
                                userId: userId,
                                upOrDown: upOrDown,
                                date: dateInput,
                                month: monthInput,
                                year: yearInput,
                            }
                        })
                        const tidiedUpData = res.data
                            .filter((_data: WeekJournalInitState, index: number) => {
                                return page * 20 <= index && index < (page + 1) * 20
                            })
                            .map((_data: WeekJournalInitState) => {
                                return {
                                    ..._data,
                                    startDate: format(_data.startDate, "yyyy-MM-dd"),
                                    endDate: format(_data.endDate, "yyyy-MM-dd")
                                }
                            })
                        // 最大のページ数を計算
                        setMaxPage(Math.ceil(res.data.length / 20) - 1)
                        dispatch(setJournal(tidiedUpData))
                        break
                    }
                    case "月別": {
                        const res = await axios.get("/api/watchPastJournal/getMonthJournal", {
                            params: {
                                userId: userId,
                                upOrDown: upOrDown,
                                month: monthInput,
                                year: yearInput,
                            }
                        })
                        const tidiedUpData = res.data
                            .filter((_data: MonthJournalInitState, index: number) => {
                                return page * 20 <= index && index < (page + 1) * 20
                            })
                            .map((_data: MonthJournalInitState) => {
                                return {
                                    ..._data,
                                    targetDate: format(_data.targetDate, "yyyy-MM")
                                }
                        })
                        // 最大のページ数を計算
                        setMaxPage(Math.ceil(res.data.length / 20) - 1)
                        dispatch(setJournal(tidiedUpData))
                        break 
                    }
                    case "年別": {
                        const res = await axios.get("/api/watchPastJournal/getYearJournal", {
                            params: {
                                userId: userId,
                                upOrDown: upOrDown,
                                year: yearInput,
                            }
                        })
                        const tidiedUpData = res.data
                            .filter((_data: YearJournalInitState, index: number) => {
                                return page * 20 <= index && index < (page + 1) * 20
                            })
                            .map((_data: YearJournalInitState) => {
                                return {
                                    ..._data,
                                    targetDate: format(_data.targetDate, "yyyy")
                                }
                        })
                        // 最大のページ数を計算
                        setMaxPage(Math.ceil(res.data.length / 20) - 1)
                        dispatch(setJournal(tidiedUpData))
                        break
                    }
                    default:
                }
                window.scrollTo(0, 0)
            } catch (e) {
                console.log("過去のジャーナル情報取得においてでエラー", e)
            }
    }

    // 削除するを押した後、pageを0にしてデータを取得するための関数
    const handleDeleteSuccess = () => {
        if (page == 0) {
            getPastData()
        } else {
            dispatch(setJournal([]))
            dispatch(setPage(0))
        }
    }

    useEffect(() => {
        getPastData()
    }, [userId, upOrDown, dateInput, monthInput, yearInput, selected, page, dispatch])

    const changeSelected = (value: string) => {
        dispatch(setPage(0))
        dispatch(setSelected(value))
        dispatch(setJournal([]))
    }

    const changeUpOrDown = (value: string) => {
        dispatch(setPage(0))
        dispatch(setUpOrDown(value))
        dispatch(setJournal([]))
    }

    const changeYearInput = (value: string) => {
        if (value.length !== 0) {
            const intValue: number = parseInt(value)
            if (intValue< 9999) {
                dispatch(setPage(0))
                dispatch(setYearInput(value))
                dispatch(setJournal([]))
            } 
        } else {
            dispatch(setPage(0))
            dispatch(setYearInput(""))
            dispatch(setJournal([]))
        }
    }

    const changeMonthInput = (value: string) => {
        if (value.length !== 0) {
            const intValue: number = parseInt(value)
            if (intValue< 13) {
                dispatch(setPage(0))
                dispatch(setMonthInput(value))
                dispatch(setJournal([]))
            } 
        } else {
            dispatch(setPage(0))
            dispatch(setMonthInput(""))
            dispatch(setJournal([]))
        }
    }

    const changeDateInput = (value: string) => {
        if (value.length !== 0) {
            const intValue: number = parseInt(value)
            if (intValue< 32) {
                dispatch(setPage(0))
                dispatch(setDateInput(value))
                dispatch(setJournal([]))
            } 
        } else {
            dispatch(setPage(0))
            dispatch(setDateInput(""))
            dispatch(setJournal([]))
        }
    }

    const changePage = (type: string) => {
        if (type == "+") {
            dispatch(setPage(page + 1))
        } else if (type == "-") {
            dispatch(setPage(page - 1))
        }
        dispatch(setJournal([]))
    }


    return (
        <div>
            {/* ラジオボタン */}
            <div className = {`text-lg flex justify-cetner border-2 mt-4 mx-6 px-4 py-2 bg-white border-dashed ${selectedColor !== "pink" && "border-gray-400"} ${selectedColor == "pink" && "border-pink-400"} shadow-lg rounded-xl`}>
                {radioBtn.map((value) => {
                    return (
                            <label key = {value} className = "mx-2">
                                <input 
                                    type = "radio"
                                    data-testid = {`radio-${value}`}
                                    value = {value}
                                    className = "size-4 pr-1"
                                    checked = {selected === value}
                                    onChange = {(e) => changeSelected(e.target.value)}
                                />
                                {value}
                            </label>
                    )
                })}
            </div>

            {/* 検索窓 */}
            {/* 日別、週別とかで処理を分ける。 */}
            <div className = {`md:flex md:pl-12 md:pr-36 justify-between items-center gap-x-10 mt-6 bg-white mx-2 py-2 border-2 rounded-xl border-dashed ${selectedColor == "blue" && "border-sky-400/90"} ${selectedColor == "whiteBlack" && "border-gray-400/90"} ${selectedColor == "pink" && "border-pink-400/90"} shadow-lg`}>
                <div className = "mt-2 flex justify-center items-center gap-x-2">
                    <p>日付入力 : </p>
                    <div>
                        <input 
                            data-testid = "input-year"
                            className = {`border-2 w-14 rounded-lg shadow-lg text-center ${selectedColor == "blue" && "border-sky-400/90 hover:border-sky-600"} ${selectedColor == "whiteBlack" && "border-gray-400/90 hover:border-gray-600"} ${selectedColor == "pink" && "border-pink-400/90 hover:border-pink-600"} transition duration-200`}
                            placeholder = "年"
                            value = {yearInput}
                            onChange = {(e) => changeYearInput(e.target.value)}
                        />
                    </div>
                    <p>年</p>
                    <div>
                        <input 
                            data-testid = "input-month"
                            className = {`border-2 w-14 rounded-lg shadow-lg text-center ${selectedColor == "blue" && "border-sky-400/90 hover:border-sky-600"} ${selectedColor == "whiteBlack" && "border-gray-400/90 hover:border-gray-600"} ${selectedColor == "pink" && "border-pink-400/90 hover:border-pink-600"} transition duration-200`}
                            placeholder = "月"
                            value = {monthInput}
                            onChange = {(e) => changeMonthInput(e.target.value)}
                        />
                    </div>
                    <p>月</p>
                    <div>
                        <input 
                            data-testid = "input-date"
                            className = {`border-2 w-14 rounded-lg shadow-lg text-center ${selectedColor == "blue" && "border-sky-400/90 hover:border-sky-600"} ${selectedColor == "whiteBlack" && "border-gray-400/90 hover:border-gray-600"} ${selectedColor == "pink" && "border-pink-400/90 hover:border-pink-600"} transition duration-200`}
                            placeholder = "日"
                            value = {dateInput}
                            onChange = {(e) => changeDateInput(e.target.value)}
                        />
                    </div>
                    <p>日</p>
                </div>

                <div className = "mt-4 mb-2 flex justify-center items-end gap-x-4 text-lg">
                    {updown.map((value) => {
                    return (
                        <label key = {value} className = "mx-2">
                            <input 
                                type = "radio"
                                data-testid = {`radio-${value}`}
                                value = {value}
                                className = "size-4 pr-1"
                                checked = {upOrDown === value}
                                onChange = {(e) => changeUpOrDown(e.target.value)}
                            />
                            {value}
                        </label>
                    )
                })}
                </div>
            </div>

            {/* 一覧を表示 */}
            <div className = {`mt-6 border-2 mx-3 py-6 px-3 rounded-2xl shadow-lg bg-white border-dashed ${selectedColor !== "pink" && "border-gray-500"} ${selectedColor == "pink" && "border-pink-500"}`}>
                {/* mapでループさせる */}
                {/* 最大20個までループさせる */}
                <div className = "block md:grid grid-cols-2 justify-center items-center gap-x-8 gap-y-6">
                    {selected == "日別" && (journal as DailyJournalInitState[]).map((dailyJournal) => {
                        if (!dailyJournal.targetDate) return null
                        return (
                            <DispDaily 
                                journal = {dailyJournal} 
                                handleDeleteSuccess = {handleDeleteSuccess}
                                key = {dailyJournal.targetDate}
                            />
                        )
                    })}
                    {selected == "週別" && (journal as WeekJournalInitState[]).map((weekJournal) => {
                        if (!weekJournal.startDate || !weekJournal.endDate) return null
                        return (
                            <DispWeek 
                                journal = {weekJournal} 
                                handleDeleteSuccess = {handleDeleteSuccess}
                                key = {weekJournal.startDate + weekJournal.endDate}
                            />
                        )
                    })}
                    {selected == "月別" && (journal as MonthJournalInitState[]).map((monthJournal) => {
                        if (!monthJournal.targetDate) return null
                        return (
                            <DispMonth
                                journal = {monthJournal} 
                                handleDeleteSuccess = {handleDeleteSuccess}
                                key = {monthJournal.targetDate}
                            />
                        )
                    })}
                    {selected == "年別" && (journal as YearJournalInitState[]).map((yearJournal) => {
                        if (!yearJournal.targetDate) return null
                        return (
                            <DispYear
                                journal = {yearJournal} 
                                handleDeleteSuccess = {handleDeleteSuccess}
                                key = {yearJournal.targetDate}
                            />
                        )
                    })}
                </div>

                {/* ページ遷移ボタンの作成 */}
                {/* stateを新たに作って、mapで数字のところを多く表示させる */}
                    {page == 0 && maxPage > 0 && 
                        <div className = "mt-6 flex justify-center items-center gap-x-3">
                            <p className = "text-lg hover:scale-110 hover:border-b-2 border-gray-500 hover:cursor-pointer transition duration-200">{page + 1}</p>
                            <div
                                className = {`p-1 ${selectedColor !== "pink" && "bg-gray-100 hover:bg-gray-200"} ${selectedColor == "pink" && "bg-pink-100 hover:bg-pink-200"} rounded-xl hover:scale-110 transition duration-200`}
                                onClick = {() => changePage("+")}
                            >
                                <svg className = {`size-6 ${selectedColor == "blue" && "text-sky-500 hover:text-sky-600"} ${selectedColor == "whiteBlack" && "text-gray-500 hover:text-gray-600"} ${selectedColor == "pink" && "text-pink-500 hover:text-pink-600"}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m5.25 4.5 7.5 7.5-7.5 7.5m6-15 7.5 7.5-7.5 7.5" />
                                </svg>
                            </div>
                        </div>
                    }

                    {page == 0 && maxPage == 0 && 
                        <div className = "mt-6 flex justify-center items-center gap-x-3">
                            <p className = "text-lg hover:scale-110 hover:border-b-2 border-gray-500 hover:cursor-pointer transition duration-200">{page + 1}</p>
                        </div>
                    }

                    {0 < page && page == maxPage && 
                        <div className = "mt-6 flex justify-center items-center gap-x-3">
                            <div 
                                className = {`p-1 ${selectedColor !== "pink" && "bg-gray-100 hover:bg-gray-200"} ${selectedColor == "pink" && "bg-pink-100 hover:bg-pink-200"} rounded-xl hover:scale-110 transition duration-200`}
                                onClick = {() => changePage("-")}
                            >
                                <svg className = {`size-6 ${selectedColor == "blue" && "text-sky-500 hover:text-sky-600"} ${selectedColor == "whiteBlack" && "text-gray-500 hover:text-gray-600"} ${selectedColor == "pink" && "text-pink-500 hover:text-pink-600"}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m18.75 4.5-7.5 7.5 7.5 7.5m-6-15L5.25 12l7.5 7.5" />
                                </svg>
                            </div>
                            <p className = "text-lg hover:scale-110 hover:border-b-2 border-gray-500 hover:cursor-pointer transition duration-200">{page + 1}</p>
                        </div>
                    }

                    {0 < page && page < maxPage && 
                        <div className = "mt-6 flex justify-center items-center gap-x-3">
                            <div 
                                data-testid = "page-before"
                                className = {`p-1 ${selectedColor !== "pink" && "bg-gray-100 hover:bg-gray-200"} ${selectedColor == "pink" && "bg-pink-100 hover:bg-pink-200"} rounded-xl hover:scale-110 transition duration-200`}
                                onClick = {() => changePage("-")}
                            >
                                <svg className = {`size-6 ${selectedColor == "blue" && "text-sky-500 hover:text-sky-600"} ${selectedColor == "whiteBlack" && "text-gray-500 hover:text-gray-600"} ${selectedColor == "pink" && "text-pink-500 hover:text-pink-600"}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m18.75 4.5-7.5 7.5 7.5 7.5m-6-15L5.25 12l7.5 7.5" />
                                </svg>
                            </div>
                            <p className = "text-lg hover:scale-110 hover:border-b-2 border-gray-500 hover:cursor-pointer transition duration-200">{page + 1}</p>
                            <div 
                                data-testid = "page-next"
                                className = {`p-1 ${selectedColor !== "pink" && "bg-gray-100 hover:bg-gray-200"} ${selectedColor == "pink" && "bg-pink-100 hover:bg-pink-200"} rounded-xl hover:scale-110 transition duration-200`}
                                onClick = {() => changePage("+")}
                            >
                                <svg className = {`size-6 ${selectedColor == "blue" && "text-sky-500 hover:text-sky-600"} ${selectedColor == "whiteBlack" && "text-gray-500 hover:text-gray-600"} ${selectedColor == "pink" && "text-pink-500 hover:text-pink-600"}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m5.25 4.5 7.5 7.5-7.5 7.5m6-15 7.5 7.5-7.5 7.5" />
                                </svg>
                            </div>
                        </div>
                    }
            </div>
        </div>
    )
}

export default WatchPastJournal