const authService = require("../services/auth.service");

async function login(req, res) {
  const { email, password } = req.body;

  try {
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
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
}
async function register(req, res) {
  const { email, password, fullname } = req.body;

  try {
    const user = await authService.registerUser(email, password, fullname);
    res.status(201).json({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}
module.exports = {
  login,
  register,
};
