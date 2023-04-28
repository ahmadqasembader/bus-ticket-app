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

    dashboard(req, res) {
        /**
         * if user not logged in, redirect to '/login'
         */
        res.send("Dashboard");
    }

    async login(req, res) {
        /// Fetching user info
        let { email, password } = req.body;

        /// creating a jwt token for the login 
        /// and store it in the cookies
        const token = jwt.sign({ email, password }, config.TOKEN_KEY, { expiresIn: "24h" });
        res.cookie("access_token", token, { httpOnly: true });

        console.log(req.body);
        res.send(req.body);
    }

    async signup(req, res) {
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
}

export default UserOperations 