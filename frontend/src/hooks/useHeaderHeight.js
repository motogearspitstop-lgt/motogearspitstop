import { useState, useEffect } from 'react';

const useHeaderHeight = (headerRef) => {
  const [headerHeight, setHeaderHeight] = useState(0);

  useEffect(() => {
    const calculateHeaderHeight = () => {
      let totalHeight = 0;

      // Access announcement and navbar refs from Header component
      if (headerRef?.current) {
        const announcementRef = headerRef.current.announcementRef;
        const navbarRef = headerRef.current.navbarRef;

        // Measure announcement bar height if it exists
        if (announcementRef?.current) {
          totalHeight += announcementRef.current.offsetHeight;
        }

        // Measure navbar height if it exists
        if (navbarRef?.current) {
          totalHeight += navbarRef.current.offsetHeight;
        }
      }

      setHeaderHeight(totalHeight);
    };

    // Calculate initial height after a short delay to ensure DOM is rendered
    const initialTimeout = setTimeout(calculateHeaderHeight, 100);
    
    // Calculate again after component mount
    calculateHeaderHeight();

    // Recalculate on window resize
    window.addEventListener('resize', calculateHeaderHeight);

    // Recalculate periodically for the first second (handles dynamic content loading)
    const intervals = [200, 400, 600, 800, 1000].map(delay =>
      setTimeout(calculateHeaderHeight, delay)
    );

    // Cleanup
    return () => {
      window.removeEventListener('resize', calculateHeaderHeight);
      clearTimeout(initialTimeout);
      intervals.forEach(clearTimeout);
    };
  }, [headerRef]);

  return headerHeight;
};

export default useHeaderHeight;