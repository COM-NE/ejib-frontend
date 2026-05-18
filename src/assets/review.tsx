interface IconProps {
  width?: number | string;
  height?: number | string;
  color?: string;
  opacity?: number;
}

const ReviewIcon: React.FC<IconProps> = ({
  width = 18,
  height = 18,
  color = "#C2D5F8",
  opacity = 1,
}) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 18 18"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{ opacity }}
  >
    <path
      d="M1.20549 17.95C0.855488 18.0333 0.551321 17.9458 0.292988 17.6875C0.0346545 17.4292 -0.0528455 17.125 0.0304878 16.775L0.905488 12.525L5.45549 17.075L1.20549 17.95ZM7.08049 15.85L2.13049 10.9L12.4555 0.575C12.8388 0.191667 13.3138 0 13.8805 0C14.4472 0 14.9222 0.191667 15.3055 0.575L17.4055 2.675C17.7888 3.05833 17.9805 3.53333 17.9805 4.1C17.9805 4.66667 17.7888 5.14167 17.4055 5.525L7.08049 15.85Z"
      fill={color}
    />
  </svg>
);

export default ReviewIcon;
