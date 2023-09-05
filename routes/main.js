const express = require('express');
const router = express.Router();
const controller = require('../controller/Cmain.js');
const clogin = require('../controller/Clogin.js');
const cprofile = require('../controller/Cprofile.js');
const cprofileEdit = require('../controller/CprofileEdit.js')

router.get('/', controller.main);
router.get('/profile', cprofile.profile);
router.get('/new', controller.newMain);
router.get('/chat',controller.chatMain);
router.get('/profile/edit', cprofileEdit.profileUpdate);

router.get('/new/:userid',controller.newMain);

router.post('/signup',clogin.signUp)
router.post('/signin',clogin.signIn)
router.post('/logout',clogin.userLogOut)

router.post('/profile/edit', cprofileEdit.post_profileUpdate)

router.post('/board',controller.boardPost)
router.post('/bookmark',controller.bookmarkPost)
router.post('/friendlist',controller.friendListPost)
router.post('/chatroom',controller.chatRoomPost)
router.post('/chatroomjoin',controller.chatRoomJoinPost)
router.post('/chatmessage',controller.chatMessagePost)


router.post('/delete/user',controller.deleteUser)
router.post('/delete/board',controller.deleteBoard)
router.post('/delete/friend',controller.deleteFriend)
router.post('/delete/chatroom',controller.deleteChatRoom)
router.post('/delete/chatroomjoin',controller.deleteChatRoomJoin)
router.post('/delete/chatmessage',controller.deleteChatMessage)

module.exports = router;