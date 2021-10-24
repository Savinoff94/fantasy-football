const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const env = require('dotenv');
const register = require('./controllers/register')
const signin = require('./controllers/signin')
const withAuth = require('./controllers/withAuth')
const deleteuser = require('./controllers/deleteuser')
const savePlayer =require('./controllers/savePlayer')
const downloadPlayerData = require('./controllers/downloadPlayerData')
const updatePlayerData = require('./controllers/updatePlayers')
const sendLeaderBoards = require('./controllers/sendLeaderBoards')
const sendTeamInfo = require('./controllers/sendTeamInfo')
const playerList = require('./controllers/downloadPlayerList')
const playerstochoose = require('./controllers/playerstochoose')
const app = express();
env.config();

app.use(cors());
app.use(bodyParser.json());

app.post('/signin',playerList.handleDownloadPlayerList, updatePlayerData.handleUpdatePlayers, (req,res) => {signin.handleSignIn(req,res)});
app.post('/register', (req,res)=>{register.handleRegister(req,res)});
app.post('/checkToken', withAuth.withAuth, (req,res)=> {res.sendStatus(200)});

app.post('/playerstochoose', (req,res) => {playerstochoose.handleplayerstochoose(req,res)})

app.post('/delete', (req,res)=> {deleteuser.handleDelete(req,res)});
app.post('/saveplayer', (req,res) => {savePlayer.handleSavePlayer(req,res)});
app.post('/downloadplayerdata', (req,res) => {downloadPlayerData.handleDownloadPlayerData(req,res)});
app.post('/teamInfo', (req,res) => {sendTeamInfo.handleSendTeamInfo(req,res)});
app.get('/leaderBoards', (req,res) => {sendLeaderBoards.handlesendLeaderBoards(req,res)});

app.listen(process.env.PORT, ()=>{
  console.log('listening on port '+ process.env.PORT);
})
