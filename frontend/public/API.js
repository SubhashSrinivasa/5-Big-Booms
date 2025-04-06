require('dotenv').config();
const path = require('path');
const pLimit = require('p-limit');
const { writeFileSync } = require('fs');
const retry = require('async-retry');
const axios = require('axios');

const PERPLEXITY_API_KEY = "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";
const NEWS_API_KEY = "8773f10be46d4d98aef6d0ef37523e00";
const filePath = path.join(process.cwd(), 'frontend', 'public', 'top_7_grouped_news.json');

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
      return response.data;
    }, { retries: 3 });

    if (!newsData.articles.length) {
      console.log('No articles found');
      return;
    }

    // Step 2: Scrape article content
    const limit = pLimit(5);
    const processingQueue = newsData.articles.map(article => limit(async () => {
      return await retry(async () => {
        try {
          const scrapeResponse = await axios.post(
            'https://api.perplexity.ai/chat/completions',
            {
              model: 'sonar-pro',
              messages: [
                {
                  role: 'system',
                  content: `Extract and return the full text of this article. Only include the article's raw body text without summaries or analysis.`
                },
                {
                  role: 'user',
                  content: `Article URL: ${article.url}\nExtract full content:`
                }
              ]
            },
            {
              headers: {
                'Authorization': `Bearer ${PERPLEXITY_API_KEY}`,
                'Content-Type': 'application/json'
              }
            }
          );

          const fullContent = scrapeResponse.data?.choices?.[0]?.message?.content?.trim();
          if (!fullContent) throw new Error('Missing article content');
          return { ...article, content: fullContent };
        } catch (err) {
          console.error(`Error scraping article: ${err.message}`);
          throw err;
        }
      }, { retries: 2 });
    }));

    const fullArticles = await Promise.all(processingQueue);

    // Step 3: Process and summarize
    const summarizationResponse = await retry(async () => {
      const response = await axios.post(
        'https://api.perplexity.ai/chat/completions',
        {
          model: 'sonar-pro',
          messages: [
            {
              role: 'system',
              content: `
You are a high-accuracy information extractor and analyst.

Given a list of articles (each with a title, short description, and full content), do the following:

1. Group articles ONLY if they describe the same specific news event. Do NOT group by general topic.
2. Identify the 7 most important unique world news events from these groups.
3. For each event:
   a. Write 1-2 sentences summarizing the main issue/event.
   b. Provide non-redundant context and implications.
   c. Assign one category from this list:
      - Governance & Politics
      - International Relations & Security
      - Economy & Business
      - Science, Technology & Innovation
      - Health & Environment
      - Law, Rights & Justice
      - Culture, Identity & Society
      - Migration & Demographics
      - Sports, Media & Entertainment
      - Other

Return JSON in this exact format:
{
  "timestamp": "YYYY-MM-DD",
  "events": [
    {
      "title": "Event Title",
      "summary": "Concise factual summary.",
      "context": "Contextual analysis.",
      "implications": "Implications.",
      "articles": ["url1", "url2"],
      "category": "Category Name"
    }
  ]
}`
            },
            {
              role: 'user',
              content: JSON.stringify(fullArticles.map(a => ({
                title: a.title,
                description: a.description,
                url: a.url,
                content: a.content
              })))
            }
          ]
        },
        {
          headers: {
            'Authorization': `Bearer ${PERPLEXITY_API_KEY}`,
            'Content-Type': 'application/json'
          }
        }
      );

      let finalOutput = response.data?.choices?.[0]?.message?.content?.trim();
      if (!finalOutput) throw new Error('Missing summarization content');

      // Remove Markdown code blocks
      finalOutput = finalOutput.replace(/^``````$/, '').trim();

      return finalOutput;
    }, { retries: 2 });

    // Validate and save
    let parsedOutput;
    try {
      parsedOutput = JSON.parse(summarizationResponse);
    } catch (e) {
      console.error("Invalid JSON:", e.message);
      throw new Error(`Failed to parse API response: ${e.message}`);
    }

    parsedOutput.timestamp = new Date().toLocaleDateString('en-CA', { 
      timeZone: 'America/Los_Angeles' 
    });
    
    writeFileSync(filePath, JSON.stringify(parsedOutput, null, 2));
    console.log('News data saved successfully');
    return parsedOutput;

  } catch (err) {
    console.error('Pipeline error:', err.message);
    throw err; // Propagate error for controller handling
  }
}

module.exports = { getTopNewsIssues };