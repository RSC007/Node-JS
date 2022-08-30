const express = require('express')
const router = express.Router()
const path = require('path')

router.get('^/$|index(.html)?', (req, res) =>{
    res.sendFile(path.join(__dirname, '..', 'views', 'index.html'))
})

router.get('/newPage(.html)?', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'newPage.html'))
})

router.get('/oldPage(.html)?', (req, res)=>{
    res.redirect(301, '/newPage.html')  // By default 302
})

module.exports = router