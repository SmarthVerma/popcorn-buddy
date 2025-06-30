

import React from "react";

interface IconProps {
  className?: string;
  size?: number;
  color?: string;
  strokeWidth?: number;
}

// Plus Icon - Add/Choose file icon
const PlusIcon: React.FC<IconProps> = ({
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
      d="M12 4v16m8-8H4"
    />
  </svg>
);

export default PlusIcon;