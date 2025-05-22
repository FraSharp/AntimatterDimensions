import "drag-drop-touch";
import "./shims";
import "./merge-globals";
import { browserCheck, init } from "./game";
import { DEV } from "./env";
import { watchLatestCommit } from "./commit-watcher";

// Initialize the game regardless of browser check on iOS/iPad devices
const isIOS = /iPad|iPhone|iPod/u.test(navigator.userAgent) ||
             (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);

if (isIOS || browserCheck()) {
  init();

  // Performance optimizations for iOS
  // Reduce update frequency when app is in background and resume when visible again
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      // Force save game state
      GameStorage.save(true);
    } else {
      GameUI.update();
    }
  });

  // Reliable state saving when page hides
  window.addEventListener("pagehide", () => {
    GameStorage.save(true);
  });
}

if (DEV) watchLatestCommit();
