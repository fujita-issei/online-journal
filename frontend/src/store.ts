import { configureStore, combineReducers } from "@reduxjs/toolkit"

import menuReducer from "./store/Menu"
import dailyJournalReducer from "./store/dailyJournal"
import routineReducer from "./store/routine"
import ngListReducer from "./store/NGList"
import weekJournalReducer from "./store/weekJournal"
import monthJournalReducer from "./store/monthJournal"
import yearJournalReducer from "./store/yearJournal"
import colorReducer from "./store/color"
import loginReducer from "./store/login"
import watchPastJournalReducer from "./store/watchPastJournal"
import summaryReducer from "./store/summary"

const PERSIST_TARGETS = ["dailyJournal", "routine", "NGList", "color", "login", "weekJournal", "monthJournal", "yearJournal", "watchPastJournal", "summary"];

// 1. Reducerを合体
const rootReducer = combineReducers({
    Menu: menuReducer,
    dailyJournal: dailyJournalReducer,
    routine: routineReducer,
    NGList: ngListReducer,
    weekJournal: weekJournalReducer,
    monthJournal: monthJournalReducer,
    yearJournal: yearJournalReducer,
    color: colorReducer,
    login: loginReducer,
    watchPastJournal: watchPastJournalReducer,
    summary: summaryReducer
});

// 2. RootState型を定義
export type RootState = ReturnType<typeof rootReducer>;

// 3. 読み込み関数（anyを使わずPartial<RootState>を使用）
const loadState = (): Partial<RootState> | undefined => {
    try {
        const serializedState = localStorage.getItem("appState");
        if (serializedState === null) {
            return undefined;
        }
        return JSON.parse(serializedState) as Partial<RootState>;
    } catch (err) {
        console.error("State load error:", err);
        return undefined;
    }
}

const saveState = (state: RootState) => {
    try {
        const stateToSave: Partial<RootState> = {};
        
        PERSIST_TARGETS.forEach((key) => {
            const k = key as keyof RootState;
            if (state[k]) {
                // ▼ ここを修正
                // stateToSave を「なんでも入る箱 (Record<string, unknown>)」として扱うことで
                // TypeScriptの厳密なチェックを安全に回避します。
                (stateToSave as Record<string, unknown>)[k] = state[k];
            }
        });

        const serializedState = JSON.stringify(stateToSave);
        localStorage.setItem("appState", serializedState);
    } catch (err) {
        console.error("State save error:", err);
    }
}

export const store = configureStore({
    reducer: rootReducer, // 合体させたReducerを渡す
    preloadedState: loadState(), // 型が合うのでエラーにならない
})

store.subscribe(() => {
    saveState(store.getState());
});

export type AppDispatch = typeof store.dispatch