import { useAppDispatch, useAppSelector } from "../../hooks/ReduxHooks"
import { changeRoutine, changeRoutineTime, deleteRoutine } from "../../store/routine"

const RoutineList = ({ routineName, routineTime, i } : { routineName : string, routineTime: number, i : number }) => {

    const dispatch = useAppDispatch()
    const selectedColor = useAppSelector((state) => state.color.color)

    return (

        <div className = {`border-2 ${selectedColor == "blue" && "border-sky-400"} ${selectedColor == "whiteBlack" && "border-gray-500/90"} ${selectedColor == "pink" && "border-pink-400"} my-4 rounded-xl shadow-xl py-4 px-4 mx-2`}>
            <div className = {`md:hidden pb-4 border-b-2 mb-4 border-dashed ${selectedColor == "blue" && "border-sky-400"} ${selectedColor == "whiteBlack" && "border-gray-500/90"} ${selectedColor == "pink" && "border-pink-400"} px-2`}>
                <input 
                    data-testid = "input-name"
                    className = {`border-2 w-full px-2 py-0.5 ${selectedColor !== "pink" && "border-gray-400"} ${selectedColor == "pink" && "border-pink-300"} rounded-lg shadow-lg hover:border-sky-400 transition duration-200`}
                    placeholder= "やることを入力"
                    value = {routineName}
                    onChange = {(e) => dispatch(changeRoutine({ text: e.target.value, i: i }))}
                />
            </div>
            <div className = "md:hidden flex justify-center items-center gap-x-2">
                <div 
                    data-testid = "delete-button"
                    className = {`mr-2 cursor-pointer ${selectedColor !== "pink" && "bg-gray-200 hover:bg-gray-300 hover:text-gray-700"} ${selectedColor == "pink" && "bg-pink-200 text-pink-600 hover:bg-pink-300 hover:text-pink-700"} p-0.5 rounded-lg shadow-sm hover:scale-110 transition duration-200`}
                    onClick = {() => dispatch(deleteRoutine(i))}
                >
                    <svg className = "size-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                    </svg>
                </div>
                <p>目標完了時間 :</p>
                <div>
                    <input 
                        className = {`w-16 border-2 px-2 py-0.5 ${selectedColor !== "pink" && "border-gray-400"} ${selectedColor == "pink" && "border-pink-300"} rounded-lg shadow-lg`}
                        value = {routineTime}
                        onChange = {(e) => dispatch(changeRoutineTime({ value: e.target.value, i: i }))}
                    />
                </div>
                <p>分</p>
            </div>

            <div className = "hidden md:flex jusitfy-center items-center mx-6">
                <div className = {`pr-6 border-r-2 border-dashed ${selectedColor == "blue" && "border-sky-400"} ${selectedColor == "whiteBlack" && "border-gray-500/90"} ${selectedColor == "pink" && "border-pink-400"} w-1/2`}>
                    <input 
                        className = {`border-2 w-full px-2 py-0.5 ${selectedColor !== "pink" && "border-gray-400"} ${selectedColor == "pink" && "border-pink-300"} rounded-lg shadow-lg hover:border-sky-400 transition duration-200`}
                        placeholder= "やることを入力"
                        value = {routineName}
                        onChange = {(e) => dispatch(changeRoutine({ text: e.target.value, i: i }))}
                    />
                </div>

                <div className = "flex justify-center items-center gap-x-2 pl-6">
                    <div 
                        className = {`mr-2 cursor-pointer ${selectedColor !== "pink" && "bg-gray-200 hover:bg-gray-300 hover:text-gray-700"} ${selectedColor == "pink" && "bg-pink-200 text-pink-600 hover:bg-pink-300 hover:text-pink-700"} p-0.5 rounded-lg shadow-sm hover:scale-110 transition duration-200`}
                        onClick = {() => dispatch(deleteRoutine(i))}
                    >
                        <svg className = "size-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                        </svg>
                    </div>
                    <p>目標完了時間 :</p>
                    <div>
                        <input 
                            className = {`w-16 border-2 px-2 py-0.5 ${selectedColor !== "pink" && "border-gray-400"} ${selectedColor == "pink" && "border-pink-300"} rounded-lg shadow-lg`}
                            value = {routineTime}
                            onChange = {(e) => dispatch(changeRoutineTime({ value: e.target.value, i: i }))}
                        />
                    </div>
                    <p>分</p>
                </div>
            </div>
        </div>
    )
}

export default RoutineList