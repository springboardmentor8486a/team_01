import User from '../models/users.js';
import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import cloudinary from '../config/cloudinary.js';

const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: '1h',
  });
};

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, location, role } = req.body;

  
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(409);
    throw new Error('User with this email already exists');
  }

  
  let profilePhotoUrl = '';
  if (req.file) {
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'user_profiles',
    });
    profilePhotoUrl = result.secure_url;
  } else if (req.body.profile_photo) {
    // fallback: take URL from body if passed
    profilePhotoUrl = req.body.profile_photo;
  }

  
  const user = await User.create({
    name,
    email,
    password,
    location,
    role,
    profile_photo: profilePhotoUrl,
  });

  if (user) {
    res.status(201).json({
      message: 'User registered successfully',
      token: generateToken(user._id, user.role),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profile_photo: user.profile_photo,
      },
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

export { registerUser };
