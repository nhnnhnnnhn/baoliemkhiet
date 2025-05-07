const authService = require("../services/auth.service");
const controllerHandler = require("../utils/controllerHandler");
const userService = require("../services/user.service");

const login = controllerHandler(async (req, res) => {
  const { email, password } = req.body;
  const { accessToken, refreshToken, user } = await authService.loginUser(
    email,
    password
  );
  res.status(200).json({
    accessToken,
    refreshToken,
    user: {
      id: user.id,
      email: user.email,
      fullname: user.name || user.fullname || '', // Trả về fullname thay vì name
      role: user.role,
    },
  });
});

const register = controllerHandler(async (req, res) => {
  const { email, password, fullname,bio, avatar, role, otp, action } = req.body;
  const user = await authService.registerUser(email, password, fullname, bio, avatar, role, otp, action);
  res.status(201).json({
    id: user.id,
    email: user.email,
    fullname: user.name || user.fullname || '', // Trả về fullname thay vì name
    role: user.role,
    bio: user.bio,
    avatar: user.avatar,    
  });
});

const changePassword = controllerHandler(async (req, res) => {
  const { email, oldPassword, newPassword } = req.body;
  await authService.changePassword(email, oldPassword, newPassword);
  res.status(200).json({ message: "Password changed successfully" });
});

const getProfile = controllerHandler(async (req, res) => {
  const userId = req.user.id;
  const user = await userService.getUserById(userId);
  res.status(200).json({
    data: user
  });
});

const updateProfile = controllerHandler(async (req, res) => {
  const userId = req.user.id;
  const updateData = req.body;
  
  // Ensure only allowed fields are updated
  const allowedFields = ['fullname', 'email', 'phone', 'address', 'bio', 'avatar'];
  const filteredData = Object.keys(updateData)
    .filter(key => allowedFields.includes(key))
    .reduce((obj, key) => {
      obj[key] = updateData[key];
      return obj;
    }, {});

  const updatedUser = await userService.updateUser(userId, filteredData);
  res.status(200).json(updatedUser);
});

module.exports = {
  login,
  register,
  changePassword,
  getProfile,
  updateProfile
};