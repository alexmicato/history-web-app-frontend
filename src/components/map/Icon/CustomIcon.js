// CustomIcon.js
import React from 'react';

const CustomIcon = ({ IconComponent, style }) => {
  return (
    <div style={{ ...style }}>
      <IconComponent />
    </div>
  );
};

export default CustomIcon;
