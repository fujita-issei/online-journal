import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import express from 'express';
import summaryRoutes from './summary.js'

const mockQuery = vi.fn();
vi.mock('../db.js', () => ({
    default: {
        promise: () => ({
            query: mockQuery
        })
    }
}));

const app = express();
app.use(express.json());
app.use('/summary', summaryRoutes)

describe("summaryのテスト", () => {

    beforeEach(() => {
        vi.clearAllMocks();
    })

    describe("GET getCurrentJournalStreakのテスト", () => {
        it("正常: 正しいパラメータ送る => 意図した通りに返ってくる", async () => {
            // DBが返すダミーデータ
            const mockDbData = Array.from({ length: 7 }).map((_, i) => ({
                target_date: `2026-03-0${i + 1}`,
            }))
            mockQuery.mockResolvedValue([mockDbData])
            // 仮想リクエストを送信
            const res = await request(app).get("/summary/getCurrentJournalStreak").query({
                userId: "testUser",
                targetDate: "2026-03-07"
            })
            // resを検証する
            expect(res.status).toBe(200)
            expect(res.body).toEqual(Array.from({ length: 7 }).map((_, i) => ({
                targetDate: `2026-03-0${i + 1}`,
            })))
            expect(mockQuery).toHaveBeenCalledWith(
                expect.stringContaining("select target_date from dailyJournal"),
                ["testUser", "2026-03-07"]
            )
        })
        
        it("異常: パラメータが不足していたら、400エラーを返す", async () => {
            const res = await request(app).get("/summary/getCurrentJournalStreak").query({
                userId: "testUser"
            })
            // 異常を検証する
            expect(res.status).toBe(400)
            expect(res.body).toEqual({message: "userId and targetDate are required" })
        })
        
        it("異常: DBエラー => 500エラー返す", async () => {
            mockQuery.mockRejectedValue(new Error("DB error"))
            const res = await request(app).get("/summary/getCurrentJournalStreak").query({
                userId: "testUser",
                targetDate: "2026-03-07"
            })
            expect(res.status).toBe(500)
            expect(res.body).toEqual({ error: "server error. cant get current journal streak" })
        })
    })

    describe("GET getSleepDataのテスト", () => {
        it("正常: 正しいパラメータ送る => 意図した通りに返ってくる", async () => {
            // DBが返すダミーデータ
            const mockDbData = Array.from({ length: 7 }).map((_, i) => ({
                target_date: `2026-03-0${i + 1}`,
                get_up_hour: 7,
                get_up_min: 30,
                go_bed_hour: 23,
                go_bed_min: 20
            }))
            mockQuery.mockResolvedValue([mockDbData])
            // 仮想リクエストを送信
            const res = await request(app).get("/summary/getSleepData").query({
                userId: "testUser",
                targetDate: "2026-03-07",
                sleepNumberOfDay: "7"
            })
            // resを検証する
            expect(res.status).toBe(200)
            expect(res.body).toEqual(Array.from({ length: 7 }).map((_, i) => ({
                targetDate: `2026-03-0${i + 1}`,
                getUpHour: 7,
                getUpMin: 30,
                goBedHour: 23,
                goBedMin: 20
            })))
            expect(mockQuery).toHaveBeenCalledWith(
                expect.stringContaining("select target_date, get_up_hour, get_up_min, go_bed_hour, go_bed_min from dailyJournal"),
                ["testUser", "2026-03-07", 7]
            )
        })
        
        it("異常: パラメータが不足していたら、400エラーを返す", async () => {
            const res = await request(app).get("/summary/getSleepData").query({
                userId: "testUser"
            })
            // 異常を検証する
            expect(res.status).toBe(400)
            expect(res.body).toEqual({message: "not enough information" })
        })
        
        it("異常: DBエラー => 500エラー返す", async () => {
            mockQuery.mockRejectedValue(new Error("DB error"))
            const res = await request(app).get("/summary/getSleepData").query({
                userId: "testUser",
                targetDate: "2026-03-07",
                sleepNumberOfDay: "7"
            })
            expect(res.status).toBe(500)
            expect(res.body).toEqual({ error: "server error. cant get sleep data for summary" })
        })
    })

    describe("GET getRoutineDataのテスト", () => {
        it("正常: 正しいパラメータ送る => 意図した通りに返ってくる", async () => {
            // DBが返すダミーデータ
            const mockDbData = Array.from({ length: 7 }).map((_, i) => ({
                target_date: `2026-03-0${i + 1}`,
                routine: [], 
                routine_check: [false]
            }))
            mockQuery.mockResolvedValue([mockDbData])
            // 仮想リクエストを送信
            const res = await request(app).get("/summary/getRoutineData").query({
                userId: "testUser",
                targetDate: "2026-03-07",
                routineNumberOfDay: "7"
            })
            // resを検証する
            expect(res.status).toBe(200)
            expect(res.body).toEqual(Array.from({ length: 7 }).map((_, i) => ({
                targetDate: `2026-03-0${i + 1}`,
                routine: [], 
                routineCheck: [false]
            })))
            expect(mockQuery).toHaveBeenCalledWith(
                expect.stringContaining("select target_date, routine, routine_check from dailyJournal"),
                ["testUser", "2026-03-07", 7]
            )
        })
        
        it("異常: パラメータが不足していたら、400エラーを返す", async () => {
            const res = await request(app).get("/summary/getRoutineData").query({
                userId: "testUser"
            })
            // 異常を検証する
            expect(res.status).toBe(400)
            expect(res.body).toEqual({message: "not enough information" })
        })
        
        it("異常: DBエラー => 500エラー返す", async () => {
            mockQuery.mockRejectedValue(new Error("DB error"))
            const res = await request(app).get("/summary/getRoutineData").query({
                userId: "testUser",
                targetDate: "2026-03-07",
                routineNumberOfDay: "7"
            })
            expect(res.status).toBe(500)
            expect(res.body).toEqual({ error: "server error. cant get routine data for summary" })
        })
    })

    describe("GET getListDataのテスト", () => {
        it("正常: 正しいパラメータ送る => 意図した通りに返ってくる", async () => {
            // DBが返すダミーデータ
            const mockDbData = Array.from({ length: 7 }).map((_, i) => ({
                target_date: `2026-03-0${i + 1}`,
                import_list: [],
                import_list_check: [false],
                add_list: [],
                add_list_check: [false]
            }))
            mockQuery.mockResolvedValue([mockDbData])
            // 仮想リクエストを送信
            const res = await request(app).get("/summary/getListData").query({
                userId: "testUser",
                targetDate: "2026-03-07",
                listNumberOfDay: "7"
            })
            // resを検証する
            expect(res.status).toBe(200)
            expect(res.body).toEqual(Array.from({ length: 7 }).map((_, i) => ({
                targetDate: `2026-03-0${i + 1}`,
                importList: [],
                importListCheck: [false],
                addList: [],
                addListCheck: [false]
            })))
            expect(mockQuery).toHaveBeenCalledWith(
                expect.stringContaining("select target_date, import_list, import_list_check, add_list, add_list_check from dailyJournal"),
                ["testUser", "2026-03-07", 7]
            )
        })
        
        it("異常: パラメータが不足していたら、400エラーを返す", async () => {
            const res = await request(app).get("/summary/getListData").query({
                userId: "testUser"
            })
            // 異常を検証する
            expect(res.status).toBe(400)
            expect(res.body).toEqual({message: "not enough information" })
        })
        
        it("異常: DBエラー => 500エラー返す", async () => {
            mockQuery.mockRejectedValue(new Error("DB error"))
            const res = await request(app).get("/summary/getListData").query({
                userId: "testUser",
                targetDate: "2026-03-07",
                listNumberOfDay: "7"
            })
            expect(res.status).toBe(500)
            expect(res.body).toEqual({ error: "server error. cant get list data for summary" })
        })
    })

    describe("GET getToDoDataのテスト", () => {
        it("正常: 正しいパラメータ送る => 意図した通りに返ってくる", async () => {
            // DBが返すダミーデータ
            const mockDbData = Array.from({ length: 7 }).map((_, i) => ({
                target_date: `2026-03-0${i + 1}`,
                to_do_time_hour: 3,
                to_do_time_min: 0,
                to_do_time_check: [true, true, false, false]
            }))
            mockQuery.mockResolvedValue([mockDbData])
            // 仮想リクエストを送信
            const res = await request(app).get("/summary/getToDoData").query({
                userId: "testUser",
                targetDate: "2026-03-07",
                toDoNumberOfDay: "7"
            })
            // resを検証する
            expect(res.status).toBe(200)
            expect(res.body).toEqual(Array.from({ length: 7 }).map((_, i) => ({
                targetDate: `2026-03-0${i + 1}`,
                toDoTimeHour: 3,
                toDoTimeMin: 0,
                toDoTimeCheck: [true, true, false, false]
            })))
            expect(mockQuery).toHaveBeenCalledWith(
                expect.stringContaining("select target_date, to_do_time_hour, to_do_time_min, to_do_time_check, to_do_list_check from dailyJournal"),
                ["testUser", "2026-03-07", 7]
            )
        })
        
        it("異常: パラメータが不足していたら、400エラーを返す", async () => {
            const res = await request(app).get("/summary/getToDoData").query({
                userId: "testUser"
            })
            // 異常を検証する
            expect(res.status).toBe(400)
            expect(res.body).toEqual({message: "not enough information" })
        })
        
        it("異常: DBエラー => 500エラー返す", async () => {
            mockQuery.mockRejectedValue(new Error("DB error"))
            const res = await request(app).get("/summary/getToDoData").query({
                userId: "testUser",
                targetDate: "2026-03-07",
                toDoNumberOfDay: "7"
            })
            expect(res.status).toBe(500)
            expect(res.body).toEqual({ error: "server error. cant get toDo data for summary" })
        })
    })

    describe("GET getJournalDataのテスト", () => {
        it("正常: 正しいパラメータ送る => 意図した通りに返ってくる", async () => {
            // DBが返すダミーデータ
            const mockDbData = Array.from({ length: 7 }).map((_, i) => ({
                target_date: `2026-03-0${i + 1}`,
                journal_count: 100
            }))
            mockQuery.mockResolvedValue([mockDbData])
            // 仮想リクエストを送信
            const res = await request(app).get("/summary/getJournalData").query({
                userId: "testUser",
                targetDate: "2026-03-07",
                journalNumberOfDay: "7"
            })
            // resを検証する
            expect(res.status).toBe(200)
            expect(res.body).toEqual(Array.from({ length: 7 }).map((_, i) => ({
                targetDate: `2026-03-0${i + 1}`,
                journalCount: 100
            })))
            expect(mockQuery).toHaveBeenCalledWith(
                expect.stringContaining("select target_date, journal_count from dailyJournal"),
                ["testUser", "2026-03-07", 7]
            )
        })
        
        it("異常: パラメータが不足していたら、400エラーを返す", async () => {
            const res = await request(app).get("/summary/getJournalData").query({
                userId: "testUser"
            })
            // 異常を検証する
            expect(res.status).toBe(400)
            expect(res.body).toEqual({message: "not enough information" })
        })
        
        it("異常: DBエラー => 500エラー返す", async () => {
            mockQuery.mockRejectedValue(new Error("DB error"))
            const res = await request(app).get("/summary/getJournalData").query({
                userId: "testUser",
                targetDate: "2026-03-07",
                journalNumberOfDay: "7"
            })
            expect(res.status).toBe(500)
            expect(res.body).toEqual({ error: "server error. cant get journal data for summary" })
        })
    })

    describe("GET getMoneyDataのテスト", () => {
        it("正常: 正しいパラメータ送る => 意図した通りに返ってくる", async () => {
            // DBが返すダミーデータ
            const mockDbData = Array.from({ length: 7 }).map((_, i) => ({
                target_date: `2026-03-0${i + 1}`,
                money_investment: 1000,
                money_waste: 2000,
                money_consumption: 3000,
                money_use_sum: 6000
            }))
            mockQuery.mockResolvedValue([mockDbData])
            // 仮想リクエストを送信
            const res = await request(app).get("/summary/getMoneyData").query({
                userId: "testUser",
                targetDate: "2026-03-07",
                moneyNumberOfDay: "7"
            })
            // resを検証する
            expect(res.status).toBe(200)
            expect(res.body).toEqual(Array.from({ length: 7 }).map((_, i) => ({
                targetDate: `2026-03-0${i + 1}`,
                moneyInvestment: 1000,
                moneyWaste: 2000,
                moneyConsumption: 3000,
                moneyUseSum: 6000
            })))
            expect(mockQuery).toHaveBeenCalledWith(
                expect.stringContaining("select target_date, money_investment, money_waste, money_consumption, money_use_sum from dailyJournal"),
                ["testUser", "2026-03-07", 7]
            )
        })
        
        it("異常: パラメータが不足していたら、400エラーを返す", async () => {
            const res = await request(app).get("/summary/getMoneyData").query({
                userId: "testUser"
            })
            // 異常を検証する
            expect(res.status).toBe(400)
            expect(res.body).toEqual({message: "not enough information" })
        })
        
        it("異常: DBエラー => 500エラー返す", async () => {
            mockQuery.mockRejectedValue(new Error("DB error"))
            const res = await request(app).get("/summary/getMoneyData").query({
                userId: "testUser",
                targetDate: "2026-03-07",
                moneyNumberOfDay: "7"
            })
            expect(res.status).toBe(500)
            expect(res.body).toEqual({ error: "server error. cant get money data for summary" })
        })
    })

})