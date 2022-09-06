    const User = require('../modal/User')
    const jwt = require('jsonwebtoken')
    
    
    const handleRefreshToken = async (req, res) => {
    const cookies = req.cookies
    
    if(!cookies?.jwt) return res.sendStatus(401)
    
    const refreshToken = cookies?.jwt
    const foundUser = await User.findOne({ refreshToken }).exec()
    if(!foundUser) return res.sendStatus(403) // Forbidden
    
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
        })
    }
    
    module.exports = { handleRefreshToken }