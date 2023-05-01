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

            /// Getting the cookie
            let access_token = req.headers.cookie
            access_token = access_token.split("access_token=")
            access_token = access_token[1];
            
            /// Verifying the jwt token
            jwt.verify(access_token, config.TOKEN_KEY, (err, user) => {
                if(err)
                    return err;
                user = User.findOne(user.email);
                console.log("Index: " + user);
                res.redirect('/dashboard');
            });
        }else{
            //otherwise redirect to the login page
            console.log("Login redirecting");
            res.render('login', {flag})
        }
    }

    dashboard(req, res) 
    {
        const {email, name} = req.body
        console.log("Dashboard User: " + email, name);
        res.render('dashboard', {email, name})//send the data to the ejs file
    }


    async login(req, res) {
        /// Fetching user info
        let { email, password } = req.body;

        let flag = false;
        const user = await User.findOne({ email });
        if (user && (await bcrypt.compare(password, user.passwordHashed)))
        {
            /// creating a jwt token for the login 
            /// and store it in the cookies
            const token = jwt.sign({ email, password }, config.TOKEN_KEY, { expiresIn: "24h" });
            res.cookie("access_token", token, { httpOnly: true });
            res.redirect("/dashboard");
            // res.render('dashboard', {user});
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

    create(req, res) {
        
        let { name, email, password, phoneNumber } = req.body;
        
        const passwordHashed = bcrypt.hash(password, 10);
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

            const token = jwt.sign({ user }, config.TOKEN_KEY, { expiresIn: "24h" })
            user.token = token;
            res.cookie("access_token", token, { httpOnly: true })


            /**
             * 3.
             *      Save user the in the DB
             *      and redirect to the homepage
             */
            user.save();
            console.log("user saved!!");
            res.render('dashboard', {user});

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