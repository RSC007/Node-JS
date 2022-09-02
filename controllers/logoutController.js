const usersDB = {
    users: require('../modal/users.json'),
    setUsers: function (data) { this.users = data }
    }
    const fsPromises = require('fs').promises
    const path = require('path')
    
    const handleLogout = async (req, res) => {
    const cookies = req.cookies
    
    if(!cookies?.jwt) return res.sendStatus(204) // (success status) for - No Contect
    
    const refreshToken = cookies?.jwt
    const foundUser = usersDB.users.find(person => person.refreshToken === refreshToken)
    if(!foundUser) {
        res.clearCookie('jwt', { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 })
        return res.sendStatus(204) // No Content
    }
    console.log('----------------------------------------------------------', foundUser, usersDB.users.map(person => person.refreshToken === foundUser.refreshToken ? ({...person, refreshToken: '' }) : person) );
    // delete the token from DB
    usersDB.setUsers(usersDB.users.map(person => person.refreshToken === foundUser.refreshToken ? ({...person, refreshToken: '' }) : person))
        await fsPromises.writeFile(
        path.join(__dirname, '..', 'modal', 'users.json'),
        JSON.stringify(usersDB.users)
    )
        // maxAge is optional
        res.clearCookie('jwt', { httpOnly: true, maxAge: 24 * 60 * 60 * 1000, sameSite: 'None', secure: true }) // secure: true - for https request
        res.sendStatus(204)
    }
    
    module.exports = { handleLogout }