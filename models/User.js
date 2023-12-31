const { DataTypes } = require('sequelize');

const User = (sequelize) => {
    return sequelize.define('user', {
        user_id: {
            type: DataTypes.UUID,
            primaryKey: true,
            allowNull: false,
        },
        login_id: {
            type: DataTypes.STRING(20),
            allowNull: false,
        },
        login_pw: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        nickname: {
            type: DataTypes.STRING(20),
        },
        user_name: {
            type: DataTypes.STRING(20),
        },
        gender: {
            type: DataTypes.STRING(10),
        },
        birth: {
            type: DataTypes.DATEONLY,
        },
        email: {
            type: DataTypes.STRING(100),
        },
        islogin: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        },
        auth: {
            type: DataTypes.STRING(88),
        },
        auth_num: {
            type: DataTypes.INTEGER,
        },
        token: {
            type: DataTypes.STRING(63),
        },
        profile_image_filename: {
            type: DataTypes.STRING(255),
            defaultValue: 'default-profile-image.png'
        },
    },
    {
        freezeTableName: true,
        charset: 'utf8mb4',
        collate: 'utf8mb4_general_ci',
    })
}

module.exports = User;