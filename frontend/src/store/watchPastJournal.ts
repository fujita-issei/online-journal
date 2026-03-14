import { createSlice } from "@reduxjs/toolkit"
import type { PayloadAction } from "@reduxjs/toolkit"
import watchPastJournalInitState from "../constant/watchPastJournalInitState"
import type { DailyJournalInitState } from "../constant/dailyJournalInitState"
import type { WeekJournalInitState } from "../constant/weekJournalInitState"
import type { MonthJournalInitState } from "../constant/monthJournalInitState"
import type { YearJournalInitState } from "../constant/yearJournalInitState"

const watchPastJournal = createSlice({
    name: "watchPastJournal",
    initialState: watchPastJournalInitState,
    reducers: {
        setJournal: (state, action: PayloadAction<DailyJournalInitState[] | WeekJournalInitState[] | MonthJournalInitState[] | YearJournalInitState[]>) => {
            state.journal = action.payload
        },
        setSelected: (state, action: PayloadAction<string>) => {
            state.selected = action.payload
        },
        setUpOrDown: (state, action: PayloadAction<string>) => {
            state.upOrDown= action.payload
        },
        setYearInput: (state, action: PayloadAction<string>) => {
            state.yearInput = action.payload
        },
        setMonthInput: (state, action: PayloadAction<string>) => {
            state.monthInput = action.payload
        },
        setDateInput: (state, action: PayloadAction<string>) => {
            state.dateInput = action.payload
        },
        setPage: (state, action: PayloadAction<number>) => {
            state.page = action.payload
        },
        setWatchPastJournalInit: () => {
            return watchPastJournalInitState
        }
    }
})

export const { setPage, setWatchPastJournalInit, setDateInput, setMonthInput, setYearInput, setSelected, setUpOrDown, setJournal } = watchPastJournal.actions
export default watchPastJournal.reducer