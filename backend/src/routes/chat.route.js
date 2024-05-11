import { Router } from 'express';
import verifyJWT from '../middlewares/auth.middleware.js';
import {
  accessChat,
  fetchChats,
  createGroupChat,
  renameGroup,
  removeFromGroup,
  addToGroup,
} from '../controllers/chat.controller.js';
const router = Router();

router.route('/').post(verifyJWT, accessChat)
router.route('/').get(verifyJWT, fetchChats)
router.route('/group').post(verifyJWT, createGroupChat);
router.route('/rename').put(verifyJWT, renameGroup);
router.route('/groupadd').put(verifyJWT, addToGroup);
router.route('/groupremove').put(verifyJWT, removeFromGroup);


// router.route('/delete/:messageId').delete(verifyJWT, deleteMessage);

export default router;
