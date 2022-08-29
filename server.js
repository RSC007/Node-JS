const http = require('http')
const fs = require('fs')
const fsPromises = require('fs').promises
const path = require('path')

const EventEmitter = require('events')

const logEvents = require('./logEvents')

class Emitter extends EventEmitter {};
const myEmitter = new Emitter()
myEmitter.on('log', (msg, filename) => logEvents(msg, filename))
const PORT = process.env.PORT || 2500;

const serveFile = async (filePath, contentType, response) =>{
    try{
        const data = await fsPromises.readFile(filePath, 'utf8')
        response.statusCode =  filePath.includes('404.html') ? 404 : 200
        response.end(contentType === 'application/json' ? JSON.parse(data) : data)

    }catch (err) {
        console.log(err);
        myEmitter.emit('log', `${err.name}\t${err.message}`, 'errLog.txt' )
        response.statusCode = 500
        response.end()
    }

}

const server = http.createServer((req, res) =>{
    console.log(req.url, req.method);
    myEmitter.emit('log', `${req.url}\t${req.method}`, 'reqLog.txt');

    const extension = path.extname(req.url);

    let contentType;

    switch (extension) {
        case '.css':
            contentType = 'text/css';
            break;
        case '.js':
            contentType = 'text/javascript';
            break;
        case '.json':
            contentType = 'application/json';
            break;
        case '.jpg':
            contentType = 'image/jpeg';
            break;
        case '.png':
            contentType = 'image/png';
            break;
        case '.txt':
            contentType = 'text/plain';
            break;
        default:
            contentType = 'text/html';
    }

    let filePath =
        contentType === 'text/html' && req.url === '/'
            ? path.join(__dirname, 'views', 'index.html')
            : contentType === 'text/html' && req.url.slice(-1) === '/'
                ? path.join(__dirname, 'views', req.url, 'index.html')
                : contentType === 'text/html'
                    ? path.join(__dirname, 'views', req.url)
                    : path.join(__dirname, req.url);

    // makes the .html extention
    if(!extension && req.url.slice(-1) !== '/') filePath += '.html'

    const existFile = fs.existsSync(filePath)

    if(existFile){
        serveFile(filePath, contentType, res)
    }else{
        switch (path.parse(filePath).base) {
            case 'old-page.html':
                res.writeHead(301, { 'Location': '/new-page.html' });
                res.end();
                break;
            case 'www-page.html':
                res.writeHead(301, { 'Location': '/' });
                res.end();
                break;
            default:
                serveFile(path.join(__dirname, 'views', '404.html'), 'text/html', res);
        }
    }

})

server.listen(PORT, () => console.log(`Server running at PORT : ${PORT}`))