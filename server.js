import "dotenv/config"
import express from "express"
import nunjucks from "nunjucks"
import bodyParser from "body-parser"
import session from "express-session";
import helmet from "helmet"

import indexRouter from "./routes/index.js"
import tweetsRouter from "./routes/tweets.js"
import loginRouter from "./routes/login.js"
import registerRouter from "./routes/register.js"

const app = express()
const port = 3000

nunjucks.configure("views", {
  autoescape: true,
  express: app,
})

app.use(express.static("public"))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(helmet())

app.use(session({
  secret: "keyboard cat",
  resave: false,
  saveUninitialized: true,
  cookie: { sameSite: true }
}))

app.use((req, res, next) => {
  res.locals.user = req.session.user;
  next();
});

app.use("/", indexRouter)
app.use("/tweets", tweetsRouter)
app.use("/login", loginRouter)
app.use("/register", registerRouter)

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

