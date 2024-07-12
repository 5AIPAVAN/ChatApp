const UserModel = require("../models/UserModel")
const bcryptjs = require('bcryptjs')

async function registerUser(request,response){
    try {  // use try-catch for better error handling

        const { name, email , password, profile_pic } = request.body

        const checkEmail = await UserModel.findOne({ email }) //check if email already exists

        if(checkEmail){
            return response.status(400).json({
                message : "user with this email already exits",
                error : true,
            })
        }

        //password hashing using salt with bcryptjs
        const salt = await bcryptjs.genSalt(10)
        const hashpassword = await bcryptjs.hash(password,salt)

        // user data with hashed password
        const payload = {
            name,
            email,
            profile_pic,
            password : hashpassword
        }

        const user = new UserModel(payload)
        const userSave = await user.save() // save user data

        return response.status(201).json({
            message : "User created successfully",
            data : userSave,
            success : true
        })

    } catch (error) {
        return response.status(500).json({
            message : error.message || error,
            error : true
        })
    }
}

module.exports = registerUser