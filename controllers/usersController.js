import { User } from '../models/User.js';
import { Note } from '../models/Note.js';
import asyncHandler from 'express-async-handler';
import bcrypt from 'bcrypt';

//@ACCESS PRIVATE

//@desc GET ALL USERS
//@route GET /users
export const getAllUsers = asyncHandler(async (req, res) => {
	const users = await User.find().select('-password').lean();
	if (!users?.length) return res.status(400).json({ message: 'No users found' });
	res.status(200).json(users);
});


//@desc CREATE NEW USER
//@route POST /users
export const createNewUser = asyncHandler(async (req, res) => {
	const { username, password, roles } = req.body;
	//confirm data
	if (!username || !password || !roles.length || !Array.isArray(roles)) {
		return res.status(400).json({ message: 'All fields required' });
	}

	//check for duplicates
	const foundUser = await User.findOne({ username }).lean().exec();
	if (foundUser)
		return res.status(409).json({ message: 'The user already exist' });

	//hash password
	const hashedPwd = await bcrypt.hash(password, 10);

	//create new User
	const newUser = {
		username: username,
		password: hashedPwd,
		roles: roles,
	};

	//store new user
	const user = await User.create(newUser);
	if (user) {
		res.status(201).json({ message: `New user ${username} created` });
	} else {
		res.status(400).json({ message: 'Invalid user data received' });
	}
});


//@desc UPDATE USER
//@route PATCH /users
export const updateUser = asyncHandler(async (req, res) => {
	const { id, username, roles, active, password } = req.body;

	//confirm data
	if (!id||!username||typeof active !== 'boolean'||!roles.length||!Array.isArray(roles)) {
		return res.status(400).json({ message: 'All fields required' });
	}

	//check for user
	const foundUser = await User.findById(id).exec();
	if (!foundUser) return res.status(400).json({ message: 'User not found' });

	//check for duplicates
	const duplicate = await User.findOne({ username }).lean().exec();
	//Allow update to the original user
	if (duplicate && duplicate?._id.toString() !== id) {
		return res.status(409).json({ message: 'Duplicate username' });
	}

	//update user
	foundUser.username = username;
	foundUser.roles = roles;
	foundUser.active = active;
	//if password exist
	if (password) {
		foundUser.password = await bcrypt.hash(password, 10);
	}

	const updatedUser = await foundUser.save();
	res.json({ message: `${updatedUser.username} updated` });
});


//@desc DELETE USER
//@route DELETE /users
export const deleteUser = asyncHandler(async (req, res) => {
	const { id } = req.body;
	if (!id) return res.status(400).json({ message: 'User id required' });

	//check if there are user assigned notes
	const notes = await Note.findOne({ user: id }).lean().exec();
	if (notes)
		return res.status(400).json({ message: 'User has assigned notes' });

	//find user
	const user = await User.findById(id).exec();
	if (!user) return res.status(400).json({ message: 'User not found' });

	//delete user
	const result = await user.deleteOne();
	const reply = `Username ${user.username} with ID ${user._id} deleted`;
	res.json(reply);
});

//@ACCESS PUBLIC
