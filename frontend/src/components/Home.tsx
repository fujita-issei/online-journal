import { useEffect } from "react"
import DisplayCurrentJournal from "./Home/DisplayCurrentJournal"
import SelectCreateJournal from "./Home/SelectCreateJournal"
import { useAppDispatch, useAppSelector } from "../hooks/ReduxHooks"
import { setSelectedMenu } from "../store/Menu"

const Home = () => {

  const dispatch = useAppDispatch()
  const selectedColor = useAppSelector((state) => state.color.color)

  useEffect(() => {
    localStorage.setItem("currentPage", "ホーム")
    dispatch(setSelectedMenu("ホーム"))
  }, [dispatch])

  return (
    <div>
      <div className = {`lg:my-4 my-6 mx-4 p-2 rounded-xl shadow-lg border-2 bg-white ${selectedColor !== "pink" && "border-gray-500"} ${selectedColor == "pink" && "border-pink-500"} border-dashed`}>
        {/* ジャーナルを作成ボタンとルーティーンを作成ボタンのUI */}
        <SelectCreateJournal />
        {/* 最近のジャーナルの部分のUI */}
        <DisplayCurrentJournal/>
      </div>
    </div>
  )
}

export default Home