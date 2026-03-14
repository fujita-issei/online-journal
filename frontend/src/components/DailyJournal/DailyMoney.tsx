import { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../hooks/ReduxHooks'
import { calcSumMoney, changeConsumption, changeInvestment, changeWaste } from '../../store/dailyJournal'

const DailyMoney = () => {

    const [open, setOpen] = useState(true)
    const { moneyInvestment, moneyWaste, moneyConsumption, moneyUseSum } = useAppSelector((state) => state.dailyJournal)
    const dispatch = useAppDispatch()
    const selectedColor = useAppSelector((state) => state.color.color)

    // 合計金額を計算する
    useEffect(() => {
        dispatch(calcSumMoney())
    })

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
                <h2 className = "text-2xl text-gray-700">金銭管理</h2>
            </div>

            {/* ここから下がルーティーンの管理 */}
            {open &&
                <div className = "mt-4">
                    <div className = "md:hidden">
                        <div className = {`border-2 px-3 py-2 ${selectedColor !== "pink" && "border-gray-300"} ${selectedColor == "pink" && "border-pink-300"} rounded-xl shadow-lg mx-2`}>
                            <div className = {`flex justify-center items-center border-b-2 py-3 ${selectedColor !== "pink" && "border-gray-400"} ${selectedColor == "pink" && "border-pink-400"} border-dashed gap-x-3`}>
                                <p className = "text-lg">投資 :</p>
                                <div>
                                    <input 
                                        data-testid = "input-investment"
                                        className = {`border-2 w-40 px-2 ${selectedColor !== "pink" && "border-gray-400/90"} ${selectedColor == "pink" && "border-pink-300"} rounded-lg shadow-lg hover:border-sky-500 transition duration-200`}
                                        value = {moneyInvestment}
                                        onChange = {(e) => dispatch(changeInvestment(e.target.value))}
                                    />
                                </div>
                                <p className = "text-lg">円</p>
                            </div>

                            <div className = {`flex justify-center items-center border-b-2 py-3 ${selectedColor !== "pink" && "border-gray-400"} ${selectedColor == "pink" && "border-pink-400"} border-dashed gap-x-3`}>
                                <p className = "text-lg">浪費 :</p>
                                <div>
                                    <input 
                                        data-testid = "input-waste"
                                        className = {`border-2 w-40 px-2 ${selectedColor !== "pink" && "border-gray-400/90"} ${selectedColor == "pink" && "border-pink-300"} rounded-lg shadow-lg hover:border-sky-500 transition duration-200`}
                                        value = {moneyWaste}
                                        onChange = {(e) => dispatch(changeWaste(e.target.value))}
                                    />
                                </div>
                                <p className = "text-lg">円</p>
                            </div>

                            <div className = "flex justify-center items-center py-3 gap-x-3">
                                <p className = "text-lg">消費 :</p>
                                <div>
                                    <input 
                                        data-testid = "input-consumption"
                                        className = {`border-2 w-40 px-2 ${selectedColor !== "pink" && "border-gray-400/90"} ${selectedColor == "pink" && "border-pink-300"} rounded-lg shadow-lg hover:border-sky-500 transition duration-200`}
                                        value = {moneyConsumption}
                                        onChange = {(e) => dispatch(changeConsumption(e.target.value))}
                                    />
                                </div>
                                <p className = "text-lg">円</p>
                            </div>
                        </div>

                        <div className = "flex justify-center mt-5">
                            <p className = "px-8 py-2 bg-red-500 text-white rounded-xl shadow-lg text-xl">合計金額 : {moneyUseSum}円</p>
                        </div>
                    </div>

                    <div className = "hidden md:block">
                        <div className = {`border-2 ${selectedColor !== "pink" && "border-gray-300"} ${selectedColor == "pink" && "border-pink-300"} rounded-xl shadow-lg mx-2 py-6 px-4`}>
                            <div className = {`flex justify-center items-center divide-x-2 ${selectedColor !== "pink" && "divide-gray-300"} ${selectedColor == "pink" && "divide-pink-400"} divide-dashed border-b-2 pb-4 ${selectedColor == "whiteBlack" && "border-gray-400"} ${selectedColor !== "whiteBlack" && "border-rose-400"} border-dashed`}>
                                <div className = "py-3 gap-x-3 pr-3">
                                    <p className = "text-lg ml-3 mb-2">投資 :</p>
                                    <div className = "flex justify-center items-center gap-x-2">
                                        <input 
                                            className = {`border-2 w-40 px-2 ${selectedColor !== "pink" && "border-gray-400/90"} ${selectedColor == "pink" && "border-pink-300"} rounded-lg shadow-lg hover:border-sky-500 transition duration-200`}
                                            value = {moneyInvestment}
                                            onChange = {(e) => dispatch(changeInvestment(e.target.value))}
                                        />
                                        <p className = "text-lg">円</p>
                                    </div>
                                </div>

                                <div className = "py-3 gap-x-3 px-3">
                                    <p className = "text-lg ml-3 mb-2">浪費 :</p>
                                    <div className = "flex justify-center items-center gap-x-2 ">
                                        <input 
                                            className = {`border-2 w-40 px-2 ${selectedColor !== "pink" && "border-gray-400/90"} ${selectedColor == "pink" && "border-pink-300"} rounded-lg shadow-lg hover:border-sky-500 transition duration-200`}
                                            value = {moneyWaste}
                                            onChange = {(e) => dispatch(changeWaste(e.target.value))}
                                        />
                                        <p className = "text-lg">円</p>
                                    </div>
                                </div>

                                <div className = "py-3 gap-x-3 pl-3">
                                    <p className = "text-lg ml-3 mb-2">消費 :</p>
                                    <div className = "flex justify-center items-center gap-x-2 ">
                                        <input 
                                            className = {`border-2 w-40 px-2 ${selectedColor !== "pink" && "border-gray-400/90"} ${selectedColor == "pink" && "border-pink-300"} rounded-lg shadow-lg hover:border-sky-500 transition duration-200`}
                                            value = {moneyConsumption}
                                            onChange = {(e) => dispatch(changeConsumption(e.target.value))}
                                        />
                                        <p className = "text-lg">円</p>
                                    </div>
                                </div>
                            </div>

                            <div className = "flex justify-center mt-5">
                                <p className = "px-8 py-2 bg-red-500 text-white rounded-xl shadow-lg text-xl">合計金額 : {moneyUseSum}円</p>
                            </div>
                        </div>
                    </div>
                    
                </div>
            }
        </div>
    )
}

export default DailyMoney