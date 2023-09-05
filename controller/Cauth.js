const {User} = require('../models');
const bcrypt = require('bcrypt');

const dbIdCheck = async (login_id) => {
    const result = await User.findAll({attributes: ["login_id"],where:{login_id}})
    if(result.length>1){
        console.log('database error 아이디 중복');
        return false;
    } else if(result.length == 1){
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
    const result = await User.findOne({attributes: ["login_pw"],where:{login_id},raw:true})
    const dbpw = result.login_pw;
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

module.exports = {
    dbIdCheck,
    dbIdSearch,
    pwHashing,
    dbpwCompare,
    uuidToString,
    stringToUuid,
}