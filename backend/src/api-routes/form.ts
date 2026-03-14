import { Router } from "express"
import type { Request, Response } from "express"
import pool from "../db.js"
import camelcaseKeys from 'camelcase-keys'

const router = Router()

router.post("/save",  async (req: Request, res: Response) => {
    try {
        const { userId, content, email } = req.body 
        if (!userId) {
            return res.status(400).json({ message: "userId are required"})
        }
        const sql = `
            insert into forms (user_id, content, email) values (?, ?, ?)
        `
        await pool.promise().query(sql, [userId, content, email])
        res.status(200).json({ message: "Saved success"})
    } catch (e) {
        console.log("form/saveでエラー", e)
        res.status(500).json({ error: "server error. cant save form"})
    }
})

export default router;