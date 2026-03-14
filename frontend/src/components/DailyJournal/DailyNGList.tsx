import React, { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../hooks/ReduxHooks'
import { addImportNG, changeNGList, deleteImportNG, deleteNGList, plusNGList, toggleImportNG, toggleNGList } from '../../store/dailyJournal'
import axios from "axios"
import * as wanakana from "wanakana"
import type { NGListInitStateInterface } from '../../constant/NGListInitState'

const DailyNGList = () => {

    const [open, setOpen] = useState(true)
    const [inputText, setInputText] = useState("")
    const [allNG, setAllNG] = useState<NGListInitStateInterface[]>([])
    const [filteredNG, setFilteredNG] = useState<NGListInitStateInterface[]>([])
    const [filterOpen, setFilterOpen] = useState(false)
    const { importList, importListCheck, addList, addListCheck } = useAppSelector((state) => state.dailyJournal)
    const dispatch = useAppDispatch()
    const selectedColor = useAppSelector((state) => state.color.color)
    const { userId } = useAppSelector((state) => state.login)

    useEffect(() => { 
        // DBから全てのNGを取得して、それをallNGに入れる。
        const getAllNG = async () => {
            try {
                const res = await axios.get("/api/NGList/get", {
                    params: {
                        userId: userId
                    }
                })
                setAllNG(res.data)
            } catch (e) {
                console.log("getAllNGでエラー", e)
            }
        }
        if (userId) getAllNG()
    }, [userId])

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
            setFilteredNG([])
            setFilterOpen(false)
            return
        }
        // filter処理をする
        const filteredList = allNG.filter((_NG) => {
            // すでにimportNGListにあるものは除外
            const isAlreadyImported = importList.some((importedNG) => importedNG.listId == _NG.listId)
            if (isAlreadyImported) {
                return false
            }
            const newNGName = interpretText(_NG.listName)
            const newInputText = interpretText(text)
            return newNGName.includes(newInputText)
        })
        setFilteredNG(filteredList);
        setFilterOpen(true)
    }

    const selectNG = (NG: NGListInitStateInterface) => {
        dispatch(addImportNG(NG))
        setInputText("")
        setFilterOpen(false)
    }

    const deleteOneNG = (listId: string, i: number) => {
        dispatch(deleteImportNG({ listId, i }))
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
                <h2 className = "text-2xl text-gray-700">禁止事項リスト</h2>
            </div>

            {/* ここから下がルーティーンの管理 */}
            {open &&
                <div className = "mt-4">
                    <div className = "md:flex justify-center items-end gap-x-8">
                        <div className = "md:w-5/12  flex justify-center items-center gap-x-2">
                            <div className = "pt-1">
                                <svg className = "size-7 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 6.878V6a2.25 2.25 0 0 1 2.25-2.25h7.5A2.25 2.25 0 0 1 18 6v.878m-12 0c.235-.083.487-.128.75-.128h10.5c.263 0 .515.045.75.128m-12 0A2.25 2.25 0 0 0 4.5 9v.878m13.5-3A2.25 2.25 0 0 1 19.5 9v.878m0 0a2.246 2.246 0 0 0-.75-.128H5.25c-.263 0-.515.045-.75.128m15 0A2.25 2.25 0 0 1 21 12v6a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 18v-6c0-.98.626-1.813 1.5-2.122" />
                                </svg>
                            </div>
                            <p className = "text-lg">作成した禁止事項リストを使う</p>
                        </div>

                        <div className = "md:w-1/2  mt-3 flex justify-center items-center gap-x-3">
                            <div className = "w-9/12 relative">
                                <input 
                                    className = {`border-2 ${selectedColor !== "pink" && "border-gray-400"} ${selectedColor == "pink" && "border-pink-300"} rounded-lg shadow-md w-full py-1 px-2 hover:border-blue-500 transition duration-100`}
                                    placeholder = "作った禁止リストを入力"
                                    value = {inputText}
                                    onChange = {(e) => changeInputText(e.target.value)}
                                />
                                {filterOpen && inputText.length > 0 && (
                                    <ul className = "absolute top-full left-0 min-w-full w-max max-w-xs sm:max-w-sm md:max-w-md mt-1 border-2 border-red-500 rounded-lg shadow-lg py-4 bg-white max-h-60 overflow-y-auto z-50">
                                        {filteredNG.length > 0 ? (
                                            filteredNG.map((_NG, i) => {
                                                return (
                                                    <li 
                                                        key = {_NG.listId}
                                                        onClick = {() => selectNG(_NG)}
                                                    >
                                                        <div className = {`${i !== filteredNG.length - 1 ? "border-b-2 pb-2 mb-2 border-dashed border-gray-600" : "pb-2"} cursor-pointer px-6 mx-2 flex justify-start items-center hover:bg-gray-100 hover:rounded-md hover:shadow-lg transition-all duration-200`}>
                                                            <div className = "pr-2 border-dashed flex-1 min-w-0">
                                                                <p className = "truncate">{_NG.listName}</p>
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
                                data-testid = "clear-button"
                                className = {`${selectedColor !== "pink" && "bg-gray-300 hover:bg-gray-400"} ${selectedColor == "pink" && "bg-pink-300 hover:bg-pink-400"} cursor-pointer rounded-full p-1 transition duration-200`}
                                onClick = {() => {
                                    setInputText("")
                                    setFilterOpen(false)
                                }}
                            >
                                <svg className = {`size-7 ${selectedColor == "pink" && "text-pink-700"}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    {/* 事前に作ったNGを表示 */}
                    {importList.length > 0 ? (
                        <div className = {`border-2 mt-6 px-2 py-5 rounded-lg shadow-lg ${selectedColor !== "pink" && "border-gray-300"} ${selectedColor == "pink" && "border-pink-300"}`}>
                            {importList.map((NG, i) => {
                            return (
                                <div key = {NG.listId}>
                                    <div className = {`${i == 0 ? "" : "mt-6"}`}>
                                        {/* NGのタイトル、ゴミ箱、チェックリスト */}
                                        <div className = {`flex justify-center items-center border-b-2 pb-2 border-dashed ${selectedColor !== "pink" && "border-gray-400"} ${selectedColor == "pink" && "border-pink-400"}`}>
                                            <div className= "w-8/12 md:w-6/12">
                                                <p className = {`truncate text-xl text-center ${selectedColor !== "pink" && "text-gray-600"} ${selectedColor == "pink" && "text-pink-600"}`}>{NG.listName}</p>
                                            </div>
                                            <div 
                                                data-testid = {`clear-importNG-${i}`}
                                                className = {`md:mx-6 cursor-pointer whitespace-nowrap flex-shrink-0 mx-3 ${selectedColor !== "pink" && "bg-gray-200 hover:bg-gray-300 hover:text-gray-700"} ${selectedColor == "pink" && "bg-pink-200 hover:bg-pink-300 hover:text-pink-700"} p-0.5 rounded-lg shadow-sm hover:scale-110 transition duration-200`}
                                                onClick = {() => deleteOneNG(NG.listId, i)}
                                            >
                                                <svg className = {`size-5 ${selectedColor == "pink" && "text-pink-600"}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                                </svg>
                                            </div>
                                            <div className = "pt-2 whitespace-nowrap flex-shrink-0">
                                                <input 
                                                    type = "checkbox"
                                                    checked={importListCheck[i]}
                                                    className = "size-5 cursor-pointer"
                                                    onChange = {() => dispatch(toggleImportNG(i))}
                                            />
                                            </div>
                                        </div>
                                        {/* NGの名前を箇条書き */}
                                        <div className = {`mt-2 ${selectedColor !== "pink" && "text-gray-500"} ${selectedColor == "pink" && "text-pink-500"}`}>
                                            <ul className = {`md:grid grid-cols-2 rounded-xl shadow-md px-4 py-2 ${selectedColor == "blue" && "bg-sky-100"} ${selectedColor == "pink" && "bg-pink-100"} ${selectedColor == "whiteBlack" && "bg-gray-100"}`}>
                                                {NG.list.map((item, i) => {
                                                    return (
                                                        <li className = "md:mx-2 md:w-5/12 my-1" key = {i}>
                                                            <p className = "text-lg truncate">・ {item}</p>
                                                        </li>
                                                    )
                                                })}
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            )})}
                        </div>
                    ) : (
                        <div>
                            
                        </div>
                    )}

                    {/* 新たに追加するNGを表示 */}
                    <div className = {`mt-6 border-2 pb-3 ${selectedColor !== "pink" && "border-gray-300"} ${selectedColor == "pink" && "border-pink-300"} rounded-2xl shadow-lg px-1`}>
                        <div className = {`mt-3 pb-2 mx-3 border-b-2 border-dashed mb-3 ${selectedColor !== "pink" && "border-gray-400"} ${selectedColor == "pink" && "border-pink-400"}`}>
                            <p className = {`text-center text-xl ${selectedColor !== "pink" && "text-gray-600"} ${selectedColor == "pink" && "text-pink-600"}`}>追加の禁止事項リスト</p>
                        </div>
                        <div className= "md:grid grid-cols-2 mt-6">
                            {addList.map((list, i) => {
                                return (
                                    <div className = "flex justify-center items-center gap-x-2 mt-3" key = {i}>
                                        <div 
                                            className = {`${selectedColor !== "pink" && "bg-gray-200 hover:bg-gray-300 hover:text-gray-700"} ${selectedColor == "pink" && "bg-pink-200 hover:bg-pink-300 hover:text-pink-700"} p-0.5 rounded-lg shadow-sm cursor-pointer hover:scale-110 transition duration-200`}
                                            onClick = {() => dispatch(deleteNGList(i))}
                                        >
                                            <svg className = {`size-5 ${selectedColor == "pink" && "text-pink-600"}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                            </svg>
                                        </div>

                                        <div className = "ml-1">
                                            <input 
                                                className = {`md:w-52 border-2 w-44 ${selectedColor !== "pink" && "border-gray-400/90"} ${selectedColor == "pink" && "border-pink-300/90"} rounded-lg px-1 shadow-md`}
                                                value = {list}
                                                onChange = {(e) => dispatch(changeNGList({ text: e.target.value, i: i }))}
                                            />
                                        </div>
                                        <div 
                                            className = {`text-2xl cursor-pointer border-r-2 pr-2 ${selectedColor !== "pink" && "border-gray-400"} ${selectedColor == "pink" && "border-pink-400"} border-dashed hover:text-rose-600 transition duration-200 ${addListCheck[i] ? "text-rose-800" : "text-rose-200"}`}
                                            onClick = {() => dispatch(toggleNGList({ value: true, i: i }))}
                                        >
                                            ⚪︎
                                        </div>
                                        <div 
                                            className = {`text-2xl cursor-pointer hover:text-sky-600 transition duration-200 ${addListCheck[i] ? " text-sky-200" : "text-sky-800"}`}
                                            onClick = {() => dispatch(toggleNGList({ value: false, i: i }))}
                                        >
                                            ×
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                        
                        {/* NGListを追加するボタン */}
                        <div className = "mt-5 flex flex-col items-center justify-center">
                            <svg onClick = {() => dispatch(plusNGList())} className = "size-10 cursor-pointer text-white p-1 rounded-xl shadow-lg bg-red-400 hover:bg-red-500 hover:scale-110 transition duration-200" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                            </svg>
                        </div>
                    </div>

                    
                </div>
            }
        </div>
    )
}

export default DailyNGList