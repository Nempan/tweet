import express from "express"
import pool from "../db.js"

const router = express.Router()

router.get("/", async (req, res) => {
  const [tweets] = await pool.promise().query(`
    SELECT tweet.*, user.name, DATE_FORMAT(tweet.updated_at, "%Y-%m-%d %H:%i") AS date
    FROM tweet
    JOIN user ON tweet.author_id = user.id
    ORDER BY updated_at DESC;`)

  res.render("index.njk", {
    title: "Kvitter",
    tweets: tweets,
  })
})

router.get("/skicka", (req, res) => {
  res.render("skicka.njk", {
    title: "Kvitter - New post",
  })
})

router.post("/skicka", async (req, res) => {
  const message = req.body.message
  const author_id = 1
  await pool
    .promise()
    .query("INSERT INTO tweet (message, author_id) VALUES (?, ?)", [
      message,
      author_id,
    ])
  res.redirect("/")
})

export default router