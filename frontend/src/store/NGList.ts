import { createSlice } from "@reduxjs/toolkit"
import type { PayloadAction } from "@reduxjs/toolkit"
import NGListInitState from "../constant/NGListInitState"

const NGList = createSlice({
    name: "NGList",
    initialState: NGListInitState,
    reducers: {
        setNGInit: () => {
            return {
                ...NGListInitState,
                listId: crypto.randomUUID()
            }
        },
        changeListName: (state, action: PayloadAction<string>) => {
            state.listName = action.payload
        },
        changeList: (state, action: PayloadAction<{ text: string, i: number}>) => {
            state.list[action.payload.i] = action.payload.text
        },
        deleteList: (state, action: PayloadAction<number>) => {
            state.list.splice(action.payload, 1)
        },
        plusList: (state) => {
            state.list.push("")
        },
        setList: (state, action: PayloadAction<{ listId: string, listName: string, list: string[], createdAt: string, updatedAt: string }>) => {
            state.listId = action.payload.listId
            state.listName = action.payload.listName
            state.list = action.payload.list 
            state.createdAt = action.payload.createdAt 
            state.updatedAt = action.payload.updatedAt
        }
    }
})

export const { setNGInit, changeListName, changeList, deleteList, plusList, setList } = NGList.actions
export default NGList.reducer