const express = require('express');
//requiring all routes
const authrouter = require('./Routes/Auth.routes');
const cookieParser = require('cookie-parser');
const cors = require('cors');


const app = express();

app.use(cors({
  origin: "http://localhost:5173",
  credentials:true
}));
app.use(express.json());
app.use(cookieParser());
app.use('/api/auth', authrouter);



module.exports = app;