import { Router } from 'express';
import {
  registerUser,
  loginUser,
  logoutUser,
  allUser,
  verifyUser,
  //   getReceiver,
} from '../controllers/user.controller.js';
import verifyJWT from '../middlewares/auth.middleware.js';

const router = Router();

router.route('/signup').post(registerUser);
router.route('/search').get(verifyJWT, allUser);
router.route('/login').post(loginUser);
router.route('/logout').post(verifyJWT, logoutUser);
router.route('/verify').post(verifyJWT, verifyUser);
// router.route('/receiver/:receiverId').get(getReceiver);

export default router;
