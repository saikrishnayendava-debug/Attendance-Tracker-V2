import React from "react";

const LoadingSpinner = ({
  size = 40,
  color = "emerald",
  text = "Loading..."
}) => {
  const sizeClass = `w-${size} h-${size}`;

  return (
    <div className="flex flex-col items-center justify-center gap-2">
      <div
        className={`animate-spin rounded-full border-4 border-${color}-500 border-t-transparent`}
        style={{ width: size, height: size }}
      />
      {text && (
        <p className="text-sm text-gray-400 font-medium">
          {text}
        </p>
      )}
    </div>
  );
};

export default LoadingSpinner;
