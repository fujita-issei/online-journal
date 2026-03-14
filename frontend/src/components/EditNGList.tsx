import { useNavigate } from "react-router-dom"
import { useAppDispatch, useAppSelector } from "../hooks/ReduxHooks"
import { useEffect, useState } from "react"
import { setSelectedMenu } from "../store/Menu"
import { changeList, changeListName, deleteList, plusList, setNGInit } from "../store/NGList"
import axios from "axios"

const EditNGList = () => {

    const dispatch = useAppDispatch()
    const navigate = useNavigate()
    const [btn, setBtn] = useState(false)
    const { listId, listName, list } = useAppSelector((state) => state.NGList)
    const selectedColor = useAppSelector((state) => state.color.color)
    const { userId } = useAppSelector((state) => state.login)

    useEffect(() => {
        localStorage.setItem("currentPage", "禁止リストを作成")
        dispatch(setSelectedMenu("禁止リストを作成"))
    }, [dispatch])

    const deleteNGList = async () => {
        try {
            await axios.delete("/api/NGList/delete", {
                params: {
                    listId: listId
                }
            })
            setBtn(false)
            dispatch(setNGInit())
            navigate("/createNGList")
            window.scrollTo(0, 0)
        } catch (e) {
            console.error("deleteListでエラー", e)
        }
    }

    const saveNGList = async () => {
        try {
            await axios.post("/api/NGList/save", {
                listId: listId,
                userId: userId,
                listName: listName,
                list: list
            })
            dispatch(setNGInit())
            navigate("/createNGList")
        } catch (e) {
            console.log("saveNGListでエラー", e)
        }
    }


    return (
        <div className = {`mt-4 border-2 mx-3 py-6 px-3 rounded-2xl shadow-lg bg-white border-dashed ${selectedColor !== "pink" && "border-gray-500"} ${selectedColor == "pink" && "border-pink-500"}`}>

            <div className = {`pl-2 flex justify-start items-center gap-x-2 mb-6 text-lg border-b-2 pb-6 ${selectedColor == "blue" && "border-sky-400"} ${selectedColor == "whiteBlack" && "border-gray-400"} ${selectedColor == "pink" && "border-pink-400"} border-dashed`}>
                <p>名前 :</p>
                <div>
                    <input 
                        className = {`border-2 px-2 py-0.5 w-60 ${selectedColor !== "pink" && "border-gray-400/90"} ${selectedColor == "pink" && "border-pink-300"} rounded-lg shadow-lg hover:border-sky-400 transition duration-200`}
                        placeholder = "禁止リスト名を入力"
                        value = {listName}
                        onChange = {(e) => dispatch(changeListName(e.target.value))}
                    />
                </div>
            </div>

            <div className = "block md:grid grid-cols-2 justify-center items-center gap-x-3">
                {/* NGリストを追加 */}
                {list.map((ng, i) => {
                    return (
                        <div key = {i} className = "my-4 px-1 flex justify-between items-center gap-x-4">
                            <input 
                                className = {`border-2 w-full px-2 py-0.5 ${selectedColor !== "pink" && "border-gray-400"} ${selectedColor == "pink" && "border-pink-300"} rounded-xl shadow-lg hover:border-sky-400 transition duration-200`}
                                value = {ng}
                                onChange = {(e) => dispatch(changeList({ text: e.target.value, i: i }))}
                            />
                            <div 
                                className = {`${selectedColor !== "pink" && "bg-gray-200 hover:bg-gray-300 hover:text-gray-700"} ${selectedColor == "pink" && "bg-pink-200 text-pink-600 hover:bg-pink-300 hover:text-pink-700"} cursor-pointer p-0.5 rounded-lg shadow-sm hover:scale-110 transition duration-200`}
                                onClick = {() => dispatch(deleteList(i))}
                            >
                                <svg className = "size-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                </svg>
                            </div>
                        </div>
                    )
                })}
            </div>
            

            <div className = {`flex justify-center border-b-2 pb-6 border-dashed ${selectedColor == "blue" && "border-sky-400"} ${selectedColor == "whiteBlack" && "border-gray-400"} ${selectedColor == "pink" && "border-pink-400"} mx-2 mb-6`}>
                <svg data-testid = "plus-button" onClick = {() => dispatch(plusList())} className = {`size-10 cursor-pointer text-rose-500 ${selectedColor !== "pink" && "bg-gray-100 hover:bg-gray-200"} ${selectedColor == "pink" && "bg-pink-100 hover:bg-pink-200"} rounded-md shadow-lg hover:text-rose-600 hover:scale-110 transition duration-200`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
            </div>

            {/* ボタン */}
            <div className = "mb-4 flex justify-center items-center gap-x-10">
                <button
                    data-testid = "save-button"
                    className = {`border-2 cursor-pointer text-white rounded-xl shadow-lg px-4 py-2 ${selectedColor == "blue" && "border-sky-500 bg-sky-500 hover:border-sky-600 hover:bg-sky-600"} ${selectedColor == "whiteBlack" && "border-gray-500 bg-gray-500 hover:border-gray-600 hover:bg-gray-600"} ${selectedColor == "pink" && "border-pink-500 bg-pink-500 hover:border-pink-600 hover:bg-pink-600"} hover:scale-110 transition duration-300`}
                    onClick = {() => saveNGList()}
                >
                    保存
                </button>
                <button
                    data-testid = "reset1"
                    className = {`border-2 cursor-pointer rounded-xl shadow-lg px-4 py-2 ${selectedColor == "blue" && "border-sky-500 text-sky-500 hover:border-sky-600"} ${selectedColor == "whiteBlack" && "border-gray-500 text-gray-500 hover:border-gray-600"} ${selectedColor == "pink" && "border-pink-500 text-pink-500 hover:border-pink-600"} hover:scale-110 transition duration-300`}
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
                    <p className = "mb-1 w-60 md:w-80 truncate">{listName}</p>
                    <p className = "mb-3">という禁止リストを削除します</p>
                    <p className = "text-xl">本当によろしいですか？</p>
                    <div className = "flex justify-center items-center mt-8 gap-x-8">
                        <button
                            data-testid = "reset2"
                            className = "bg-red-500 cursor-pointer px-4 py-2 rounded-xl shadow-lg text-white border-2 border-red-500 hover:border-red-600 hover:bg-red-600 hover:scale-110 transition duration-200"
                            onClick = {() => deleteNGList()}
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

export default EditNGList