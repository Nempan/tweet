import express from "express"
import db from "../db-sqlite.js"
import bcrypt from "bcrypt"
import { formatDistanceToNow } from "date-fns"


import { body, matchedData, validationResult } from "express-validator"


const router = express.Router()

function isAuthenticated(req, res, next) {
  if (req.session.user) {
      return next(); 
  } else {

  res.redirect("/login"); 
  }
}


router.get("/inloggad",isAuthenticated, async (req, res) => {
  if (req.session.views) {
    req.session.views++
  } else {
    req.session.views = 1
  }
  const tweets = await db.all(`
    SELECT tweet.*, user.name
    FROM tweet
    JOIN user ON tweet.author_id = user.id
    ORDER BY updated_at DESC;
    ;`)

    // Format the dates on the backend
    const formattedTweets = tweets.map(tweet => ({
        ...tweet,
        date: formatDistanceToNow(new Date(tweet.updated_at), { addSuffix: true }),
    }))
    console.log("Sessionen i /tweets/inloggad:", req.session);

    res.render("inloggad.njk", {
        title: "Fireplace - All posts",
        message: "",
        tweets: formattedTweets,
        user: req.session.user
    }) 
})



router.get("/:id/delete",isAuthenticated, async(req, res) => {

    const id = req.params.id

    if (!Number.isInteger(Number(id))) {
        return res.status(400).send("Invalid ID")
      }

    db.all("DELETE FROM tweet WHERE id = ?", id)

    res.redirect("/tweets/inloggad")
})


router.get("/:id/edit", isAuthenticated, async (req, res) => {
  const id = req.params.id
  if (!Number.isInteger(Number(id))) {
    return res.status(400).send("Invalid ID")
  }
  console.log("Session i edit:", req.session);

  const row = await db.get("SELECT * FROM tweet WHERE id = ?", id)
  if (!row) {
    return res.status(404).send("Tweet not found")
  }
  
  res.render("edit.njk", { tweet: row })
  
})

router.post("/edit",isAuthenticated,
  body("id").isInt(),
  body("message").isLength({ min: 1, max: 130 }),
  async (req, res) => {
  console.log("Session i edit:", req.session);

  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).send("Invalid input")
  }

  const { id, message } = matchedData(req)
  db.all("UPDATE tweet SET message = ? WHERE id = ?", message, id)
  res.redirect("/tweets/inloggad")
})



router.get("/skicka",isAuthenticated, (req, res) => {
  res.render("skicka.njk", {
    title: "Kvitter - New post",
  })
})

router.post("/skicka", isAuthenticated, async (req, res) => {
  const message = req.body.message
  const author_id = 1
  await db.run("INSERT INTO tweet (message, author_id) VALUES (?, ?)", 
      message,
      author_id,
    )
  res.redirect("/tweets/inloggad")
})

export default router
