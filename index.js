const express = require("express");
const fs = require('fs')
const fileUpload = require('express-fileupload')
const config = require("config");
const authRouter = require("./routes/auth.routes");
const fileRouter = require("./routes/file.routes")
const corsMiddleware = require('./middleware/cors.middleware')

const app = express();
const PORT = process.env.PORT || config.get('serverPort');

app.use(corsMiddleware)
app.use(fileUpload({}))
app.use(express.json())
app.use("/api/auth", authRouter)
app.use("/api/files", fileRouter)

const start = async () => {
    try {
        app.listen(PORT, () => {
            console.log('Server started on port ', PORT)
        })
    } catch (e) {

    }
}

start();