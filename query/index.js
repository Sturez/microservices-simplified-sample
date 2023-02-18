const express = require('express');
const bodyParser = require('body-parser');
const { randomBytes } = require('crypto');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const posts = {};


app.get('/posts', (req, res) => {
    res.send(posts);
});


const handleEvent = (type, data) => {
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
}



app.post('/events', (req, res) => {
    console.log("Received event:", req.body.type);
    const { type, data } = req.body;

    handleEvent(type, data);

    res.send({});
});

app.listen(4002, async () => {
    console.log('Checking events');

    try {
        const res = await axios.get("http://localhost:4005/events");
        if (!res.data || res.data.length === 0) {
            console.log('no event to parse');
        } else {
            
            console.log(`Pasting ${res.data.length} events...`);
            for (const event of res.data) {
                try {
                    console.log("Processing event:", event.type);
                    handleEvent(event.type, event.data);

                } catch (error) {
                    console.log("event handling failed with error:", error);
                }
            }
        }

    } catch (error) {
        console.log("an error occurred:", error);
    }

    console.log('Listening on 4002');
});