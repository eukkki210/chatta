const http = require('http');
const express = require('express');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const SocketIo = require('socket.io');
const secret = require('./config/secret');

const app = express();
const PORT = 8000;
const db = require('./models');

app.set('view engine','ejs');
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(cookieParser(secret.cookieSecret));
app.use(session({
    secret: secret.sessionSecret,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}))
app.use('/img',express.static(__dirname+'/img'));


const server = http.createServer(app);
const io = SocketIo(server);

const socketRouter = require('./routes/socket');
socketRouter(io);

const router = require('./routes/main');
app.use('/',router);

app.use('*',(req,res)=>{
    res.status(404).render('404');
})

db.sequelize.sync({force:true}).then(()=>{
    server.listen(PORT,()=>{
        console.log(`http://localhost:${PORT}`);
    })
})