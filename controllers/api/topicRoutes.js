const router = require('express').Router();
const { User, Topic, Message } = require('../../models');
const withAuth = require('../../utils/auth');

// The `/api/topics` endpoint

router.get('/', withAuth, async (req, res) => {
  // find all topics only for authorised users
  try {
    const topicData = await Topic.findAll({
      include: [{ model: User, attributes: { exclude: ['password'] }}, { model: Message }]
    });
    res.status(200).json(topicData);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/:id', async (req, res) => {
  // find one topic by its `id` value
  try {
    const topicData = await Topic.findByPk(req.params.id, {
      include: [{ model: User, attributes: { exclude: ['password'] }}, { model: Message }]
    });

    if (!topicData) {
      res.status(404).json({message: 'No topic found with this id!'});
      return;
    }

    res.status(200).json(topicData);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post('/', withAuth, async (req, res) => {
  // create a new topic only for authorised users
  /* req.body should look like this...
    {
      topic_name: "travel",
      user_id: 3,
    }
  */
  try {
    const newTopic = await Topic.create({
      ...req.body,
      user_id: req.session.user_id
    });
    res.status(200).json(newTopic);
  } catch (err) {
    res.status(400).json(err);
  }
});

module.exports = router;