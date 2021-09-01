import express from 'express';
import routes from './routes';
import dotenv from 'dotenv';
dotenv.config();
import path from 'path'
import { db } from './database';
import bodyParser from 'body-parser'
import * as admin from 'firebase-admin'
import credentials from '../key.json'

admin.initializeApp({
 credential: admin.credential.cert(credentials)//initializes firebase admin sdk
});
let uid = process.argv[3]
let port = process.argv[2]//Gets port from command line
if(uid){
admin.auth().setCustomUserClaims(uid, {admin:true})
.then(()=>{
    console.log('custom claims set', uid)
})
}
const app = express ();


db.connect()//connects with db
app.use(bodyParser.json())

app.use('/api', routes()) //uses index.js to handle routes
app.use('/', express.static(path.join(__dirname, 'static/dist/lab4/')))
const server= app.listen(port, ()=>{
    console.log (`Listening on http://localhost:${port}`) 
})

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname + '/static/index.html'));
});//Redirects unknown routes to index

process.on('unhandledRejection', err => {
    console.log(err);
    process.exit(1);
});

process.on('SIGINT', async () => {
    console.log('Stopping server...');
    await server.close({timeout:10000})
    db.end();
    console.log('Server stopped');
    process.exit(0);
});//Closes the server
