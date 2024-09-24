import React from 'react';

const CourseCard = ({ title, instructor, progress }) => {
  return (
    <div className="course-card">
      <div className="course-image">
        <img src="/path-to-your-image-placeholder.png" alt={title} />
      </div>
      <div className="course-info">
        <h3>{title}</h3>
        <p>{instructor}</p>
        <div className="progress-bar">
          <div className="progress" style={{ width: `${progress}%` }}></div>
        </div>
        <p>{progress}% complete</p>
        <button className="continue-btn">Continue Learning</button>
      </div>
    </div>
  );
};

export default CourseCard;
