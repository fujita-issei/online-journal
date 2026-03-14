import axios from "axios"

// 特定の日付と、そのnumberOfDays前からのデータを取ってくる
// year/month/date : 2026/2/2, numberOfDays : 6だったら、2026/1/27から2026/2/2
// までのデータを取ってくる
const getDataForSummary = async (userId: string, targetDate: string, numberOfDays: number ) => {
    const res = await axios.get("/api/dailyJournal/getDailyDataForSummary", {
        params: {
            userId: userId,
            targetDate: targetDate,
            numberOfDays: numberOfDays
        }
    })
    return res.data
}

export default getDataForSummary