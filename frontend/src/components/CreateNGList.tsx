import { useCallback, useEffect, useState } from "react"
import { setSelectedMenu } from "../store/Menu"
import { useAppDispatch, useAppSelector } from "../hooks/ReduxHooks"
import { useNavigate } from "react-router-dom"
import NGList from "./CreateNGList/NGList"
import { setNGInit } from "../store/NGList"
import axios from "axios"
import type { NGListInitStateInterface } from "../constant/NGListInitState"

const CreateNGList = () => {

    const dispatch = useAppDispatch()
    const navigate = useNavigate()
    const selectedColor = useAppSelector((state) => state.color.color)
    const { userId } = useAppSelector((state) => state.login)
    const [list, setList] = useState<NGListInitStateInterface[]>([])

    const getNGList = useCallback(async() => {
        try {
            const res = await axios.get("/api/NGList/get", {
                params: {
                    userId: userId
                }
            })
            setList(res.data)
        } catch (e) {
            console.log("getNGListでエラー", e)
        }
    }, [userId])

    useEffect(() => {
        localStorage.setItem("currentPage", "禁止リストを作成")
        dispatch(setSelectedMenu("禁止リストを作成"))
        getNGList()
    }, [dispatch, getNGList])

    const createNewNGList = () => {
        dispatch(setNGInit())
        navigate("/createNGList/edit")
    }


    return (
        <div className = {`mt-4 border-2 mx-3 py-6 px-3 rounded-2xl shadow-lg bg-white border-dashed ${selectedColor !== "pink" && "border-gray-500"} ${selectedColor == "pink" && "border-pink-500"}`}>

            {/* 新しく作成ボタン */}
            <div 
                data-testid = "create-button"
                className = {`md:mx-32 cursor-pointer flex justify-center items-center border-2 gap-x-2 px-2 py-9 rounded-2xl shadow-xl ${selectedColor == "blue" && "border-sky-400 bg-sky-100 hover:border-sky-500 hover:bg-sky-200"} ${selectedColor == "whiteBlack" && "border-gray-400 bg-gray-100 hover:border-gray-500 hover:bg-gray-200"} ${selectedColor == "pink" && "border-pink-400 bg-pink-100 hover:border-pink-500 hover:bg-pink-200"} hover:scale-105 transition duration-300`}
                onClick = {() => createNewNGList()}
            >
                <div className = {`text-gray-700 rounded-full ${selectedColor == "blue" && "bg-sky-200"} ${selectedColor == "whiteBlack" && "bg-gray-200"} ${selectedColor == "pink" && "bg-pink-200 text-pink-600"} p-1`}>
                <svg className = "size-7" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                </svg>
                </div>
                <p className = {`text-xl ${selectedColor !== "pink" && "text-gray-700"} ${selectedColor == "pink" && "text-pink-700"}`}>新しい禁止リストを作成</p>
            </div>

            <div className = {`flex justify-center items-center gap-x-2 mt-6 border-b-2 pb-2 border-dashed ${selectedColor !== "pink" && "border-gray-400"} ${selectedColor == "pink" && "border-pink-400"} mx-1 text-gray-600`}>
                <div>
                <svg className = "size-7" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 0 1 4.5 9.75h15A2.25 2.25 0 0 1 21.75 12v.75m-8.69-6.44-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44Z" />
                </svg>
                </div>
                <h2 className = "text-xl">過去に作成した禁止リスト</h2>
            </div>

            {/* mapメソッドで過去に作成したジャーナルを繰り返す */}
            <div className = "block md:grid grid-cols-2 justify-center items-center gap-x-8 gap-y-6">
                {list.map((_list) => {
                        return (
                            <div key = {_list.listId}>
                                <NGList _list = {_list} getNGList = {getNGList} />
                            </div>
                        )
                    }
                )}
            </div>

        </div>
    )
}

export default CreateNGList