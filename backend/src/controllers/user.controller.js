const userService = require("../services/user.service");
const controllerHandler = require("../utils/controllerHandler");

const createUser = controllerHandler(async (req, res) => {
  const { email, password, fullname, avatar, bio } = req.body;
  
  if (!email || !password || !fullname) {
    throw new Error("Email, password and fullname are required");
  }

  // Set default role as USER for new registrations
  const userData = {
    email,
    password,
    fullname,
    role: "USER",
    avatar: avatar || null,
    bio: bio || null
  };

  const user = await userService.createUser(userData);
  res.status(201).json(user);
});

const getAllUsers = controllerHandler(async (req, res) => {
  const { role, search, page, limit } = req.query;
  
  const filters = {};
  if (role) filters.role = role;
  if (search) filters.search = search;

  const pagination = {};
  if (page) pagination.page = parseInt(page);
  if (limit) pagination.limit = parseInt(limit);

  const result = await userService.getAllUsers(filters, pagination);
  res.status(200).json(result);
});

const getUserById = controllerHandler(async (req, res) => {
  const { id } = req.params;

  if (isNaN(id)) {
    throw new Error("Invalid user ID");
  }

  const user = await userService.getUserById(parseInt(id));
  res.status(200).json(user);
});

const deleteUser = controllerHandler(async (req, res) => {
  const { id } = req.params;

  if (isNaN(id)) {
    throw new Error("Invalid user ID");
  }

  // Prevent user from deleting themselves
  if (parseInt(id) === req.user.id) {
    throw new Error("Cannot delete your own account");
  }

  await userService.deleteUser(parseInt(id));
  res.status(204).send();
});

const updateUser = controllerHandler(async (req, res) => {
  const { id } = req.params;
  const userData = req.body;

  if (isNaN(id)) {
    throw new Error("Invalid user ID");
  }

  // Only admin can update other users
  if (parseInt(id) !== req.user.id && req.user.role !== "ADMIN") {
    throw new Error("You don't have permission to update this user");
  }

  // Non-admin users can't change their role
  if (req.user.role !== "ADMIN" && userData.role) {
    throw new Error("You don't have permission to change role");
  }

  const user = await userService.updateUser(parseInt(id), userData);
  res.status(200).json(user);
});

module.exports = {
  createUser,
  getAllUsers,
  getUserById,
  deleteUser,
  updateUser,
};