

import React from "react";

interface IconProps {
  className?: string;
  size?: number;
  color?: string;
  strokeWidth?: number;
}

// Check Icon - Success indicator
const CheckIcon: React.FC<IconProps> = ({
  className = "w-5 h-5",
  strokeWidth = 2,
}) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={strokeWidth}
      d="M5 13l4 4L19 7"
    />
  </svg>
);

export default CheckIcon;