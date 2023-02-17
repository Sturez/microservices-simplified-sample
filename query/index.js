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

    switch (type) {
        case "PostCreated":
            const { id: postid, title } = data;
            posts[postid] = { id: postid, title, comments: [] };

            break;

        case "CommentCreated":
            const { id: commentId, content, postId } = data;

            const post = posts[postId];
            if (post) {
                post.comments.push({ commentId, content });
            }

            break;

        default:
            console.warning("uhnandled event type");
            break;
    }

    res.send({});
});

app.listen(4002, () => {
    console.log('Listening on 4002');
});