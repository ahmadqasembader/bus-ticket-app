import express from 'express'
import bodyParser from 'body-parser'
import UserOperations from '../controllers/controllers.js';
import auth from '../middlerware/auth.js'


const router = express.Router();
router.use(bodyParser.urlencoded({extended: true}))
router.use(express.json());

/**
 * creating a new user controller
 */
const user = new UserOperations("User Created!");

router.get('/', user.index);
router.get('/dashboard', auth, user.dashboard);
router.get('/logout', user.logout);
router.post('/login', user.login);
router.get('/signup', user.signup);
router.post('/create', user.create);


export default router;