const express = require('express')
const router = express.Router()
const { handleNewUser } = require('../../controllers/registorController')

router.post('/', handleNewUser)

module.exports = router;