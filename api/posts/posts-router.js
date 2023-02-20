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
  
  router.get('/:id', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            res.status(404).json({ message: "The post with the specified ID does not exist" })
        }
        res.status(200).json(post);
    }
    catch(err) {
        res.status(500).json({ message: "The posts information could not be retrieved" })
    }
    
  });
  
  router.post('/', (req, res) => {
        const { title, contents } = req.body
        if (!title || !contents ) {
            res.status(400).json({ message: "Please provide title and contents for the post" })
        } else {
            Post.insert({title, contents})
                .then(({ id }) => {
                    return Post.findById(id)
                })
                .then(post => {
                    res.status(201).json(post)
                })
                .catch(err => {
                    res.status(500).json({ message: "There was an error while saving the post to the database" })
                })
        }
  });

  router.put('/:id', (req, res) => {
        const { id } = req.params
        const { title, contents } = req.body
        if (!title || !contents ) {
            res.status(400).json({ message: "Please provide title and contents for the post" })
        } 
        else {
            Post.update(id, req.body)
                .then(stuff => {
                    if (!stuff) {
                        res.status(404).json({ message: "The post with the specified ID does not exist" })
                    } else {
                        return Post.findById(id)
                    }
                    })
                .then(post => {
                    res.status(200).json(post);
                })
                .catch(err => {
                    res.status(500).json({ message: "The post information could not be modified" })
                })
            }
})

router.delete('/:id', async (req, res) => {
    try {
        const maybe = await Post.findById(req.params.id)
        if (!maybe) {
            res.status(404).json({ message: "The post with the specified ID does not exist" })
        } else {
            const post = await Post.remove(req.params.id)
            res.status(200).json(maybe);
        }
    } catch(err) {
        res.status(500).json({ message: "The post could not be removed" })
    }
})

router.get('/:id/comments', (req, res) => {
    Post.findById(req.params.id)
        .then(stuff => {
            if(!stuff) {
                res.status(404).json({ message: "The post with the specified ID does not exist" })
            }
            else {
                return Post.findPostComments(req.params.id)
            }
        })
        .then(comments => {
            res.status(200).json(comments)
        })
        .catch(err => {
            res.status(500).json({ message: "The comments information could not be retrieved" })
        })
})


module.exports = router;