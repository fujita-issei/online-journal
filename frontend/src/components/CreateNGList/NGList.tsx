import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAppDispatch, useAppSelector } from "../../hooks/ReduxHooks"
import axios from "axios"
import { setList, setNGInit } from "../../store/NGList"
import type { NGListInitStateInterface } from "../../constant/NGListInitState"
import formatDate from "../../func/formatDate"

type Props = {
    _list: NGListInitStateInterface;
    getNGList: () => void;
}

const NGList = ({_list, getNGList}: Props) => {

    const navigate = useNavigate()
    const [btn, setBtn] = useState(false)
    const dispatch = useAppDispatch()
    const selectedColor = useAppSelector((state) => state.color.color)

    const deleteNGList = async () => {
        try {
            await axios.delete("/api/NGList/delete", {
                params: {
                    listId: _list.listId
                }
            })
            getNGList()
            dispatch(setNGInit())
            setBtn(false)
            window.scrollTo(0, 0)
        } catch (e) {
            console.error("deleteNGListでエラー", e)
        }
    }
    const editNGList = async () => {
        dispatch(setList({
            listId: _list.listId,
            listName: _list.listName,
            list: _list.list,
            createdAt: _list.createdAt,
            updatedAt: _list.updatedAt
        }))
        navigate("/createNGList/edit")
    }

    return (
        <div>
            <div className = {`mt-6 border-2 ${selectedColor == "blue" && "border-sky-500"} ${selectedColor == "whiteBlack" && "border-gray-500"} ${selectedColor == "pink" && "border-pink-500"} shadow-xl rounded-2xl shadow-lx`}>
                <p className = {`py-2 px-2 truncate text-lg text-center ${selectedColor == "blue" && "bg-sky-500"} ${selectedColor == "whiteBlack" && "bg-gray-500"} ${selectedColor == "pink" && "bg-pink-500"} text-white rounded-t-xl rounded-b-md shadow-lg`}>
                    {_list.listName !== "" ? _list.listName : "タイトル無し"}
                </p>
                <div className = {`my-4 border-b-2 pb-4 mx-4 border-dashed ${selectedColor == "blue" && "border-sky-400"} ${selectedColor == "whiteBlack" && "border-gray-400"} ${selectedColor == "pink" && "border-pink-400"}`}>
                    <div className = {`border-2 py-3 rounded-xl shadow-lg ${selectedColor == "blue" && "border-sky-300 bg-sky-50"} ${selectedColor == "whiteBlack" && "border-gray-400 bg-gray-50"} ${selectedColor == "pink" && "border-pink-300 bg-pink-50 text-pink-600"} px-2`}>
                        {_list.list.map((item, i) => {
                            return (
                                <p className = "pb-1 truncate" key = {i}>・{item}</p>
                            )
                        })}
                    </div>
                    
                </div>

                <div className = "my-4 flex justify-center items-center gap-x-10">
                    <button
                        data-testid = "edit-button"
                        className = {`border-2 text-white rounded-xl shadow-lg px-4 py-2 ${selectedColor == "blue" && "border-sky-500 bg-sky-500 hover:border-sky-600 hover:bg-sky-600"} ${selectedColor == "whiteBlack" && "border-gray-500 bg-gray-500 hover:border-gray-600 hover:bg-gray-600"} ${selectedColor == "pink" && "border-pink-500 bg-pink-500 hover:border-pink-600 hover:bg-pink-600"} hover:scale-110 transition duration-300`}
                        onClick = {() => editNGList()}
                    >
                        編集
                    </button>
                    <button
                        data-testid = "reset1"
                        className = {`border-2 rounded-xl shadow-lg px-4 py-2 ${selectedColor == "blue" && "border-sky-500 text-sky-500 hover:border-sky-600"} ${selectedColor == "whiteBlack" && "border-gray-500 text-gray-500 hover:border-gray-600"} ${selectedColor == "pink" && "border-pink-500 text-pink-500 hover:border-pink-600"} hover:scale-110 transition duration-300`}
                        onClick = {() => setBtn(true)}
                    >
                        削除
                    </button>
                </div>

                <p className = "text-center mb-4 text-gray-400">
                    最終更新日 : {formatDate(_list.updatedAt)}
                </p>
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
                    <p className = "mb-1 w-60 md:w-80 truncate">{_list.listName}</p>
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

export default NGList