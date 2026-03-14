import { createSlice } from "@reduxjs/toolkit"
import type { PayloadAction } from "@reduxjs/toolkit"
import colorInitState from "../constant/colorInitState"

const color = createSlice({
    name: "color",
    initialState: colorInitState,
    reducers: {
        changeColor: (state, action: PayloadAction<string>) => {
            localStorage.setItem("color", action.payload)
            state.color = action.payload
        }
    }
})

export const { changeColor } = color.actions
export default color.reducer