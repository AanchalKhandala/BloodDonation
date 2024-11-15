const userModel = require("../models/userModel");
const bcrypt = require('bcryptjs'); // for password hashing
const jwt = require('jsonwebtoken');

const registerController = async (req, res) => {
    
    try {
        const existingUser = await userModel.findOne({ email: req.body.email });
        if (existingUser) {
            return res.status(200).send({
                success: false,
                message: 'User Already exists'
            });
        }
        
        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(req.body.password, salt);
        req.body.password = hashPassword;

        // Save new user
        const user = new userModel(req.body);
        await user.save();
        return res.status(201).send({
            success: true,
            message: 'User registered successfully',
            user
        });

    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error in registration API',
            error
        });
    }
};

// Login callback
const loginController = async (req, res) => {
    try {
        const user = await userModel.findOne({ email: req.body.email });
        if (!user) {
            return res.status(404).send({
                success: false,
                message: "User not found"
            });
        }
        //check role
        if(user.role!== req.body.role){
            res.status(500).send({
                success: false,
                message: 'Error in role donot match',
                error
            });
        }
        
        // Compare password
        const isPasswordValid = await bcrypt.compare(req.body.password, user.password);
        if (!isPasswordValid) {
            return res.status(401).send({
                success: false,
                message: 'Invalid credentials'
            });
        }

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
        return res.status(200).send({
            success: true,
            message: 'Login successfully',
            token,
            user
        });

    } catch (error) {
        res.status(500).send({
            success: false,
            message: 'Error in Login API',
            error
        });
    }
};

// Get current user
const currentUserController = async (req, res) => {
    try {
        const user = await userModel.findOne({ _id: req.body.userId });
        return res.status(200).send({
            success: true,
            message: 'User fetched successfully',
            user
        });
        
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            success: false,
            message: 'Unable to get current user',
            error
        });
    }
};

module.exports = { registerController, loginController, currentUserController };
