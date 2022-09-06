# Node-JS
This repository content all the basic to advance api configuration.

**Make sure before running the project add .env file to in your local**
1. ACCESS_TOKEN_SECRET (require('crypto').random(64).toString('hex'))
2. REFRESH_TOKEN_SECRET
3. DATABASE_URI ( from mongo cluster generater URL)

## Type of Middlewares
1. Build-in Middleware
2. Custom Middleware
3. Third Party Middleware

**Instatll All packages local and dev**
    1. To start: *npm run dev*

### This project follow the MVC modal.

## Access and RefreshToken
### When you logged in you send json *accessToken* and hold *refreshToken* in database, when you request for refreshToken it compare with your .env REFRESH_TOKEN and generate the new *accessToken* and send in frontend.

## Role Authentication

### For delete and post the data each user have different different roles, check you role if your getting *Unauthorized*