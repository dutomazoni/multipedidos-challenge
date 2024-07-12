import express from 'express';

import cors from 'cors'
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import path from "path";
const appWs = require('./app-ws');
dotenv.config({ path: path.join(__dirname, '.env') });
let app = express();
app.use(cors());

app.use(bodyParser.json({limit: '100mb'}));
let port = process.env.PORT || 5001

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});



const server = app.listen(port, () => {
  console.log(`Server listening on ${port}`);
});

appWs(server);
export {app};
