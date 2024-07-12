const getUserDetailsFromToken = require("../helpers/getUserDetailsFromToken")

async function userDetails(request,response){
    try {
        // like headers in prev project here i am going to use cookies to store token 
        const token = request.cookies.token || ""

        console.log("token in user detailsssssssssss"+token);

        // to obtain userid from signed token -> call helper functions
        // like using fetchuser like middleware in prev project
        const user = await getUserDetailsFromToken(token)

        return response.status(200).json({
            message : "user details from userDetails Controller",
            data : user
        })
    } catch (error) {
        return response.status(500).json({
            message : error.message || error,
            error : true
        })
    }
}

module.exports = userDetails