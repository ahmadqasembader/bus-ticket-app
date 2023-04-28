import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import User from '../mongoose.js';
import dotenv from 'dotenv'
dotenv.config();
const config = process.env;

class UserOperations {
    constructor(msg) {
        console.log('Message: ' + msg);
    }

    index(req, res)
    {
        let flag = false;
        //redirecting to the dashboard if the user didn't logout
        if(req.headers.cookie){
            let access_token = req.headers.cookie
            access_token = access_token.split("access_token=")
            access_token = access_token[1];
            jwt.verify(access_token, config.TOKEN_KEY, (err, user) => {
                if(err)
                    return err;
                res.redirect('dashboard')
            });
        }else{
            //otherwise redirect to the login page
            res.render('login', {flag})
        }
    }

    dashboard(req, res) 
    {
        const {user} = req.body.user
        res.render('dashboard', {user})//send the data to the ejs file
    }

    async login(req, res) {
        /// Fetching user info
        let { email, password } = req.body;

        let flag = false;
        const user = await User.findOne({ email })
        if (user && (await bcrypt.compare(password, user.passwordHashed)))
        {
            /// creating a jwt token for the login 
            /// and store it in the cookies
            const token = jwt.sign({ email, password }, config.TOKEN_KEY, { expiresIn: "24h" });
            res.cookie("access_token", token, { httpOnly: true });

            console.log(req.body);
            res.redirect('/')
        }else
        {
            flag = true;
            res.render('login', {flag});
        }

    }

    signup(req, res)
    {
        res.render('signup')
    }

    async create(req, res) {
        
        let { name, email, password, phoneNumber } = req.body;

        const passwordHashed = await bcrypt.hash(password, 10);

        try {
            /**
             * 1. 
             *      Create the user in the DB 
             *      and check if it already exist
             */

            const user = new User({ name, email, passwordHashed, phoneNumber });


            /**
             * 2.
             *      Generate a jwt token for the user
             *      and store it in the cookies
             */

            //Generate JWT token for each created user
            const token = jwt.sign({ user }, config.TOKEN_KEY, { expiresIn: "24h" })
            user.token = token;
            res.cookie("access_token", token, { httpOnly: true })


            /**
             * 3.
             *      Save user the in the DB
             *      and redirect to the homepage
             */
            user.save();
            res.redirect('/');

        } catch (error) {
            res.json(error);
        }
    }

    async logout(req, res)
    {
        res.clearCookie("access_token")
        res.redirect('/')
    }
}

export default UserOperations 