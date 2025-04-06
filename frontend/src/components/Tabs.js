import React, { useState, useEffect } from 'react';
import TabContent from './TabContent';
import axios from 'axios';

const Tabs = () => {
  const [news, setNews] = useState([]);
  const [activeTab, setActiveTab] = useState(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/news');
        setNews(response.data);
      } catch (error) {
        console.error('Error fetching news:', error);
        // Fallback to placeholder data
        setNews([
          { id: 1, title: "Placeholder News 1", summary: "Summary 1", implications: "Implications 1", links: ["https://example.com/1"] },
          { id: 2, title: "Placeholder News 2", summary: "Summary 2", implications: "Implications 2", links: ["https://example.com/2"] }
        ]);
      }
    };
    fetchNews();
  }, []);

  return (
    <div className="tabs">
      {news.map((item) => (
        <button key={item.id} className="tab" onClick={() => setActiveTab(item.id)}>
          {item.title}
        </button>
      ))}
      {activeTab && <TabContent newsItem={news.find((item) => item.id === activeTab)} />}
    </div>
  );
};

export default Tabs;
