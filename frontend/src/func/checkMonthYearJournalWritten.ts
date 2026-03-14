import type { MonthJournalInitState } from "../constant/monthJournalInitState";
import monthJournalInitState from "../constant/monthJournalInitState";

const checkMonthYearJournalWritten = (data: MonthJournalInitState) => {
    const ignoreProperty = ["targetDate", "journalLastEditTime", "createdAt", "updatedAt", "isWritten"]
    return Object.keys(monthJournalInitState)
        .filter((key) => !ignoreProperty.includes(key)) // 無視するキーを取り除く
        .every((key) => {
            // TypeScriptの型エラーを防ぐための型アサーション
            const k = key as keyof MonthJournalInitState;
            // 配列なども中身で比較できるように JSON.stringify を使う
            return JSON.stringify(monthJournalInitState[k]) === JSON.stringify(data[k]);
        });
}

export default checkMonthYearJournalWritten