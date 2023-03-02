const router = require("express").Router();
const { User, Topic, Message } = require("../../models");

// The `/api/users` endpoint

router.get("/", async (req, res) => {
  // find all users
  try {
    const userData = await User.findAll({
      include: [{ model: Topic }, { model: Message }],
      attributes: { exclude: ['password'] }
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

    if (!userData) {
      res
        .status(400)
        .json({ message: "Incorrect email or password, please try again" });
      return;
    }

    // Check if password matches
    const isMatch = await userData.checkPassword(req.body.password);
    console.log(`password match is ${isMatch}`);

    if (!isMatch) {
      return res
        .status(400)
        .json({ success: false, message: "Incorrect email or password, please try again" });
    }

    req.session.save(() => {
      req.session.user_id = userData.id;
      req.session.logged_in = true;

      res
        .status(200)
        .json({ success: true, user: userData, message: 'Login successful' });
    });
  } catch (err) {
    res.status(400).json(err);
  }
});

router.get("/:id", async (req, res) => {
  // find one user by their `id` value
  try {
    const userData = await User.findByPk(req.params.id, {
      include: [{ model: Topic }, { model: Message }],
      attributes: { exclude: ['password'] }
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

    req.session.save(() => {
      req.session.user_id = newUser.id;
      req.session.logged_in = true;

      res
        .status(200)
        .json({ success: true, user: newUser, message: "new user successfully created" });
    });
  } catch (err) {
    res.status(400).json(err);
  }
});

module.exports = router;
