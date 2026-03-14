import { useNavigate } from "react-router-dom"
import menuList from "../constant/menuList"
import { useAppDispatch, useAppSelector } from "../hooks/ReduxHooks"
import { setSelectedMenu, toggleIsClicked } from "../store/Menu"
import DisplayTheme from "./childComp/DisplayTheme"
import menuURL from "../constant/menuURL"
import axios from "axios"
import checkJournalWritten from "../func/checkJournalWritten"
import checkWeekJournalWritten from "../func/checkWeekJournalWritten"
import checkMonthYearJournalWritten from "../func/checkMonthYearJournalWritten"
import routineInitState, { type RoutineInitState } from "../constant/routineInitState"
import NGListInitState, { type NGListInitStateInterface } from "../constant/NGListInitState"

const SideHomeIcon = () => {

    const { selectedMenu } = useAppSelector((state) => state.Menu)
    const dispatch = useAppDispatch()
    const navigate = useNavigate()
    const selectedColor = useAppSelector((state) => state.color.color)
    const dailyJournal = useAppSelector((state) => state.dailyJournal)
    const weekJournal = useAppSelector((state) => state.weekJournal)
    const monthJournal = useAppSelector((state) => state.monthJournal)
    const yearJournal = useAppSelector((state) => state.yearJournal)
    const routine = useAppSelector((state) => state.routine)
    const list = useAppSelector((state) => state.NGList)

    const movePage = async (menu: string) => {
        // stateが初期値と違ったら、保存する処理を書きたい
        if (selectedMenu == "ジャーナルを作成") {
            if (!checkJournalWritten(dailyJournal)) {
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const { createdAt, updatedAt, userId, targetDate, ...dataToSend } = dailyJournal
                if (targetDate !== "") {
                    try {
                        await axios.post("/api/dailyJournal/saveTodayJournal", {
                            ...dataToSend,
                            isWritten: !checkJournalWritten(dailyJournal),
                            userId: userId,
                            targetDate: targetDate
                        })
                    } catch (e) {
                        console.log("daily journalがページ移動でちゃんと保存されなくてエラー", e)
                    }
                }
            }
            if (!checkWeekJournalWritten(weekJournal)) {
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const { createdAt, updatedAt, userId, startDate, endDate, ...dataToSend } = weekJournal
                if (startDate !== "" && endDate !== "") {
                    try {
                        await axios.post("/api/weekJournal/saveThisWeek", {
                            ...dataToSend,
                            isWritten: !checkWeekJournalWritten(weekJournal),
                            userId: userId,
                            startDate: startDate,
                            endDate: endDate
                        })
                    } catch (e) {
                        console.log("week journalがページ移動でちゃんと保存されなくてエラー", e)
                    }
                }
            }
            if (!checkMonthYearJournalWritten(monthJournal)) {
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const { createdAt, updatedAt, userId, targetDate, ...dataToSend } = monthJournal
                if (targetDate !== "") {
                    try {
                        await axios.post("/api/monthJournal/saveThisMonth", {
                            ...dataToSend,
                            isWritten: !checkMonthYearJournalWritten(monthJournal),
                            userId: userId,
                            targetDate: targetDate + "-01"
                        })
                    } catch (e) {
                        console.log("month journalがページ移動でちゃんと保存されなくてエラー", e)
                    }
                }
            }
            if (!checkMonthYearJournalWritten(yearJournal)) {
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const { createdAt, updatedAt, userId, targetDate, ...dataToSend } = yearJournal
                if (targetDate !== "") {
                    try {
                        await axios.post("/api/yearJournal/saveThisYear", {
                            ...dataToSend,
                            isWritten: !checkMonthYearJournalWritten(yearJournal),
                            userId: userId,
                            targetDate: targetDate + "-01-01"
                        })
                    } catch (e) {
                        console.log("year journalがページ移動でちゃんと保存されなくてエラー", e)
                    }
                }
            }
        }

        if (selectedMenu == "ルーティーンを作成") {
            // 初期stateを同じかどうかを判定。同じなら保存しない。
            const ignoreProperty = ["routineId", "createdAt", "updatedAt"]
            const isChanged = Object.keys(routineInitState)
                .filter((key) => !ignoreProperty.includes(key)) // 無視するキーを取り除く
                .every((key) => {
                    // TypeScriptの型エラーを防ぐための型アサーション
                    const k = key as keyof RoutineInitState
                    // 配列なども中身で比較できるように JSON.stringify を使う
                    return JSON.stringify(routineInitState[k]) === JSON.stringify(routine[k])
                })
            
            if (!isChanged) {
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const { createdAt, updatedAt, userId, ...dataToSend } = routine
                try {
                    await axios.post("/api/routine/save", {
                        ...dataToSend,
                        userId: userId
                    })
                } catch (e) {
                    console.log("routineがページ移動でちゃんと保存されなくてエラー", e)
                }
            }
        }

        if (selectedMenu == "禁止リストを作成") {
            // 初期stateを同じかどうかを判定。同じなら保存しない。
            const ignoreProperty = ["listId", "createdAt", "updatedAt"]
            const isChanged = Object.keys(NGListInitState)
                .filter((key) => !ignoreProperty.includes(key)) // 無視するキーを取り除く
                .every((key) => {
                    // TypeScriptの型エラーを防ぐための型アサーション
                    const k = key as keyof NGListInitStateInterface
                    // 配列なども中身で比較できるように JSON.stringify を使う
                    return JSON.stringify(NGListInitState[k]) === JSON.stringify(list[k])
                })
            
            if (!isChanged) {
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const { createdAt, updatedAt, userId, ...dataToSend } = list
                try {
                    await axios.post("/api/NGList/save", {
                        ...dataToSend,
                        userId: userId
                    })
                } catch (e) {
                    console.log("禁止リストのページ移動でちゃんと保存されなくてエラー", e)
                }
            }
        }

        localStorage.setItem("currentPage", menu)
        dispatch(setSelectedMenu(menu))
        dispatch(toggleIsClicked())
        const nextURL: string = menuURL.filter((_menu) => _menu.menu === menu)[0]?.url
        if (nextURL) {
            navigate(nextURL)
        } else {
            console.error("URL not found")
        }
    }

    return (
        <div className = {`${selectedColor == "blue" && "bg-themeDefault-300"} ${selectedColor == "whiteBlack" && "bg-themeWhiteBlack-300"} ${selectedColor == "pink" && "bg-themePink-300"} rounded-r-md shadow-md`}>
            <div className = "flex-grow overflow-y-auto mb-4">
                {menuList
                    .map((menu) => {
                        return (
                            <div 
                                data-testid = {`${menu}-button`}
                                key={menu} 
                                className = {`xl:text-2xl cursor-pointer py-1 px-2 text-lg my-4 ml-3 mr-2 rounded-2xl text-gray-600 hover:text-gray-700 ${selectedColor == "blue" && "hover:bg-white"} ${selectedColor == "whiteBlack" && "hover:bg-gray-600"} ${selectedColor == "pink" && "hover:bg-pink-600"} hover:scale-105 hover:shadow-md transition duration-300 ${selectedMenu == menu && selectedColor == "blue" && "bg-white scale-105 text-gray-700"} ${selectedMenu == menu && selectedColor == "whiteBlack" && "bg-gray-600 scale-105"} ${selectedMenu == menu && selectedColor == "pink" && "bg-pink-600 scale-105"}`}
                                onClick = {() => movePage(menu)}
                            >
                                <DisplayTheme menu = {menu}/>
                            </div>
                        )
                    })
                }
            </div>
        </div>
    )
}

export default SideHomeIcon