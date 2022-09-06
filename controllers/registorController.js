const User = require('../modal/User')
const bcrypt = require('bcrypt')

const handleNewUser = async (req, res) =>{
    const { username, password } = req.body

    if(!username || !password) return res.sendStatus(400).json({ "message": "Username and Password are required!" })

    // Check the duplicates in userDB
    const existUser = await User.findOne({ username }).exec()
    if(existUser) return res.send(409).json({ 'message': 'User Name is already exist!' }) // Conflict
    try {
        // encrypt the password
        const hashePwd = await bcrypt.hash(password, 10)
        // store the new username
        const newUser = await User.create({ 
            "username": username,
            "roles": { "User": 2001 },
            "password": hashePwd
         })
        res.status(201).json({ 'success': `New username ${username} created!` })
    } catch (err) {
        res.status(500).json({ 'message' : err.message })
    }
}

module.exports = { handleNewUser }