const router = require('express').Router();
const { User, Topic, Message } = require('../../models');

// The `/api/users` endpoint

router.get('/', async (req, res) => {
  // find all users
  try {
    const userData = await User.findAll({
      include: [{ model: Topic }, { model: Message }]
    });
    res.status(200).json(userData);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/:id', async (req, res) => {
  // find one user by their `id` value
  try {
    const userData = await User.findByPk(req.params.id, {
      include: [{ model: Topic }, { model: Message }]
    });

    if (!userData) {
      res.status(404).json({message: 'No user found with this id!'});
      return;
    }

    res.status(200).json(userData);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post('/', async (req, res) => {
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