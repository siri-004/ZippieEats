const registerUser = async (req, res) => {
  res.json({ message: "Register works" });
};

const loginUser = async (req, res) => {
  res.json({ message: "Login works" });
};

module.exports = { registerUser, loginUser };
