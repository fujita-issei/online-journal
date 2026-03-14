import { createSlice } from "@reduxjs/toolkit"
import type { PayloadAction } from "@reduxjs/toolkit"

export interface MenuState {
    selectedMenu: string;
    isClickedMenu: boolean;
}

const initialState: MenuState = {
    selectedMenu: "ホーム",
    isClickedMenu: false
};

const Menu = createSlice({
    name: "Menu",
    initialState,
    reducers: {
        toggleIsClicked(state) {
            state.isClickedMenu = !state.isClickedMenu
        },
        setSelectedMenu(state, action: PayloadAction<string>) {
            state.selectedMenu = action.payload
        }
    }
})

export const { toggleIsClicked, setSelectedMenu } = Menu.actions
export default Menu.reducer

