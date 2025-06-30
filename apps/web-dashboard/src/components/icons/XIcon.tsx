interface IconProps {
  className?: string;
  size?: number;
  color?: string;
  strokeWidth?: number;
}
export const XIcon: React.FC<IconProps> = ({
  className = "w-5 h-5 text-red-400",
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
      d="M6 18L18 6M6 6l12 12"
    />
  </svg>
);
