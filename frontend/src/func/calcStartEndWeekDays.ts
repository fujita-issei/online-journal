// 今日からi番目前の日曜日と、その日曜日が週末とする週の初めの日付を

import { endOfWeek, format, startOfWeek, subWeeks } from "date-fns"

// 配列として出力する
const calcStartEndWeekDays = (i: number) => {
    const now = new Date()
    // 今週の日曜日の日付
    const sundayThisWeek = endOfWeek(now, {weekStartsOn: 1})
    // ここから、i週間前の日曜日の日付
    const targetSunday = subWeeks(sundayThisWeek, i)
    // その日曜日の週始めの日付
    const targetMonday = startOfWeek(targetSunday, {weekStartsOn: 1})
    return [
        format(targetMonday, "yyyy"),
        format(targetMonday, "MM"),
        format(targetMonday, "dd"),
        format(targetSunday, "yyyy"),
        format(targetSunday, "MM"),
        format(targetSunday, "dd")
    ]
}   

export default calcStartEndWeekDays