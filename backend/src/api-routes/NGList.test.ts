import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import express from 'express';
import NGListRoutes from './NGList.js'

const mockQuery = vi.fn();
vi.mock('../db.js', () => ({
    default: {
        promise: () => ({
            query: mockQuery
        })
    }
}))

const app = express()
app.use(express.json())
app.use('/NGList', NGListRoutes)

describe("NGListのテスト", () => {

    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe("GET /getのテスト", () => {
        it("正常: 正しいパラメータ送る => 意図した通りに返ってくる", async () => {
            // DBが返すダミーデータ
            const mockDbData = [
                { user_id: "testUser", list_id: "r1", list_name: "サンプル1" }
            ]
            mockQuery.mockResolvedValue([mockDbData])
            // 仮想リクエストを送信
            const res = await request(app).get("/NGList/get").query({
                userId: "testUser",
            })
            // resを検証する
            expect(res.status).toBe(200)
            expect(res.body).toEqual([
                { userId: "testUser", listId: "r1", listName: "サンプル1" }
            ])
            expect(mockQuery).toHaveBeenCalledWith(
                expect.stringContaining("select * from NGList"),
                ["testUser"]
            )
        })

        it("異常: パラメータが不足していたら、400エラーを返す", async () => {
            const res = await request(app).get("/NGList/get").query({})
            // 異常を検証する
            expect(res.status).toBe(400)
            expect(res.body).toEqual({message: "userId is required"})
        })

        it("異常: DBエラー => 500エラー返す", async () => {
            mockQuery.mockRejectedValue(new Error("DB error"))
            const res = await request(app).get("/NGList/get").query({
                userId: "testUser",
            })
            expect(res.status).toBe(500)
            expect(res.body).toEqual({ error: "server error. cant get NGList" })
        })
    })

    describe("POST saveのテスト", () => {
        it("正常: 正しいデータ送られる => DBにinsert or update => 200返す", async () => {
            mockQuery.mockResolvedValue([{ insertId: 1 }])
            const payload = {
                listId: "r1",
                userId: "testUser",
                listName: "サンプル1",
                list: ["掃除","勉強"],
            }
            const res = await request(app).post('/NGList/save').send(payload)
            // resを検証
            expect(res.status).toBe(200)
            expect(res.body).toEqual({ message: "saved success" })
            // SQLとJSON.stringifyのパラメータが正しく渡されたか確認
            expect(mockQuery).toHaveBeenCalled()
            const calledArgs = mockQuery.mock.calls[0]![1]
            expect(calledArgs[0]).toBe("r1")
            expect(calledArgs[3]).toBe(`["掃除","勉強"]`)
        })
    
        it("異常: 必須パラメータがない => 400を返す", async () => {
            const res = await request(app).post('/NGList/save').send({
                userId: "testUser",
            })
            expect(res.status).toBe(400);
        })
    
        it("異常: DBエラー => 500エラー返す", async () => {
            mockQuery.mockRejectedValue(new Error("DB error"))
            const res = await request(app).post('/NGList/save').send({
                userId: "testUser",
                listId: "r1"
            })
            expect(res.status).toBe(500)
            expect(res.body).toEqual({ error: "server error. cant save NGList" })
        })
    })

    describe("DELETE deleteのテスト", () => {
        it("正常: 正しいデータ送られる => 意図したデータを消す => 200レスポンス", async () => {
            mockQuery.mockResolvedValue([{ deleteId: 1 }])
            const res = await request(app).delete("/NGList/delete").query({
                listId: "r1"
            })
            expect(res.status).toBe(200)
            expect(res.body).toEqual({ message: "Deleted success"})
            expect(mockQuery).toHaveBeenCalledWith(
                expect.stringContaining("delete from NGList"),
                ["r1"]
            )
        })

        it("異常: 必須パラメータがない => 400を返す", async () => {
            const res = await request(app).delete('/NGList/delete').query({
            })
            expect(res.status).toBe(400);
        })
        
        it("異常: DBエラー => 500エラー返す", async () => {
            mockQuery.mockRejectedValue(new Error("DB error"))
            const res = await request(app).delete('/NGList/delete').query({
                listId: "r1"
            })
            expect(res.status).toBe(500)
            expect(res.body).toEqual({ error: "server error. cant delete NGList" })
        })
    })

})