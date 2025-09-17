import express from 'express';
import upload from "../middleware/upload.js";
const router = express.Router();
import { registerUser } from '../controllers/userController.js';

// When a POST request is made to '/api/users/register', call the registerUser function

router.post("/register", upload.single("profileImage"), registerUser);

export default router;