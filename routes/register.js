import bcrypt from "bcrypt"
import { body, validationResult, matchedData } from "express-validator"
import rateLimit from "express-rate-limit"
import express from "express"
import db from "../db-sqlite.js"


const router = express.Router()

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
})


router.get("/", async (req, res) => {
  
  


    res.render("register.njk", {
        title: "Registrera dig",
        error: null,
        oldInput: req.body
         
    })
    
})
  

router.post(
  "/", limiter,
  body("name").trim().isLength({ min: 1, max: 30 }).escape().withMessage("Användarnamnet måste vara mellan 1–30 tecken."),
  body("password").isLength({ min: 8 }).withMessage("Lösenordet måste vara minst 8 tecken."),
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      const errorMessages = errors.array().map(e => e.msg).join("<br>")
      return res.render("register.njk", {
        title: "Registrera dig",
        error: errorMessages,
        oldInput: req.body
      })
    }

    const { name, password } = matchedData(req)

    try {
      const existing = await db.get("SELECT * FROM user WHERE name = ?", name)
      if (existing) {
        return res.render("register.njk", {
          title: "Registrera dig",
          error: "Användarnamnet är redan taget.",
          oldInput: req.body
        })
      }

      const hashedPassword = await bcrypt.hash(password, 10)
      await db.run("INSERT INTO user (name, password) VALUES (?, ?)", name, hashedPassword)
      res.redirect("/login")
    } catch (err) {
      console.error("Registreringsfel:", err)
      res.status(500).send("Något gick fel")
    }
  }
)



export default router