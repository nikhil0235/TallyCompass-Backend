const User = require('../models/User');
const { generateToken } = require('../../config/jwt');
const { sendResetEmail } = require('../../config/email');

// @desc    Register a new user
// @route   POST /api/auth/signup
// @access  Public
const signup = async (req, res) => {
    try {
        const { userName, email, password } = req.body;

        // Validate required fields
        if (!userName) {
            return res.status(400).json({ message: 'Username is required' });
        }
        if (!email) {
            return res.status(400).json({ message: 'Email is required' });
        }
        if (!password) {
            return res.status(400).json({ message: 'Password is required' });
        }

        // Check if email already exists
        const emailExists = await User.findOne({ email });
        if (emailExists) {
            return res.status(400).json({ message: 'Email already exists' });
        }

        // Check if username already exists
        const usernameExists = await User.findOne({ userName });
        if (usernameExists) {
            return res.status(400).json({ message: 'Username already exists' });
        }

        // Create user
        const user = await User.create({
            userName,
            email,
            password,
        });

        if (!user) {
            return res.status(400).json({ message: 'Failed to create user' });
        }

        res.status(201).json({
            _id: user._id,
            userName: user.userName,
            email: user.email,
            profilePicture: user.profilePicture,
            function: user.function,
            designation: user.designation,
            experience: user.experience,
            status: user.status,
            location: user.location,
            fullName: user.fullName,
            yearOfJoining: user.yearOfJoining,
            token: generateToken({ id: user._id }),
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        

        // Check for user email
        const user = await User.findOne({ email });
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check password
        const isPasswordValid = password === user.password || await user.matchPassword(password);
        
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Incorrect password' });
        }

        res.json({
            _id: user._id,
            userName: user.userName,
            email: user.email,
            profilePicture: user.profilePicture,
            function: user.function,
            designation: user.designation,
            experience: user.experience,
            status: user.status,
            location: user.location,
            fullName: user.fullName,
            yearOfJoining: user.yearOfJoining,
            token: generateToken({ id: user._id })
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
const logout = (req, res) => {
    // Since we are using JWT tokens on client side (headers), 
    // actual logout happens on client by removing token.
    // If using cookies, we would clear cookie here.
    res.status(200).json({ message: 'Logged out successfully' });
};


const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ message: 'Email is required' });
        }

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Generate reset token
        const resetToken = generateToken({ id: user._id, type: 'reset' });

        // Send reset email
        await sendResetEmail(email, resetToken);

        res.json({
            message: 'Password reset link sent to your email',
            success: true
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const resetPassword = async (req, res) => {
    try {
        const { token, password } = req.body;

        if (!token || !password) {
            return res.status(400).json({ message: 'Token and password are required' });
        }

        // Verify reset token
        const jwt = require('jsonwebtoken');
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (decoded.type !== 'reset') {
            return res.status(400).json({ message: 'Invalid reset token' });
        }

        // Find user
        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Update password
        user.password = password;
        await user.save();

        res.json({
            message: 'Password reset successfully',
            success: true
        });
    } catch (error) {
        if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
            return res.status(400).json({ message: 'Invalid or expired reset token' });
        }
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    signup,
    login,
    logout,
    forgotPassword,
    resetPassword,
};
