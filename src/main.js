import "drag-drop-touch";
import "./shims";
import "./merge-globals";
import { browserCheck, init } from "./game";
import { DEV } from "./env";
import { watchLatestCommit } from "./commit-watcher";

const isIOS = /iPad|iPhone|iPod/u.test(navigator.userAgent) ||
             (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);

if (isIOS || browserCheck()) {
  init();

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      GameStorage.save(true);
    } else {
      GameUI.update();
    }
  });

  window.addEventListener("pagehide", () => {
    GameStorage.save(true);
  });
}

if (DEV) watchLatestCommit();
