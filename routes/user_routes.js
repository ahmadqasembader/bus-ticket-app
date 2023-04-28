import express from 'express'
import bodyParser from 'body-parser'
import UserOperations from '../controllers/controllers.js';



const router = express.Router();
router.use(bodyParser.urlencoded({extended: true}))

/**
 * creating a new user controller
 */
const user = new UserOperations("User Created!");


router.get('/', user.dashboard);
router.post('/login', user.login);
router.post('/signup', user.signup);


export default router;