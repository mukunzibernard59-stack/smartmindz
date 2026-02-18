import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav>
      <div className="navbar-left">
        <Link to="/home">Home</Link>
        <Link to="/ai-tutor">AI Tutor</Link>
        {/* Removed the duplicate AI Tutor menu item */}
        <Link to="/other">Other</Link>
      </div>
      <div className="navbar-right">
        <Link to="/ai-tutor">AI Tutor</Link>
        <Link to="/quizzes">Quizzes</Link> {/* Changed line 40 to show "Quizzes" */}
      </div>
    </nav>
  );
};

export default Navbar;