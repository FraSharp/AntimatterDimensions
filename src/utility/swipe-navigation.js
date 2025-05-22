/**
 * Swipe navigation utilities for tab interfaces in Antimatter Dimensions
 */

/**
 * Creates a swipe detection handler that can be applied to tab interfaces
 *
 * @param {Object|Function} options Configuration options or onSwipeLeft function
 * @param {Function} [options.onSwipeLeft] Function to call when user swipes left (next tab)
 * @param {Function} [options.onSwipeRight] Function to call when user swipes right (previous tab)
 * @param {number} [options.minSwipeDistance=50] Minimum distance in pixels to trigger swipe
 * @param {boolean} [options.preventDefaultOnSwipe=false] Whether to prevent default behavior on swipe
 * @param {Function} [onSwipeRight] Legacy: Function to call on right swipe (if options is a function)
 * @param {number} [minSwipeDistance] Legacy: Minimum swipe distance (if options is a function)
 * @returns {Object} Object with event handlers to attach to elements
 */
export function createSwipeHandler(options, onSwipeRight, minSwipeDistance) {
  // Support both object parameter style and legacy parameter style
  const config = typeof options === "object" ? options : {
    onSwipeLeft: options,
    onSwipeRight,
    minSwipeDistance: minSwipeDistance || 50,
    preventDefaultOnSwipe: false
  };

  const {
    onSwipeLeft,
    onSwipeRight: onSwipeRightFn,
    minSwipeDistance: minDistance = 50,
    preventDefaultOnSwipe = false
  } = config;

  let touchStartX = 0;
  let touchStartY = 0;
  let touchEndX = 0;
  let touchEndY = 0;
  let isScrolling = false;

  const handleTouchStart = e => {
    touchStartX = e.changedTouches[0].screenX;
    touchStartY = e.changedTouches[0].screenY;
    isScrolling = false;
  };

  const handleTouchMove = e => {
    // Detect if user is scrolling vertically (don't trigger swipe in that case)
    const currentY = e.changedTouches[0].screenY;
    const yDiff = Math.abs(currentY - touchStartY);

    if (yDiff > 15) {
      isScrolling = true;
    }
  };

  const handleTouchEnd = e => {
    if (preventDefaultOnSwipe && !isScrolling) {
      e.preventDefault();
    }

    touchEndX = e.changedTouches[0].screenX;
    // We track touchEndY for potential future features (vertical swipes)
    touchEndY = e.changedTouches[0].screenY;

    // Only handle swipes if not scrolling vertically
    if (!isScrolling) {
      handleSwipeGesture();
    }
  };

  const handleSwipeGesture = () => {
    const xDiff = touchEndX - touchStartX;
    const absXDiff = Math.abs(xDiff);

    // Only register as swipe if distance is greater than minimum threshold
    if (absXDiff >= minDistance) {
      // Swipe left - next tab
      if (xDiff < 0 && onSwipeLeft) {
        onSwipeLeft();
      }

      // Swipe right - previous tab
      if (xDiff > 0 && onSwipeRightFn) {
        onSwipeRightFn();
      }
    }
  };

  /**
   * Attaches swipe event listeners to a DOM element
   *
   * @param {HTMLElement} element The DOM element to attach listeners to
   * @returns {Function} Function to remove the event listeners
   */
  const attachTo = element => {
    if (!element) return () => {
      // Empty return function for when no element is provided
      // This avoids the ESLint no-empty-function warning
      return null;
    };

    element.addEventListener("touchstart", handleTouchStart, { passive: true });
    element.addEventListener("touchmove", handleTouchMove, { passive: true });
    element.addEventListener("touchend", handleTouchEnd, { passive: !preventDefaultOnSwipe });

    // Return cleanup function
    return () => {
      element.removeEventListener("touchstart", handleTouchStart);
      element.removeEventListener("touchmove", handleTouchMove);
      element.removeEventListener("touchend", handleTouchEnd);
    };
  };

  return {
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    attachTo
  };
}
