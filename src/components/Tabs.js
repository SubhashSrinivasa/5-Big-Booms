import React from 'react';
import './Tabs.css';

const Tabs = ({ tabs }) => {
    return (
        <div className="tabs-container">
            {tabs.map((tab, index) => (
                <div key={index} className="tab">
                    {tab}
                </div>
            ))}
        </div>
    );
};

export default Tabs;
