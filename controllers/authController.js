const User = require('../modal/User')
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const handleLogin = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password)
    return res
      .sendStatus(400)
      .json({ message: "Username and Password are required!" });

  const foundUser = await User.findOne({ username })
  if (!foundUser) return res.sendStatus(409); // UnAuthorized
  // evaluate password
  const match = bcrypt.compare(password, foundUser.password);
  
  if (match) {
    // create JWT
    // Dont pass the password it risk you security
    const accessToken = jwt.sign(
      {
        UserInfo: {
          username: foundUser.username,
          roles: foundUser.roles
        }
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "60s" }
    );
    const refreshToken = jwt.sign(
      { username: foundUser.username },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "1d" }
    );
    // Saving the refreshToken with current user
    foundUser.refreshToken = refreshToken
    foundUser.save()

    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000
    });
    res.json({ accessToken });
  } else {
    res.sendStatus(401); // UnAuthorized
  }
};

module.exports = { handleLogin };
