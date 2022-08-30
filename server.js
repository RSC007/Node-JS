const express = require('express')
const app = express()
const path = require('path')

const PORT = process.env.PORT || 2500

app.get('^/$|index(.html)?', (req, res) =>{
    res.sendFile(path.join(__dirname, 'views', 'index.html'))
})

app.get('/oldPage(.html)?', (req, res)=>{
    res.redirect(301, '/newPage.html')
})

app.get('/newPage(.html)?', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'newPage.html'))
})

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

app.get('/*', (req, res)=>{
    res.sendFile(path.join(__dirname, 'views', '404.html'))
})


app.listen(PORT, () => console.log(`Server running at PORT : ${PORT}`))