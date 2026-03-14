import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import express from 'express';
import authRoutes from './auth.js'

const mockQuery = vi.fn();
vi.mock('../db.js', () => ({
    default: {
        promise: () => ({
            query: mockQuery
        })
    }
}));
const googleAuthMock = vi.hoisted(() => ({
    verifyIdToken: vi.fn()
}))
vi.mock('google-auth-library', () => {
    return {
        OAuth2Client: class {
            verifyIdToken = googleAuthMock.verifyIdToken;
        }
    }
})

const app = express();
app.use(express.json());
app.use('/auth', authRoutes)

describe("authのテスト", () => {

    beforeEach(() => {
        vi.clearAllMocks();
    })

    describe("POST googleのテスト", () => {
        it("正常: 正しいパラメータ送る => ちゃんと保存されている", async () => {
            googleAuthMock.verifyIdToken.mockResolvedValue({
                getPayload: () => ({
                    sub: "r1",
                    email: "test@example.com",
                    name: "Test User"
                })
            })
            mockQuery.mockResolvedValue([{ insertId: 1 }])
            const res = await request(app).post("/auth/google").send({
                token: "aaa"
            })
            expect(res.status).toBe(200)
            expect(res.body).toEqual({
                message: "Login successful",
                user: {
                    sub: "r1",
                    google_id: "r1",
                    name: "Test User",
                    email: "test@example.com"
                }
            })
            expect(mockQuery).toHaveBeenCalledWith(
                expect.stringContaining("insert into users"),
                ["r1", "test@example.com", "Test User"]
            )
        })

        it("異常: トークンが送られなかった場合 => 400エラー", async () => {
            const res = await request(app).post("/auth/google").send({});
            expect(res.status).toBe(400);
            expect(res.body).toEqual({ message: "Token not provided" });
            expect(googleAuthMock.verifyIdToken).not.toHaveBeenCalled();
            expect(mockQuery).not.toHaveBeenCalled();
        });

        it("異常: Googleのトークン検証でエラーが発生した場合 => 401エラー", async () => {
            googleAuthMock.verifyIdToken.mockRejectedValue(new Error("Invalid Token from Google"));
            const res = await request(app).post("/auth/google").send({ token: "invalid-token" });
            expect(res.status).toBe(401);
            expect(res.body).toEqual({ error: "Invalid token" });
        });

        it("異常: ペイロードに sub (Google ID) が含まれていない場合 => 400エラー", async () => {
            googleAuthMock.verifyIdToken.mockResolvedValue({
                getPayload: () => ({
                    email: "test@example.com",
                    name: "Test User"
                })
            });
            const res = await request(app).post("/auth/google").send({ token: "valid-token-but-no-sub" });
            expect(res.status).toBe(400);
            expect(res.body).toEqual({ message: "Invalid token payload" });
        })
    })
})