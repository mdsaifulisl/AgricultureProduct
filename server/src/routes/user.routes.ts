import { Router } from 'express';
import { UserController } from '../controllers/user.controller.js';
import { validate } from '../middlewares/validate.js';
import {
  createUserSchema,
  updateUserSchema,
} from '../validations/user.validation.js';
import { auth } from '../middlewares/auth.js';  

const router = Router();


// User CRUD Routes
router.get('/', auth('admin', 'moderator'), UserController.getUsers);
router.post('/', auth('admin'), validate(createUserSchema), UserController.createUser);
router.patch('/:id', auth('admin'), validate(updateUserSchema), UserController.updateUser);
router.delete('/:id', auth('admin'), UserController.deleteUser);




export default router;