import { useEffect, useRef, useState } from 'react';

const useAnimateOnScroll = (threshold = 0.1) => {
  const elementRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target); // optional: stops observing once visible
        }
      },
      { threshold }
    );

    const currentElement = elementRef.current;
    if (currentElement) observer.observe(currentElement);

    return () => {
      if (currentElement) observer.unobserve(currentElement);
    };
  }, [threshold]); // ✅ no need to include elementRef

  return [elementRef, isVisible];
};

export default useAnimateOnScroll;
