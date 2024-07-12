const UserModel = require("../models/UserModel")
const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')

async function checkPassword(request,response){
    try {
        const { password, userId } = request.body

        const user = await UserModel.findById(userId)

        // bcryptjs compares wheather the hashed password and given password matches or not
        // returns true or false
        const verifyPassword = await bcryptjs.compare(password,user.password)

        if(!verifyPassword){
            return response.status(400).json({
                message : "Please check password - bcrypt compare",
                error : true
            })
        }

        // for signing the user data like token

        //remember signed data is containing these two details id,email
        // when decoded you can only get id,email of user
        const tokenData = {
            id : user._id,
            email : user.email 
        }
        // secret used to sign jwt can be any -> set in env variables
        const token = await jwt.sign(tokenData,process.env.JWT_SECREAT_KEY,{ expiresIn : '1d'})

        // instead of headers here the token is stored in cookies
        //learn more about cookies
        const cookieOptions = {
            http : true,
            secure : true
        }

        return response.cookie('token',token,cookieOptions).status(200).json({
            message : "Login successfully",
            token : token,
            success :true
        })

    } catch (error) {
        return response.status(500).json({
            message : error.message || error,
            error : true
        })
    }
}

module.exports = checkPassword