import express from 'express';
const router = express.Router();

import UserController from '../controllers/user.js';
import checkAuth from '../middleware/check-auth.js'

/**
 * @swagger
 * /signup:
 * get:
 *  description: sign up
 */
router.post("/auth/signup", UserController.user_signup);

router.post("/auth/login", UserController.user_login);
router.get("/", UserController.user_get_all);



export default router
