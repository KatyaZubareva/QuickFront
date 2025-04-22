// SmartCheckIcon.tsx

import React, { useEffect, useState } from "react";

interface SmartCheckIconProps {
  textRef: React.RefObject<HTMLSpanElement | null>;
}

const SmartCheckIcon: React.FC<SmartCheckIconProps> = ({ textRef }) => {
  const [iconSize, setIconSize] = useState(20);

  useEffect(() => {
    const element = textRef.current;
    if (!element) return;

    const checkTextWrap = () => {
      setIconSize(element.scrollHeight > element.clientHeight ? 28 : 20);
    };

    const observer = new ResizeObserver(checkTextWrap);
    observer.observe(element);
    checkTextWrap();
    
    return () => observer.disconnect();
  }, [textRef]);

  return (
    <svg 
      width={iconSize}
      height={iconSize}
      className="text-purple-400 flex-shrink-0 mt-0.5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  );
};

export default SmartCheckIcon;