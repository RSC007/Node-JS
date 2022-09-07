const whiteList = [
    'https://myWebsiteName.com',
    'https://www.google.co.in',
    'http://127.0.0.1: 5500',
    'http://localhost:2500',
    'http://localhost:3000'
    ]
const crosOptions = {
    origin: (origin, callback) => {
        if(whiteList.indexOf(origin) !== -1 || !origin){
            callback(null, true)
        }else{
            callback(new Error('Not Allowed by CORS'))
        }
    },
    optionsSuccessStatus: 200
}

module.exports = crosOptions