import { Routes, Route } from "react-router-dom"
import Home from "./components/Home"
import HomeIcon from "./components/HomeIcon"
import { useAppDispatch, useAppSelector } from "./hooks/ReduxHooks"
import SideMenu from "./components/SideMenu"
import SelectCreateJournal from "./components/SelectJournal"
import CreateDailyJournal from "./components/CreateDailyJournal"
import CreateRoutine from "./components/CreateRoutine"
import EditRoutine from "./components/EditRoutine"
import CreateNGList from "./components/CreateNGList"
import EditNGList from "./components/EditNGList"
import CreateWeekJournal from "./components/CreateWeekJournal"
import CreateMonthJournal from "./components/CreateMonthJournal"
import CreateYearJournal from "./components/CreateYearJournal"
import WatchPastJournal from "./components/WatchPastJournal"
import WatchSummary from "./components/WatchSummary"
import SideHomeIcon from "./components/SideHomeIcon"
import Setting from "./components/Setting"
import Guide from "./components/Guide"
import Form from "./components/Form"
import { GoogleLogin } from '@react-oauth/google'
import type { CredentialResponse } from '@react-oauth/google'
import { setUserId } from "./store/login"
import { changeColor } from "./store/color"
import axios from "axios"
import bgImage from "./assets/loginBgImage.png";


function App() {

  const isClickedMenu = useAppSelector((state) => state.Menu.isClickedMenu)
  const selectedColor = useAppSelector((state) => state.color.color)
  const dispatch = useAppDispatch()
  const { userId } = useAppSelector((state) => state.login)

  const handleLoginSuccess = async (credentialResponse: CredentialResponse) => {
      const token = credentialResponse.credential;
      try {
        await axios.post("/api/auth/google", {
          token: token
        }).then((res) => {
          const data = res.data
        
          dispatch(setUserId(data.user.google_id))
          dispatch(changeColor("blue"))
          localStorage.setItem("color", "blue")
          localStorage.setItem("userId", data.user.google_id)
        })
      } catch (error) {
          console.error("Login failed:", error);
      }
  }

  return (
    <div>

      {userId !== "" ?
        <div className = {`lg:flex font-ZenMaru ${selectedColor == "blue" && "bg-themeDefault-100"} ${selectedColor == "whiteBlack" && "bg-themeWhiteBlack-100"} ${selectedColor == "pink" && "bg-themePink-100"}  text-gray-600`}>
          <header className = "lg:hidden sticky top-0 left-0">
            <HomeIcon/>
          </header>

          {/* メニューアイコンがクリックされているのみ、表示する */}
          <div className = "lg:hidden">
            {isClickedMenu && <SideMenu />}
          </div>
          
          <header className = "hidden lg:block">
            <SideHomeIcon />
          </header>

          <main className = "lg:w-9/12 xl:w-8/12">
            <Routes>
                <Route path = "/" element = {<Home />}></Route>
                <Route path = "/createJournal" element = {<SelectCreateJournal />}></Route>
                <Route path = "/createJournal/daily" element = {<CreateDailyJournal />}></Route>
                <Route path = "/createRoutine" element = {<CreateRoutine />}></Route>
                <Route path = "/createRoutine/edit" element = {<EditRoutine />}></Route>
                <Route path = "/createNGList" element = {<CreateNGList />}></Route>
                <Route path = "/createNGList/edit" element = {<EditNGList />}></Route>
                <Route path = {`/createJournal/week`} element = {<CreateWeekJournal />}></Route>
                <Route path = {`/createJournal/month`} element = {<CreateMonthJournal />}></Route>
                <Route path = {`/createJournal/year`} element = {<CreateYearJournal />}></Route>
                <Route path = {`/watchPastJournal`} element = {<WatchPastJournal />}></Route>
                <Route path = {`/watchSummary`} element = {<WatchSummary />}></Route>
                <Route path = {`/setting`} element = {<Setting />}></Route>
                <Route path = {`/guide`} element = {<Guide />}></Route>
                <Route path = {`/form`} element = {<Form />}></Route>
            </Routes>
          </main>
        </div>
        :
          <div 
            className = "min-h-screen bg-cover bg-center bg-no-repeat flex flex-col justify-center items-center p-4 text-gray-700 font-ZenMaru relative"
            style={{ backgroundImage: `url(${bgImage})` }}
          >
            <div className="absolute inset-0 bg-white/50 backdrop-blur-sm z-0"></div>
            <div className="flex flex-col items-center gap-10 md:gap-14 w-full max-w-2xl z-10 relative">
              <div className = "text-center text-3xl text-gray-600 mx-4">
                オンラインジャーナルアプリへようこそ！
              </div>
              <div className = "mx-10">
                <div className = "border-2 px-8 py-8 border-gray-500 rounded-2xl shadow-lg bg-white/50 w-full">
                  <div className = "text-lg lg:text-2xl text-center">
                    <p className = "my-2">このアプリを使用するには</p>
                    <p className = "my-2">Googleアカウントでのログインが必要です。</p>
                    <p className = "my-2">下のボタンからログインしてください</p>
                  </div>
                </div>
                <div className="hidden md:flex justify-center mt-24">
                  <GoogleLogin
                    onSuccess={handleLoginSuccess}
                    onError={() => console.log('Login Failed')}
                    width = "400"
                    size = "large"
                  />
                </div>
                <div className="flex md:hidden justify-center mt-12">
                  <GoogleLogin
                    onSuccess={handleLoginSuccess}
                    onError={() => console.log('Login Failed')}
                    width = "300"
                    size = "large"
                  />
                </div>
              </div>
            </div>
          </div>
          
      }

      

    </div>
  )
}

export default App
