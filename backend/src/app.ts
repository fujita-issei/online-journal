import express from "express"
import cors from "cors"
import dailyJournalRoutes from "./api-routes/dailyJournal.js"
import authRoutes from "./api-routes/auth.js"
import routineRoutes from "./api-routes/routine.js"
import NGListRoutes from "./api-routes/NGList.js"
import weekJournalRoutes from "./api-routes/weekJournal.js"
import monthJournalRoutes from "./api-routes/monthJournal.js"
import yearJournalRoutes from "./api-routes/yearJournal.js"
import watchPastJournalRoutes from "./api-routes/watchPastJournal.js"
import summaryRoutes from "./api-routes/summary.js"
import formRoutes from "./api-routes/form.js"

const PORT = process.env.PORT || 8080
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173"
const app = express()

app.use(cors({
    origin: FRONTEND_URL,
    credentials: true
}))

app.use(express.json())

app.use("/dailyJournal", dailyJournalRoutes)
app.use("/auth", authRoutes)
app.use("/routine", routineRoutes)
app.use("/NGList", NGListRoutes)
app.use("/weekJournal", weekJournalRoutes)
app.use("/monthJournal", monthJournalRoutes)
app.use("/yearJournal", yearJournalRoutes)
app.use("/watchPastJournal", watchPastJournalRoutes)
app.use("/summary", summaryRoutes)
app.use("/form", formRoutes)

export default app