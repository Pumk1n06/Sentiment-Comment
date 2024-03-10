const express = require('express')
const app = express()
const cors = require('cors');
app.use(cors())
const natural = require("natural");

const Analyzer = natural.SentimentAnalyzer;
const stemmer = natural.PorterStemmer;
const analyzer = new Analyzer("English", stemmer, "afinn");
const { ApifyClient } = require('apify-client')

const client = new ApifyClient({
    token: 'apify_api_xhIcAMTp1BuIfnEBP8Lsbrt3peSw172oBVHV',
})

async function send(comapany) {
    // Starts an actor and waits for it to finish.
    const {defaultDatasetId} = await client.actor('apify/facebook-posts-scraper').call({
        "startUrls": [
            {
                "url": "https://www.facebook.com/"+ comapany
            }
        ],
    })
    const items = await client.dataset(defaultDatasetId).listItems()
    return items
}

async function getComments(link,postLimit){
    const {defaultDatasetId} = await client.actor('apify/facebook-comments-scraper').call({
        "startUrls": [
            {
                "url": link
            },
        ],
        "resultsLimit": postLimit
    })
    const {items} = await client.dataset(defaultDatasetId).listItems()
    console.log(items)
    const scoredItems = items.map(i=>{
        if(!i.text) return {...i,score:0}
        const score = analyzer.getSentiment(i.text.split(" "));
        return {...i,score }
    })
    return scoredItems
}

app.get('/data', async (req, res) => {
    try {
        const {company,platform,postLimit} = req.query
        const data = await send(company,postLimit);
        res.json(data);
    } catch (error) {
        console.log(error)
        res.status(500).json({ items:[],error: 'Internal server error' });
    }
});

app.get('/comments', async (req, res) => {
    const { link } = req.query;
    if (!link) {
        return res.status(400).json({ items:[],error: 'Link parameter is required' });
    }
    try {
        const comments = await getComments(link);
        res.json({items: comments});
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'Internal server error' });
    }
});


const port=process.env.PORT || 4000

app.listen(port, () => {
    console.log(`server http://localhost:${port}`)
})