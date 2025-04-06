require('dotenv').config();

const pLimit = require('p-limit');
const { writeFileSync } = require('fs');
const retry = require('async-retry');
const axios = require('axios');

const PERPLEXITY_API_KEY = process.env.PERPLEXITY_API_KEY;
const NEWS_API_KEY = process.env.NEWS_API_KEY;

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

    // Step 2: Scrape full article content using Perplexity (concurrently, with retry)
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

          return {
            title: article.title,
            url: article.url,
            source: article.source?.name || 'Unknown',
            published_at: article.publishedAt,
            description: article.description,
            content: fullContent
          };
        } catch (err) {
          console.error(`Error scraping article: ${err.message}`);
          throw err;
        }
      }, { retries: 2 });
    }));

    const fullArticles = await Promise.all(processingQueue);

    // Step 3: Send all full articles to Perplexity for grouping + summarization
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
   a. Write 1-2 sentences summarizing the main issue/event (focus on factual what/when/where)
   b. Offer 3-4 sentences of non-redundant context from the articles, including historical background, key players, and related developments. Use relevant background information from the articles and seek out new articles for context if needed.
   c. Provide 3-4 sentences of non-redundant implications from the articles (potential consequences, expert predictions, stakeholder impacts)

Return an array of objects in this exact format:
[
  {
    "title": "Event Title",
    "summary": "Concise factual summary (1-2 sentences)",
    "context": "Multi-sentence contextual analysis drawn from articles",
    "implications": "Multi-sentence impact analysis from article perspectives",
    "articles": ["url1", "url2"]
  }
]

Requirements:
- Maintain strict factual accuracy using only information from provided articles, no speculation or perspectives
- Avoid speculative language in implications section
- Ensure context and implications don't repeat summary content
- Prioritize diverse perspectives from different sources
`
            },
            {
              role: 'user',
              content: `Here are the articles:\n\n${JSON.stringify(
                fullArticles.map(a => ({
                  title: a.title,
                  description: a.description,
                  url: a.url,
                  content: a.content
                })),
                null,
                2
              )}`
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

      const finalOutput = response.data?.choices?.[0]?.message?.content?.trim();
      if (!finalOutput) throw new Error('Missing summarization content');
      return finalOutput;
    }, { retries: 2 });

    // Step 4: Save everything
    writeFileSync('top_7_grouped_news.json', summarizationResponse);
    console.log('Grouped and summarized news saved to top_7_grouped_news.json');

  } catch (err) {
    console.error('Pipeline error:', err.message);
    process.exit(1);
  }
}

getTopNewsIssues();