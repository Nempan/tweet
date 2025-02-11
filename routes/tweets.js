import express from "express"
import pool from "../db.js"

const router = express.Router()

router.get("/:id/delete", async(req, res) => {

    const id = req.params.id

    if (!Number.isInteger(Number(id))) {
        return res.status(400).send("Invalid ID")
      }

    await pool.promise().query("DELETE FROM tweet WHERE id = ?", [id])

    res.redirect("/")
})

export default router