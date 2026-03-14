import { createSlice } from "@reduxjs/toolkit"
import type { PayloadAction } from "@reduxjs/toolkit"
import loginInitState from "../constant/loginInitState"

const login = createSlice({
    name: "login",
    initialState: loginInitState,
    reducers: {
        setUserId: (state, action: PayloadAction<string>) => {
            state.userId = action.payload
        }
    }
})

export const { setUserId } = login.actions
export default login.reducer