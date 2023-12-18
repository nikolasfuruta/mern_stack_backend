import 'dotenv/config';
import express from 'express';

import path from 'path';
import * as url from 'url';
import { logger, logEvents  } from './middleware/loggerMiddleware.js'
import { errorHandler } from './middleware/errorHandlerMiddleware.js'
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { corsOptions} from './config/corsOptions.js';
import { connectDB } from './config/dbConn.js';
import mongoose from 'mongoose';

import root from './routes/root.js';
import { users } from './routes/userRoutes.js'
import { notes } from './routes/noteRoutes.js'

//this enables __dirname with ES modules
const __dirname = url.fileURLToPath(new URL('.',import .meta.url));


const PORT = process.env.PORT || 8080;
const app = express();
connectDB();

//middlewares
app.use(logger); //the logger comes first to capture all logs
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
app.use('/', express.static(path.join(__dirname, 'public')));
app.use('/', root);
app.use('/users', users);
app.use('/notes', notes);

//Not Found
app.get('*', (req,res) => {
  res.status(404);
  if(req.accepts('html')){
    res.sendFile(path.join(__dirname, 'views', '404.html'))
  } else if(req.accepts('json')) {
    res.json({ message: '404 Not Found' });
  } else {
    res.type('txt').send('404 Not Found');
  }
});

//error midleware
app.use(errorHandler) //errorHandler comes last to capture all possible error

//listeners
mongoose.connection.once('open', () => {
  console.log('Connected to MongoDB');
  app.listen(PORT, () => { console.log(`Server running on port ${PORT}`) });
});

mongoose.connection.on('error', (err) => {
  console.log(err);
  logEvents(
    `${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`,
    'mongoErrorLog.log'
  );
});
