const router = require('express').Router();
const { User, Topic, Message } = require('../../models');
const withAuth = require('../../utils/auth');

// The `/api/messages` endpoint

router.get('/', withAuth, async (req, res) => {
  // find all messages only for authorised users
  try {
    const messageData = await Message.findAll({
      include: [{ model: Topic }, { model: User, attributes: { exclude: ['password'] } }]
    });
    res.status(200).json(messageData);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/:id', async (req, res) => {
  // find one message by its `id` value
  try {
    const messageData = await Message.findByPk(req.params.id, {
      include: [{ model: Topic }, { model: User, attributes: { exclude: ['password'] } }],
    });

    if (!messageData) {
      res.status(404).json({message: 'No message found with this id!'});
      return;
    }

    res.status(200).json(messageData);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post('/', withAuth, async (req, res) => {
  // create a new message only for authorised users
  /* req.body should look like this...
    {
      content: "So then I says to Mabel, I says…",
      user_id: 1,
      topic_id: 4
    }
  */
  try {
    const newMessage = await Message.create({
      ...req.body,
      user_id: req.session.user_id
    });
    res.status(200).json(newMessage);
  } catch (err) {
    res.status(400).json(err);
  }
});

module.exports = router;