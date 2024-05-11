import { Router } from 'express';
import verifyJWT from '../middlewares/auth.middleware.js';
import { sendMessage, allMessages } from '../controllers/message.controller.js';
const router = Router();

// router.route('/').get(verifyJWT, (req, res) => {
//     console.log(req?.body);
// });

// router.route('/').get(verifyJWT, fetchChats);
router.route('/').post(verifyJWT, sendMessage);
router.route('/:chatId').get(verifyJWT, allMessages);

// router.route('/groupadd').put(verifyJWT, addToGroup);
// router.route('/groupremove').put(verifyJWT, removeFromGroup);

export default router;
