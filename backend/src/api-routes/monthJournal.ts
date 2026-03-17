import { Router } from "express"
import type { Request, Response } from "express"
import pool from "../db.js"
import camelcaseKeys from 'camelcase-keys'

const router = Router()

router.get("/getThisMonth", async (req: Request, res: Response) => {
    try {
        const { userId, targetDate } = req.query
        if (!userId || !targetDate) {
            return res.status(400).json({ message: "userId and targetDate are required"})
        }
        const sql = `
            select * from monthJournal where user_id = ? and target_date = ?
        `
        const [rows] = await pool.promise().query(sql, [userId, targetDate])
        const responseData = camelcaseKeys(rows, { deep: true });
        res.status(200).json(responseData)
    } catch (e) {
        console.log("monthJournal/getThisMonthでエラー", e)
        res.status(500).json({ error: "server error. cant get this month journal"})
    }
})

router.post("/saveThisMonth", async (req: Request, res: Response) => {
    try {
        const { userId, targetDate, toDo, toDoCheck, toDoImportant, journal, journalCount, journalLastEditTime, summary, isWritten } = req.body
        if (!userId || !targetDate || !isWritten) {
            return res.status(400).json({ message: "Not enough information"})
        }
        const sql = `
            insert into monthJournal (user_id, target_date, to_do, to_do_check, to_do_important, journal, journal_count, journal_last_edit_time, summary, is_written)
            values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            on duplicate key update
            user_id = values(user_id),
            target_date = values(target_date),
            to_do = values(to_do),
            to_do_check = values(to_do_check),
            to_do_important = values(to_do_important),
            journal = values(journal),
            journal_count = values(journal_count),
            journal_last_edit_time = values(journal_last_edit_time),
            summary = values(summary),
            is_written = values(is_written)
        `
        await pool.promise().query(sql, [
            userId,
            targetDate,
            JSON.stringify(toDo),
            JSON.stringify(toDoCheck),
            JSON.stringify(toDoImportant),
            JSON.stringify(journal),
            JSON.stringify(journalCount),
            JSON.stringify(journalLastEditTime),
            JSON.stringify(summary),
            isWritten
        ])
        res.status(200).json({ message: "month journal Saved Success"})
    } catch(e) {
        console.log("monthJournal/saveThisMonthでエラー", e)
        res.status(500).json({ error: "server error. cant save this month journal"})
    }
})

router.delete("/deleteMonthJournal", async (req: Request, res: Response) => {
    try {
        const { userId, targetDate } = req.query
        if (!userId || !targetDate) {
            return res.status(400).json({ message: "userId and targetDate are required"})
        }
        // 特定のauthorID、日付のものを削除する
        const sql = `
            delete from monthJournal where user_id = ? and target_date = ?
        `
        await pool.promise().query(sql, [userId, targetDate])
        res.status(200).json({ message: "Deleted success"})
    } catch (e) {
        console.log("deleteTodayJournalでエラー", e)
        res.status(500).json({ error: "server error. cant delete month journal"})
    }
})



export default router;