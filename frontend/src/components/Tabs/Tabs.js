import React, { useState } from 'react';
import './Tabs.css';

const Tabs = ({ tabs }) => {
    const [activeTab, setActiveTab] = useState(null);

    const handleTabClick = (index) => {
        setActiveTab(activeTab === index ? null : index); // Toggle the active tab
    };

    return (
        <div className="tabs-container">
            {tabs.map((tab, index) => (
                <div key={index}>
                    <div
                        className={`tab ${activeTab === index ? 'active' : ''}`}
                        onClick={() => handleTabClick(index)}
                    >
                        {tab.title}
                    </div>
                    <div
                        className={`tab-content ${
                            activeTab === index ? 'expanded' : 'collapsed'
                        }`}
                    >
                        <h2>{tab.title}</h2>
                        <p>{tab.summary}</p>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default Tabs;