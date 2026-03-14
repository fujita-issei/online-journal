import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import express from 'express';
import formRoutes from './form.js'

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
app.use('/form', formRoutes)

describe("formのテスト", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    })

    describe("POST /saveのテスト", () => {
        it("正常: 正しいデータ送られる => DBにinsert or update => 200返す", async () => {
            mockQuery.mockResolvedValue([{ insertId: 1 }])
            const payload = {
                userId: "testUser",
                content: "サンプル1",
                email: "aiueo@gmail.com"
            }
            const res = await request(app).post('/form/save').send(payload)
            // resを検証
            expect(res.status).toBe(200)
            expect(res.body).toEqual({ message: "Saved success" })
            // SQLとJSON.stringifyのパラメータが正しく渡されたか確認
            expect(mockQuery).toHaveBeenCalledWith(
                expect.stringContaining("insert into forms (user_id, content, email) values"),
                ["testUser", "サンプル1", "aiueo@gmail.com"]
            )
        })
            
        it("異常: 必須パラメータがない => 400を返す", async () => {
            const res = await request(app).post('/form/save').send({

            })
            expect(res.status).toBe(400);
        })
            
        it("異常: DBエラー => 500エラー返す", async () => {
            mockQuery.mockRejectedValue(new Error("DB error"))
            const res = await request(app).post('/form/save').send({
                userId: "testUser",
            })
            expect(res.status).toBe(500)
            expect(res.body).toEqual({ error: "server error. cant save form" })
        })
    })
})