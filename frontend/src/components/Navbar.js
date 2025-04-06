import React from 'react';
import './Navbar.css'; // Optional: Add styles for the Navbar

const Navbar = () => {
    return (
        <nav className="navbar">
            <div className="logo">News App</div>
            <div className="links">
                <a href="#home">Home</a>
                <a href="#about">About</a>
                <a href="#contact">Contact</a>
            </div>
        </nav>
    );
};

export default Navbar;