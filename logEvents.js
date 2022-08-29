const { format } = require('date-fns');

const fs = require('fs');
const { builtinModules } = require('module');
const fsPromise = require('fs').promises
const path = require('path')

const logEvents = async (message, logName) => {
    const logDate = `${format(new Date, 'yyyy-MM-dd\tHH:MM:SS')}` 
    const logItem = `${logDate}\t${message}\n`

    try{
        if(!fs.existsSync(path.join(__dirname, 'logs'))){
            await fsPromise.mkdir(path.join(__dirname, 'logs'))
        }
        await fsPromise.appendFile(path.join(__dirname, 'logs', logName), logItem)
        console.log("Message : ", logItem)
    }catch (err) {
        console.log(err);
    }
}

module.exports = logEvents
