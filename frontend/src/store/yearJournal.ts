import { createSlice } from "@reduxjs/toolkit"
import type { PayloadAction } from "@reduxjs/toolkit"
import yearJournalInitState, { type YearJournalInitState } from "../constant/yearJournalInitState"

import { format } from "date-fns"

const yearJournal = createSlice({
    name: "yearJournal",
    initialState: yearJournalInitState,
    reducers: {
        changeYearDate: (state, action: PayloadAction<string>) => {
            state.targetDate = action.payload
        },
        setYearInit: () => {
            return yearJournalInitState
        },
        toggleYearToDoCheck: (state, action: PayloadAction<number>) => {
            state.toDoCheck[action.payload] = !state.toDoCheck[action.payload]
        },
        changeYearToDo: (state, action: PayloadAction<{ text: string; i: number; }>) => {
            state.toDo[action.payload.i] = action.payload.text
        },
        changeYearToDoImportant: (state, action: PayloadAction<{ value: number; i: number; }>) => {
            state.toDoImportant[action.payload.i] = action.payload.value
        },
        plusYearToDo: (state) => {
            state.toDo.push("")
            state.toDoCheck.push(false)
            state.toDoImportant.push(1)
        },
        deleteYearToDo: (state, action: PayloadAction<number>) => {
            state.toDo.splice(action.payload, 1)
            state.toDoCheck.splice(action.payload, 1)
            state.toDoImportant.splice(action.payload, 1)
        },
        changeYearJournal: (state, action: PayloadAction<{ text: string; i: number}>) => {
            const text: string = action.payload.text
            const i : number = action.payload.i
            state.journal[i] = text
            state.journalCount[i] = text.length
            const now = new Date()
            state.journalLastEditTime[i] = format(now, "yyyy / MM / dd / HH : mm")
        },
        deleteYearJournal: (state, action: PayloadAction<number>) => {
            state.journal.splice(action.payload, 1)
            state.journalCount.splice(action.payload, 1)
            state.journalLastEditTime.splice(action.payload, 1)
        },
        plusYearJournal: (state) => {
            const now = new Date()
            state.journal.push("")
            state.journalCount.push(0)
            state.journalLastEditTime.push(format(now, "yyyy / MM / dd / HH : mm"))
        },
        setCurrentYear: (state, action: PayloadAction<YearJournalInitState>) => {
            return action.payload
        },
        setYearSummary: (state, action: PayloadAction<number[]>) => {
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

export const { setCurrentYear, setYearSummary, changeYearDate, setYearInit, toggleYearToDoCheck, changeYearToDo, changeYearToDoImportant, plusYearToDo, deleteYearToDo, changeYearJournal, deleteYearJournal, plusYearJournal } = yearJournal.actions
export default yearJournal.reducer