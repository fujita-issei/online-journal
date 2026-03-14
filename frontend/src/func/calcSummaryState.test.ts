import { describe, it, expect, vi } from 'vitest'
import calcSummaryState from './calcSummaryState'
import type { DailyJournalInitState } from '../constant/dailyJournalInitState'

vi.mock("./checkJournalWritten", () => ({ default: vi.fn(() => false) }))

describe("calcSummaryStateのテスト", () => {

    it("7日分のデータと、その前日の就寝時間がちゃんとあるとき、合計が正しく計算されるか", () => {
        const mockData = Array.from({ length: 7 }).map((_, i) => ({
            targetDate: `2026-03-0${i + 2}T00:00:00.000Z`,
            getUpHour: 7 + Math.trunc(i / 4), 
            getUpMin: i * 10,
            goBedHour: 23 + Math.trunc(i / 4), 
            goBedMin: i * 10,
            toDoTimeCheck: Array(i * 2).fill(true),
            routine: Array(i).fill("A"), 
            routineCheck: Array(i).fill(true),
            toDoList: Array(i * 2).fill("A"), 
            toDoListCheck: Array(i * 2).fill(true), 
            importListCheck: Array(i).fill(true), 
            addListCheck: Array(i).fill(true), 
            journalCount: [100 + i * 100, 200 + i * 200],
            moneyInvestment: 1000 + 100 * i, 
            moneyWaste: 500 + i * 1000, 
            moneyConsumption: 2000 + i * 1000
        })) as unknown as DailyJournalInitState[]
        const mockYestardaySleep = [{ goBedHour: 23, goBedMin: 0 }]
        const result = calcSummaryState(mockData, mockYestardaySleep, "2026-03-08", 7)
        expect(result).toEqual([
            7, 55, 23, 55, 8, 17, 21, 0, 21, 21, 42, 42, 42, 42, 8400, 9100, 24500, 35000, 68600
        ])
    })

    it("日付が飛び飛びで、前日の就寝時間がないとき、合計が正しく計算されるか", () => {
        const days = [2, 4, 5, 7, 8]
        const mockData = Array.from({ length: 5 }).map((_, i) => ({
            targetDate: `2026-03-0${days[i]}T00:00:00.000Z`,
            getUpHour: 7 + Math.trunc(i / 4), 
            getUpMin: i * 10,
            goBedHour: 23 + Math.trunc(i / 4), 
            goBedMin: i * 10,
            toDoTimeCheck: Array(i * 2).fill(true),
            routine: Array(i).fill("A"), 
            routineCheck: Array(i).fill(true),
            toDoList: Array(i * 2).fill("A"), 
            toDoListCheck: Array(i * 2).fill(true), 
            importListCheck: Array(i).fill(true), 
            addListCheck: Array(i).fill(true), 
            journalCount: [100 + i * 100, 200 + i * 200],
            moneyInvestment: 1000 + 100 * i, 
            moneyWaste: 500 + i * 1000, 
            moneyConsumption: 2000 + i * 1000
        })) as unknown as DailyJournalInitState[]
        const mockYestardaySleep: { goBedHour: number; goBedMin: number }[] = []
        const result = calcSummaryState(mockData, mockYestardaySleep, "2026-03-08", 7)
        expect(result).toEqual([
            7, 32, 23, 32, 8, 40, 10, 0, 10, 10, 20, 20, 20, 20, 4500, 6000, 12500, 20000, 38500
        ])
    })
})