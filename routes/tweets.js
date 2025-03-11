import express from "express"
import pool from "../db.js"
import { body, matchedData, validationResult } from "express-validator"


const router = express.Router()

router.get("/:id/delete", async(req, res) => {

    const id = req.params.id

    if (!Number.isInteger(Number(id))) {
        return res.status(400).send("Invalid ID")
      }

    await pool.promise().query("DELETE FROM tweet WHERE id = ?", [id])

    res.redirect("/")
})


router.get("/:id/edit", async (req, res) => {
  const id = req.params.id
  if (!Number.isInteger(Number(id))) {
    return res.status(400).send("Invalid ID")
  }
  const [rows] = await pool.promise().query("SELECT * FROM tweet WHERE id = ?", [id])
  if (rows.length === 0) {
    return res.status(404).send("Tweet not found")
  }
  res.render("edit.njk", { tweet: rows[0] })
})

router.post("/edit",
  body("id").isInt(),
  body("message").isLength({ min: 1, max: 130 }),
  async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).send("Invalid input")
  }

  const { id, message } = matchedData(req)
  await pool.promise().query("UPDATE tweet SET message = ? WHERE id = ?", [message, id])
  res.redirect("/")
})

export default router