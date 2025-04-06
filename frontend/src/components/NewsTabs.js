import React, { useEffect, useState } from 'react';
import { Tabs, Tab, Typography, Box } from '@mui/material';
import axios from 'axios';

const NewsTabs = () => {
    const [news, setNews] = useState([]);
    const [value, setValue] = useState(0);

    useEffect(() => {
        const fetchNews = async () => {
            try {
                const response = await axios.get('/api/news');
                setNews(response.data);
            } catch (error) {
                console.error('Error fetching news:', error);
            }
        };

        fetchNews();
    }, []);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const renderTabContent = (newsItem) => (
        <Box p={2}>
            <Typography variant="h6">{newsItem.context}</Typography>
            <Typography variant="body1">{newsItem.summary}</Typography>
            <Typography variant="body2"><strong>Implications:</strong> {newsItem.implications}</Typography>
            <Typography variant="body2">
                <a href={newsItem.link} target="_blank" rel="noopener noreferrer">Read more</a>
            </Typography>
        </Box>
    );

    return (
        <div>
            <Tabs value={value} onChange={handleChange} variant="scrollable" scrollButtons="auto">
                {news.map((newsItem, index) => (
                    <Tab key={index} label={newsItem.title} />
                ))}
            </Tabs>
            {news.map((newsItem, index) => (
                <div key={index} hidden={value !== index}>
                    {value === index && renderTabContent(newsItem)}
                </div>
            ))}
        </div>
    );
};

export default NewsTabs;