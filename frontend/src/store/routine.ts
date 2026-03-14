import { createSlice } from "@reduxjs/toolkit"
import type { PayloadAction } from "@reduxjs/toolkit"
import routineInitState from "../constant/routineInitState"

const routine = createSlice({
    name: "routine",
    initialState: routineInitState,
    reducers: {
        setRoutineInit: () => {
            return {
                ...routineInitState,
                routineId: crypto.randomUUID()
            }
        },
        changeRoutineName: (state, action: PayloadAction<string>) => {
            state.routineName = action.payload
        },
        changeTargetTimeHour: (state, action: PayloadAction<string>) => {
            if (action.payload.length !== 0) {
                const intFinishHour: number = parseInt(action.payload)
                if (intFinishHour <= 24) {
                    state.targetTimeHour = intFinishHour
                } 
            } else {
                state.targetTimeHour = 0
            }
        },
        changeTargetTimeMin: (state, action: PayloadAction<string>) => {
            if (action.payload.length !== 0) {
                const intFinishMin: number = parseInt(action.payload)
                if (intFinishMin < 60) {
                    state.targetTimeMin = intFinishMin
                } 
            } else {
                state.targetTimeMin = 0
            }
        },
        changeRoutine: (state, action: PayloadAction<{ text: string, i: number}>) => {
            state.routine[action.payload.i] = action.payload.text
        },
        changeRoutineTime: (state, action: PayloadAction<{ value: string, i: number}>) => {
            if (action.payload.value.length !== 0) {
                const intRoutineMin: number = parseInt(action.payload.value)
                if (intRoutineMin < 999) {
                    state.routineTime[action.payload.i] = intRoutineMin
                } 
            } else {
                state.routineTime[action.payload.i] = 0
            }
        },
        deleteRoutine: (state, action: PayloadAction<number>) => {
            state.routine.splice(action.payload, 1)
            state.routineTime.splice(action.payload, 1)
        },
        plusAfterRoutine: (state) => {
            state.routine.push("")
            state.routineTime.push(0)
        },
        plusBeforeRoutine: (state) => {
            state.routine.unshift("")
            state.routineTime.unshift(0)
        },
        setEditState: (state, action: PayloadAction<{ routineId: string, routineName: string, targetTimeHour: number, targetTimeMin: number, routine: string[], routineTime: number[], createdAt: string, updatedAt: string }>) => {
            state.routineId = action.payload.routineId
            state.routineName = action.payload.routineName
            state.targetTimeHour = action.payload.targetTimeHour
            state.targetTimeMin = action.payload.targetTimeMin
            state.routine = action.payload.routine
            state.routineTime = action.payload.routineTime
            state.createdAt = action.payload.createdAt
            state.updatedAt = action.payload.updatedAt
        }
    }
})

export const { setRoutineInit, changeRoutineName, changeTargetTimeHour, changeTargetTimeMin, changeRoutine, changeRoutineTime, deleteRoutine, plusAfterRoutine, plusBeforeRoutine, setEditState } = routine.actions
export default routine.reducer