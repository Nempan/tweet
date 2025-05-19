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



router.get("/:id/delete", isAuthenticated, async (req, res) => {
  const id = parseInt(req.params.id)

  if (!Number.isInteger(id)) {
    return res.status(400).send("Invalid ID")
  }

  const tweet = await db.get("SELECT * FROM tweet WHERE id = ?", id)

  
  if (!tweet || tweet.author_id !== req.session.user.id) {
    return res.status(403).send("Du har inte rättigheter att ta bort detta inlägg.")
  }

  await db.run("DELETE FROM tweet WHERE id = ?", id)
  res.redirect("/tweets/inloggad")
})



router.get("/:id/edit", isAuthenticated, async (req, res) => {
  const id = parseInt(req.params.id)

  if (!Number.isInteger(id)) {
    return res.status(400).send("Invalid ID")
  }

  const tweet = await db.get("SELECT * FROM tweet WHERE id = ?", id)

  if (!tweet || tweet.author_id !== req.session.user.id) {
    return res.status(403).send("Du får inte redigera detta inlägg.")
  }

  res.render("edit.njk", { tweet })
})

router.post("/edit", isAuthenticated,
  body("id").isInt(),
  body("message").isLength({ min: 1, max: 130 }).trim().escape(),
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).send("Ogiltig indata")
    }

    const { id, message } = matchedData(req)

    const tweet = await db.get("SELECT * FROM tweet WHERE id = ?", id)

    if (!tweet || tweet.author_id !== req.session.user.id) {
      return res.status(403).send("Du får inte redigera detta inlägg.")
    }

    await db.run("UPDATE tweet SET message = ? WHERE id = ?", message, id)
    res.redirect("/tweets/inloggad")
  }
)


router.get("/skicka",isAuthenticated, (req, res) => {
  res.render("skicka.njk", {
    title: "Kvitter - New post",
  })
})

router.post("/skicka", isAuthenticated, async (req, res) => {
  const message = req.body.message;
  const authorId = req.session.user?.id;

  try {
    await db.all("INSERT INTO tweet (message, author_id) VALUES (?, ?)", message, authorId);
    res.redirect("/tweets/inloggad");
  } catch (err) {
    console.error("Databasfel:", err);
    res.status(500).send("Något gick fel vid att skicka meddelandet.");
  }
});



export default router
