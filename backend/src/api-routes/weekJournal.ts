import { Router } from "express"
import type { Request, Response } from "express"
import pool from "../db.js"
import camelcaseKeys from 'camelcase-keys'

const router = Router()

router.get("/getThisWeek", async (req: Request, res: Response) => {
    try {
        const { userId, startDate, endDate } = req.query
        if (!userId || !startDate || !endDate) {
            return res.status(400).json({ message: "userId and startDate and endDate are required"})
        }
        const sql = `
            select * from weekJournal where user_id = ? and start_date = ? and end_date = ?
        `
        const [rows] = await pool.promise().query(sql, [userId, startDate, endDate])
        const responseData = camelcaseKeys(rows, { deep: true });
        res.status(200).json(responseData)
    } catch (e) {
        console.log("weekJournal/getThisWeekでエラー", e)
        res.status(500).json({ error: "server error. cant get this week journal"})
    }
})

router.post("/saveThisWeek", async (req: Request, res: Response) => {
    try {
        const { userId, startDate, endDate, toDo, toDoCheck, toDoImportant, journal, journalCount, journalLastEditTime, summary, isWritten } = req.body
        if (!userId || !startDate || !endDate) {
            return res.status(400).json({ message: "Not enough information"})
        }
        const sql = `
            insert into weekJournal (user_id, start_date, end_date, to_do, to_do_check, to_do_important, journal, journal_count, journal_last_edit_time, summary, is_written)
            values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            on duplicate key update
            user_id = values(user_id),
            start_date = values(start_date),
            end_date = values(end_date),
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
            startDate,
            endDate,
            JSON.stringify(toDo),
            JSON.stringify(toDoCheck),
            JSON.stringify(toDoImportant),
            JSON.stringify(journal),
            JSON.stringify(journalCount),
            JSON.stringify(journalLastEditTime),
            JSON.stringify(summary),
            isWritten
        ])
        res.status(200).json({ message: "week journal Saved Success"})
    } catch(e) {
        console.log("weekJournal/saveThisWeekでエラー", e)
        res.status(500).json({ error: "server error. cant save this week journal"})
    }
})

router.delete("/deleteWeekJournal", async (req: Request, res: Response) => {
    try {
        const { userId, startDate, endDate } = req.query
        if (!userId || !startDate || !endDate) {
            return res.status(400).json({ message: "Not enough information"})
        }
        const sql = `
            delete from weekJournal where user_id = ? and start_date = ? and end_date = ?
        `
        await pool.promise().query(sql, [userId, startDate, endDate])
        res.status(200).json({ message: "week journal delete Success"})
    } catch(e) {
        console.log("weekJournal/deleteWeekJournalでエラー", e)
        res.status(500).json({ error: "server error. cant delete this week journal"})
    }
})

export default router;