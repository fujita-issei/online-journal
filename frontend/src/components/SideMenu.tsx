import menuList from "../constant/menuList"
import { useAppDispatch, useAppSelector } from "../hooks/ReduxHooks"
import { setSelectedMenu, toggleIsClicked } from "../store/Menu"
import DisplayTheme from "./childComp/DisplayTheme"
import menuURL from "../constant/menuURL"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import checkJournalWritten from "../func/checkJournalWritten"
import checkWeekJournalWritten from "../func/checkWeekJournalWritten"
import checkMonthYearJournalWritten from "../func/checkMonthYearJournalWritten"
import routineInitState, { type RoutineInitState } from "../constant/routineInitState"
import NGListInitState, { type NGListInitStateInterface } from "../constant/NGListInitState"


const SideMenu = () => {

    const { selectedMenu, isClickedMenu } = useAppSelector((state) => state.Menu)
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
                const { createdAt, updatedAt, userId, targetDate, isWritten, ...dataToSend } = dailyJournal
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
                const { createdAt, updatedAt, userId, startDate, endDate, isWritten, ...dataToSend } = weekJournal
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
                const { createdAt, updatedAt, userId, targetDate, isWritten, ...dataToSend } = monthJournal
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
                const { createdAt, updatedAt, userId, targetDate, isWritten, ...dataToSend } = yearJournal
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
        <div
            className = "fixed inset-x-0 top-11 z-50" aria-modal="true"
        >
            {/* 背景に置く薄暗いフィルター */}
            <div
                className = "fixed cursor-pointer top-11 right-0 bottom-0 left-0 bg-black/50 transition-opacity duration-300"
                onClick = {() => dispatch(toggleIsClicked())}
            >
            </div>

            {/* メニューオプション一覧本体 */}
            <div
                // ここでのクリックが背景に伝わらないようにする。
                onClick = {(e) => e.stopPropagation()}
                className = {`
                    fixed top-11 left-0 w-11/12 bottom-0 ${selectedColor == "blue" && "bg-themeDefault-200"} ${selectedColor == "whiteBlack" && "bg-themeWhiteBlack-300"} ${selectedColor == "pink" && "bg-themePink-200"} shadow-xl transition-transform duration-400 ease-in-out flex flex-col
                    ${isClickedMenu ? "translate-x-0" : "-translate-x-full"}
                `}
            >
                {/* アイコンとテキストを、ループして全て表示させる。 */}
                <div className = "flex-grow overflow-y-auto mb-4">
                    {menuList
                        .filter((menu) => menu !== selectedMenu)
                        .map((menu) => {
                            return (
                                <div 
                                    data-testid = {`${menu}-button`}
                                    key={menu} 
                                    className = {`py-1 cursor-pointer px-2 text-2xl mt-4 ml-3 mr-5 rounded-2xl ${selectedColor == "blue" && "text-gray-600 hover:text-gray-700 hover:bg-white"} ${selectedColor == "whiteBlack" && "text-white hover:bg-gray-600"} ${selectedColor == "pink" && "text-white hover:bg-pink-500"} hover:scale-105 hover:shadow-md transition duration-300`}
                                    onClick = {() => movePage(menu)}
                                >
                                    <DisplayTheme menu = {menu}/>
                                </div>
                            )
                        })
                    }
                </div>
            </div>
            

        </div>
    )
}

export default SideMenu