import { createSlice } from "@reduxjs/toolkit"
import type { PayloadAction } from "@reduxjs/toolkit"
import weekJournalInitState from "../constant/weekJournalInitState"
import type { WeekJournalInitState } from "../constant/weekJournalInitState";
import { format } from "date-fns";

const weekJournal = createSlice({
    name: "weekJournal",
    initialState: weekJournalInitState,
    reducers: {
        changeWeekDate: (state, action: PayloadAction<{ startDate: string; endDate: string }>) => {
            state.startDate = action.payload.startDate
            state.endDate = action.payload.endDate
        },
        setWeekInit: () => {
            return weekJournalInitState
        },
        toggleWeekToDoCheck: (state, action: PayloadAction<number>) => {
            state.toDoCheck[action.payload] = !state.toDoCheck[action.payload]
        },
        changeWeekToDo: (state, action: PayloadAction<{ text: string; i: number; }>) => {
            state.toDo[action.payload.i] = action.payload.text
        },
        changeWeekToDoImportant: (state, action: PayloadAction<{ value: number; i: number; }>) => {
            state.toDoImportant[action.payload.i] = action.payload.value
        },
        plusWeekToDo: (state) => {
            state.toDo.push("")
            state.toDoCheck.push(false)
            state.toDoImportant.push(1)
        },
        deleteWeekToDo: (state, action: PayloadAction<number>) => {
            state.toDo.splice(action.payload, 1)
            state.toDoCheck.splice(action.payload, 1)
            state.toDoImportant.splice(action.payload, 1)
        },
        changeWeekJournal: (state, action: PayloadAction<{ text: string; i: number}>) => {
            const text: string = action.payload.text
            const i : number = action.payload.i
            state.journal[i] = text
            state.journalCount[i] = text.length
            const now = new Date()
            state.journalLastEditTime[i] = format(now, "yyyy / MM / dd / HH : mm")
        },
        deleteWeekJournal: (state, action: PayloadAction<number>) => {
            state.journal.splice(action.payload, 1)
            state.journalCount.splice(action.payload, 1)
            state.journalLastEditTime.splice(action.payload, 1)
        },
        plusWeekJournal: (state) => {
            const now = new Date()
            state.journal.push("")
            state.journalCount.push(0)
            state.journalLastEditTime.push(format(now, "yyyy / MM / dd / HH : mm"))
        },
        setCurrentWeek: (state, action: PayloadAction<WeekJournalInitState>) => {
            return action.payload
        },
        setWeekSummary: (state, action: PayloadAction<number[]>) => {
            const summaryData = action.payload
            state.summary.getUpHour = summaryData[0]
            state.summary.getUpMin = summaryData[1]
            state.summary.goBedHour = summaryData[2]
            state.summary.goBedMin = summaryData[3]
            state.summary.sumSleepHour = summaryData[4]
            state.summary.sumSleepMin = summaryData[5]
            state.summary.toDoTimeHour = summaryData[6]
            state.summary.toDoTimeMin = summaryData[7]
            state.summary.routineDone = summaryData[8]
            state.summary.routineAll = summaryData[9]
            state.summary.toDoDone = summaryData[10]
            state.summary.toDoAll = summaryData[11]
            state.summary.NGDone = summaryData[12]
            state.summary.NGAll = summaryData[13]
            state.summary.journalAllCount = summaryData[14]
            state.summary.moneyInvestment = summaryData[15]
            state.summary.moneyWaste = summaryData[16]
            state.summary.moneyConsumption = summaryData[17]
            state.summary.moneyUseSum = summaryData[18]
        }
    }
})

export const { setWeekSummary, setCurrentWeek, changeWeekDate, setWeekInit, toggleWeekToDoCheck, changeWeekToDo, changeWeekToDoImportant, plusWeekToDo, deleteWeekToDo, changeWeekJournal, deleteWeekJournal, plusWeekJournal } = weekJournal.actions
export default weekJournal.reducer