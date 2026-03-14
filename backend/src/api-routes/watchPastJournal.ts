import { Router } from "express"
import type { Request, Response } from "express"
import pool from "../db.js"
import camelcaseKeys from 'camelcase-keys'

const router = Router()

router.get("/getDailyJournal", async (req: Request, res: Response) => {
    try {
        const { userId, upOrDown, date, month, year } = req.query
        if(!userId) {
            return res.status(400).json({ message: "userId is required"})
        }
        let sql = `
            select * from dailyJournal where user_id = ? and is_written = true
        `
        const value: any[] = [userId]

        if (year !== "") {
            sql += ` and year(target_date) = ?`
            value.push(Number(year))
        }

        if (month !== "") {
            sql += ` and month(target_date) = ?`
            value.push(Number(month))
        }

        if (date !== "") {
            sql += ` and day(target_date) = ?`
            value.push(Number(date))
        }

        if (upOrDown == "降順") {
            sql += ` order by target_date desc`
        } else {
            sql += ` order by target_date asc`
        }

        // const limitNum = 20
        // const offsetNum = Number(page) * 20
        // sql += ` limit ? offset ?`
        // value.push(limitNum, offsetNum)

        console.log("実行するSQL:", sql);

        const [rows] = await pool.promise().query(sql, value)
        const responseData = camelcaseKeys(rows, { deep: true })

        res.status(200).json(responseData)
    } catch (e) {
        console.log("watchPastJournal/getDailyJournalでエラー", e)
        res.status(500).json({ error: "server error. cant get daily past journal"})
    }
})

router.get("/getWeekJournal", async (req: Request, res: Response) => {
    try {
        const { userId, upOrDown, date, month, year } = req.query
        if(!userId) {
            return res.status(400).json({ message: "userId is required"})
        }
        let sql = `
            select * from weekJournal where user_id = ? and is_written = true
        `
        const value: any[] = [userId]

        if (year !== "") {
            sql += ` and (year(start_date) = ? or year(end_date) = ?)`
            value.push(Number(year), Number(year))
        }

        if (month !== "") {
            sql += ` and (month(start_date) = ? or month(end_date) = ?)`
            value.push(Number(month), Number(month))
        }

        if (date !== "") {
            sql += ` and (day(start_date) = ? or day(end_date) = ?)`
            value.push(Number(date), Number(date))
        }

        if (upOrDown == "降順") {
            sql += ` order by start_date desc`
        } else {
            sql += ` order by start_date asc`
        }

        // const limitNum = 20
        // const offsetNum = Number(page) * 20
        // sql += ` limit ? offset ?`
        // value.push(limitNum, offsetNum)

        const [rows] = await pool.promise().query(sql, value)
        const responseData = camelcaseKeys(rows, { deep: true })
        res.status(200).json(responseData)
    } catch (e) {
        console.log("watchPastJournal/getWeekJournalでエラー", e)
        res.status(500).json({ error: "server error. cant get week past journal"})
    }
})

router.get("/getMonthJournal", async (req: Request, res: Response) => {
    try {
        const { userId, upOrDown, month, year } = req.query
        if(!userId) {
            return res.status(400).json({ message: "userId is required"})
        }
        let sql = `
            select * from monthJournal where user_id = ? and is_written = true
        `
        const value: any[] = [userId]

        if (year !== "") {
            sql += ` and year(target_date) = ?`
            value.push(Number(year))
        }

        if (month !== "") {
            sql += ` and month(target_date) = ?`
            value.push(Number(month))
        }

        if (upOrDown == "降順") {
            sql += ` order by target_date desc`
        } else {
            sql += ` order by target_date asc`
        }

        // const limitNum = 20
        // const offsetNum = Number(page) * 20
        // sql += ` limit ? offset ?`
        // value.push(limitNum, offsetNum)

        const [rows] = await pool.promise().query(sql, value)
        const responseData = camelcaseKeys(rows, { deep: true })
        res.status(200).json(responseData)
    } catch (e) {
        console.log("watchPastJournal/getMonthJournalでエラー", e)
        res.status(500).json({ error: "server error. cant get month past journal"})
    }
})

router.get("/getYearJournal", async (req: Request, res: Response) => {
    try {
        const { userId, upOrDown, year } = req.query
        if(!userId) {
            return res.status(400).json({ message: "userId is required"})
        }
        let sql = `
            select * from yearJournal where user_id = ? and is_written = true
        `
        const value: any[] = [userId]

        if (year !== "") {
            sql += ` and year(target_date) = ?`
            value.push(Number(year))
        }

        if (upOrDown == "降順") {
            sql += ` order by target_date desc`
        } else {
            sql += ` order by target_date asc`
        }

        // const limitNum = 20
        // const offsetNum = Number(page) * 20
        // sql += ` limit ? offset ?`
        // value.push(limitNum, offsetNum)

        const [rows] = await pool.promise().query(sql, value)
        const responseData = camelcaseKeys(rows, { deep: true })
        res.status(200).json(responseData)
    } catch (e) {
        console.log("watchPastJournal/getYearJournalでエラー", e)
        res.status(500).json({ error: "server error. cant get year past journal"})
    }
})

export default router