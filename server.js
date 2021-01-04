//Imports
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const username = require('username-generator')
const cors = require('cors');
const mongoose = require('mongoose')
const Pusher = require('pusher')
const { AwakeHeroku } = require('awake-heroku');
const { User } = require('./models/userModel');
const { auth } = require('./middlewares/auth');
const { renameKey } = require('./utils/helpers');

    AwakeHeroku.add('https://transac230.herokuapp.com')
    .catch(err => {
        console.log(err)
    })
    
   



// const mongoURI = 'mongodb://127.0.0.1:27017/whats-app';
const mongoURI = 'mongodb+srv://leafblower:Wildcrack@420@cluster0.cthss.mongodb.net/transac?retryWrites=true&w=majority';

const pusher = new Pusher({
    appId: "1126927",
    key: "e8efce7d7d499e230d89",
    secret: "c245889d5e96a72fdc29",
    cluster: "ap1",
    useTLS: true
  });



//middleware
const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(cors());
app.use(express.json());

app.use('/static', express.static('static'))



// app.use(cors(corsOptions));



//db config
mongoose.Promise = global.Promise
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false }, (err, data) => {
    if(err){
        console.log('DB Error');
    } else {
        console.log('DB Connected')
    }
})

// mongoose.connection.dropDatabase('whats-app')
mongoose.connection.once('open', () => {
    // console.log('DB Connected!');
    const convoStream = mongoose.connection.model('Conversations').watch();
    const userStream = mongoose.connection.model('users').watch();

    userStream.on('change', (change) => {
        if(change.operationType === 'insert'){
            pusher.trigger('users', 'newUser', {
                'change': change
            })
        } else {
            console.log('Error triggering Pusher')
        }
    })

    convoStream.on('change', (change) => {
        if(change.operationType === 'insert'){
            pusher.trigger('chats', 'newChat', {
                'change': change
            })
        } else if (change.operationType === 'update'){
            pusher.trigger('messages', 'newMessage', {
                'change': change
            })
        } else {
            console.log('Error triggering Pusher')
        }
    })
})

let users={}
let userBack={}

io.on('connection', socket => {
  
    let userid = username.generateUsername('-')

    if(!users[userid]){
        users[userid] = socket.id;
    }
    //send back username
    socket.emit('yourID', userid)

    socket.on('disconnect', (data)=>{
      
        delete users[userBack[userid]]
        delete userBack[userid]
      
        io.sockets.emit('allUsers', users)
    })

    socket.on('callUser', (data)=>{
        // console.log(data.userToCall)
        io.to(users[data.userToCall]).emit('hey', {signal: data.signalData, from: data.from})
    })

    socket.on('acceptCall', (data)=>{
        io.to(users[data.to]).emit('callAccepted', data.signal)
    })

    socket.on('close', (data)=>{
        io.to(users[data.to]).emit('close')
    })

    socket.on('rejected', (data)=>{
        io.to(users[data.to]).emit('rejected')
    })
})


const port = process.env.PORT || 50001;

//routes
require("./routes/authRoutes")(app);
require("./routes/messageRoutes")(app);

app.get('/', (req, res) => {
    res.send('wewewew')
})




app.get('/api/set/socketId', auth, (req, res) => {
    let uid = req.query.uid;
    let label = req.query.label;

    // console.log(Object.keys(label))
    users = renameKey(users, label, uid)
    userBack[label] = uid;
    io.sockets.emit('allUsers', users)
res.send(uid)
   
})




//Vid Chat


//listen
server.listen(port, () => console.log(`Listening to localhost:${port}`));