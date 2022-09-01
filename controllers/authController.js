const usersDB = {
    users: require('../modal/users.json'),
    setUsers: function (data) { this.users = data }
    }
    
    const bcrypt = require('bcrypt')
    
    const jwt = require('jsonwebtoken')
    require('dotenv').config()
    const fsPromises = require('fs').promises
    const path = require('path')
    
    const handleLogin = async (req, res) => {
    const { username, password } = req.body
    
    if(!username || !password) return res.sendStatus(400).json({ "message": "Username and Password are required!" })
    
    const foundUser = usersDB.users.find(person => person.username === username)
    if(!foundUser) return res.sendStatus(409) // UnAuthorized
    // evaluate password
    const match = await bcrypt.compare(password, foundUser.password)
    console.log("-----------------------------------------------", foundUser, match );
    if(match) {
    // create JWT
    // Dont pass the password it risk you security
    const accessToken = jwt.sign(
        { "username": foundUser.username },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '30s' }
    )
    const refreshToken = jwt.sign(
        { "username": foundUser.username },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: '1d' }
    )
    // Saving the refreshToken with current user
    usersDB.setUsers(usersDB.users.map(person => person.username === foundUser.username ? ({...person, refreshToken}) : person))
    await fsPromises.writeFile(
            path.join(__dirname, '..', 'modal', 'users.json'),
            JSON.stringify(usersDB.users)
        )
            res.cookie('jwt', refreshToken, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 })
            res.json({ accessToken })
        }else{
            res.sendStatus(401) // UnAuthorized
        }
    }
    
    module.exports = { handleLogin }