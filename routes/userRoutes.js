import express from 'express';
import { createNewUser, getAllUsers, updateUser, deleteUser } from '../controllers/usersController.js'

export const users = express.Router();

users.route('/')
  .get(getAllUsers)
  .post(createNewUser)
  .patch(updateUser)
  .delete(deleteUser)

