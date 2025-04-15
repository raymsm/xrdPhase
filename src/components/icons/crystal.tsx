import * as React from "react"
import { LucideIcon } from "lucide-react"

interface Props {
  className?: string
  size?: number | string
  color?: string
  strokeWidth?: number | string
}

const Crystal: React.FC<Props> = ({
  className = "lucide-react",
  size = 24,
  color = "currentColor",
  strokeWidth = 2,
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M2 9h10l10-7L12 2 2 9zM22 9v6l-10 7-10-7V9"/>
      <path d="M6 9v6"/>
      <path d="M18 9v6"/>
    </svg>
  );
};

export {Crystal};
