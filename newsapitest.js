require('dotenv').config();
const path = require('path'); // added
const pLimit = require('p-limit');
const { writeFileSync } = require('fs');
const retry = require('async-retry');
const axios = require('axios');

const NEWS_API_KEY = process.env.NEWS_API_KEY;

// Define the absolute path for the JSON file

async function getTopNewsIssues() {
  const sources = [
    'associated-press', 'reuters', 'bbc-news',
    'pbs-news', 'npr', 'propublica',
    'al-jazeera-english', 'deutsche-welle', 'france-24'
  ].join(',');

  try {
    // Step 1: Fetch news articles
    const newsData = await retry(async () => {
      const response = await axios.get(
        'https://newsapi.org/v2/top-headlines',
        {
          params: { sources, pageSize: 40 },
          headers: { Authorization: `Bearer ${NEWS_API_KEY}` }
        }
      );
      if (!response.data?.articles) throw new Error('Invalid NewsAPI response');
      console.log(response.data);
    }, { retries: 3 });


  }
  catch (error) {
    console.error('Error fetching news articles:', error);
    return;
  }
}

getTopNewsIssues();
