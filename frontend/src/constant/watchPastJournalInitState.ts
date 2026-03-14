import type { DailyJournalInitState } from "./dailyJournalInitState";
import type { MonthJournalInitState } from "./monthJournalInitState";
import type { WeekJournalInitState } from "./weekJournalInitState";
import type { YearJournalInitState } from "./yearJournalInitState";

export type Journal = DailyJournalInitState[] | WeekJournalInitState[] | MonthJournalInitState[] | YearJournalInitState[]

export interface WatchPastJournalInitState {
    selected: string;
    upOrDown: string;
    dateInput: string;
    monthInput: string;
    yearInput: string;
    page: number;
    journal: Journal
}

const watchPastJournalInitState: WatchPastJournalInitState = {
    selected: "日別",
    upOrDown: "降順",
    dateInput: "",
    monthInput: "",
    yearInput: "",
    page: 0,
    journal: []
}

export default watchPastJournalInitState