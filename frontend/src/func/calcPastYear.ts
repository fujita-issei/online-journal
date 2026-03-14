import { format, subYears } from "date-fns"

// i番目前の年を返す
const calcPastYear = (i: number) => {
    const now = new Date()
    const targetYear = subYears(now, i)
    return format(targetYear, "yyyy")
}

export default calcPastYear