import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import express from 'express';
import yearJournalRoutes from './yearJournal.js'

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
app.use('/yearJournal', yearJournalRoutes)

describe("yearJournalのテスト", () => {

    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe("GET /getThisYearのテスト", () => {
        it("正常: 正しいパラメータ送る => 意図した通りに返ってくる", async () => {
            // DBが返すダミーデータ
            const mockDbData = [
                { user_id: "testUser", target_date: "2026-01-01", toDo: [] }
            ]
            mockQuery.mockResolvedValue([mockDbData])
            // 仮想リクエストを送信
            const res = await request(app).get("/yearJournal/getThisYear").query({
                userId: "testUser",
                targetDate: "2026-01-01"
            })
            // resを検証する
            expect(res.status).toBe(200)
            expect(res.body).toEqual([
                { userId: "testUser", targetDate: "2026-01-01", toDo: [] }
            ])
            expect(mockQuery).toHaveBeenCalledWith(
                expect.stringContaining("select * from yearJournal"),
                ["testUser", "2026-01-01"]
            )
        })

        it("異常: パラメータが不足していたら、400エラーを返す", async () => {
            const res = await request(app).get("/yearJournal/getThisYear").query({
                userId: "testUser"
            })
            // 異常を検証する
            expect(res.status).toBe(400)
            expect(res.body).toEqual({message: "userId and targetDate are required" })
        })

        it("異常: DBエラー => 500エラー返す", async () => {
            mockQuery.mockRejectedValue(new Error("DB error"))
            const res = await request(app).get("/yearJournal/getThisYear").query({
                userId: "testUser",
                targetDate: "2026-01-01"
            })
            expect(res.status).toBe(500)
            expect(res.body).toEqual({ error: "server error. cant get this year journal" })
        })
    })

    describe("POST saveThisYearのテスト", () => {
        it("正常: 正しいデータ送られる => DBにinsert or update => 200返す", async () => {
            mockQuery.mockResolvedValue([{ insertId: 1 }])
            const payload = {
                userId: "testUser",
                targetDate: "2026-01-01",
                toDo: ["バックエンドのテスト終わらせる"],
                toDoCheck: [],
                toDoImportant: [],
                journal: [],
                journalCount: [],
                journalLastEditTime: [],
                summary: {
                    getUpHour : 0,
                    getUpMin: 0,
                    goBedHour: 0,
                    goBedMin: 0,
                    sumSleepHour: 0,
                    sumSleepMin: 0,
                    toDoTimeHour: 0,
                    toDoTimeMin: 0,
                    routineDone: 0,
                    routineAll: 0,
                    toDoDone: 0,
                    toDoAll: 0,
                    NGDone: 0,
                    NGAll: 0, 
                    journalAllCount: 0,
                    moneyInvestment: 0,
                    moneyWaste: 0,
                    moneyConsumption: 0,
                    moneyUseSum: 0
                },
                isWritten: true
            }
            const res = await request(app).post('/yearJournal/saveThisYear').send(payload)
            // resを検証
            expect(res.status).toBe(200)
            expect(res.body).toEqual({ message: "year journal Saved Success" })
            // SQLとJSON.stringifyのパラメータが正しく渡されたか確認
            expect(mockQuery).toHaveBeenCalled()
            const calledArgs = mockQuery.mock.calls[0]![1]
            expect(calledArgs[0]).toBe("testUser")
            expect(calledArgs[2]).toBe(`["バックエンドのテスト終わらせる"]`)
        })
    
        it("異常: 必須パラメータがない => 400を返す", async () => {
            const res = await request(app).post('/yearJournal/saveThisYear').send({
                userId: "testUser"
            })
            expect(res.status).toBe(400);
        })
    
        it("異常: DBエラー => 500エラー返す", async () => {
            mockQuery.mockRejectedValue(new Error("DB error"))
            const res = await request(app).post('/yearJournal/saveThisYear').send({
                userId: "testUser",
                targetDate: "2026-01-01",
                isWritten: true
            })
            expect(res.status).toBe(500)
            expect(res.body).toEqual({ error: "server error. cant save this year journal" })
        })
    })

    describe("DELETE deleteYearJournalのテスト", () => {
        it("正常: 正しいデータ送られる => 意図したデータを消す => 200レスポンス", async () => {
            mockQuery.mockResolvedValue([{ deleteId: 1 }])
            const res = await request(app).delete("/yearJournal/deleteYearJournal").query({
                userId: "testUser",
                targetDate: "2026-01-01"
            })
            expect(res.status).toBe(200)
            expect(res.body).toEqual({ message: "Deleted success"})
            expect(mockQuery).toHaveBeenCalledWith(
                expect.stringContaining("delete from yearJournal"),
                ["testUser", "2026-01-01"]
            )
        })

        it("異常: 必須パラメータがない => 400を返す", async () => {
            const res = await request(app).delete('/yearJournal/deleteYearJournal').query({
                userId: "testUser"
            })
            expect(res.status).toBe(400);
        })
        
        it("異常: DBエラー => 500エラー返す", async () => {
            mockQuery.mockRejectedValue(new Error("DB error"))
            const res = await request(app).delete('/yearJournal/deleteYearJournal').query({
                userId: "testUser",
                targetDate: "2026-01-01"
            })
            expect(res.status).toBe(500)
            expect(res.body).toEqual({ error: "server error. cant delete year journal" })
        })
    })

})