import db from "../db-sqlite.js"
import bcrypt from "bcrypt"
import express from "express"
import rateLimit from "express-rate-limit"


const router = express.Router()

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
})

router.get("/", async (req, res) => {
  
  


    res.render("login.njk", {
        title: "Login Page"
         
    })
    
})
  
router.post("/", limiter, async (req, res) => {

    const { user, password } = req.body; 
  
    try {
        
        const rows = await db.get("SELECT * FROM user WHERE name = ?", user);

        console.log(rows)
  
        if (rows === undefined) {
            return res.status(401).send("Fel användarnamn eller lösenord.");
        }
  
        const dbUser = rows; 
        const hashedPassword = dbUser.password; 
  
        
        const match = await bcrypt.compare(password, hashedPassword);
        if (!match) {
            return res.status(401).send("Fel användarnamn eller lösenord.");
        }

        
        req.session.user = { id: dbUser.id, name: dbUser.name };
        req.session.username = dbUser.name
        res.redirect("/tweets/inloggad"); 
    } catch (error) {
        console.error(error);
        res.status(500).send("Serverfel, försök igen senare.");
    }
});


  export default router
