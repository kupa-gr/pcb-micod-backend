import React, { useEffect, useRef, useState } from 'react';

export default function Reveal({ children, direction = 'up', delay = 0, duration = 0.6 }) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) observer.unobserve(ref.current);
    };
  }, []);

  const getTransform = () => {
    switch (direction) {
      case 'up': return 'translateY(40px)';
      case 'down': return 'translateY(-40px)';
      case 'left': return 'translateX(40px)';
      case 'right': return 'translateX(-40px)';
      case 'scale': return 'scale(0.9)';
      default: return 'translateY(40px)';
    }
  };

  const style = {
    opacity: isVisible ? 1 : 0,
    transform: isVisible ? 'translate(0) scale(1)' : getTransform(),
    transition: `opacity ${duration}s ease-out, transform ${duration}s ease-out`,
    transitionDelay: `${delay}s`,
    willChange: 'opacity, transform'
  };

  return (
    <div ref={ref} style={style}>
      {children}
    </div>
  );
}
