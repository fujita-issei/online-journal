import { format } from "date-fns";
import type { DailyJournalInitState } from "../constant/dailyJournalInitState"
import calcDays from "./calcDays"
import checkJournalWritten from "./checkJournalWritten";

interface YestardaySleepData {
    goBedHour: number;
    goBedMin: number;
}

const calcSummaryState = (data: DailyJournalInitState[], yestardaySleepData: YestardaySleepData[], endDate: string, numberOfDays: number) => {
    // DBに保存してあっても、dailyJournalの初期値と全く一致しているものは、書いたと見なさない
    // よって、日付以外を全て初期値と比較して、全て一致しているものは取り除く
    const filteredData: DailyJournalInitState[] = data.filter((_data) => {
        return !checkJournalWritten(_data)
    })
    const dataLength = filteredData.length
    const summaryData: number[] = []
            // データが取れてきたかで処理を分ける
            if (dataLength > 0) {
                let sumSleepCount = 0 // sumSleepのところ、何で割るかをここで定義
                const sumData: number[] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
                for(let i = 0; i < dataLength; i++) {
                    // 起きた時間合計 (分単位)
                    sumData[0] = sumData[0] + (60 * filteredData[i].getUpHour) + filteredData[i].getUpMin
                    // 寝た時間合計 (分単位)
                    // 時間が12以下なら、+24する。
                    if (filteredData[i].goBedHour < 12) {
                        sumData[1] = sumData[1] + (60 * (filteredData[i].goBedHour + 24)) + filteredData[i].goBedMin
                    } else {
                        sumData[1] = sumData[1] + (60 * filteredData[i].goBedHour) + filteredData[i].goBedMin
                    }
                    // 睡眠時間合計を計算 (分単位)
                    // i = 0のときの日付がyestardaySleepDataをとった日の次の日かどうかを確認する
                    // そうなら、filteredData[i]と、yestardaySleepDataを比べる
                    // i > 0ならi日のデータとi-1日のデータが次の日と前の日の関係かどうかを比べる
                    // そうなら、filteredData[i]とdata[i-1]を比べる
                    let sumSleep = 0
                    if (i == 0 && yestardaySleepData.length == 1) {
                        const yestardayDate = calcDays(endDate, numberOfDays - 1, "-")
                        const i0Date = format(filteredData[i].targetDate, "yyyy-MM-dd")
                        if (yestardayDate == i0Date) {
                            sumSleepCount = sumSleepCount + 1
                            let prevGoBedHour = yestardaySleepData[0].goBedHour
                            if (prevGoBedHour < 12) {
                                prevGoBedHour += 24
                            }
                            const newGoBedHour = prevGoBedHour - 24
                            if (filteredData[i].getUpMin >= yestardaySleepData[0].goBedMin) {
                                sumSleep = sumSleep + ((filteredData[i].getUpHour - newGoBedHour) * 60) + (filteredData[i].getUpMin - yestardaySleepData[0].goBedMin)
                            } else {
                                sumSleep = sumSleep + ((filteredData[i].getUpHour - newGoBedHour - 1) * 60) + (filteredData[i].getUpMin + 60 - yestardaySleepData[0].goBedMin)
                            }
                        }
                    } else if (i > 0) {
                        const iDate = calcDays(format(filteredData[i].targetDate, "yyyy-MM-dd"), 1, "-")
                        const iMinus1Date = format(filteredData[i - 1].targetDate, "yyyy-MM-dd")
                        if (iDate == iMinus1Date) {
                            sumSleepCount = sumSleepCount + 1
                            let prevGoBedHour = filteredData[i - 1].goBedHour
                            if (prevGoBedHour < 12) {
                                prevGoBedHour += 24
                            }
                            const newGoBedHour = prevGoBedHour - 24
                            if (filteredData[i].getUpMin >= filteredData[i-1].goBedMin) {
                                sumSleep = sumSleep + ((filteredData[i].getUpHour - newGoBedHour) * 60) + (filteredData[i].getUpMin - filteredData[i-1].goBedMin)
                            } else {
                                sumSleep = sumSleep + ((filteredData[i].getUpHour - newGoBedHour - 1) * 60) + (filteredData[i].getUpMin + 60 - filteredData[i-1].goBedMin)
                            }
                        }
                    }
                    sumData[2] = sumData[2] + sumSleep
                    // やることやった時間 (分単位)
                    let checkedNum = 0
                    filteredData[i].toDoTimeCheck.forEach((item: boolean) => {
                        if (item) {
                            checkedNum = checkedNum + 30
                        }
                    })
                    sumData[3] = sumData[3] + checkedNum
                    // 達成したroutineの数
                    let clearRoutineNum = 0
                    filteredData[i].routineCheck.forEach((item: boolean) => {
                        if (item) {
                            clearRoutineNum = clearRoutineNum + 1
                        }
                    })
                    sumData[4] = sumData[4] + clearRoutineNum
                    // 設定した全てのroutineの数
                    sumData[5] = sumData[5] + filteredData[i].routine.length
                    // 達成したtoDoの数
                    let clearToDoNum = 0
                    filteredData[i].toDoListCheck.forEach((item: boolean) => {
                        if (item) {
                            clearToDoNum = clearToDoNum + 1
                        }
                    })
                    sumData[6] = sumData[6] + clearToDoNum
                    // 設定した全てのtoDoの数
                    sumData[7] = sumData[7] + filteredData[i].toDoList.length
                    // やらなかったNGの数
                    let clearNGNum = 0
                    filteredData[i].addListCheck.forEach((item: boolean) => {
                        if (item) {
                            clearNGNum = clearNGNum + 1
                        }
                    })
                    filteredData[i].importListCheck.forEach((item: boolean) => {
                        if (item) {
                            clearNGNum = clearNGNum + 1
                        }
                    })
                    sumData[8] = sumData[8] + clearNGNum
                    // 設定した全てのNGの数
                    sumData[9] = sumData[9] + filteredData[i].importListCheck.length + filteredData[i].addListCheck.length
                    // 書いたジャーナルの合計文字数
                    let countJournal = 0
                    filteredData[i].journalCount.forEach((item: number) => {
                        countJournal = countJournal + item
                    })
                    sumData[10] = sumData[10] + countJournal
                    // 投資に使ったお金の合計
                    sumData[11] = sumData[11] + filteredData[i].moneyInvestment
                    // 浪費に使ったお金の合計
                    sumData[12] = sumData[12] + filteredData[i].moneyWaste
                    // 消費に使ったお金の合計
                    sumData[13] = sumData[13] + filteredData[i].moneyConsumption
                    // 合計金額
                    sumData[14] = sumData[14] + filteredData[i].moneyInvestment + filteredData[i].moneyWaste + filteredData[i].moneyConsumption
                }
                // summary stateに更新するための配列を作る
                sumData.forEach((data, i) => {
                    // i = 0, 1 : 分単位で計算したものを更新。データの長さで割る
                    // i = 2 : 分単位で計算したsumSleepを更新。sumSleepCountが0だったら、[0, 0]を返す
                    // i = 3 : 分単位で計算したものを更新して、そのまま挿入
                    // それ以外 : sumDataの各プロパティをそのまま挿入
                    if (i == 0 || i == 1) {
                        const avgMin = Math.trunc(data / dataLength)
                        summaryData.push(Math.trunc(avgMin / 60))
                        summaryData.push(Math.trunc(avgMin - (Math.trunc(avgMin / 60) * 60)))
                    } else if (i == 2) {
                        if (sumSleepCount > 0) {
                            const avgMin = Math.trunc(data / sumSleepCount)
                            summaryData.push(Math.trunc(avgMin / 60))
                            summaryData.push(Math.trunc(avgMin - (Math.trunc(avgMin / 60) * 60)))
                        } else {
                            summaryData.push(0, 0)
                        }
                    } else if (i == 3) {
                        summaryData.push(Math.trunc(data / 60))
                        summaryData.push(Math.trunc(data - (Math.trunc(data / 60) * 60)))
                    } else {
                        summaryData.push(data)
                    }
                })
                return summaryData
            } else {
                return summaryData
            }
}

export default calcSummaryState
