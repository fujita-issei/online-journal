import weekJournalInitState, { type WeekJournalInitState } from "../constant/weekJournalInitState";

// 書かれてない判定なら、trueを返す
const checkWeekJournalWritten = (data: WeekJournalInitState) => {
    const ignoreProperty = ["startDate", "endDate", "journalLastEditTime", "createdAt", "updatedAt", "isWritten"]
    return Object.keys(weekJournalInitState)
        .filter((key) => !ignoreProperty.includes(key)) // 無視するキーを取り除く
        .every((key) => {
            // TypeScriptの型エラーを防ぐための型アサーション
            const k = key as keyof WeekJournalInitState;
            // 配列なども中身で比較できるように JSON.stringify を使う
            return JSON.stringify(weekJournalInitState[k]) === JSON.stringify(data[k]);
        });
}

export default checkWeekJournalWritten