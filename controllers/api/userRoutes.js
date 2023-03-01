const router = require("express").Router();
const { User, Topic, Message } = require("../../models");
const bcrypt = require("bcrypt");

// The `/api/users` endpoint

router.get("/", async (req, res) => {
  // find all users
  try {
    const userData = await User.findAll({
      include: [{ model: Topic }, { model: Message }],
    });
    res.status(200).json(userData);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post("/login", async (req, res) => {
  try {
    const userData = await User.findOne({
      where: {
        user_name: req.body.user_name,
      },
    });
    console.log(userData)

    if (!userData) {
      res
        .status(400)
        .json({ message: "Incorrect email or password, please try again" });
      return;
    }

    // Check if password matches
    const isMatch = await bcrypt.compare(req.body.password, userData.password);
    console.log(`password match is ${isMatch}`)

    if (!isMatch) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid password" });
    }

    res.status(200).json({ success: true, message: "Login successful", user_name: userData.user_name});
  } catch (err) {
    res.status(400).json(err);
  }
});

router.get("/:id", async (req, res) => {
  // find one user by their `id` value
  try {
    const userData = await User.findByPk(req.params.id, {
      include: [{ model: Topic }, { model: Message }],
    });

    if (!userData) {
      res.status(404).json({ message: "No user found with this id!" });
      return;
    }

    res.status(200).json(userData);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post("/", async (req, res) => {
  // create a new user
  /* req.body should look like this...
    {
      user_name: "John1",
      password: "Password1234",
      email: "john@example.com"
    }
  */
  try {
    const newUser = await User.create(req.body);
    res.status(200).json(newUser);
  } catch (err) {
    res.status(400).json(err);
  }
});

module.exports = router;
