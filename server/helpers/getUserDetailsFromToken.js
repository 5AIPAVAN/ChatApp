const jwt = require('jsonwebtoken');
const UserModel = require('../models/UserModel');

const getUserDetailsFromToken = async (token) => {
    if (!token) {
        console.log("No token provided");
        return {
            message: "session out",
            logout: true,
        };
    }

    try {
        const decode = await jwt.verify(token, process.env.JWT_SECREAT_KEY);
        const user = await UserModel.findById(decode.id).select('-password');
        if (!user) {
            console.log("User not found for token:", decode.id);
            return {
                message: "user not found",
                logout: true,
            };
        }
        return user;
    } catch (error) {
        console.error("Error verifying token:", error.message);
        if (error.name === 'TokenExpiredError') {
            return {
                message: "token expired",
                logout: true,
            };
        } else if (error.name === 'JsonWebTokenError') {
            return {
                message: "invalid token",
                logout: true,
            };
        } else {
            return {
                message: "an error occurred",
                error: error.message,
                logout: true,
            };
        }
    }
};

module.exports = getUserDetailsFromToken;
