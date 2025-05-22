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
 * @param {number} [options.maxSwipeTime=500] Maximum time in ms for a valid swipe
 * @param {number} [options.minSwipeSpeed=0.2] Minimum speed in px/ms for a valid swipe
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
    preventDefaultOnSwipe = false,
    maxSwipeTime = 500,
    minSwipeSpeed = 0.2
  } = config;

  let touchStartX = 0;
  let touchStartY = 0;
  let touchEndX = 0;
  let touchEndY = 0;
  let touchStartTime = 0;

  // Store the element that started the touch
  let touchStartElement = null;

  // Detect if device is iOS
  const isIOS = /iPhone|iPad|iPod/iu.test(navigator.userAgent);

  /**
   * Handle the start of a touch event
   * @param {TouchEvent} e The touch event
   */
  function handleTouchStart(e) {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
    touchStartTime = Date.now();
    touchStartElement = e.target;
  }

  /**
   * Handle touch move events
   * @param {TouchEvent} e The touch event
   */
  function handleTouchMove(e) {
    // Don't handle multi-touch events
    if (e.touches.length > 1) return;

    // Store current position to allow for velocity calculation
    touchEndX = e.touches[0].clientX;
    touchEndY = e.touches[0].clientY;

    // Calculate horizontal and vertical distance
    const xDiff = touchStartX - touchEndX;
    const yDiff = touchStartY - touchEndY;

    // If horizontal swipe is significantly greater than vertical, prevent default scrolling
    // This prevents conflicting with vertical scrolling
    if (Math.abs(xDiff) > Math.abs(yDiff) * 1.5 && Math.abs(xDiff) > minDistance / 2 && preventDefaultOnSwipe) {
      e.preventDefault();
    }
  }

  /**
   * Handle the end of a touch event
   * @param {TouchEvent} e The touch event
   */
  function handleTouchEnd(e) {
    // Skip if no touchStartX (shouldn't happen, but just in case)
    if (touchStartX === 0) return;

    // Calculate final position if not set in touchmove
    touchEndX = e.changedTouches[0].clientX;
    touchEndY = e.changedTouches[0].clientY;

    // Calculate horizontal and vertical distance
    const xDiff = touchStartX - touchEndX;
    const yDiff = touchStartY - touchEndY;

    // Only detect swipes if horizontal movement is dominant (to avoid triggering during scrolling)
    const isHorizontalSwipe = Math.abs(xDiff) > Math.abs(yDiff);

    // Calculate time and speed
    const touchEndTime = Date.now();
    const touchTime = touchEndTime - touchStartTime;

    // Calculate pixels per ms
    const touchSpeed = Math.abs(xDiff) / touchTime;

    // Don't handle swipes in scrollable containers unless the swipe is very deliberate
    const isScrollable = isScrollableElement(touchStartElement);
    const isDeliberateSwipe = touchSpeed > minSwipeSpeed * 1.5;

    if (isHorizontalSwipe &&
        Math.abs(xDiff) >= minDistance &&
        touchTime <= maxSwipeTime &&
        (touchSpeed >= minSwipeSpeed) &&
        (!isScrollable || isDeliberateSwipe)) {

      if (preventDefaultOnSwipe) {
        e.preventDefault();
      }

      if (xDiff > 0) {
        // Swiped left (next)
        if (typeof onSwipeLeft === "function") onSwipeLeft();
      } else {
        // Swiped right (previous)
        if (typeof onSwipeRightFn === "function") onSwipeRightFn();
      }
    }

    // Reset values
    touchStartX = 0;
    touchStartY = 0;
    touchEndX = 0;
    touchEndY = 0;
    touchStartElement = null;
  }

  /**
   * Check if an element or its parents are scrollable and have content that's scrolling
   * @param {Element} element The element to check
   * @returns {boolean} True if element is in a scrollable container with active scrolling
   */
  function isScrollableElement(element) {
    let current = element;
    // Don't check too many parents
    const maxDepth = 5;
    let depth = 0;

    // Look for scrollable elements in the parent chain
    while (current && depth < maxDepth) {
      const hasVerticalScroll = current.scrollHeight > current.clientHeight;
      const style = window.getComputedStyle(current);
      const isScrollable = ["auto", "scroll"].includes(style.overflowY);

      if (hasVerticalScroll && isScrollable) {
        // Special case for iOS where we use -webkit-overflow-scrolling
        if (isIOS && style.webkitOverflowScrolling === "touch") {
          return true;
        }
        // Normal scrollable detection
        if (current.scrollTop > 0 && current.scrollTop < (current.scrollHeight - current.clientHeight)) {
          return true;
        }
      }

      current = current.parentElement;
      depth++;
    }

    return false;
  }

  return {
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd
  };
}
