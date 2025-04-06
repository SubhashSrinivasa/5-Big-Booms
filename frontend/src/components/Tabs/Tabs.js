import React, { useState, useEffect, useRef } from 'react';
import './Tabs.css';

const Tabs = () => {
    const [news, setNews] = useState([]);
    const [activeTab, setActiveTab] = useState(null);
    const [clearContext, setClearContext] = useState(false);
    const [clearImplications, setClearImplications] = useState(false);

    const lastTapContext = useRef(0);
    const lastTapImplications = useRef(0);

    const DOUBLE_TAP_DELAY = 300; // 300ms delay

    // Fetch news data from top_7_grouped_news.json
    useEffect(() => {
        const fetchNews = async () => {
            try {
                const response = await fetch('/top_7_grouped_news.json');
                const data = await response.json();
                console.log('yea');

                const today = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format
                if (data.timestamp !== today) {
                    console.log('Timestamp mismatch. Updating news...');
                    
                    await fetch('/api/update-news');

                    const updatedResponse = await fetch('/top_7_grouped_news.json');
                    const updatedData = await updatedResponse.json();
                    setNews(updatedData.events || []);
                } else {
                    console.log('News is up-to-date.');
                    setNews(data.events || []); // Use "events" instead of "articles"
                }
            } catch (error) {
                console.error('Error fetching news:', error);
                setNews([]); // Clear stale data in case of error
            }
        };

        fetchNews();
    }, []);

    const handleTabClick = (index) => {
        setActiveTab(activeTab === index ? null : index); // Reset activeTab if the same tab is clicked
        setClearContext(false);
        setClearImplications(false);
    };

    const handleDoubleTapContext = () => {
        const now = Date.now();
        if (now - lastTapContext.current < DOUBLE_TAP_DELAY) {
            setClearContext(prev => !prev);
            lastTapContext.current = 0;
        } else {
            lastTapContext.current = now;
        }
    };

    const handleDoubleTapImplications = () => {
        const now = Date.now();
        if (now - lastTapImplications.current < DOUBLE_TAP_DELAY) {
            setClearImplications(prev => !prev);
            lastTapImplications.current = 0;
        } else {
            lastTapImplications.current = now;
        }
    };

    useEffect(() => {
        document.addEventListener('DOMContentLoaded', function() {
            const newsTabs = document.querySelectorAll('.tab[data-tab="news"]');
            newsTabs.forEach(tab => {
                tab.style.textAlign = 'left';
                tab.style.justifyContent = 'flex-start';
            });
        });
    }, []);

    return (
        <div className="tabs-container">
            {activeTab === null &&
                news.map((item, index) => (
                    <div
                        key={index}
                        className={`tab-wrapper ${
                            activeTab === index || activeTab === null ? 'visible' : 'hidden'
                        }`}
                    >
                        {/* Tab Header */}
                        <div
                            className={`tab ${activeTab === index ? 'active' : ''}`}
                            onClick={() => handleTabClick(index)}
                        >
                            {item.title} <span className="category">category: {item.category}</span>
                        </div>
                    </div>
                ))}

            {activeTab !== null && (
                <div className="tab-expanded">
                    {/* Active Tab Header */}
                    <div
                        className="tab active"
                        onClick={() => handleTabClick(activeTab)}
                    >
                        {news[activeTab].title} <span className="category">category: {news[activeTab].category}</span>
                    </div>

                    {/* Tab Content */}
                    <div className="tab-content">
                        <div className="tab-content-inner">
                            <p 
                              className={`context ${clearContext ? 'clear' : ''}`} 
                              onClick={handleDoubleTapContext}
                            >
                                <strong>context:</strong> {news[activeTab].context}
                            </p>
                            {/* Remove "Summary" heading */}
                            <p className="summary">
                                {news[activeTab].summary}
                            </p>
                            <p 
                              className={`implications ${clearImplications ? 'clear' : ''}`} 
                              onClick={handleDoubleTapImplications}
                            >
                                <strong>implications:</strong> {news[activeTab].implications}
                            </p>
                            {/* Articles Section */}
                            <p>
                                <strong>Articles:</strong>
                            </p>
                            <ul className="articles-list">
                                {news[activeTab].articles.map((link, i) => (
                                    <li key={i}>
                                        <a
                                            href={link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            {link}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Tabs;