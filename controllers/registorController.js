const usersDB = {
    users: require('../modal/users.json'),
    setUsers: function (data) { this.users = data }
}

const fsPromises = require('fs').promises
const path = require('path')
const bcrypt = require('bcrypt')

const handleNewUser = async (req, res) =>{
    const { username, password } = req.body

    if(!username || !password) return res.sendStatus(400).json({ "message": "Username and Password are required!" })

    // Check the duplicates in userDB
    const existUser = usersDB.users.find(person => person.username === username )
    if(existUser) return res.sendStatus(409) // Conflict
    try {
        // encrypt the password
        const hashePwd = await bcrypt.hash(password, 10)
        // store the new username
        const newUser = { 
            "username": username,
            "roles": { "User": 2001 },
            "password": hashePwd
         }
        usersDB.setUsers([ ...usersDB.users, newUser ])
        await fsPromises.writeFile(
            path.join(__dirname, '..', 'modal', 'users.json'),
            JSON.stringify(usersDB.users)
        )
        res.status(201).json({ 'success': `New username ${username} created!` })
    } catch (err) {
        res.status(500).json({ 'message' : err.message })
    }
}

module.exports = { handleNewUser }