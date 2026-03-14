import { useEffect, useState } from "react"
import { useAppDispatch, useAppSelector } from "../hooks/ReduxHooks"
import { setSelectedMenu } from "../store/Menu"
import axios from "axios"
import { useNavigate } from "react-router-dom"

const Form = () => {

    const dispatch = useAppDispatch()
    const navigate = useNavigate()
    const selectedColor = useAppSelector((state) => state.color.color)
    const { userId } = useAppSelector((state) => state.login)
    const [textInput, setTextInput] = useState("")
    const [emailInput, setEmailInput] = useState("")
    
    useEffect(() => {
        localStorage.setItem("currentPage", "お問い合わせフォーム")
        dispatch(setSelectedMenu("お問い合わせフォーム"))
    }, [dispatch])

    const postForm = async () => {
        try {
            await axios.post("/api/form/save", {
                userId: userId,
                content: textInput,
                email: emailInput
            })
            setTextInput("")
            setEmailInput("")
            navigate("/")
        } catch (e) {
            console.log("postFormでエラー", e)
        }
    }

    return (
        <div className = {`lg:my-4 my-6 mx-4 p-2 rounded-xl shadow-lg border-2 bg-white ${selectedColor !== "pink" && "border-gray-500"} ${selectedColor == "pink" && "border-pink-500"} border-dashed`}>
            <div className = "mt-6 mx-1">
                <p className = "text-center mt-1">ご要望やバグ報告があったらこのフォームに記入してください</p>
                <p className = "text-center mt-1">特にバグ報告は助かるのでお願いします</p>
            </div>

            <div className = {`md:px-4 mt-6 mx-1 border-2 ${selectedColor == "blue" && "border-sky-300 bg-sky-100"} ${selectedColor == "whiteBlack" && "border-gray-300 bg-gray-100"} ${selectedColor == "pink" && "border-pink-300 bg-pink-100"} py-3 px-2 rounded-xl shadow-md`}>
                <p className = {`mb-2 ml-4 text-lg ${selectedColor == "whiteBlack" && "text-gray-700"}`}>記入欄</p>
                <textarea 
                    data-testid = "text-input"
                    value = {textInput}
                    rows = {8}
                    className = "border-2 w-full border-gray-300 py-1 px-2 rounded-xl shadow-md hover:border-sky-400"
                    onChange = {(e) => setTextInput(e.target.value)}
                />
            </div>

            <div className = {`md:px-4 mt-6 mx-1 border-2 ${selectedColor == "blue" && "border-sky-300 bg-sky-100"} ${selectedColor == "whiteBlack" && "border-gray-300 bg-gray-100"} ${selectedColor == "pink" && "border-pink-300 bg-pink-100"} py-3 px-2 rounded-xl shadow-md`}>
                <p className = {`mb-3 text-center mt-1 ${selectedColor == "whiteBlack" && "text-gray-700"}`}>返信を希望の方はこちらに、ご自身のメールアドレスを書いてください</p>
                <textarea 
                    data-testid = "email-input"
                    value = {emailInput}
                    rows = {2}
                    placeholder = "〇〇@email.com"
                    className = "border-2 w-full border-gray-300 py-1 px-2 rounded-xl shadow-md hover:border-sky-400"
                    onChange = {(e) => setEmailInput(e.target.value)}
                />
            </div>

            <div className = "my-8 flex justify-center">
                <button
                    data-testid = "button"
                    className = {`py-2 px-6 text-xl ${selectedColor == "blue" && "bg-sky-500 text-white hover:bg-sky-600"} ${selectedColor == "whiteBlack" && "bg-gray-600 text-white hover:bg-gray-700"} ${selectedColor == "pink" && "bg-pink-500 text-white hover:bg-pink-600"} rounded-xl shadow-lg hover:scale-110 transition duration-300`}
                    onClick = {() => postForm()}
                >
                    送信
                </button>
            </div>



        </div>
    )
}

export default Form