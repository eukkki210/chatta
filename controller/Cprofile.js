const { User, Friend_List } = require('../models');
const constant = require('../common/constant');
const Cauth = require('./Cauth');

function calculateAge(birthdate) {
    const birthDate = new Date(birthdate);
    const currentDate = new Date();

    const age = currentDate.getFullYear() - birthDate.getFullYear();

    const currentMonth = currentDate.getMonth();
    const birthMonth = birthDate.getMonth();

    if (currentMonth < birthMonth || (currentMonth === birthMonth && currentDate.getDate() < birthDate.getDate())) {
        return age - 1;
    } else {
        return age;
    }
}

const profile = async (req, res) => {
    try {
        const cookieValue = req.signedCookies.logined.id;
        const userId = await Cauth.stringToUuid(cookieValue);

        const user = await User.findOne({ where: { user_id: userId } });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        // 지금으로썬 친구 등록이 단방향으로만 되어서 방법을 찾아야함
        const friendCount = await Friend_List.count({ where: { user_id: userId } });

        const age = await calculateAge(user.birth);

        res.render('profile', { user, age, friendCount });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const editProfile = async (req, res) => {
    try {
        const cookieValue = req.signedCookies.logined.id;
        const userId = await Cauth.stringToUuid(cookieValue);
        const updatedProfileData = req.body;
        await User.update(updatedProfileData, { where: { user_id: userId } });

        res.redirect(`/profile`);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

const deleteProfile = async (req, res) => {
    try {
        const cookieValue = req.signedCookies.logined.id;
        const userId = await Cauth.stringToUuid(cookieValue);

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