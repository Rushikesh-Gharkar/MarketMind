const express = require("express")
const dotenv = require("dotenv")
const cors = require("cors")
const authRouter = require("../src/routes/authroutes") 

dotenv.config()

const app = express()

app.use(cors())
app.use(express.json())


app.use("/api/auth",authRouter)

app.get("/" , (req , res)=>{
    res.send("Api running")
})

module.exports = app;