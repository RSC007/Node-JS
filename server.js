const express = require('express')
const app = express()
const path = require('path')
const cors = require('cors')
const { logger } = require('./middleware/logEvents')
const errorHandler = require('./middleware/errorHandler')

const PORT = process.env.PORT || 2500

// custom middleware
app.use(logger)

// Cros Origin Source Sharing ( Its Kind of Third Party Middleware )
// whiteList can only the origin which can access
const whiteList = ['https://myWebsiteName.com', 'https://www.google.co.in', 'http://127.0.0.1: 5500', 'http://localhost:2500']
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
app.use(cors(crosOptions))

// Buid-in middleware to handle urlencoded data
// in other words, form data;
// content-type: application/x-www-form-uelencoded
app.use(express.urlencoded({ extended: false}))

// build-in middleware for json
app.use(express.json())

// server static files
app.use('/', express.static(path.join(__dirname, '/public')))
app.use('/subdir', express.static(path.join(__dirname, '/public')))

// routes
app.use('/', require('./routes/root'))
app.use('/subdir', require('./routes/subdir'))
app.use('/employees', require('./routes/api/employees'))

// Route handle
app.get('/hello(.html)?', (req, res, next)=>{
    console.log("Attampt to load hello.html");
    next()
}, (req, res)=>{
    res.send("Hello Word!")
})

// chaining route handlers
const one = (req, res, next) => {
    console.log('one');
    next();
}

const two = (req, res, next) => {
    console.log('two');
    next();
}

const three = (req, res) => {
    console.log('three');
    res.send('Finished!');
}

app.get('/chain(.html)?', [one, two, three])

// Any route that made this far, follwing response will get respectively
app.get('*', (req, res)=>{
    res.status = 404
    // if(req.accepted('html')){
        res.sendFile(path.join(__dirname, 'views', '404.html'))
    // }else if(req.accepted('json')){
    //     res.json({ error: '404 Not Found'})
    // }else {
    //     res.type('txt').send('404 Not Found')
    // }

})

// Middleware respond the error if crosOptions send failed message
app.use(errorHandler)


app.listen(PORT, () => console.log(`Server running at PORT : ${PORT}`))