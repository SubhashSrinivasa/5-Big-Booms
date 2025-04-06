import React from 'react';
import Tabs from '../components/Tabs/Tabs';

const Home = () => {
    const tabLabels = [
        { title: 'Tab 1', summary: 'This is the summary for Tab 1.' },
        { title: 'Tab 2', summary: 'This is the summary for Tab 2.' },
        { title: 'Tab 3', summary: 'This is the summary for Tab 3.' },
    ];

    return (
        <div>
            <Tabs tabs={tabLabels} />
        </div>
    );
};

export default Home;