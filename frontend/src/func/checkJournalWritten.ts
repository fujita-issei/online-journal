import type { DailyJournalInitState } from "../constant/dailyJournalInitState";
import dailyJournalInitState from "../constant/dailyJournalInitState";

// 書かれてない判定なら、trueを返す
const checkJournalWritten = (data: DailyJournalInitState) => {
    const ignoreProperty = ["targetDate", "journalLastEditTime", "createdAt", "updatedAt", "isWritten"]
    return Object.keys(dailyJournalInitState)
        .filter((key) => !ignoreProperty.includes(key)) // 無視するキーを取り除く
        .every((key) => {
            // TypeScriptの型エラーを防ぐための型アサーション
            const k = key as keyof DailyJournalInitState;
            // 配列なども中身で比較できるように JSON.stringify を使う
            return JSON.stringify(dailyJournalInitState[k]) === JSON.stringify(data[k]);
        });
}

export default checkJournalWritten