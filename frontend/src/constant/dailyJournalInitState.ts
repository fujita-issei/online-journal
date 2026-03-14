import { format } from "date-fns";
import type { RoutineInitState } from "./routineInitState";
import type { NGListInitStateInterface } from "./NGListInitState";

export interface DailyJournalInitState {
    userId: string;
    targetDate: string;
    getUpHour: number;
    getUpMin: number;
    goBedHour: number;
    goBedMin: number;
    routine: RoutineInitState[];
    routineCheck: boolean[];
    toDoTimeHour: number;
    toDoTimeMin: number;
    startToDoHour: number;
    startToDoMin: number;
    endToDoHour: number;
    endToDoMin: number;
    toDoTimeCheck: boolean[]
    toDoList: string[];
    toDoListCheck: boolean[];
    toDoListImportant: number[];
    importList: NGListInitStateInterface[];
    importListCheck: boolean[]
    addList: string[];
    addListCheck: boolean[];
    journal: string[];
    journalCount: number[];
    journalLastEditTime: string[];
    moneyInvestment: number;
    moneyWaste: number;
    moneyConsumption: number;
    moneyUseSum: number;
    isWritten: boolean;
    createdAt: string;
    updatedAt: string;
}

const now = new Date()

const dailyJournalInitState: DailyJournalInitState = {
    userId: localStorage.getItem("userId") ?? "",
    targetDate: localStorage.getItem("dailyJournalDate") ?? "",
    getUpHour: 7,
    getUpMin: 0,
    goBedHour: 23,
    goBedMin: 0,
    routine: [],
    routineCheck: [],
    toDoTimeHour: 0,
    toDoTimeMin: 0,
    startToDoHour: 8,
    startToDoMin: 0,
    endToDoHour: 12,
    endToDoMin: 0,
    toDoTimeCheck: [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false],
    toDoList: [],
    toDoListCheck: [],
    toDoListImportant: [],
    importList: [],
    importListCheck: [],
    addList: [],
    addListCheck: [],
    journal: [],
    journalCount: [0],
    journalLastEditTime: [format(now, "yyyy / MM / dd / HH : mm")],
    moneyInvestment: 0,
    moneyWaste: 0,
    moneyConsumption: 0,
    moneyUseSum: 0,
    isWritten: false,
    createdAt: "",
    updatedAt: ""
}

export default dailyJournalInitState;