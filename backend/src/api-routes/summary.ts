import { Router } from "express"
import type { Request, Response } from "express"
import pool from "../db.js"
import camelcaseKeys from 'camelcase-keys'

const router = Router()

router.get("/getCurrentJournalStreak", async (req: Request, res: Response) => {
    try {
        const { userId, targetDate } = req.query
        if (!userId || !targetDate) {
            return res.status(400).json({ message: "userId and targetDate are required"})
        }
        // 今日以前の書いてるデータを取得
        const sql = `
            select target_date from dailyJournal where user_id = ? and is_written = 1 and target_date <= ? order by target_date desc
        `
        const [rows] = await pool.promise().query(sql, [userId, targetDate])
        const responseData = camelcaseKeys(rows, { deep: true })
        res.status(200).json(responseData)
    } catch(e) {
        console.log("getCurrentJournalStreakでエラー", e)
        res.status(500).json({ error: "server error. cant get current journal streak" })
    }
})

router.get("/getSleepData", async (req: Request, res: Response) => {
    try {
        const { userId, targetDate, sleepNumberOfDay } = req.query 
        if (!userId || !targetDate || !sleepNumberOfDay) {
            return res.status(400).json({ message: "not enough information"})
        }
        const sql = `
            select target_date, get_up_hour, get_up_min, go_bed_hour, go_bed_min from dailyJournal where user_id = ? and is_written = 1 and target_date <= ? order by target_date desc limit ?
        `
        const [rows] = await pool.promise().query(sql, [userId, targetDate, Number(sleepNumberOfDay)])
        const responseData = camelcaseKeys(rows, { deep: true })
        res.status(200).json(responseData)
    } catch (e) {
        console.log("getSleepDataでエラー", e)
        res.status(500).json({ error: "server error. cant get sleep data for summary" })
    }
})

router.get("/getRoutineData", async (req: Request, res: Response) => {
    try {
        const { userId, targetDate, routineNumberOfDay } = req.query 
        if (!userId || !targetDate || !routineNumberOfDay) {
            return res.status(400).json({ message: "not enough information"})
        }
        const sql = `
            select target_date, routine, routine_check from dailyJournal where user_id = ? and is_written = 1 and target_date <= ? order by target_date desc limit ?
        `
        const [rows] = await pool.promise().query(sql, [userId, targetDate, Number(routineNumberOfDay)])
        const responseData = camelcaseKeys(rows, { deep: true })
        res.status(200).json(responseData)
    } catch (e) {
        console.log("getRoutineDataでエラー", e)
        res.status(500).json({ error: "server error. cant get routine data for summary" })
    }
})

router.get("/getListData", async (req: Request, res: Response) => {
    try {
        const { userId, targetDate, listNumberOfDay } = req.query 
        if (!userId || !targetDate || !listNumberOfDay) {
            return res.status(400).json({ message: "not enough information"})
        }
        const sql = `
            select target_date, import_list, import_list_check, add_list, add_list_check from dailyJournal where user_id = ? and is_written = 1 and target_date <= ? order by target_date desc limit ?
        `
        const [rows] = await pool.promise().query(sql, [userId, targetDate, Number(listNumberOfDay)])
        const responseData = camelcaseKeys(rows, { deep: true })
        res.status(200).json(responseData)
    } catch (e) {
        console.log("getListDataでエラー", e)
        res.status(500).json({ error: "server error. cant get list data for summary" })
    }
})

router.get("/getToDoData", async (req: Request, res: Response) => {
    try {
        const { userId, targetDate, toDoNumberOfDay } = req.query 
        if (!userId || !targetDate || !toDoNumberOfDay) {
            return res.status(400).json({ message: "not enough information"})
        }
        const sql = `
            select target_date, to_do_time_hour, to_do_time_min, to_do_time_check, to_do_list_check from dailyJournal where user_id = ? and is_written = 1 and target_date <= ? order by target_date desc limit ?
        `
        const [rows] = await pool.promise().query(sql, [userId, targetDate, Number(toDoNumberOfDay)])
        const responseData = camelcaseKeys(rows, { deep: true })
        res.status(200).json(responseData)
    } catch (e) {
        console.log("getToDoDataでエラー", e)
        res.status(500).json({ error: "server error. cant get toDo data for summary" })
    }
})

router.get("/getJournalData", async (req: Request, res: Response) => {
    try {
        const { userId, targetDate, journalNumberOfDay } = req.query 
        if (!userId || !targetDate || !journalNumberOfDay) {
            return res.status(400).json({ message: "not enough information"})
        }
        const sql = `
            select target_date, journal_count from dailyJournal where user_id = ? and is_written = 1 and target_date <= ? order by target_date desc limit ?
        `
        const [rows] = await pool.promise().query(sql, [userId, targetDate, Number(journalNumberOfDay)])
        const responseData = camelcaseKeys(rows, { deep: true })
        res.status(200).json(responseData)
    } catch (e) {
        console.log("getJournalDataでエラー", e)
        res.status(500).json({ error: "server error. cant get journal data for summary" })
    }
})

router.get("/getMoneyData", async (req: Request, res: Response) => {
    try {
        const { userId, targetDate, moneyNumberOfDay } = req.query 
        if (!userId || !targetDate || !moneyNumberOfDay) {
            return res.status(400).json({ message: "not enough information"})
        }
        const sql = `
            select target_date, money_investment, money_waste, money_consumption, money_use_sum from dailyJournal where user_id = ? and is_written = 1 and target_date <= ? order by target_date desc limit ?
        `
        const [rows] = await pool.promise().query(sql, [userId, targetDate, Number(moneyNumberOfDay)])
        const responseData = camelcaseKeys(rows, { deep: true })
        res.status(200).json(responseData)
    } catch (e) {
        console.log("getMoneyDataでエラー", e)
        res.status(500).json({ error: "server error. cant get money data for summary" })
    }
})

export default router;