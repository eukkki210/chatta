const {User} = require('../models');
const { v4 } = require('uuid');
const constant = require('../common/constant');
const Cauth = require('./Cauth');


const signUp = async (req,res)=>{
    const {login_id,login_pw,user_name}=req.body
    try {
        const flag = await Cauth.dbIdCheck(login_id)
        if(flag){
            res.json({result:false , message:'아이디가 중복되어 사용할 수 없습니다'})
            return;
        }
        const hash = await Cauth.pwHashing(login_pw);
        const uuid=v4();
        // console.log('uuid',uuid)
        // const uuidString = await Cauth.uuidToString(uuid)
        // console.log('uuid string',uuidString);
        // const newUuid = await Cauth.stringToUuid(uuidString);
        // console.log('uuid new', newUuid);
        const user = await User.create({
            user_id:uuid,
            login_id,
            login_pw:hash,
            user_name,
            nickname:login_id,
        })
        res.json({result:true,message:`${login_id}님이 회원가입 하셨습니다`,uuid});
    } catch (error) {
        console.log(error);
    }
}

const signIn = async (req,res)=>{
    try {
        const {login_id , login_pw} = req.body;
        const check = await Cauth.dbIdCheck(login_id);
        if(check) {
            const flag = await Cauth.dbpwCompare(login_id,login_pw);
            if(flag){
                const user = await Cauth.dbIdSearch(login_id);
                const {user_id,nickname} = user;
                const id = await Cauth.uuidToString(user_id);
                const cookieValue = {id,nickname};
                const {loginCookie,cookieSetting} = constant;
                res.cookie(loginCookie,cookieValue,cookieSetting);
                res.json({result:true, message:`${nickname}님 어서오세요`})
            } else {
                res.json({result:false, message:"pw가 일치하지 않습니다"})
            }
        } else {
            res.json({result:false, message:"id가 존재하지 않습니다"})
        }
    } catch (error) {
        console.log(error);
    }
}

const userLogOut = async (req,res)=>{
    res.clearCookie(constant.loginCookie);
    res.json({result:true});
}

module.exports = {
    signUp,
    signIn,
    userLogOut,
}