const Router = require("express");
const config = require("config")
const jwt = require("jsonwebtoken")
const {check, validationResult} = require("express-validator");
const authMiddleware = require('../middleware/auth.middleware')
const Mailer = require("../mailer");
const { get } = require("config");
const connection = require("../connection").connection

const router = new Router()

function isEmptyRes(obj){
    return JSON.stringify(obj) === '[]';
}

router.post('/autorization',
    [
        check('email', "Uncorrect email").isEmail()
    ],
    async (req, res) => {
    try {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({message: "Uncorrect request", errors})
        }

        const {email} = req.body;
        await connection.execute("SELECT id FROM users where email=?", [email],
            function(err, results) {
                if (isEmptyRes(results)){
                    connection.execute("INSERT INTO users(email) VALUES(?)", [email]);
                }
                const password = Math.floor(Math.random() * (999999 - 111111)) + 111111;
                Mailer.Mailer(email,password);
                connection.execute("update users set passcode = ? where email=?", [password,email])
            }
        );
    } catch (e) {
        res.send({message: "Server error"})
    }
})

router.post('/login',
    async (req, res) => {
        try {
            const {email, password} = req.body
            await connection.execute("SELECT * FROM users where email=?", [email], function(err, results) {
                const user = results[0]

                const isPassValid = (password, user.passcode)
                if (!isPassValid) {
                    return res.status(400).json({message: "Invalid passcode"})
                }
                const str = "CREATE TABLE IF NOT EXISTS id_" + user.id + "(track_id int primary key,main_playlist bool default true);"
                connection.execute(str)

                const token = jwt.sign({id: user.id}, config.get("secretKey"), {expiresIn: "1h"})
                return res.json({
                    token,
                    user: {
                        id: user.id,
                        email: user.email,
                        nickname: user.nickname,
                        role: user.role,
                        avatar: user.avatar
                    }
                })
            });
        } catch (e) {
            console.log(e)
            res.send({message: "Server error"})
        }
})

router.get('/auth', authMiddleware, async (req, res) => {
        try {
            await connection.execute("SELECT * FROM users where id=?", [req.user.id],
            function(err, results) {
                const user = results[0]
                const token = jwt.sign({id: user.id}, config.get("secretKey"), {expiresIn: "1h"})
                return res.json({
                    token,
                    user: {
                        id: user.id,
                        email: user.email,
                        nicknamename: user.nickname,
                        role: user.role,
                        avatar: user.avatar
                    }
                })
            }
        );

        } catch (e) {
            console.log(e)
            res.send({message: "Server error"})
        }
    }
)

module.exports = router