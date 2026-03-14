import { Router } from "express"
import type { Request, Response } from "express"
import pool from "../db.js";
import camelcaseKeys from 'camelcase-keys'

const router = Router()

router.post("/save", async ( req: Request, res: Response) => {
    const { routineId, userId, routineName, targetTimeHour, targetTimeMin, routine, routineTime } = req.body;
    if (!routineId || !userId) {
        return res.status(400).json({ message: "userId and routineId are required"})
    }
    try {
        const sql = `
            insert into routine (routine_id, user_id, routine_name, target_time_hour, target_time_min, routine, routine_time) 
            values (?, ?, ?, ?, ?, ?, ?) 
            on duplicate key update 
            routine_name = values(routine_name),
            target_time_hour = values(target_time_hour),
            target_time_min = values(target_time_min),
            routine = values(routine),
            routine_time = values(routine_time)
        `
        await pool.promise().query(sql, [
            routineId,
            userId,
            routineName, 
            targetTimeHour,
            targetTimeMin,
            JSON.stringify(routine),
            JSON.stringify(routineTime)
        ])
        res.status(200).json({message: "Saved success"})
    } catch (e) {
        console.log(e);
        res.status(500).json({error: "server error. cant save routine"})
    }

})

router.get("/get", async ( req: Request, res: Response ) => {
    try{
        const userId = req.query.userId
        if (!userId) {
            return res.status(400).json({ message: "userId is required"})
        }
        const sql = `
            select * from routine where user_id = ? order by updated_at desc
        `
        const [rows] = await pool.promise().query(sql, [userId])
        // console.log("backend", rows)
        const responseData = camelcaseKeys(rows, { deep: true });
        res.status(200).json(responseData)
    } catch (e) {
        console.error("routine/getでエラー", e)
        res.status(500).json({error: "server error. cant get routine"})
    }
})

router.delete("/delete", async(req: Request, res: Response) => {
    const routineId = req.query.routineId
    try {
        if (!routineId) {
            return res.status(400).json({ message: "routineId is required"})
        }
        const sql = `delete from routine where routine_id = ?`
        await pool.promise().query(sql, [routineId])
        res.json({ message: "Deleted success"})
    } catch (e) {
        res.status(500).json({ error: "server error. cant delete routine" })
    }
})

export default router;