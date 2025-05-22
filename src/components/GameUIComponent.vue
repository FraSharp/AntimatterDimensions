<script>
import BackgroundAnimations from "@/components/BackgroundAnimations";
import ClassicUi from "@/components/ui-modes/classic/ClassicUi";
import GameUiComponentFixed from "@/components/GameUiComponentFixed";
import ModernUi from "@/components/ui-modes/modern/ModernUi";
import S12DesktopIcons from "@/components/ui-modes/s12/DesktopIcons";
import S12Ui from "@/components/ui-modes/s12/S12Ui";
import S12UiFixed from "@/components/ui-modes/s12/S12UiFixed";
import TabComponents from "@/components/tabs";
import { createSwipeHandler } from "@/utility/swipe-navigation";

export default {
  name: "GameUIComponent",
  components: {
    ...TabComponents,
    ClassicUi,
    ModernUi,
    GameUiComponentFixed,
    BackgroundAnimations,
    S12Ui,
    S12UiFixed,
    S12DesktopIcons,
  },
  computed: {
    view() {
      return this.$viewModel;
    },
    isThemeS12() {
      return this.view.theme === "S12";
    },
    uiLayout() {
      if (this.isThemeS12) return "S12Ui";
      return this.view.newUI ? "ModernUi" : "ClassicUi";
    },
    containerClass() {
      // Add mobile detection class
      const isMobile = /iPhone|iPad|iPod|Android/iu.test(navigator.userAgent);
      return `${this.view.newUI ? "new-ui" : "old-ui"}${isMobile ? " mobile-ui" : ""}`;
    },
    page() {
      const subtab = Tabs.current[this.$viewModel.subtab];
      return subtab.config.component;
    },
    themeCss() {
      return `stylesheets/theme-${this.view.theme}.css`;
    },
    // Add computed property to check if device is iOS
    isIOS() {
      return /iPhone|iPad|iPod/iu.test(navigator.userAgent);
    }
  },
  // Lifecycle hooks should come before methods according to ESLint vue/order-in-components
  mounted() {
    // Setup swipe handling for mobile devices
    if (/iPhone|iPad|iPod|Android/iu.test(navigator.userAgent)) {
      const swipeHandler = createSwipeHandler({
        onSwipeLeft: this.nextTab,
        onSwipeRight: this.prevTab,
        minSwipeDistance: 50,
        preventDefaultOnSwipe: true
      });

      // Store swipeHandler reference for cleanup
      this.swipeHandler = swipeHandler;

      document.addEventListener("touchstart", swipeHandler.handleTouchStart, { passive: true });
      document.addEventListener("touchmove", swipeHandler.handleTouchMove, { passive: true });
      document.addEventListener("touchend", swipeHandler.handleTouchEnd, { passive: true });

      // Add iOS safe area class to main container
      if (this.isIOS) {
        document.getElementById("ui").classList.add("safe-area-container");
      }

      // Prevent double-tap zoom
      document.addEventListener("touchend", e => {
        if (e.target.tagName !== "INPUT" && e.target.tagName !== "TEXTAREA") {
          e.preventDefault();
        }
      }, { passive: false });
    }
  },
  beforeDestroy() {
    // Clean up event listeners if component is destroyed
    if (/iPhone|iPad|iPod|Android/iu.test(navigator.userAgent) && this.swipeHandler) {
      document.removeEventListener("touchstart", this.swipeHandler.handleTouchStart);
      document.removeEventListener("touchmove", this.swipeHandler.handleTouchMove);
      document.removeEventListener("touchend", this.swipeHandler.handleTouchEnd);
    }
  },
  methods: {
    nextTab() {
      const currentTabIndex = Tabs.allTabs.indexOf(Tabs.current.tab);
      const nextTabIndex = (currentTabIndex + 1) % Tabs.allTabs.length;
      // Move to next available tab
      Tabs.all[Tabs.allTabs[nextTabIndex]].show();
    },
    prevTab() {
      const currentTabIndex = Tabs.allTabs.indexOf(Tabs.current.tab);
      const prevTabIndex = (currentTabIndex - 1 + Tabs.allTabs.length) % Tabs.allTabs.length;
      // Move to previous available tab
      Tabs.all[Tabs.allTabs[prevTabIndex]].show();
    }
  }
};
</script>

<template>
  <div
    v-if="view.initialized"
    id="ui-container"
    :class="[containerClass, 'safe-area-container']"
    class="ui-wrapper"
  >
    <!-- Dynamic component based on UI layout -->
    <component :is="uiLayout"></component>
  </div>
</template>
