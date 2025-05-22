/**
 * Touch optimization utilities for Antimatter Dimensions mobile experience
 */

/**
 * Creates a debounced function that delays invoking func until after wait milliseconds have elapsed
 * since the last time the debounced function was invoked.
 *
 * @param {Function} func The function to debounce
 * @param {number} wait The number of milliseconds to delay (default: 200ms)
 * @param {boolean} immediate Whether to invoke the function on the leading edge of the timeout (default: false)
 * @returns {Function} The debounced function
 */
export function debounce(func, wait = 200, immediate = false) {
  let timeout;
  return function() {
    const context = this;
    const args = arguments;
    const later = function() {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
}

/**
 * Handler for touch interactions to prevent double-firing of events
 * and improve iOS touch response time
 *
 * @param {Function} handler The event handler function to optimize
 * @returns {Function} The optimized touch handler function
 */
export function touchHandler(handler) {
  // Track whether the handler has been called to prevent double execution
  let hasBeenHandled = false;

  return function(event) {
    // Prevent default only for touch events to allow keyboard accessibility
    if (event.type === "touchstart") {
      event.preventDefault();

      // Reset the handled flag on touchend
      const resetHandler = () => {
        hasBeenHandled = false;
        document.removeEventListener("touchend", resetHandler);
      };
      document.addEventListener("touchend", resetHandler);

      if (!hasBeenHandled) {
        hasBeenHandled = true;
        return handler.apply(this, arguments);
      }
    } else if (event.type === "click" && !hasBeenHandled) {
      // For non-touch devices, handle clicks normally
      return handler.apply(this, arguments);
    }
  };
}

/**
 * Adds visibility change detection to optimize performance when app is in background
 *
 * @param {Function} onVisible Called when document becomes visible
 * @param {Function} onHidden Called when document is hidden
 * @returns {Function} Function to remove event listeners
 */
export function setupVisibilityChangeDetection(onVisible, onHidden) {
  const handleVisibilityChange = () => {
    if (document.hidden) {
      onHidden();
    } else {
      onVisible();
    }
  };

  document.addEventListener("visibilitychange", handleVisibilityChange);
  window.addEventListener("pagehide", onHidden);
  window.addEventListener("pageshow", onVisible);

  // Return function to clean up event listeners
  return () => {
    document.removeEventListener("visibilitychange", handleVisibilityChange);
    window.removeEventListener("pagehide", onHidden);
    window.removeEventListener("pageshow", onVisible);
  };
}
