const User = require("../schemas/User");
const jwt = require("jsonwebtoken");

const createToken = (user) => {
  const isLoggedIn = {
    id: user._id,
  };
  return jwt.sign(isLoggedIn, process.env.USER_SECRET, { expiresIn: "1h" });
};

// login
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.login(email, password);
    const token = createToken(user);
    res.status(200).json({ email, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// signup
const signUpUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.signup(email, password);
    const token = createToken(user._id);
    res.status(200).json({ email, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = { loginUser, signUpUser };
