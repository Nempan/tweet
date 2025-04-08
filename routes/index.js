import express from "express"
import db from "../db-sqlite.js"
import { formatDistanceToNow } from "date-fns"


const router = express.Router()

router.get("/", async (req, res) => {
  if (req.session.views) {
    req.session.views++
  } else {
    req.session.views = 1
  }
 
  const tweets = await db.all(`
    SELECT tweet.*, user.name
    FROM tweet
    JOIN user ON tweet.author_id = user.id
    ORDER BY updated_at DESC;`)

    const formattedTweets = tweets.map(tweet => ({
      ...tweet,
      date: formatDistanceToNow(new Date(tweet.updated_at), { addSuffix: true }),
      }))

  res.render("index.njk", {
    title: "Kvitter",
    tweets: tweets,
  })
})

export default router