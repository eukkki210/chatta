const { User } = require('../models');
const { v4 } = require('uuid');
const constant = require('../common/constant');
const Cauth = require('./Cauth');

const profileUpdate = async (req, res) => {
    try {
        const cookieValue = req.signedCookies.logined.id;
        console.log(cookieValue)
        const userId = await Cauth.stringToUuid(cookieValue);

        const user = await User.findOne({ where: { user_id: userId } });



        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.render('profileEdit', { user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const post_profileUpdate = async (req,res)=>{
    try {
        const {id,nick} = req.body

        const update = await User.update({nickname : nick}, {where : {user_id : id}})
        res.json({result : true})

    } catch (error) {
        console.log(error)
    }
}

module.exports ={
    profileUpdate,
    post_profileUpdate
}