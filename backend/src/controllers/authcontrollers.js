const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const {PrismaClient} = require("@prisma/client")

const prisma = new PrismaClient()

exports.signup = async (req , res)=>{

    try{
        const {email , password} = req.body;

        if(!email || !password){
            return res.status(400).json({
                message : "All fields required"
            })
        }

        const existing_user = await prisma.user.findUnique({
            where : {email}
        })

        if(existing_user){
            return res.status(400).json({
                message : "User already exists"
            })
        }

        const hashpassword = await bcrypt.hash(password , 10)

        const user = await prisma.user.create({
            data : {
                email : email,
                password : hashpassword
            }
        })

        const token = jwt.sign({id : user.id} , process.env.JWT_SECRET , {expiresIn : "7d"})

        res.status(201).json({
            message : "User successfully created",
            token,
            user:{
                id : user.id,
                email : user.email
            } 
        })

    }
    catch(err){
        console.log(err);
        
        res.status(500).json({
            message : "Server error"
        })
    }
}

exports.login = async (req , res)=>{

    try{
        const {email , password} = req.body;

        const user = await prisma.user.findUnique({
            where : {email : email}
        })

        if(!user){
            return res.status(400).json({
                message : "Invalid Credentials"
            })
        }

        const token_match = await bcrypt.compare(
            password , user.password
        )

        if(!token_match){
            return res.status(400).json({
                message : "Invalid Credits"
            })
        }

        const token = jwt.sign({id : user.id} , process.env.JWT_SECRET , {expiresIn : "7d"})

        res.status(200).json({
            message : "Login Successful",
            token , 
            user : {
                id : user.id,
                email : user.email
            }
        })

    }
    catch(err){
        console.log(err);
        res.status(500).json({
            message : "Server Error"
        })
    }

}