// components/Logo.tsx

import { useTheme } from "@/lib/providers/ThemeProvider";

const Logo = ({
  fillColor = "#000000",
  darkmode = "#ffffffff",
}) =>{

  const {theme} = useTheme()
  return (
    <svg
      width="180"
      height="50"
      viewBox="0 0 180 50"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-32 md:w-36"
    >
      {/* Food delivery icon - simplified fork and spoon */}
      <g transform="translate(0, 5)">
        {/* Fork */}
        <rect x="8" y="15" width="2" height="20" fill={theme === 'dark' ? darkmode : fillColor} />
        <rect x="12" y="15" width="2" height="20" fill={theme === 'dark' ? darkmode : fillColor} />
        <rect x="6" y="30" width="12" height="2" fill={theme === 'dark' ? darkmode : fillColor} />

        {/* Spoon */}
        <rect x="20" y="15" width="2" height="17" fill={theme === 'dark' ? darkmode : fillColor} />
        <ellipse cx="21" cy="35" rx="6" ry="3" fill={theme === 'dark' ? darkmode : fillColor} />
      </g>

      {/* Civora Text */}
      <text
        x="45"
        y="35"
        fontFamily="Arial, sans-serif"
        fontSize="28"
        fontWeight="bold"
        fill={theme === 'dark' ? darkmode : fillColor}
      >
        Civora
      </text>
    </svg>
  );
}


export default Logo;
