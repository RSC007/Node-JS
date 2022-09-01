const express = require('express')
const app = express()
const path = require('path')
const cors = require('cors')
const cookieeParser = require('cookie-parser')

const { logger } = require('./middleware/logEvents')
const errorHandler = require('./middleware/errorHandler')
const crosOptions = require('./config/coreOptions')
const verifyJWT = require('./middleware/verifyJWT')
const PORT = process.env.PORT || 2500

// custom middleware
app.use(logger)

// Cros Origin Source Sharing ( Its Kind of Third Party Middleware )
// whiteList can only the origin which can access

app.use(cors(crosOptions))

// Buid-in middleware to handle urlencoded data
// in other words, form data;
// content-type: application/x-www-form-uelencoded
app.use(express.urlencoded({ extended: false}))

// build-in middleware for json
app.use(express.json())

// middleware for cookiees
app.use(cookieeParser())

// server static files
app.use('/', express.static(path.join(__dirname, '/public')))

// routes
// following routes we can access without token to genrate or register random person
app.use('/', require('./routes/root'))
app.use('/register', require('./routes/api/register'))
app.use('/auth', require('./routes/api/auth'))
app.use('/refresh', require('./routes/api/refresh'))
app.use('/logout', require('./routes/api/logout'))

// This route need authentication, so thats why I added the auth middleware to generate the token using which randon user cant access without permission
app.use(verifyJWT)
app.use('/employees', require('./routes/api/employees'))

// Any route that made this far, follwing response will get respectively
app.get('*', (req, res)=>{
res.status = 404
// if(req.accepted('html')){
res.sendFile(path.join(__dirname, 'views', '404.html'))
// }else if(req.accepted('json')){
// res.json({ error: '404 Not Found'})
// }else {
// res.type('txt').send('404 Not Found')
// }

})

// Middleware respond the error if crosOptions send failed message
app.use(errorHandler)


app.listen(PORT, () => console.log(`Server running at PORT : ${PORT} ...`))