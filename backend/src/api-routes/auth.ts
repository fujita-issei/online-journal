import { Router } from "express";
import type { Request, Response } from "express"
import { OAuth2Client } from "google-auth-library";
import pool from "../db.js"

const router = Router();
const CLIENT_ID = process.env.GOOGLE_CLIENT_ID || ""
const client = new OAuth2Client(CLIENT_ID);

router.post("/google", async (req: Request, res: Response) => {
  const { token } = req.body;

  // データが届かなかったら終了させる
  if (!token) {
    res.status(400).json({ message: "Token not provided" });
    return;
  }

  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: CLIENT_ID,
    });
    const payload = ticket.getPayload();

    if (!payload || !payload.sub) {
      res.status(400).json({ message: "Invalid token payload" });
      return;
    }

    const googleId = payload.sub
    const email = payload.email || ""
    const name = payload.name || ""

    const sql = `
      insert into users (user_id, email, name) values(?, ?, ?) on duplicate key update email = values(email), name = values(name)
    `
    await pool.promise().query(sql, [googleId, email, name])

    res.status(200).json({
      message: "Login successful",
      user: {
        sub: googleId,
        google_id: googleId,
        name: name,
        email: email
      }
    });
  } catch (error) {
    console.error(error);
    res.status(401).json({ error: "Invalid token" });
  }
});

export default router;