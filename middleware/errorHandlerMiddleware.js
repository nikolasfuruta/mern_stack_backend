import {logEvents}  from './loggerMiddleware.js'

//middleware
export const errorHandler = (err, req, res, next) => {
  logEvents(
    `${err.name}: ${err.message}\t${req.method}\t${req.url}\t${req.headers.origin}\n`,
    'errorLog.log'
  );
  console.log(err.stack);
  //define status code
  const status = res.statusCode ? res.statusCode : 500;
  res.status(status);
  res.json({ message: err.message });
};