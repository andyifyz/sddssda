const express = require('express');
const bodyParser = require('body-parser');
const webPush = require('web-push');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

// Serve static files
app.use(express.static('public'));
app.use(express.static('admin'));

const VAPID_KEYS = {
    publicKey: 'BPZugiwG545YwybFdgMuQMy9eTmoePuXafsYzv5wFSI6mipYE1a848y8wBB4g5WL8ojG8gknq-e3DfFRiAFpR_A',
    privateKey: 'vqxEWG1jcYmR1JPSzytY9PpEc88Gc8FXPNCrsn9w9J4'
};

webPush.setVapidDetails('mailto:example@example.com', VAPID_KEYS.publicKey, VAPID_KEYS.privateKey);

let subscriptions = [];

app.post('/subscribe', (req, res) => {
    const subscription = req.body;
    subscriptions.push(subscription);
    res.status(201).json({});
});

app.post('/send-notification', (req, res) => {
    const { title, body, url } = req.body;

    const payload = JSON.stringify({ title, body, url });

    Promise.all(subscriptions.map(sub =>
        webPush.sendNotification(sub, payload).catch(err => console.error(err))
    ))
    .then(() => res.sendStatus(200))
    .catch(error => res.sendStatus(500));
});

app.listen(3000, () => {
    console.log('Server started on port 3000');
});
