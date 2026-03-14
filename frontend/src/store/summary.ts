import { createSlice } from "@reduxjs/toolkit"
import type { PayloadAction } from "@reduxjs/toolkit"
import summaryInitState, { type JournalSummary, type ListSummary, type MoneySummary, type RoutineSummary, type SleepSummary, type ToDoSummary } from "../constant/summaryInitState"

const summary = createSlice({
    name: "summary",
    initialState: summaryInitState,
    reducers: {
        setStreak: (state, action: PayloadAction<{ streak: number; streakStartDay: string }>) => {
            state.streak = action.payload.streak 
            state.streakStartDay = action.payload.streakStartDay
        },
        setSleepNumberOfDay: (state, action: PayloadAction<number>) => {
            state.sleepNumberOfDay = action.payload
        },
        setSleepSummary: (state, action: PayloadAction<SleepSummary>) => {
            state.sleepSummary = action.payload
        },
        setSleepSummaryInit: (state) => {
            state.sleepSummary = {
                aveGetUpHour: 0,
                aveGetUpMin: 0,
                earlyGetUpHour: 0,
                earlyGetUpMin: 0,
                lateGetUpHour: 0,
                lateGetUpMin: 0,
                aveGoBedHour: 0,
                aveGoBedMin: 0,
                earlyGoBedHour: 0,
                earlyGoBedMin: 0,
                lateGoBedHour: 0,
                lateGoBedMin: 0
            }
        },
        setRoutineSummaryInit: (state) => {
            state.routineSummary = {
                routineDone: 0,
                routineAll: 0,
                achievementHighest: "",
                achievementLowest: ""
            }
        },
        setRoutineNumberOfDay: (state, action: PayloadAction<number>) => {
            state.routineNumberOfDay = action.payload
        },
        setRoutineSummary: (state, action: PayloadAction<RoutineSummary>) => {
            state.routineSummary = action.payload
        },
        setListSummaryInit: (state) => {
            state.listSummary = {
                listDone: 0,
                listAll: 0,
                achievementHighest: "",
                achievementLowest: ""
            }
        },
        setListNumberOfDay: (state, action: PayloadAction<number>) => {
            state.listNumberOfDay = action.payload
        },
        setListSummary: (state, action: PayloadAction<ListSummary>) => {
            state.listSummary = action.payload
        },
        setToDoSummaryInit: (state) => {
            state.toDoSummary = {
                sumToDoHour: 0,
                sumToDoMin: 0,
                aveToDoHour: 0,
                aveToDoMin: 0,
                long1stDate: "",
                long1stHour: 0,
                long1stMin: 0,
                long2ndDate: "",
                long2ndHour: 0,
                long2ndMin: 0,
                long3rdDate: "",
                long3rdHour: 0,
                long3rdMin: 0,
                short1stDate: "",
                short1stHour: 0,
                short1stMin: 0,
                short2ndDate: "",
                short2ndHour: 0,
                short2ndMin: 0,
                short3rdDate: "",
                short3rdHour: 0,
                short3rdMin: 0,
                toDoDone: 0,
                toDoAll: 0,
                achieveGoalTime: 0
            }
        },
        setToDoNumberOfDay: (state, action: PayloadAction<number>) => {
            state.toDoNumberOfDay = action.payload
        },
        setToDoSummary: (state, action: PayloadAction<ToDoSummary>) => {
            state.toDoSummary = action.payload
        },
        setJournalSummaryInit: (state) => {
            state.journalSummary = {
                sumJournalCount: 0,
                aveJournalCount: 0,
                long1stDate: "",
                long1stCount: 0,
                long2ndDate: "",
                long2ndCount: 0,
                long3rdDate: "",
                long3rdCount: 0,
                short1stDate: "",
                short1stCount: 0,
                short2ndDate: "",
                short2ndCount: 0,
                short3rdDate: "",
                short3rdCount: 0
            }
        },
        setJournalNumberOfDay: (state, action: PayloadAction<number>) => {
            state.journalNumberOfDay = action.payload
        },
        setJournalSummary: (state, action: PayloadAction<JournalSummary>) => {
            state.journalSummary = action.payload
        },
        setMoneySummaryInit: (state) => {
            state.moneySummary = {
                aveInvestment: 0,
                aveWaste: 0,
                aveConsumption: 0,
                maxInvestment: 0,
                maxWaste: 0,
                maxConsumption: 0,
                minInvestment: 0,
                minWaste: 0,
                minConsumption: 0,
                sumInvestment: 0,
                sumWaste: 0,
                sumConsumption: 0,
                sumUseMoney: 0
            }
        },
        setMoneyNumberOfDay: (state, action: PayloadAction<number>) => {
            state.moneyNumberOfDay = action.payload
        },
        setMoneySummary: (state, action: PayloadAction<MoneySummary>) => {
            state.moneySummary = action.payload
        },
    }
})

export const { setMoneySummary, setMoneyNumberOfDay, setMoneySummaryInit, setJournalSummary, setJournalNumberOfDay, setJournalSummaryInit, setToDoSummary, setToDoNumberOfDay, setToDoSummaryInit, setListSummary, setListNumberOfDay, setListSummaryInit, setRoutineSummary, setRoutineNumberOfDay, setRoutineSummaryInit, setSleepSummaryInit, setSleepSummary, setStreak, setSleepNumberOfDay } = summary.actions
export default summary.reducer