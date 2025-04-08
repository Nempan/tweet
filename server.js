import "dotenv/config"
import express from "express"
import nunjucks from "nunjucks"
import bodyParser from "body-parser"
import session from "express-session";

import indexRouter from "./routes/index.js"
import tweetsRouter from "./routes/tweets.js"
import loginRouter from "./routes/login.js"

const app = express()
const port = 3000

nunjucks.configure("views", {
  autoescape: true,
  express: app,
})

app.use(express.static("public"))
app.use(bodyParser.urlencoded({ extended: true }))

app.use(session({
  secret: "keyboard cat",
  resave: false,
  saveUninitialized: true,
  cookie: { sameSite: true }
}))


app.use("/", indexRouter)
app.use("/tweets", tweetsRouter)
app.use("/login", loginRouter)

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

