const express = require('express');
const bodyParser = require('body-parser');
const { randomBytes } = require('crypto');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const posts = {};


app.get('/posts', (req, res) => {
    res.send(posts);
});


app.post('/events', (req, res) => {
    console.log("Received event:", req.body.type);
    const { type, data } = req.body;


    if (type === "PostCreated") {

        const { id: postid, title } = data;
        posts[postid] = { id: postid, title, comments: [] };
    }

    if (type === "CommentCreated") {
        const { id, content, postId, status } = data;

        const post = posts[postId];
        if (post) {
            post.comments.push({ id, content, status });
        }

    }

    if (type === "CommentUpdated") {
        const { id, content, postId, status } = data;

        const post = posts[postId];
        const comment = post.comments.find((c) => {
            return c.id === id;
        });

        comment.status = status;
        comment.comment = content; 

    }


    res.send({});
});

app.listen(4002, () => {
    console.log('Listening on 4002');
});