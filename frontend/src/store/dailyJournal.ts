import { createSlice } from "@reduxjs/toolkit"
import type { PayloadAction } from "@reduxjs/toolkit"
import dailyJournalInitState from "../constant/dailyJournalInitState"
import type { DailyJournalInitState } from "../constant/dailyJournalInitState"
import { format } from "date-fns";
import type { NGListInitStateInterface } from "../constant/NGListInitState";
import type { RoutineInitState } from "../constant/routineInitState";

const dailyJournal = createSlice({
    name: "dailyJournal",
    initialState: dailyJournalInitState,
    reducers: {
        changeDate: (state, action: PayloadAction<string>) => {
            state.targetDate = action.payload
        },
        changeGetUpHour: (state, action: PayloadAction<string>) => {
            if (action.payload.length !== 0) {
                const intGetUpHour: number = parseInt(action.payload)
                if (intGetUpHour <= 24) {
                    state.getUpHour = intGetUpHour
                } 
            } else {
                state.getUpHour = 0
            }
        },
        changeGetUpMin: (state, action: PayloadAction<string>) => {
            if (action.payload.length !== 0) {
                const intGetUpMin: number = parseInt(action.payload)
                if (intGetUpMin <= 60) {
                    state.getUpMin = intGetUpMin
                } 
            } else {
                state.getUpMin = 0
            }
        },
        changeGoBedHour: (state, action: PayloadAction<string>) => {
            if (action.payload.length !== 0) {
                const intGoBedHour: number = parseInt(action.payload)
                // 24時以降の時間で入力する人もいるので、99以上とする
                if (intGoBedHour < 99) {
                    state.goBedHour = intGoBedHour
                } 
            } else {
                state.goBedHour = 0
            }
        },
        changeGoBedMin: (state, action: PayloadAction<string>) => {
            if (action.payload.length !== 0) {
                const intGoBedMin: number = parseInt(action.payload)
                if (intGoBedMin <= 60) {
                    state.goBedMin = intGoBedMin
                } 
            } else {
                state.goBedMin = 0
            }
        },
        toggleRoutineCheck: (state, action: PayloadAction<number>) => {
            state.routineCheck[action.payload] = !state.routineCheck[action.payload]
        },
        deleteRoutine: (state, action: PayloadAction<{routineId: string; i: number}>) => {
            const routineId = action.payload.routineId
            state.routine = state.routine.filter((_routine) => {
                return _routine.routineId !== routineId
            })
            const routineNum = action.payload.i
            state.routineCheck = state.routineCheck.filter((_routine, i) => {
                return i !== routineNum
            })
        },
        changeToDoTimeHour: (state, action: PayloadAction<string>) => {
            if (action.payload.length !== 0) {
                const intToDoTimeHour: number = parseInt(action.payload)
                if (intToDoTimeHour < 99) {
                    state.toDoTimeHour = intToDoTimeHour
                } 
            } else {
                state.toDoTimeHour = 0
            }
        },
        changeToDoTimeMin: (state, action: PayloadAction<string>) => {
            if (action.payload.length !== 0) {
                const intToDoTimeMin: number = parseInt(action.payload)
                if (intToDoTimeMin < 99) {
                    state.toDoTimeMin = intToDoTimeMin
                } 
            } else {
                state.toDoTimeMin = 0
            }
        },
        changeStartToDoHour: (state, action: PayloadAction<string>) => {
            if (action.payload.length !== 0) {
                const intStartToDoHour: number = parseInt(action.payload)
                if (intStartToDoHour < 99) {
                    state.startToDoHour = intStartToDoHour
                } 
            } else {
                state.startToDoHour = 0
            }
        },
        changeStartToDoMin: (state, action: PayloadAction<string>) => {
            if (action.payload.length !== 0) {
                const intStartToDoMin: number = parseInt(action.payload)
                if (intStartToDoMin < 99) {
                    state.startToDoMin = intStartToDoMin
                } 
            } else {
                state.startToDoMin = 0
            }
        },
        changeEndToDoHour: (state, action: PayloadAction<string>) => {
            if (action.payload.length !== 0) {
                const intEndToDoHour: number = parseInt(action.payload)
                if (intEndToDoHour < 99) {
                    state.endToDoHour = intEndToDoHour
                } 
            } else {
                state.endToDoHour = 0
            }
        },
        changeEndToDoMin: (state, action: PayloadAction<string>) => {
            if (action.payload.length !== 0) {
                const intEndToDoMin: number = parseInt(action.payload)
                if (intEndToDoMin < 99) {
                    state.endToDoMin = intEndToDoMin
                } 
            } else {
                state.endToDoMin = 0
            }
        },
        toggleToDoTimeCheck: (state, action: PayloadAction<number>) => {
            state.toDoTimeCheck[action.payload] = !state.toDoTimeCheck[action.payload]
        },
        toggleToDoListCheck: (state, action: PayloadAction<number>) => {
            state.toDoListCheck[action.payload] = !state.toDoListCheck[action.payload]
        },
        changeToDo: (state, action: PayloadAction<{ text: string; i: number}>) => {
            state.toDoList[action.payload.i] = action.payload.text
        },
        channgeToDoImportant: (state, action: PayloadAction<{ value: number, i: number}>) => {
            state.toDoListImportant[action.payload.i] = action.payload.value
        },
        plusToDoList: (state) => {
            state.toDoList.push("")
            state.toDoListCheck.push(false)
            state.toDoListImportant.push(1)
        },
        deleteToDoList: (state, action: PayloadAction<number>) => {
            state.toDoList.splice(action.payload, 1)
            state.toDoListCheck.splice(action.payload, 1)
            state.toDoListImportant.splice(action.payload, 1)
        },
        changeNGList: (state, action: PayloadAction<{ text: string; i: number}>) => {
            state.addList[action.payload.i] = action.payload.text
        },
        toggleNGList: (state, action: PayloadAction<{ value: boolean; i: number}>) => {
            state.addListCheck[action.payload.i] = action.payload.value
        },
        plusNGList: (state) => {
            state.addList.push("")
            state.addListCheck.push(false)
        },
        deleteNGList: (state, action: PayloadAction<number>) => {
            state.addList.splice(action.payload, 1)
            state.addListCheck.splice(action.payload, 1)
        },
        addImportNG: (state, action: PayloadAction<NGListInitStateInterface>) => {
            state.importList.push(action.payload)
            state.importListCheck.push(false)
        },
        deleteImportNG: (state, action: PayloadAction<{listId: string; i: number}>) => {
            const listId = action.payload.listId
            state.importList = state.importList.filter((list) => {
                return list.listId !== listId
            })
            const listNum = action.payload.i
            state.importListCheck = state.importListCheck.filter((list, i) => {
                return i !== listNum
            })
        },
        toggleImportNG: (state, action: PayloadAction<number>) => {
            const listNum = action.payload
            state.importListCheck = state.importListCheck.map((item, i) => {
                return i == listNum ? !item : item
            })
        },
        changeJournal: (state, action: PayloadAction<{ text: string; i: number}>) => {
            const text: string = action.payload.text
            const i : number = action.payload.i
            state.journal[i] = text
            state.journalCount[i] = text.length
            const now = new Date()
            state.journalLastEditTime[i] = format(now, "yyyy / MM / dd / HH : mm")
        },
        plusJournal: (state) => {
            const now = new Date()
            state.journal.push("")
            state.journalCount.push(0)
            state.journalLastEditTime.push(format(now, "yyyy / MM / dd / HH : mm"))
        },
        deleteJournal: (state, action: PayloadAction<number>) => {
            state.journal.splice(action.payload, 1)
            state.journalCount.splice(action.payload, 1)
            state.journalLastEditTime.splice(action.payload, 1)
        },
        changeInvestment: (state, action: PayloadAction<string>) => {
            if (action.payload.length !== 0) {
                const intInvestment: number = parseInt(action.payload)
                if (intInvestment > 0) {
                    state.moneyInvestment = intInvestment
                    state.moneyUseSum = intInvestment + state.moneyWaste + state.moneyConsumption
                }
            } else {
                state.moneyInvestment = 0
                state.moneyUseSum = state.moneyConsumption + state.moneyConsumption
            }
        },
        changeWaste: (state, action: PayloadAction<string>) => {
            if (action.payload.length !== 0) {
                const intWaste: number = parseInt(action.payload)
                if (intWaste > 0) {
                    state.moneyWaste = intWaste
                    state.moneyUseSum = intWaste + state.moneyInvestment + state.moneyConsumption
                }
            } else {
                state.moneyWaste = 0
                state.moneyUseSum = state.moneyInvestment + state.moneyConsumption
            }
        },
        changeConsumption: (state, action: PayloadAction<string>) => {
            if (action.payload.length !== 0) {
                const intConsumption: number = parseInt(action.payload)
                if (intConsumption > 0) {
                    state.moneyConsumption = intConsumption
                    state.moneyUseSum = intConsumption + state.moneyInvestment + state.moneyWaste
                }
            } else {
                state.moneyConsumption = 0
                state.moneyUseSum = state.moneyInvestment + state.moneyWaste
            }
        },
        calcSumMoney: (state) => {
            state.moneyUseSum = state.moneyConsumption + state.moneyInvestment + state.moneyWaste
        },
        setInit: () => {
            return dailyJournalInitState;
        },
        setCurrentDailyJournal: (state, action: PayloadAction<DailyJournalInitState>) => {
            return action.payload
        },
        addRoutine: (state, action: PayloadAction<RoutineInitState>) => {
            state.routine.push(action.payload)
            state.routineCheck.push(false)
        }
    }
})

export const { calcSumMoney, toggleImportNG, deleteImportNG, addImportNG, deleteRoutine, setInit, changeDate, changeGetUpHour, changeGetUpMin, changeGoBedHour, changeGoBedMin, toggleRoutineCheck, changeToDoTimeHour, changeToDoTimeMin, changeStartToDoHour, changeStartToDoMin, changeEndToDoHour, changeEndToDoMin, toggleToDoTimeCheck, toggleToDoListCheck, changeToDo, channgeToDoImportant, plusToDoList, deleteToDoList, changeNGList, toggleNGList, plusNGList, deleteNGList, changeJournal, plusJournal, deleteJournal, changeInvestment, changeWaste, changeConsumption, setCurrentDailyJournal, addRoutine } = dailyJournal.actions
export default dailyJournal.reducer