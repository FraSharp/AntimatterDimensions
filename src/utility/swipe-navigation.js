/**
 * Swipe navigation utilities for tab interfaces in Antimatter Dimensions
 */

/**
 * Creates a swipe detection handler that can be applied to tab interfaces
 *
 * @param {Function} onSwipeLeft Function to call when user swipes left (next tab)
 * @param {Function} onSwipeRight Function to call when user swipes right (previous tab)
 * @param {number} threshold Minimum distance in pixels to trigger swipe (default: 50)
 * @returns {Object} Object with event handlers to attach to elements
 */
export function createSwipeHandler(onSwipeLeft, onSwipeRight, threshold = 50) {
  let touchStartX = 0;
  let touchEndX = 0;

  const handleTouchStart = e => {
    touchStartX = e.changedTouches[0].screenX;
  };

  const handleTouchEnd = e => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipeGesture();
  };

  const handleSwipeGesture = () => {
    // Swipe left - next tab
    if (touchEndX < touchStartX - threshold && onSwipeLeft) {
      onSwipeLeft();
    }

    // Swipe right - previous tab
    if (touchEndX > touchStartX + threshold && onSwipeRight) {
      onSwipeRight();
    }
  };

  /**
   * Attaches swipe event listeners to a DOM element
   *
   * @param {HTMLElement} element The DOM element to attach listeners to
   * @returns {Function} Function to remove the event listeners
   */
  const attachTo = element => {
    if (!element) return () => {};

    element.addEventListener("touchstart", handleTouchStart, { passive: true });
    element.addEventListener("touchend", handleTouchEnd, { passive: true });

    // Return cleanup function
    return () => {
      element.removeEventListener("touchstart", handleTouchStart);
      element.removeEventListener("touchend", handleTouchEnd);
    };
  };

  return {
    handleTouchStart,
    handleTouchEnd,
    attachTo
  };
}
