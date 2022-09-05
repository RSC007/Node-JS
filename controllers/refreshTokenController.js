const usersDB = {
        users: require('../modal/users.json'),
        setUsers: function (data) { this.users = data }
    }
    const jwt = require('jsonwebtoken')
    require('dotenv').config()
    
    const handleRefreshToken = async (req, res) => {
    const cookies = req.cookies
    
    if(!cookies?.jwt) return res.sendStatus(401)
    
    const refreshToken = cookies?.jwt
    const foundUser = usersDB.users.find(person => person.refreshToken === refreshToken)
    if(!foundUser) return res.sendStatus(403) // Forbidden
    
    console.log("-00-0--00-000000-0-0-0", refreshToken, foundUser);
    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        (err, decoded) => {
            if(err || decoded.username !== foundUser.username) return res.sendStatus(403) // Forbidden
                const accessToken = jwt.sign(
                { 
                    "UserInfo": {
                        "username": foundUser.username,
                        "roles": foundUser.roles
                    }
                 },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: '60s' }
            )
        res.json({ accessToken })
        }
        )
    }
    
    module.exports = { handleRefreshToken }