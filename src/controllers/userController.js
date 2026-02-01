const User = require('../models/User');

const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}).select('-password');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);


        if (user) {
            res.json({
                _id: user._id,
                username: user.username,
                email: user.email,
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
        console.log(error.message);
    }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (user) {
            // Map 'username' from request to 'userName' in model if present
            if (req.body.username) {
                req.body.userName = req.body.username;
                delete req.body.username;
            }

            // Define allowed fields to prevent pollution
            const allowedUpdates = [
                'fullName',
                'userName',
                'email',
                'password',
                'profilePicture',
                'yearOfJoining',
                'function',
                'designation',
                'status',
                'location'
            ];

            // Iterate over keys in req.body and update if allowed
            Object.keys(req.body).forEach((key) => {
                if (allowedUpdates.includes(key)) {
                    user[key] = req.body[key];
                }
            });

            const updatedUser = await user.save();

            res.json({
                _id: updatedUser._id,
                username: updatedUser.userName, // returning as username for consistency with frontend expectations
                userName: updatedUser.userName,
                fullName: updatedUser.fullName,
                email: updatedUser.email,
                profilePicture: updatedUser.profilePicture,
                yearOfJoining: updatedUser.yearOfJoining,
                function: updatedUser.function,
                designation: updatedUser.designation,
                status: updatedUser.status,
                location: updatedUser.location,
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getAllUsers,
    getUserProfile,
    updateUserProfile,
};
