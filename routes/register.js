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
         
    })
    
})
  

router.post(
  "/", limiter,
  body("name").trim().isLength({ min: 1, max: 30 }).escape(),
  body("password").isLength({ min: 8 }),
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).send("För kort eller långt användarnamn eller lösenord")
    }

    const { name, password } = matchedData(req)

    try {
      
      const existing = await db.get("SELECT * FROM user WHERE name = ?", name)
      if (existing) {
        return res.status(400).send("Användarnamnet är redan taget")
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