import { format, subMonths } from "date-fns"

// i番目前の月を取得する
const calcPastMonth = (i: number) => {
    const now = new Date()
    const targetMonth = subMonths(now, i)
    return [
        format(targetMonth, "yyyy"),
        format(targetMonth, "MM")
    ]
}

export default calcPastMonth