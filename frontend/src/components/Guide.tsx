import { useAppDispatch, useAppSelector } from "../hooks/ReduxHooks"
import createJournalSmartPhone from "../assets/createJournalSmartPhone.png"
import createJournalPC from "../assets/createJournalPC.png"
import createRoutineSmartPhone from "../assets/createRoutineSmartPhone.png"
import createRoutinePC from "../assets/createRoutinePC.png"
import nglistCreate from "../assets/nglistCreate.png"
import watchPastJournal from "../assets/watchPastJournal.png"
import watchSummary from "../assets/watchSummary.png"
import settingColor from "../assets/settingColor.png"
import { useEffect } from "react"
import { setSelectedMenu } from "../store/Menu"

const Guide = () => {

    const dispatch = useAppDispatch()
    const selectedColor = useAppSelector((state) => state.color.color)

    useEffect(() => {
        localStorage.setItem("currentPage", "使い方ガイド")
        dispatch(setSelectedMenu("使い方ガイド"))
    }, [dispatch])

    return (
        <div className = {`lg:my-4 my-6 mx-4 p-2 rounded-xl shadow-lg border-2 bg-white ${selectedColor !== "pink" && "border-gray-500"} ${selectedColor == "pink" && "border-pink-500"} border-dashed`}>

            <div className = "my-4 px-2 py-3 border-2 border-gray-500 bg-gray-50 rounded-2xl shadow-lg">
                <p className = "text-center text-2xl text-red-500">重要</p>
                <p className = "text-center text-lg mt-3">このサイトに書いたジャーナルを含む全てがサーバーに送信されます</p>
                <p className = "text-center text-lg mt-1 text-red-500">なので、クレジットカードの番号やパスワードなどの重要な情報は絶対に記入しないでください</p>
                <p className = "text-center text-lg mt-1">もし、このサイトを利用して何か損害を被ったとしても、製作者は責任を負いません</p>
            </div>

            <div className = "mb-3 mt-6 mx-0">
                <div className = "md:flex justify-center items-center">
                    <p className = "py-1 text-center">ジャーナルを作成というところを押すと、</p>
                    <p className = "py-1 text-center">その日のジャーナルを書くことができます。</p>
                </div>
                <p className = "py-1 text-center">また、週ごと、月ごと、年ごとの目標を書くこともできます</p>
            </div>

            <div className = "md:flex justify-center items-start gap-x-6">
                <div className = {`mt-4 py-2 px-1 ${selectedColor == "blue" && "bg-sky-50"} ${selectedColor == "whiteBlack" && "bg-gray-100"} ${selectedColor == "pink" && "bg-pink-100"} rounded-xl shadow-md`}>
                    <p className = "text-center text-xl mb-2">スマホ版</p>
                    <div className = "rounded-xl shadow-md">
                        <img 
                            src = {createJournalSmartPhone}
                            alt= "スマホ版ジャーナル作成UI説明"
                            className = "w-full md:h-72 rounded-xl"
                        />
                    </div>
                </div>
                
                <div className = {`mt-4 py-2 px-1 ${selectedColor == "blue" && "bg-sky-50"} ${selectedColor == "whiteBlack" && "bg-gray-100"} ${selectedColor == "pink" && "bg-pink-100"} rounded-xl shadow-md`}>
                    <p className = "text-center text-xl mb-2">PC版</p>
                    <div className = "rounded-xl shadow-md">
                        <img 
                            src = {createJournalPC}
                            alt= "PC版ジャーナル作成UI説明"
                            className = "w-full md:h-72 rounded-xl"
                        />
                    </div>
                </div>
            </div>

            <div className = "mt-6">
                <div className = "md:flex justify-center items-center">
                    <p className = "py-1 text-center">ルーティーンを作成を押すと、</p>
                    <p className = "py-1 text-center">オリジナルのルーティーンを作れます</p>
                </div>
                <p className = "py-1 text-center">それを、ジャーナルに使うことができます</p>
            </div>

            <div className = "md:flex justify-center items-start gap-x-6">
                <div className = {`mt-4 py-2 px-1 ${selectedColor == "blue" && "bg-sky-50"} ${selectedColor == "whiteBlack" && "bg-gray-100"} ${selectedColor == "pink" && "bg-pink-100"} rounded-xl shadow-md`}>
                    <p className = "text-center text-xl mb-2">スマホ版</p>
                    <div className = "rounded-xl shadow-md">
                        <img 
                            src = {createRoutineSmartPhone}
                            alt= "スマホ版ルーティーン作成UI説明"
                            className = "w-full md:h-72 rounded-xl"
                        />
                    </div>
                </div>
                
                <div className = {`mt-4 py-2 px-1 ${selectedColor == "blue" && "bg-sky-50"} ${selectedColor == "whiteBlack" && "bg-gray-100"} ${selectedColor == "pink" && "bg-pink-100"} rounded-xl shadow-md`}>
                    <p className = "text-center text-xl mb-2">PC版</p>
                    <div className = "rounded-xl shadow-md">
                        <img 
                            src = {createRoutinePC}
                            alt= "PC版ルーティーン作成UI説明"
                            className = "w-full md:h-72 rounded-xl"
                        />
                    </div>
                </div>
            </div>

            <div className = "md:grid grid-cols-2 gap-x-6 gap-y-8 md:mt-8">
                <div className = {`mt-6 md:py-4 md:px-2 ${selectedColor == "blue" && "md:bg-sky-50"} ${selectedColor == "whiteBlack" && "md:bg-gray-100"} ${selectedColor == "pink" && "md:bg-pink-100"}`}>
                    <div className = "">
                        <p className = "py-1 text-center">メニューの禁止リストを作成を押すと、</p>
                        <p className = "py-1 text-center">オリジナルの今日禁止することリストを作れます</p>
                        <p className = "py-1 text-center">それを、ジャーナルに使うことができます</p>
                    </div>

                    <div className = {`mt-4 py-2 px-1 ${selectedColor == "blue" && "bg-sky-50"} ${selectedColor == "whiteBlack" && "bg-gray-100"} ${selectedColor == "pink" && "bg-pink-100"} rounded-xl shadow-md`}>
                        <img 
                            src = {nglistCreate}
                            alt= "禁止リスト作成UI説明"
                            className = "w-full rounded-xl"
                        />
                    </div>
                </div>
            
                <div className = {`mt-6 md:py-4 md:px-2 ${selectedColor == "blue" && "md:bg-sky-50"} ${selectedColor == "whiteBlack" && "md:bg-gray-100"} ${selectedColor == "pink" && "md:bg-pink-100"}`}>
                    <div className = "">
                        <p className = "py-1 text-center">過去に書いたジャーナルを見ることができます</p>
                        <p className = "py-1 text-center">日付を指定して検索かけることもできます</p>
                    </div>

                    <div className = {`mt-4 py-2 px-1 ${selectedColor == "blue" && "bg-sky-50"} ${selectedColor == "whiteBlack" && "bg-gray-100"} ${selectedColor == "pink" && "bg-pink-100"} rounded-xl shadow-md`}>
                        <img 
                            src = {watchPastJournal}
                            alt= "過去のジャーナル見るUI"
                            className = "w-full rounded-xl"
                        />
                    </div>
                </div>

                <div className = {`mt-6 md:py-4 md:px-2 ${selectedColor == "blue" && "md:bg-sky-50"} ${selectedColor == "whiteBlack" && "md:bg-gray-100"} ${selectedColor == "pink" && "md:bg-pink-100"}`}>
                    <div className = "">
                        <p className = "py-1 text-center">過去に書いたジャーナルの情報から</p>
                        <p className = "py-1 text-center">今までの統計データを見ることができます</p>
                        <p className = "py-1 text-center">これがオンライン上でジャーナルをする</p>
                        <p className = "py-1 text-center">一番のメリットです</p>
                    </div>

                    <div className = {`mt-4 py-2 px-1 ${selectedColor == "blue" && "bg-sky-50"} ${selectedColor == "whiteBlack" && "bg-gray-100"} ${selectedColor == "pink" && "bg-pink-100"} rounded-xl shadow-md`}>
                        <img 
                            src = {watchSummary}
                            alt= "サマリーを見るUI"
                            className = "w-full rounded-xl"
                        />
                    </div>
                </div>

                <div className = {`mt-6 md:py-4 md:px-2 ${selectedColor == "blue" && "md:bg-sky-50"} ${selectedColor == "whiteBlack" && "md:bg-gray-100"} ${selectedColor == "pink" && "md:bg-pink-100"}`}>
                    <div className = "">
                        <p className = "py-1 text-center">設定からテーマカラーを自由にセットできます</p>
                        <p className = "py-1 text-center">サイト全体の雰囲気が変わります</p>
                    </div>

                    <div className = {`mt-4 py-2 px-1 ${selectedColor == "blue" && "bg-sky-50"} ${selectedColor == "whiteBlack" && "bg-gray-100"} ${selectedColor == "pink" && "bg-pink-100"} rounded-xl shadow-md`}>
                        <img 
                            src = {settingColor}
                            alt= "色を変えるUI"
                            className = "w-full rounded-xl"
                        />
                    </div>
                </div>
            </div>

        </div>
    )
}

export default Guide