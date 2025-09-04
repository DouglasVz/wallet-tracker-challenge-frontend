import React from 'react';
import './styles/intro.css'

const Intro = () => {
  return (
    <div className="intro-container">
      <svg className="intro-logo" viewBox="0 0 50 50">
        <circle className="intro-circle" cx="25" cy="25" r="20" />
      </svg>
    </div>
  );
};

export default Intro;
