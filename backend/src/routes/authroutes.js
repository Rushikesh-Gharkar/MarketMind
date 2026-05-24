const express = require("express")

const {signup , login} = require("../controllers/authcontrollers")

const authToken = require("../middleware/authmiddleware")
const validate = require("../middleware/validatemiddleware")
const {signupSchema , loginSchema} = require("../validator/authvalidator")
const { route } = require("../app")

const router = express.Router()

router.post("/signup" , validate(signupSchema) , signup);
router.post("/login" , validate(loginSchema) , login);

//route for testing

router.get("/me" , authToken , (req , res)=>{
    res.json({
        message : "Protected route accessed",
        user : req.user
    })
})

module.exports = router;