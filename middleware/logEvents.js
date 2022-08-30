const { format } = require('date-fns');
const fs = require('fs')
const fsPromise = require('fs').promises
const path = require('path')

const logEvents = async (message, logName) => {
    const logDate = `${format(new Date(), 'yyyy-MM-dd\tHH:MM:SS')}` 
    const logItem = `${logDate}\t${message}\n`

    try{
        if(!fs.existsSync(path.join(__dirname, '..', 'logs'))){
            await fsPromise.mkdir(path.join(__dirname, '..', 'logs'))
        }
        await fsPromise.appendFile(path.join(__dirname, '..', 'logs', logName), logItem)
    }catch (err) {
        console.log(err);
    }
}

const logger = (req, res, next) => {
    logEvents(`${req.method}\t${req.headers.origin} ${req.url}`, 'reqLog.txt')
    console.log(`${req.method} ${req.path}`)
    next()
}

module.exports = {logger, logEvents}