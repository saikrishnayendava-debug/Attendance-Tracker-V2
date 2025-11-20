import React from "react";

const ChartComponent = ({ progress, size = 120 }) => {
  const radius = size / 2 - 15;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  // Progress-based color selection
  const getColor = () => {
    if (progress < 50) return "#EF4444";          // red
    if (progress < 75) return "#F97316";          // orange
    return "#00ce86";          // green
                                // mint green
  };

  return (
    <div className="relative flex items-center justify-center">
      <svg className="transform -rotate-90" width={size} height={size}>
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#E5E7EB"
          strokeWidth="12"
          fill="none"
        />

        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={getColor()}
          strokeWidth="12"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-2000 ease-out"
        />
      </svg>

      {/* Center Text */}
      <div className="absolute text-center">
        <div className="text-lg font-bold" style={{ color: getColor() }}>
          {progress.toFixed(2)}%
        </div>
      </div>
    </div>
  );
};

export default ChartComponent;
