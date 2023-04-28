import jwt from 'jsonwebtoken'

const config = process.env;
 
const auth = (req, res, next) => 
{
    let access_token = req.headers.cookie
    access_token = access_token.split("access_token=")
    access_token = access_token[1];
    
    if (!access_token)
        return res.send("A token is required for authentication");
    
    try 
    {
        jwt.verify(access_token, config.TOKEN_KEY, 
            (err, user) => 
            {
                if(err)
                    return res.send(err)

                req.body.user = user
                next()
            }
        );
    } 
    catch (err) 
    {
        res.status(401).send("Invalid Token");
    }
};

module.exports = auth;
