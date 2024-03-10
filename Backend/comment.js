const { ApifyClient } = require('apify-client')

const client = new ApifyClient({
    token: 'apify_api_xhIcAMTp1BuIfnEBP8Lsbrt3peSw172oBVHV',
})


async function send() {
    // Starts an actor and waits for it to finish.
    const {defaultDatasetId} = await client.actor('apify/facebook-posts-scraper').call({
        "startUrls": [
            {
                "url": "https://www.facebook.com/nytimes"
            }
        ],
    })
    const items = await client.dataset(defaultDatasetId).listItems()
    return items
}

async function getComments(link){
    const {defaultDatasetId} = await client.actor('apify/facebook-comments-scraper').call({
        "startUrls": [
            {
                "url": link
            }
        ],
    })
    const items = await client.dataset(defaultDatasetId).listItems()
    console.log(items)
    return items
    
}