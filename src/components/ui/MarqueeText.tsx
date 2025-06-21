'use client';

import { useEffect, useRef, useState } from 'react';

interface MarqueeTextProps {
  text: string;
  className?: string;
  speed?: number; // pixels per second
  pauseOnHover?: boolean;
  pauseDuration?: number; // milliseconds to pause at start/end
}

export default function MarqueeText({ 
  text, 
  className = '', 
  speed = 50, 
  pauseOnHover = true,
  pauseDuration = 1500 
}: MarqueeTextProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const checkOverflow = () => {
      if (containerRef.current && textRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        const textWidth = textRef.current.scrollWidth;
        const overflow = textWidth > containerWidth;
        setIsOverflowing(overflow);
        
        if (overflow && containerRef.current) {
          // Set CSS custom property for container width
          containerRef.current.style.setProperty('--container-width', `${containerWidth}px`);
          
          // Calculate animation duration based on text width and speed
          const distance = textWidth - containerWidth;
          const duration = (distance + textWidth * 0.3) / speed + (pauseDuration / 1000);
          
          if (textRef.current) {
            textRef.current.style.animationDuration = `${duration}s`;
            textRef.current.style.animationDelay = `${pauseDuration / 1000}s`;
          }
        }
      }
    };

    // Small delay to ensure accurate measurements
    const timeoutId = setTimeout(checkOverflow, 50);
    
    const handleResize = () => {
      setTimeout(checkOverflow, 50);
    };
    
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timeoutId);
    };
  }, [text, speed, pauseDuration]);

  const handleMouseEnter = () => {
    if (pauseOnHover && textRef.current) {
      setIsPaused(true);
    }
  };

  const handleMouseLeave = () => {
    if (pauseOnHover) {
      setIsPaused(false);
    }
  };

  return (
    <div 
      ref={containerRef}
      className={`marquee-container ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div
        ref={textRef}
        className={`marquee-text ${
          isOverflowing ? 'animate-marquee' : ''
        }`}
        style={{
          animationPlayState: isPaused ? 'paused' : 'running'
        }}
      >
        {text}
      </div>
    </div>
  );
} 