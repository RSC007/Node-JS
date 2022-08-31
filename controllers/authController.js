const usersDB = {
    users: require('../modal/users.json'),
    setUsers: function (data) { this.users = data }
}

const bcrypt = require('bcrypt')

const handleLogin = async (req, res) => {
    const { username, password } = req.body

    if(!username || !password) return res.sendStatus(400).json({ "message": "Username and Password are required!" })

    const foundUser = usersDB.users.find(person => person.username === username)
    if(!foundUser) return res.sendStatus(409) // UnAuthorized
    // evaluate password
    const match = await bcrypt.compare(password, foundUser.password) 
    if(match) {
        // create JWT
        res.json({ 'success': `User ${username} logedIn Successfully` })
    }else{
        res.sendStatus(401) // UnAuthorized
    }   
}

module.exports = { handleLogin }