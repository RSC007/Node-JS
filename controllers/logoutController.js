    const User = require('../modal/User')
    
    const handleLogout = async (req, res) => {
    const cookies = req.cookies
    
    if(!cookies?.jwt) return res.sendStatus(204) // (success status) for - No Contect
    
    const refreshToken = cookies?.jwt
    const foundUser = await User.findOne({ refreshToken }).exec()
    if(!foundUser) {
        res.clearCookie('jwt', { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 })
        return res.sendStatus(204) // No Content
    }
        // delete the token from DB
        foundUser.refreshToken = ''
        foundUser.save()

        // maxAge is optional
        res.clearCookie('jwt', { httpOnly: true, maxAge: 24 * 60 * 60 * 1000, sameSite: 'None', secure: true }) // secure: true - for https request
        res.sendStatus(204)
    }
    
    module.exports = { handleLogout }