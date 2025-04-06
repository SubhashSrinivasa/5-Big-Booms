import React from 'react';
import Tabs from '../components/Tabs';

const Home = () => {
    const tabLabels = ['Tab 1', 'Tab 2', 'Tab 3']; // Example tab labels

    return (
        <div>
            <Tabs tabs={tabLabels} />
        </div>
    );
};

export default Home;
