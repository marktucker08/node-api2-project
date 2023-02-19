// implement your posts router here
const express = require('express');
const Post = require('./posts-model');

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const posts = await Post.find();
        res.status(200).json(posts);
    }
    catch(err) {
        res.status(500).json({ message: "The posts information could not be retrieved" })
    }
  });
  
  router.get('/:id', (req, res) => {
    res.status(200).send('hello from the GET /users/:id endpoint');
  });
  
  router.post('/', (req, res) => {
    res.status(200).send('hello from the POST /users endpoint');
  });

module.exports = router;