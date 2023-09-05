const { User } = require('../models');
const bcrypt = require('bcrypt');
const { v4 } = require('uuid');

const profile = async (req, res) => {
    try {
        console.log(req.body)
        const { user_id } = req.body.userId;
        const user = await User.findOne({ where: { user_id } });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.render('profile', { user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const editProfile = async (req, res) => {
    try {
        const userId = req.params.userId;
        const updatedProfileData = req.body;
        await User.update(updatedProfileData, { where: { user_id: userId } });

        res.redirect(`/profile/${userId}`);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

const deleteProfile = async (req, res) => {
    try {
        const userId = req.params.userId;

        await User.destroy({ where: { user_id: userId } });

        res.redirect('/');
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

module.exports = {
    profile,
    editProfile,
    deleteProfile
}