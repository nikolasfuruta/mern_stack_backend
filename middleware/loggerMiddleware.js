import { format } from 'date-fns';
import { v4 as uuid } from 'uuid';
import fs from 'fs';
const fsPromises = fs.promises;
import path from 'path';
import * as url from 'url'

const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

//log helper function
export const logEvents = async (message, logFileName) => {
	const dateTime = format(new Date(), 'yyyyMMdd\tHH:mm:ss');
	const logItem = `${dateTime}\t${uuid()}\t${message}`;

	try {
		if (!fs.existsSync(path.join(__dirname, '..', 'logs'))) {
			//create log directory
			await fsPromises.mkdir(path.join(__dirname, '..', 'logs'));
		}
		await fsPromises.appendFile(
			path.join(__dirname, '..', 'logs', logFileName),
			logItem
		);
	} catch (err) {
    console.log(err)
  }
};

//middleware
export const logger = (req, res, next) => {
  //create log
  logEvents(`${req.method}\t${req.url}\t${req.headers.origin}\n`,'reqLog.log');
  console.log( `${req.method} - ${req.path}`);
  next();
}
