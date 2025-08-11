import { useEffect, useRef } from "react";

export function useScrollAnimation(animationType: 'fadeInUp' | 'fadeInLeft' | 'fadeInRight' | 'scale' | 'rotateIn' = 'fadeInUp') {
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Remove initial animation classes
            entry.target.classList.remove(
              "opacity-0", 
              "translate-y-12", 
              "-translate-x-12", 
              "translate-x-12",
              "scale-75",
              "rotate-12"
            );
            
            // Add final animation classes based on type
            switch (animationType) {
              case 'fadeInUp':
                entry.target.classList.add("opacity-100", "translate-y-0");
                break;
              case 'fadeInLeft':
                entry.target.classList.add("opacity-100", "translate-x-0");
                break;
              case 'fadeInRight':
                entry.target.classList.add("opacity-100", "translate-x-0");
                break;
              case 'scale':
                entry.target.classList.add("opacity-100", "scale-100");
                break;
              case 'rotateIn':
                entry.target.classList.add("opacity-100", "rotate-0");
                break;
            }
            
            // Add smooth transition classes
            entry.target.classList.add(
              "transition-all",
              "duration-700",
              "ease-out",
              "transform"
            );
          }
        });
      },
      {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px",
      }
    );

    // Set initial animation state based on type
    if (element) {
      element.classList.add("transition-all", "duration-700", "ease-out", "transform");
      
      switch (animationType) {
        case 'fadeInUp':
          element.classList.add("opacity-0", "translate-y-12");
          break;
        case 'fadeInLeft':
          element.classList.add("opacity-0", "-translate-x-12");
          break;
        case 'fadeInRight':
          element.classList.add("opacity-0", "translate-x-12");
          break;
        case 'scale':
          element.classList.add("opacity-0", "scale-75");
          break;
        case 'rotateIn':
          element.classList.add("opacity-0", "rotate-12");
          break;
      }
    }

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [animationType]);

  return elementRef;
}
