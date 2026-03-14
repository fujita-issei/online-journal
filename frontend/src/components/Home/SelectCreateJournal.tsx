import { useNavigate } from "react-router-dom"
import { useAppDispatch, useAppSelector } from "../../hooks/ReduxHooks"
import { setSelectedMenu } from "../../store/Menu"
import menuURL from "../../constant/menuURL"

// ジャーナルを作成とルーティーンを作成の部分のUIを構築するコンポーネント
const SelectCreateJournal = () => {

  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const selectedColor = useAppSelector((state) => state.color.color)

  //menuで渡した文字列を頼りに、ページ移動をする
  const movePage = (menu: string) => {
        localStorage.setItem("currentPage", menu)
        dispatch(setSelectedMenu(menu))
        const nextURL: string = menuURL.filter((_menu) => _menu.menu === menu)[0]?.url
        if (nextURL) {
            navigate(nextURL)
        } else {
            console.error("URL not found")
        }
    }

  return (
    <div className = "md:grid grid-cols-2 justify-center items-center">
        {/* ジャーナルを作成するボタン */}
        <div 
          data-testid = "journal-button"
          className = {`md:px-8 cursor-pointer flex justify-center gap-x-2 border-2 py-10 mx-8 mt-8 rounded-3xl shadow-lg ${selectedColor == "blue" && "border-gray-100 bg-sky-200 hover:bg-sky-300"} ${selectedColor == "whiteBlack" && "border-gray-100 bg-gray-200 hover:bg-gray-300"} ${selectedColor == "pink" && "border-gray-100 bg-pink-200 hover:bg-pink-300"} transition duration-100 hover:scale-105`}
          onClick = {() => movePage("ジャーナルを作成")}
        >
          <div>
            <svg className = {`size-7 ${selectedColor !== "pink" && "text-gray-500/80"} ${selectedColor == "pink" && "text-pink-500"}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
            </svg>
          </div>

          <h2 className = {`text-center text-xl ${selectedColor !== "pink" && "text-gray-600"} ${selectedColor == "pink" && "text-pink-700"}`}>ジャーナルを作成</h2>
        </div>

        {/* ルーティーンを作成するボタン */}
        <div 
          data-testid = "routine-button"
          className = {`md:px-8 md:mt-8 cursor-pointer flex justify-center gap-x-2 border-2 py-10 mx-8 mt-10 rounded-3xl shadow-lg ${selectedColor == "blue" && "border-gray-100 bg-sky-500/90 hover:bg-sky-600/90"} ${selectedColor == "whiteBlack" && "border-gray-100 bg-gray-500/90 hover:bg-gray-600/90"} ${selectedColor == "pink" && "border-pink-100 bg-pink-500/90 hover:bg-pink-600/90"} transition duration-100 hover:scale-105`}
          onClick = {() => movePage("ルーティーンを作成")}
        >
          <div>
            <svg className = "size-7 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
            </svg>
          </div>

          <h2 className = "text-center text-xl text-white">ルーティーンを作成</h2>
        </div>

        <div 
          data-testid = "NGList-button"
          className = {`md:px-8 cursor-pointer flex justify-center gap-x-2 border-2 py-10 mx-8 mt-8 rounded-3xl shadow-lg ${selectedColor == "blue" && "border-gray-100 bg-sky-200 hover:bg-sky-300"} ${selectedColor == "whiteBlack" && "border-gray-100 bg-gray-200 hover:bg-gray-300"} ${selectedColor == "pink" && "border-gray-100 bg-pink-200 hover:bg-pink-300"} transition duration-100 hover:scale-105`}
          onClick = {() => movePage("禁止リストを作成")}
        >
          <div>
            <svg className = {`size-7 ${selectedColor !== "pink" && "text-gray-500/80"} ${selectedColor == "pink" && "text-pink-500"}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
            </svg>
          </div>

          <h2 className = {`text-center text-xl ${selectedColor !== "pink" && "text-gray-600"} ${selectedColor == "pink" && "text-pink-700"}`}>禁止リストを作成</h2>
        </div>
    </div>
  )
}

export default SelectCreateJournal