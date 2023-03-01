const router = require('express').Router();
const { User, Topic, Message } = require('../../models');

// The `/api/topics` endpoint

router.get('/', async (req, res) => {
  // find all topics
  try {
    const topicData = await Topic.findAll({
      include: [{ model: User, attributes: { exclude: ['password'] }}, { model: Message }],
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
      include: [{ model: User, attributes: { exclude: ['password'] } }, { model: Message }]
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

router.post('/', async (req, res) => {
  // create a new topic
  /* req.body should look like this...
    {
      topic_name: "travel",
      user_id: 3,
    }
  */
  try {
    const newTopic = await Topic.create(req.body);
    res.status(200).json(newTopic);
  } catch (err) {
    res.status(400).json(err);
  }
});

module.exports = router;