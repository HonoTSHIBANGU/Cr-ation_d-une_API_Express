const express = require('express');
const app = express();
const fs =  require("fs");
const PORT = 3000;
const initialData = require('./assets/initial-data.json');
const bodyParser = require('body-parser');
const data = require('./backend/data.json');


app.use(bodyParser.json());
app.use(express.json());
app.get('/', (req, res) => {
    const data = JSON.stringify(initialData);
    fs.writeFileSync('backend/data.json', data);
});

app.get('/users/:handle', (req, res) => {
    const handle = req.params.handle;
    const user = data.users.find((user) => user.handle === handle);

    if (user) {
        res.status(200).json(user);
    } else {
        res.status(404).send(`${handle} not found`);
    }
});

app.get('/tweets', (req, res) => {
    const sortedTweets = data.tweets.sort((a, b) => b.timestamp - a.timestamp); 
    res.status(200).json(sortedTweets); 
});

app.get("/tweets/:handle", (req, res) => {
    const handle = req.params.handle;
    const user = data.users.find(u => u.handle === handle);
    if (!user) {
        return res.status(404).json({ error: "Utilisateur non trouvé" });
    }
    const userTweets = data.tweets.filter(tweet => tweet.id === user.id);
    res.json(userTweets);
});

//Setting On The Route /tweets/:handle/media returns All tweets Of User Containing Medias Like Images and Videos
app.get('/tweets/:handle/media', (req ,res) => {
    const getTweets = data.tweets;
    const getUsers = data.users;
    const handle = req.params.handle;

    //Find User By His Handle
        const users = getUsers.find( user => user.handle === handle)
            if(!users){
                return res.status(404).json({error: 'User Not Found'})
            }
    //Filter Tweet And Compare if his author is Equalt With Users Id And Media
        const tweets = getTweets.filter(tweet => tweet.author === users.id && tweet.media.length > 0 );
    
    //Map Tweet To Take Medias Only
        const getUsersMedia = getTweets.flatMap( tweet => tweet.media )
            tweets.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            if( tweets ) {
                res.status(200).json({ getUsersMedia });
            
            } else {
                res.status(404).send('Media For This User Is Not Found');
            }
});

app.post('/tweets',(req, res, next) => {
    // Error Handling For New Tweet
    // const errors = validationResult(req);
    // if (!errors.isEmpty()) {
    //     return res.status(400).json({ errors: errors.array() });
    // }
    // console.log('Valid data. Message saved successfully.');

    // Some Items To Create
    const tweets = data.tweets;
    const users = data.users;
    const creatTweetId = tweets.length + 1;
    const createTweetDate = new Date().toISOString();
    const creatAuthor = users[8].id;
    const { media, text } = req.body;

    // Add New Tweet
    const newTweet = {
        id: creatTweetId,
        author: creatAuthor,
        media: media || [],
        text,
        createdAt: createTweetDate
    };
    tweets.push(newTweet);

    // Send Updated Tweet Data To Client
    res.status(201).json({
        createdTweet: newTweet,
        allTweets: tweets
    });
});

app.listen(PORT, () => {
    console.log(`Serveur en cours d'écoute sur le port ${PORT}`);
});
