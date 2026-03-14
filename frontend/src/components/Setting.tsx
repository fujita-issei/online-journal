import { useEffect } from "react"
import { useAppDispatch, useAppSelector } from "../hooks/ReduxHooks"
import { setSelectedMenu } from "../store/Menu"
import { changeColor } from "../store/color"
import { googleLogout } from "@react-oauth/google"
import { setUserId } from "../store/login"
import { useNavigate } from "react-router-dom"

const Setting = () => {

    const dispatch = useAppDispatch()
    const colors = ["blue", "whiteBlack", "pink"]
    const selectedColor = useAppSelector((state) => state.color.color)
    const navigate = useNavigate()

    useEffect(() => {
        localStorage.setItem("currentPage", "設定")
        dispatch(setSelectedMenu("設定"))
    }, [dispatch])

    const logout = () => {
        googleLogout()
        dispatch(setUserId(""))
        localStorage.clear()
        navigate("/")
    }

    return (
        <div className = {`lg:my-4 my-6 mx-4 py-4 px-2 rounded-xl shadow-lg border-2 bg-white ${selectedColor !== "pink" && "border-gray-500"} ${selectedColor == "pink" && "border-pink-500"} border-dashed`}>
            <div>
                <p className = "text-xl text-center mb-4">テーマカラー</p>
                <div className = "text-lg flex justify-center items-center gap-x-8">
                    {colors.map((color) => {
                        return (
                            <div key={color} className = "">
                                <input
                                    id = {`color-${color}`}
                                    data-testid = {`input-${color}`}
                                    type = "radio"
                                    value = {color}
                                    className = "mr-2 size-4 cursor-pointer"
                                    checked = {selectedColor == color}
                                    onChange = {(e) => dispatch(changeColor(e.target.value))}
                                />
                                {color == "blue" && <label htmlFor = {`color-${color}`} className = "text-sky-700 cursor-pointer text-xl">青</label>}
                                {color == "whiteBlack" && <label htmlFor = {`color-${color}`} className = "text-xl cursor-pointer">白黒</label>}
                                {color == "pink" && <label htmlFor = {`color-${color}`} className = "text-pink-700 cursor-pointer text-xl">ピンク</label>}
                            </div>
                        )
                    })}
                </div>
            </div>

            <div className = "mt-8">
                <p className = "text-lg text-center">ログアウトするにはこのボタンを押してください</p>
                <div className = "my-4 flex justify-center">
                    <button
                        className = {`border-2 px-5 py-3 rounded-xl shadow-md ${selectedColor == "blue" && "border-sky-500 bg-sky-500 hover:bg-sky-600 hover:border-sky-600"} ${selectedColor == "whiteBlack" && "border-gray-500 bg-gray-500 hover:bg-gray-600 hover:border-gray-600"} ${selectedColor == "pink" && "border-pink-500 bg-pink-500 hover:bg-pink-600 hover:border-pink-600"} hover:scale-110 transition duration-300 text-white text-xl`}
                        onClick = {() => logout()}
                    >
                        ログアウト
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Setting