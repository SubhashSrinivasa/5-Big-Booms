import React from 'react';
import Navbar from './components/Navbar';
import Home from './pages/Home';

function App() {
    return (
        <div className="App">
            <Navbar /> {/* Add the Navbar here */}
            <Home />
        </div>
    );
}

export default App;