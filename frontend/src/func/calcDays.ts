import { format, subDays, addDays } from "date-fns"

const calcDays = (targetDate: string, numOfDays: number, type: string) => {
    const [year, month, date] = targetDate.split("-").map(Number)
    if (!year || !month || !date || !numOfDays || !type) return ""
    const target = new Date(year, month - 1, date)
    if (type == "+") {
        return format(addDays(target, numOfDays), "yyyy-MM-dd")
    } else if(type == "-") {
        return format(subDays(target, numOfDays), "yyyy-MM-dd")
    } else {
        return ""
    }
}

export default calcDays