// hooks/useSwipeToggle.js
import { useState, useCallback, useEffect } from 'react';

const useSwipeToggle = (initialVisibility = false) => {
    const [isVisible, setIsVisible] = useState(initialVisibility);
    let touchStartX = 0;
    let touchEndX = 0;

    const handleTouchStart = useCallback((event) => {
        touchStartX = event.touches[0].clientX;
    }, []);

    const handleTouchMove = useCallback((event) => {
        touchEndX = event.touches[0].clientX;
    }, []);

    const handleTouchEnd = useCallback(() => {
        if (touchStartX - touchEndX > 50) {
            setIsVisible(false);  // Left Swipe
        } else if (touchEndX - touchStartX > 50) {
            setIsVisible(true);  // Right Swipe
        }
    }, []);

    useEffect(() => {
        window.addEventListener('touchstart', handleTouchStart);
        window.addEventListener('touchmove', handleTouchMove);
        window.addEventListener('touchend', handleTouchEnd);

        return () => {
            window.removeEventListener('touchstart', handleTouchStart);
            window.removeEventListener('touchmove', handleTouchMove);
            window.removeEventListener('touchend', handleTouchEnd);
        };
    }, [handleTouchStart, handleTouchMove, handleTouchEnd]);

    return [isVisible, setIsVisible];
};

export default useSwipeToggle;
