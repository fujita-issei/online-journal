import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import express from 'express';
import dailyJournalRoutes from './dailyJournal.js'

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
app.use('/dailyJournal', dailyJournalRoutes)

describe("dailyJournalのテスト", () => {

    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe("GET /getTodayJournalのテスト", () => {
        it("正常: 正しいパラメータ送る => 意図した通りに返ってくる", async () => {
            // DBが返すダミーデータ
            const mockDbData = [
                { user_id: "testUser", target_date: "2026-03-08", get_up_hour: 7 }
            ]
            mockQuery.mockResolvedValue([mockDbData])
            // 仮想リクエストを送信
            const res = await request(app).get("/dailyJournal/getTodayJournal").query({
                userId: "testUser",
                targetDate: "2026-03-08"
            })
            // resを検証する
            expect(res.status).toBe(200)
            expect(res.body).toEqual([
                { userId: "testUser", targetDate: "2026-03-08", getUpHour: 7 }
            ])
            expect(mockQuery).toHaveBeenCalledWith(
                expect.stringContaining("select * from dailyJournal"),
                ["testUser", "2026-03-08"]
            )
        })

        it("異常: パラメータが不足していたら、400エラーを返す", async () => {
            const res = await request(app).get('/dailyJournal/getTodayJournal').query({
                userId: "testUser"
            })
            // 異常を検証する
            expect(res.status).toBe(400)
            expect(res.body).toEqual({message: "userId and targetDate are required"})
        })

        it("異常: DBエラー => 500エラー返す", async () => {
            mockQuery.mockRejectedValue(new Error("DB error"))
            const res = await request(app).get('/dailyJournal/getTodayJournal').query({
                userId: "testUser",
                targetDate: "2026-03-08"
            })
            expect(res.status).toBe(500)
            expect(res.body).toEqual({ error: "server error. cant get today journal" })
        })
    })

    describe("POST saveTodayJournalのテスト", () => {
        it("正常: 正しいデータ送られる => DBにinsert or update => 200返す", async () => {
            mockQuery.mockResolvedValue([{ insertId: 1 }])
            const payload = {
                userId: "testUser",
                targetDate: "2026-03-08",
                getUpHour: 7,
                getUpMin: 0,
                goBedHour: 23,
                goBedMin: 0,
                routine: ["読書"],
                routineCheck: [true],
                toDoTimeHour: 2,
                toDoTimeMin: 0,
                startToDoHour: 10,
                startToDoMin: 0,
                endToDoHour: 12,
                endToDoMin: 0,
                toDoTimeCheck: [true, false],
                toDoList: ["勉強"],
                toDoListCheck: [false],
                toDoListImportant: [true],
                importList: [],
                importListCheck: [],
                addList: [],
                addListCheck: [],
                journal: ["日記です"],
                journalCount: [5],
                journalLastEditTime: ["12:00"],
                moneyInvestment: 1000,
                moneyWaste: 0,
                moneyConsumption: 500,
                moneyUseSum: 1500,
                isWritten: true
            }
            const res = await request(app).post('/dailyJournal/saveTodayJournal').send(payload)
            // resを検証
            expect(res.status).toBe(200)
            expect(res.body).toEqual({ message: "Saved success"})
            // SQLとJSON.stringifyのパラメータが正しく渡されたか確認
            expect(mockQuery).toHaveBeenCalled()
            const calledArgs = mockQuery.mock.calls[0]![1]
            expect(calledArgs[0]).toBe("testUser")
            expect(calledArgs[6]).toBe(`["読書"]`)
        })

        it("異常: 必須パラメータがない => 400を返す", async () => {
            const res = await request(app).post('/dailyJournal/saveTodayJournal').send({
                userId: "testUser"
            });
            expect(res.status).toBe(400);
        })

        it("異常: DBエラー => 500エラー返す", async () => {
            mockQuery.mockRejectedValue(new Error("DB error"))
            const res = await request(app).post('/dailyJournal/saveTodayJournal').send({
                userId: "testUser",
                targetDate: "2026-03-08"
            })
            expect(res.status).toBe(500)
            expect(res.body).toEqual({ error: "server error. cant save today journal" })
        })
    })

    describe("DELETE deleteTodayJournalのテスト", () => {
        it("正常: 正しいデータ送られる => 意図したデータを消す => 200レスポンス", async () => {
            mockQuery.mockResolvedValue([{ deleteId: 1 }])
            const res = await request(app).delete("/dailyJournal/deleteTodayJournal").query({
                userId: "testUser",
                targetDate: "2026-03-08"
            })
            expect(res.status).toBe(200)
            expect(res.body).toEqual({ message: "Deleted success"})
            expect(mockQuery).toHaveBeenCalledWith(
                expect.stringContaining("delete from dailyJournal"),
                ["testUser", "2026-03-08"]
            )
        })

        it("異常: 必須パラメータがない => 400を返す", async () => {
            const res = await request(app).delete('/dailyJournal/deleteTodayJournal').query({
                userId: "testUser"
            });
            expect(res.status).toBe(400);
        })

        it("異常: DBエラー => 500エラー返す", async () => {
            mockQuery.mockRejectedValue(new Error("DB error"))
            const res = await request(app).delete('/dailyJournal/deleteTodayJournal').query({
                userId: "testUser",
                targetDate: "2026-03-08"
            })
            expect(res.status).toBe(500)
            expect(res.body).toEqual({ error: "server error. cant delete today journal" })
        })
    })
    
    describe("GET getYestardaySleepTimeのテスト", () => {
        it("正常: 正しいデータが送られる => 意図したデータをとる => 200レスポンス", async () => {
            const mockDbData = [
                { go_bed_hour: 23, go_bed_min: 30 }
            ]
            mockQuery.mockResolvedValue([mockDbData])
            const res = await request(app).get("/dailyJournal/getYestardaySleepTime").query({
                userId: "testUser",
                targetDate: "2026-03-08"
            })
            // resを検証する
            expect(res.status).toBe(200)
            expect(res.body).toEqual([
                { goBedHour: 23, goBedMin: 30 }
            ])
            expect(mockQuery).toHaveBeenCalledWith(
                expect.stringContaining("select go_bed_hour, go_bed_min from dailyJournal"),
                ["testUser", "2026-03-08"]
            )
        })

        it("異常: 必須パラメータがない => 400を返す", async () => {
            const res = await request(app).get('/dailyJournal/getYestardaySleepTime').query({
                userId: "testUser"
            });
            expect(res.status).toBe(400);
        })

        it("異常: DBエラー => 500エラー返す", async () => {
            mockQuery.mockRejectedValue(new Error("DB error"))
            const res = await request(app).get('/dailyJournal/getYestardaySleepTime').query({
                userId: "testUser",
                targetDate: "2026-03-08"
            })
            expect(res.status).toBe(500)
            expect(res.body).toEqual({ error: "server error. cant get yestarday sleep time" })
        })
    })

    describe("GET getDailyDataForSummaryのテスト", () => {
        it("正常: 正しいデータが送られる => 意図したデータをとる => 200レスポンス", async () => {
            const mockDbData = Array.from({ length: 7 }).map((_, i) => ({
                user_id: "testUser",
                target_date: `2026-03-0${8 - i}`,
                get_up_hour: 23
            }))
            mockQuery.mockResolvedValue([mockDbData])
            const res = await request(app).get("/dailyJournal/getDailyDataForSummary").query({
                userId: "testUser",
                targetDate: "2026-03-08",
                numberOfDays: 7
            })
            // resを検証する
            expect(res.status).toBe(200)
            expect(res.body).toEqual(Array.from({ length: 7 }).map((_, i) => ({
                userId: "testUser",
                targetDate: `2026-03-0${8 - i}`,
                getUpHour: 23
            })))
            expect(mockQuery).toHaveBeenCalledWith(
                expect.stringContaining("AND target_date IN (?, ?, ?, ?, ?, ?, ?)"),
                ["testUser", "2026-03-08", "2026-03-07", "2026-03-06", "2026-03-05", "2026-03-04", "2026-03-03", "2026-03-02"]
            )
        })

        it("異常系: 必須パラメーターが足りない場合は400エラーを返す", async () => {
            const res = await request(app).get('/dailyJournal/getDailyDataForSummary').query({
                userId: "testUser",
                targetDate: "2026-03-08"
            })
            expect(res.status).toBe(400)
            expect(res.body).toEqual({ message: "userId and targetDate and numberOfDays are required" })
        });

        it("異常系: 日付のフォーマットが不正(ハイフン区切りではない)場合は400エラーを返す", async () => {
            const res = await request(app).get('/dailyJournal/getDailyDataForSummary').query({
                userId: "testUser",
                targetDate: "20260308",
                numberOfDays: 3
            })
            expect(res.status).toBe(400)
            expect(res.body).toEqual({ message: "year and month and date are not clear" })
        })

        it("異常系: DBエラーが発生した場合は500エラーを返す", async () => {
            mockQuery.mockRejectedValue(new Error("DB error"))
            const res = await request(app).get('/dailyJournal/getDailyDataForSummary').query({
                userId: "testUser",
                targetDate: "2026-03-08",
                numberOfDays: 3
            })
            expect(res.status).toBe(500)
            expect(res.body).toEqual({ error: "server error. cant get data for summary" })
        })
    })

})