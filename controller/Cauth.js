const {User} = require('../models');
const crypto = require('crypto');
const { v4 } = require('uuid');
const bcrypt = require('bcrypt');
const constant = require('../common/constant');
const secret = require('../config/secret');
const {keylen,digest,maxint,minint} = constant.auth

const dbIdCheck = async (login_id) => {
    const users = await User.findAll({attributes: ["login_id"],where:{login_id}})
    if(users.length>1){
        console.log('database error 아이디 중복');
        return false;
    } else if(users.length == 1){
        return true;
    } else {
        return false;
    }
}

const dbIdSearch = async (login_id) =>{
    const user = await User.findOne({attributes: ["user_id","nickname"] , where:{login_id} , raw:true})
    return user
}

const pwHashing = async (pw) => {
    const hash = await bcrypt.hash(pw,10)
    return hash;
}

const dbpwCompare = async (login_id,login_pw) => {
    const user = await User.findOne({attributes: ["login_pw"],where:{login_id},raw:true})
    const dbpw = user.login_pw;
    const flag = await bcrypt.compare(login_pw,dbpw);
    return flag
}

const uuidToString = async (uuid) => {
    let uuidArr = uuid.split('-');
    const [a,b,c,d,e] = uuidArr;
    const newUuid = b + 'g' + d + 'g' + a + 'g' + e + 'g' + c;
    return newUuid;
}

const stringToUuid = async (uuidString)=>{
    let uuidStringArr = uuidString.split('g');
    const [b,d,a,e,c] = uuidStringArr;
    const newUuid = a + '-' + b + '-' + c + '-' + d + '-' + e;
    return newUuid;
}

const saltSlicing = (auth_num)=>{
    const salt = secret.salt
    const slice = ((auth_num-1) % (salt.length-1))+ 1
    // %값이 0으로 정확하게 떨어지면 salt 길이가 0이 되므로 조정
    const hashSalt = salt.slice(0,slice);
    return hashSalt;
}

const authCodeIssue = async (user_id)=>{
    const user = await User.findOne({attributes: ["auth","auth_num"],where:{user_id},raw:true})
    let hash;
    if(user){
        // 정상적인 접근이라면 회원가입을 해서 이미 인증 코드가 들어가 있는 상태에서
        // 로그인으로 접근할때 나오는 코드,
        const {auth,auth_num} = user;
        hash = await authHashing(auth,auth_num + 1,keylen,digest)
        // 로그인을 새로 했으므로 이전에 사용했던 인증 코드 변경
        const userUpdate = await User.update({
            auth_num : auth_num + 1,
            // 변경할때 iter+1 을 했으므로 데이터베이스 조정
        },{
            where:{user_id},
        })
    } else {
        // 정상적인 접근이라면 회원가입 할 때 들어오게 됨
        // 인증 코드를 처음 발급하는 코드
        const salt = crypto.randomBytes(minint).toString("base64");
        const iter = crypto.randomInt(maxint)+minint;
        hash = await crypto.pbkdf2Sync(user_id,salt,iter,keylen,digest).toString("base64");
    }
    return hash;
}

const authHashing = async (auth,auth_num) => {
    const salt = saltSlicing(auth_num);
    const hash = await crypto.pbkdf2Sync(auth,salt,auth_num,keylen,digest).toString("base64");
    return hash;
}

const loginCookieRes = async (login_id,res)=>{
    const user = await dbIdSearch(login_id);
    const {user_id,nickname} = user;
    const auth = await authCodeIssue(user_id);
    const id = await uuidToString(user_id);
    const cookieValue = {id,nickname,auth};
    const {loginCookie,cookieSetting} = constant;
    res.cookie(loginCookie,cookieValue,cookieSetting);
    return nickname;
}

const signUpConst = async (login_pw)=>{
    const hash = await pwHashing(login_pw);
    const uuid = v4();
    const auth = await authCodeIssue(uuid);
    const auth_num = crypto.randomInt(maxint)+minint;
    return {
        uuid,
        hash,
        auth,
        auth_num,
    }
}

const authCheck = async (id,auth)=>{
    const user_id = await stringToUuid(id)
    const user = await User.findOne({attributes: ["auth","auth_num"],where:{user_id},raw:true})
    if(user){
        // 데이터베이스에 인증 코드가 존재하면 들어오는 코드
        const {auth:dbAuth,auth_num} = user;
        const hashSalt = saltSlicing(auth_num);
        const hash = await crypto.pbkdf2Sync(dbAuth,hashSalt,auth_num,keylen,digest).toString("base64");
        if(hash === auth){
            const newAuthNum = crypto.randomInt(maxint)+minint;
            const newHashSalt = saltSlicing(newAuthNum);
            const newAuth = await crypto.pbkdf2Sync(dbAuth,newHashSalt,newAuthNum,keylen,digest).toString("base64");
            const userUpdate = await User.update({
                auth_num:newAuthNum,
            },{
                where:{user_id},
            })
            return {result:true,newAuth}
        }
        return {result:false}
    } else {
        return {result:false};
    }
}

const authCheckPost = async (req,res)=>{
    if(req.signedCookies.logined){
        const {id,nickname,auth}=req.signedCookies.logined;
        const check = await authCheck(id,auth);
        if(check.result){
            const cookieValue = {id,nickname,auth:check.newAuth};
            console.log("check newauth",check.newAuth);
            const {loginCookie,cookieSetting} = constant;
            res.cookie(loginCookie,cookieValue,cookieSetting);
            res.json({result:true})
            return;
        }
    }
    res.json({result:false})
}


module.exports = {
    dbIdCheck,
    dbIdSearch,
    pwHashing,
    dbpwCompare,
    uuidToString,
    stringToUuid,
    authCodeIssue,
    loginCookieRes,
    signUpConst,
    authCheck,
    authCheckPost,
}