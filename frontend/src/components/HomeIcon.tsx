import { useAppDispatch, useAppSelector } from "../hooks/ReduxHooks"
import { toggleIsClicked } from "../store/Menu"
import DisplayTheme from "./childComp/DisplayTheme"

const HomeIcon = () => {

  const { selectedMenu, isClickedMenu } = useAppSelector((state) => state.Menu)
  const dispatch = useAppDispatch()
  const selectedColor = useAppSelector((state) => state.color.color)


  return (
    <div className = {`w-full ${selectedColor == "blue" && "bg-themeDefault-300"} ${selectedColor == "whiteBlack" && "bg-themeWhiteBlack-300"} ${selectedColor == "pink" && "bg-themePink-300"} z-50 rounded-md shadow-md`}>
      {/* ホーム画面に常に上の固定されているアイコンを作成する。 */}
      <div className = "flex justify-start content-start py-1 pl-2">
        
        {/* ハンバーガーメニュー */}
        {/* onClickで、押したらメニューのオープンを調整できる。 */}
        <div 
          className = {`hover:bg-gray-200 cursor-pointer rounded-lg hover:shadow-md transition duration-100 ${isClickedMenu && "bg-gray-200"}`} 
          onClick = {() => dispatch(toggleIsClicked())}
        >
          <svg className ={`size-9 ${selectedColor !== "blue" && "text-white"}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
          </svg>
        </div>

        {/* 今いる画面の説明 */}
        <div className = "ml-10 px-1 text-2xl text-gray-700 hover:bg-themeDefault-300/30 hover:shadow-md rounded-md transition duration-100 hover:scale-105">
          <DisplayTheme  menu = {selectedMenu} />
        </div>
      </div>
    </div>
  )
}

export default HomeIcon