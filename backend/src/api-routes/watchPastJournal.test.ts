import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import express from 'express';
import watchPastJournalRoutes from './watchPastJournal.js'

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
app.use('/watchPastJournal', watchPastJournalRoutes)

describe("watchPastJournalのテスト", () => {

    beforeEach(() => {
        vi.clearAllMocks();
    })

    describe("GET getDailyJournalのテスト", () => {
        it("正常: 正しいパラメータを送る => 意図したデータが返ってくる", async () => {
            const mockDbData = Array.from({ length: 7 }).map((_, i) => ({
                user_id: "testUser",
                target_date: `2026-03-0${i + 1}`,
                get_up_hour: 23
            }))
            mockQuery.mockResolvedValue([mockDbData])
            const res = await request(app).get("/watchPastJournal/getDailyJournal").query({
                userId: "testUser",
                upOrDown: "降順",
                date: "",
                month: "3",
                year: "2026"
            })
            // resを検証する
            expect(res.status).toBe(200)
            expect(res.body).toEqual(Array.from({ length: 7 }).map((_, i) => ({
                userId: "testUser",
                targetDate: `2026-03-0${i + 1}`,
                getUpHour: 23
            })))
            expect(mockQuery).toHaveBeenCalledWith(
                expect.stringContaining("select * from dailyJournal"),
                ["testUser", 2026, 3]
            )
        })
            
        it("異常: パラメータが不足していたら、400エラーを返す", async () => {
            const res = await request(app).get("/watchPastJournal/getDailyJournal").query({
            })
            // 異常を検証する
            expect(res.status).toBe(400)
            expect(res.body).toEqual({message: "userId is required" })
            })
        
        it("異常: DBエラー => 500エラー返す", async () => {
            mockQuery.mockRejectedValue(new Error("DB error"))
            const res = await request(app).get("/watchPastJournal/getDailyJournal").query({
                userId: "testUser",
            })
            expect(res.status).toBe(500)
            expect(res.body).toEqual({ error: "server error. cant get daily past journal" })
        })
    })

    describe("GET getWeekJournalのテスト", () => {
        it("正常: 正しいパラメータを送る => 意図したデータが返ってくる", async () => {
            const mockDbData = Array.from({ length: 7 }).map((_, i) => ({
                user_id: "testUser",
                start_date: `2026-03-0${i + 1}`,
                end_date: `2026-03-0${i + 2}`,
                to_do: []
            }))
            mockQuery.mockResolvedValue([mockDbData])
            const res = await request(app).get("/watchPastJournal/getWeekJournal").query({
                userId: "testUser",
                upOrDown: "降順",
                date: "",
                month: "3",
                year: "2026"
            })
            // resを検証する
            expect(res.status).toBe(200)
            expect(res.body).toEqual(Array.from({ length: 7 }).map((_, i) => ({
                userId: "testUser",
                startDate: `2026-03-0${i + 1}`,
                endDate: `2026-03-0${i + 2}`,
                toDo: []
            })))
            expect(mockQuery).toHaveBeenCalledWith(
                expect.stringContaining("select * from weekJournal"),
                ["testUser", 2026, 2026, 3, 3]
            )
        })
            
        it("異常: パラメータが不足していたら、400エラーを返す", async () => {
            const res = await request(app).get("/watchPastJournal/getWeekJournal").query({
            })
            // 異常を検証する
            expect(res.status).toBe(400)
            expect(res.body).toEqual({message: "userId is required" })
            })
        
        it("異常: DBエラー => 500エラー返す", async () => {
            mockQuery.mockRejectedValue(new Error("DB error"))
            const res = await request(app).get("/watchPastJournal/getWeekJournal").query({
                userId: "testUser",
            })
            expect(res.status).toBe(500)
            expect(res.body).toEqual({ error: "server error. cant get week past journal" })
        })
    })

    describe("GET getMonthJournalのテスト", () => {
        it("正常: 正しいパラメータを送る => 意図したデータが返ってくる", async () => {
            const mockDbData = Array.from({ length: 7 }).map((_, i) => ({
                user_id: "testUser",
                target_date: `2026-0${i + 1}-01`,
                to_do: []
            }))
            mockQuery.mockResolvedValue([mockDbData])
            const res = await request(app).get("/watchPastJournal/getMonthJournal").query({
                userId: "testUser",
                upOrDown: "降順",
                month: "",
                year: "2026"
            })
            // resを検証する
            expect(res.status).toBe(200)
            expect(res.body).toEqual(Array.from({ length: 7 }).map((_, i) => ({
                userId: "testUser",
                targetDate: `2026-0${i + 1}-01`,
                toDo: []
            })))
            expect(mockQuery).toHaveBeenCalledWith(
                expect.stringContaining("select * from monthJournal"),
                ["testUser", 2026]
            )
        })
            
        it("異常: パラメータが不足していたら、400エラーを返す", async () => {
            const res = await request(app).get("/watchPastJournal/getMonthJournal").query({
            })
            // 異常を検証する
            expect(res.status).toBe(400)
            expect(res.body).toEqual({message: "userId is required" })
            })
        
        it("異常: DBエラー => 500エラー返す", async () => {
            mockQuery.mockRejectedValue(new Error("DB error"))
            const res = await request(app).get("/watchPastJournal/getMonthJournal").query({
                userId: "testUser",
            })
            expect(res.status).toBe(500)
            expect(res.body).toEqual({ error: "server error. cant get month past journal" })
        })
    })

    describe("GET getYearJournalのテスト", () => {
        it("正常: 正しいパラメータを送る => 意図したデータが返ってくる", async () => {
            const mockDbData = Array.from({ length: 7 }).map((_, i) => ({
                user_id: "testUser",
                target_date: `202${i + 1}-01-01`,
                to_do: []
            }))
            mockQuery.mockResolvedValue([mockDbData])
            const res = await request(app).get("/watchPastJournal/getYearJournal").query({
                userId: "testUser",
                upOrDown: "降順",
                year: ""
            })
            // resを検証する
            expect(res.status).toBe(200)
            expect(res.body).toEqual(Array.from({ length: 7 }).map((_, i) => ({
                userId: "testUser",
                targetDate: `202${i + 1}-01-01`,
                toDo: []
            })))
            expect(mockQuery).toHaveBeenCalledWith(
                expect.stringContaining("select * from yearJournal"),
                ["testUser"]
            )
        })
            
        it("異常: パラメータが不足していたら、400エラーを返す", async () => {
            const res = await request(app).get("/watchPastJournal/getYearJournal").query({
            })
            // 異常を検証する
            expect(res.status).toBe(400)
            expect(res.body).toEqual({message: "userId is required" })
            })
        
        it("異常: DBエラー => 500エラー返す", async () => {
            mockQuery.mockRejectedValue(new Error("DB error"))
            const res = await request(app).get("/watchPastJournal/getYearJournal").query({
                userId: "testUser",
            })
            expect(res.status).toBe(500)
            expect(res.body).toEqual({ error: "server error. cant get year past journal" })
        })
    })
})