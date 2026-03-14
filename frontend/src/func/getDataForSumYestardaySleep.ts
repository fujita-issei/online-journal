import axios from "axios"
import calcDays from "./calcDays"

// 特定の日にちのnumberOfDays前の日にちのgoBedHour, goBedMinを取得する
const getDataForSumYestardaySleep = async (userId: string, targetDate: string, numberOfDays: number) => {

    const yestarday = calcDays(targetDate, numberOfDays, "-")

    const res = await axios.get("/api/dailyJournal/getYestardaySleepTime", {
        params: {
            userId: userId,
            targetDate: yestarday,
        }
    })
    return res.data
}

export default getDataForSumYestardaySleep