const express = require('express');
//requiring all routes
const authrouter = require('./Routes/Auth.routes');
const AiRouter = require('./Routes/Ai.routes');
const FilesRouter = require('./Routes/Files.routes');
const cookieParser = require('cookie-parser');
const cors = require('cors');


const app = express();

app.use(cors({
  origin: "http://localhost:5173",
  credentials:true
}));

//middle ware
app.use(express.json());
app.use(cookieParser());

// using router
app.use('/api/auth', authrouter);
app.use('/api/ai', AiRouter);
app.use('/api/files', FilesRouter);


module.exports = app;