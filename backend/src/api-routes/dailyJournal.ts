import { Router } from "express"
import type { Request, Response } from "express"
import pool from "../db.js"
import camelcaseKeys from 'camelcase-keys'
import { format } from "date-fns"

const router = Router()

router.get("/getTodayJournal", async (req: Request, res: Response) => {
    try {
        const { userId, targetDate } = req.query
        if (!userId || !targetDate ) {
            return res.status(400).json({ message: "userId and targetDate are required"})
        }
        const sql = `
            select * from dailyJournal where user_id = ? and target_date = ?
        `
        const [rows] = await pool.promise().query(sql, [userId, targetDate])
        const responseData = camelcaseKeys(rows, { deep: true })
        res.status(200).json(responseData)
    } catch (e) {
        console.log("getTodayjournalでエラー", e)
        res.status(500).json({ error: "server error. cant get today journal"})
    }
})

router.post("/saveTodayJournal", async (req: Request, res: Response) => {
    try {
        const { userId, targetDate, getUpHour, getUpMin, goBedHour, goBedMin, routine, routineCheck, toDoTimeHour, toDoTimeMin, startToDoHour, startToDoMin, endToDoHour, endToDoMin, toDoTimeCheck, toDoList, toDoListCheck, toDoListImportant, importList, importListCheck, addList, addListCheck, journal, journalCount, journalLastEditTime, moneyInvestment, moneyWaste, moneyConsumption, moneyUseSum, isWritten } = req.body
        if (!userId || !targetDate) {
            return res.status(400).json({ message: "userId and targetDate are required"})
        }
        const sql = `
            insert into dailyJournal (user_id, target_date, get_up_hour, get_up_min, go_bed_hour, go_bed_min, routine, routine_check, to_do_time_hour, to_do_time_min, start_to_do_hour, start_to_do_min, end_to_do_hour, end_to_do_min, to_do_time_check, to_do_list, to_do_list_check, to_do_list_important, import_list, import_list_check, add_list, add_list_check, journal, journal_count, journal_last_edit_time, money_investment, money_waste, money_consumption, money_use_sum, is_written)
            values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            on duplicate key update 
            user_id = values(user_id), 
            target_date = values(target_date), 
            get_up_hour = values(get_up_hour), 
            get_up_min = values(get_up_min), 
            go_bed_hour = values(go_bed_hour), 
            go_bed_min = values(go_bed_min), 
            routine = values(routine), 
            routine_check = values(routine_check), 
            to_do_time_hour = values(to_do_time_hour), 
            to_do_time_min = values(to_do_time_min), 
            start_to_do_hour = values(start_to_do_hour), 
            start_to_do_min = values(start_to_do_min), 
            end_to_do_hour = values(end_to_do_hour), 
            end_to_do_min = values(end_to_do_min), 
            to_do_time_check = values(to_do_time_check), 
            to_do_list = values(to_do_list), 
            to_do_list_check = values(to_do_list_check), 
            to_do_list_important = values(to_do_list_important), 
            import_list = values(import_list), 
            import_list_check = values(import_list_check), 
            add_list = values(add_list), 
            add_list_check = values(add_list_check), 
            journal = values(journal), 
            journal_count = values(journal_count), 
            journal_last_edit_time = values(journal_last_edit_time), 
            money_investment = values(money_investment), 
            money_waste = values(money_waste), 
            money_consumption = values(money_consumption),
            money_use_sum = values(money_use_sum),
            is_written = values(is_written)
        `
        await pool.promise().query(sql, [
                userId, 
                targetDate,
                getUpHour, 
                getUpMin, 
                goBedHour, 
                goBedMin, 
                JSON.stringify(routine), 
                JSON.stringify(routineCheck), 
                toDoTimeHour, 
                toDoTimeMin, 
                startToDoHour, 
                startToDoMin, 
                endToDoHour, 
                endToDoMin, 
                JSON.stringify(toDoTimeCheck), 
                JSON.stringify(toDoList), 
                JSON.stringify(toDoListCheck), 
                JSON.stringify(toDoListImportant), 
                JSON.stringify(importList), 
                JSON.stringify(importListCheck), 
                JSON.stringify(addList), 
                JSON.stringify(addListCheck), 
                JSON.stringify(journal), 
                JSON.stringify(journalCount), 
                JSON.stringify(journalLastEditTime), 
                moneyInvestment, 
                moneyWaste, 
                moneyConsumption,
                moneyUseSum,
                isWritten
        ])
        res.status(200).json({ message: "Saved success"})
    } catch(e) {
        console.log("saveTodayJournalでエラー", e)
        res.status(500).json({ error : "server error. cant save today journal"})
    }
})

router.delete("/deleteTodayJournal", async (req: Request, res: Response) => {
    try {
        const { userId, targetDate } = req.query
        if (!userId || !targetDate) {
            return res.status(400).json({ message: "userId and targetDate are required"})
        }
        // 特定のauthorID、日付のものを削除する
        const sql = `
            delete from dailyJournal where user_id = ? and target_date = ?
        `
        await pool.promise().query(sql, [userId, targetDate])
        res.status(200).json({ message: "Deleted success"})
    } catch (e) {
        console.log("deleteTodayJournalでエラー", e)
        res.status(500).json({ error: "server error. cant delete today journal"})
    }
})

router.get("/getYestardaySleepTime", async (req: Request, res: Response) => {
    try {
        const { userId, targetDate } = req.query
        if (!userId || !targetDate) {
            return res.status(400).json({ message: "userId and targetDate are required"})
        }
        const sql = `
            select go_bed_hour, go_bed_min from dailyJournal where user_id = ? and target_date = ?
        `
        const [rows] = await pool.promise().query(sql, [userId, targetDate])
        const responseData = camelcaseKeys(rows, { deep: true })
        res.status(200).json(responseData)
    } catch(e) {
        console.log("getYestardaySleepTimeでエラー", e)
        res.status(500).json({ error: "server error. cant get yestarday sleep time"})
    }
})

router.get("/getDailyDataForSummary", async (req: Request, res: Response) => {
    try {
        const { userId, targetDate, numberOfDays } = req.query
        if (
            !userId || typeof userId !== "string" || 
            !targetDate || typeof targetDate !== "string" || 
            !numberOfDays
        ) {
            return res.status(400).json({ message: "userId and targetDate and numberOfDays are required"})
        }
        const [year, month, date] = targetDate.split("-")
        if (!year || !month || !date) {
            return res.status(400).json({ message: "year and month and date are not clear"})
        }
        const numYear = Number(year)
        const numMonth = Number(month) - 1
        const numDate = Number(date)
        const numDays = Number(numberOfDays)
        const targetDates: string[] = [];
        for (let i = 0; i < numDays; i++) {
            const target = new Date(numYear, numMonth, numDate - i)
            targetDates.push(
                format(target, "yyyy-MM-dd")
            )
        }
        const placeholders = targetDates.map(() => "?").join(", ");
        const sql = `
            SELECT * FROM dailyJournal
            WHERE user_id = ? 
            AND target_date IN (${placeholders})
            ORDER BY target_date ASC
        `;
        const queryValues = [userId, ...targetDates];
        const [rows] = await pool.promise().query(sql, queryValues)
        const responseData = camelcaseKeys(rows, { deep: true })
        res.status(200).json(responseData)
    } catch(e) {
        console.log("getDailyDataForSummaryでエラー", e)
        res.status(500).json({ error: "server error. cant get data for summary"})
    }
})

export default router;