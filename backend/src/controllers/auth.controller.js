const authService = require("../services/auth.service");
const controllerHandler = require("../utils/controllerHandler");

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
      name: user.name,
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
    name: user.name,
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

module.exports = {
  login,
  register,
  changePassword,
};
