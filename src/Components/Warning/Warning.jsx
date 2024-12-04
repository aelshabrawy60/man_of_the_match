import React, { useEffect, useRef, useState } from 'react'
import './Warning.css'

function Warning({text}) {
  const [hasOverflow, setHasOverflow] = useState(false);
  const containerRef = useRef(null);
  const textRef = useRef(null);

  useEffect(() => {
    const checkOverflow = () => {
      const container = containerRef.current;
      const textElement = textRef.current;
      if (container && textElement) {
        setHasOverflow(textElement.scrollWidth > container.clientWidth);
      }
    };

    checkOverflow();
    window.addEventListener('resize', checkOverflow);
    return () => window.removeEventListener('resize', checkOverflow);
  }, [text]);

  return (
    <div ref={containerRef} className='warning-container text-center w-100'>
      <span 
        ref={textRef}
        className={`warning-text ${hasOverflow ? 'overflow' : ''}`}
        data-text={text}
      >
        {text}
      </span>
    </div>
  )
}

export default Warning