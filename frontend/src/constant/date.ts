import { format } from "date-fns"

const now = new Date()

export const nowYear = format(now, "yyyy")
export const nowMonth = format(now, "MM")
export const nowDate = format(now, "dd")

export const nowYearMonthDate = format(now, "yyyy-MM-dd")