import { describe, it, expect } from 'vitest'
import request from 'supertest'
import app from './app.js'

describe("App (統合) のテスト", () => {
    it("存在しないルートにアクセスした時、404エラーが返る", async () => {
        const res = await request(app).get("/not-found-route")
        expect(res.status).toBe(404)
    })

    it("CORSヘッダーが正しく設定されている", async () => {
        const res = await request(app).options("/dailyJournal/getTodayJournal")
        expect(res.headers['access-control-allow-origin']).toBeDefined()
    })
})