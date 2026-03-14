import { Router } from "express"
import type { Request, Response } from "express"
import pool from "../db.js";
import camelcaseKeys from 'camelcase-keys'

const router = Router()

router.post("/save", async (req: Request, res: Response) => {
    const { listId, userId, listName, list } = req.body
    if (!listId || !userId) {
        return res.status(400).json({ message: "userId and listId are required"})
    }
    try {
        const sql = `
            insert into NGList (list_id, user_id, list_name, list)
            values (?, ?, ?, ?)
            on duplicate key update
            list_name = values(list_name),
            list = values(list)
        `
        await pool.promise().query(sql, [
            listId,
            userId,
            listName,
            JSON.stringify(list)
        ])
        res.status(200).json({ message : "saved success"})
    } catch (e) {
        console.log("NGList/saveでエラー", e);
        res.status(500).json({error: "server error. cant save NGList"})
    }
})

router.get("/get", async (req: Request, res: Response) => {
    try {
        const userId = req.query.userId
        if (!userId) {
            return res.status(400).json({ message: "userId is required"})
        }
        const sql = `
            select * from NGList where user_id = ? order by updated_at desc
        `
        const [rows] = await pool.promise().query(sql, [userId])
        const responseData = camelcaseKeys(rows, { deep: true })
        res.status(200).json(responseData)
    } catch (e) {
        console.error("NGList/getでのエラー", e)
        res.status(500).json({ error: "server error. cant get NGList"})
    }
})

router.delete("/delete", async (req: Request, res: Response) => {
    try {
        const listId = req.query.listId
        if (!listId) {
            return res.status(400).json({ message: "listId is required"})
        }
        const sql = `
            delete from NGList where list_id = ?
        `
        await pool.promise().query(sql, [listId])
        res.json({ message: "Deleted success"})
    } catch (e) {
        console.error("NGList/deleteでのエラー", e)
        res.status(500).json({ error: "server error. cant delete NGList"})
    }
})

export default router;