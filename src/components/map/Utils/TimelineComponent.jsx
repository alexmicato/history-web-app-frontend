import React, { useState, useEffect, useRef } from 'react';
import './TimelineComponent.css';

const TimelineComponent = ({ years, currentYear, onYearChange }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHidden, setIsHidden] = useState(false);
  const [jumpYear, setJumpYear] = useState(currentYear);
  const timelineRef = useRef(null);
  const itemRefs = useRef([]);

  useEffect(() => {
    const index = years.findIndex(year => year === currentYear);
    setCurrentIndex(index);
    setJumpYear(currentYear);
  }, [currentYear, years]);

  useEffect(() => {
    if (itemRefs.current[currentIndex]) {
      itemRefs.current[currentIndex].scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center',
      });
    }
  }, [currentIndex]);

  const handleNext = () => {
    if (currentIndex < years.length - 1) {
      setCurrentIndex(currentIndex + 1);
      onYearChange(years[currentIndex + 1]);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      onYearChange(years[currentIndex - 1]);
    }
  };

  const handleYearClick = (index) => {
    setCurrentIndex(index);
    const selectedYear = years[index];
    onYearChange(selectedYear); 
  };
  const handleJumpToYear = () => {
    const index = years.findIndex(year => year === jumpYear);
    if (index !== -1) {
      setCurrentIndex(index);
      onYearChange(years[index]);
    }
  };

  const formatYear = (year) => {
    return year < 0 ? `${-year} BCE` : `${year} CE`;
  };


  return (
    <div className="timeline-container">
      <button className="timeline-control left" onClick={handlePrev} disabled={currentIndex === 0} >
        &lt;
      </button>
      <div className="timeline" ref={timelineRef} style={{ display: isHidden ? 'none' : 'flex' }}>
        <div className="timeline-content">
          {years.map((year, index) => (
            <div
              key={year}
              ref={el => itemRefs.current[index] = el}
              className={`timeline-item ${index === currentIndex ? 'active' : ''}`}
              onClick={() => handleYearClick(index)}
            >
              {formatYear(year)}
            </div>
          ))}
        </div>
      </div>
      <button className="timeline-control right" onClick={handleNext} disabled={currentIndex === years.length - 1}>
        &gt;
      </button>
      <div className="timeline-controls">
        <select 
          className="jump-select" 
          value={jumpYear} 
          onChange={(e) => setJumpYear(parseInt(e.target.value))} 
        >
          {years.map(year => (
            <option key={year} value={year}>
              {formatYear(year)}
            </option>
          ))}
        </select>
        <button className="jump-button" onClick={handleJumpToYear}>Jump</button>
      </div>
    </div>
  );
};

export default TimelineComponent;
