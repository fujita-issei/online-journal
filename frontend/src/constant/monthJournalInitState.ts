import { format } from "date-fns";
import type Summary from "./summary";

export interface MonthJournalInitState {
    userId: string;
    targetDate: string;
    toDo: string[];
    toDoCheck: boolean[];
    toDoImportant: number[];
    journal: string[];
    journalCount: number[];
    journalLastEditTime: string[];
    summary: Summary;
    isWritten: boolean;
    createdAt: string;
    updatedAt: string;
}

const now = new Date()

const monthJournalInitState: MonthJournalInitState = {
    userId: localStorage.getItem("userId") ?? "",
    targetDate: localStorage.getItem("monthJournalDate") ?? "",
    toDo: [],
    toDoCheck: [],
    toDoImportant: [],
    journal: [],
    journalCount: [],
    journalLastEditTime: [format(now, "yyyy / MM / dd / HH : mm")],
    summary: {
        getUpHour : 0,
        getUpMin: 0,
        goBedHour: 0,
        goBedMin: 0,
        sumSleepHour: 0,
        sumSleepMin: 0,
        toDoTimeHour: 0,
        toDoTimeMin: 0,
        routineDone: 0,
        routineAll: 0,
        toDoDone: 0,
        toDoAll: 0,
        NGDone: 0,
        NGAll: 0, 
        journalAllCount: 0,
        moneyInvestment: 0,
        moneyWaste: 0,
        moneyConsumption: 0,
        moneyUseSum: 0
    },
    isWritten: false,
    createdAt: "",
    updatedAt: ""
}

export default monthJournalInitState;