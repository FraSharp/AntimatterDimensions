<script>
import BackgroundAnimations from "@/components/BackgroundAnimations";
import ClassicUi from "@/components/ui-modes/classic/ClassicUi";
import GameUiComponentFixed from "@/components/GameUiComponentFixed";
import ModernUi from "@/components/ui-modes/modern/ModernUi";
import TabComponents from "@/components/tabs";
import { createSwipeHandler } from "@/utility/swipe-navigation";

import S12DesktopIcons from "@/components/ui-modes/s12/DesktopIcons";
import S12Ui from "@/components/ui-modes/s12/S12Ui";
import S12UiFixed from "@/components/ui-modes/s12/S12UiFixed";

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
      return this.view.newUI ? "new-ui" : "old-ui";
    },
    page() {
      const subtab = Tabs.current[this.$viewModel.subtab];
      return subtab.config.component;
    },
    themeCss() {
      return `stylesheets/theme-${this.view.theme}.css`;
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
  },
  mounted() {
    // Create and attach swipe handler for tab navigation but wait for DOM to be ready
    this.$nextTick(() => {
      this.swipeHandler = createSwipeHandler(
        () => this.nextTab(),
        () => this.prevTab(),
        50 // 50px threshold to trigger swipe
      );

      const uiElement = document.getElementById('ui');
      if (uiElement) {
        this.removeSwipeListeners = this.swipeHandler.attachTo(uiElement);
      }
    });
  },
  beforeDestroy() {
    // Clean up event listeners
    if (this.removeSwipeListeners) this.removeSwipeListeners();
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
    <div
      id="ui"
      class="c-game-ui ios-scroll"
    >
      <component :is="uiLayout">
        <component
          :is="page"
          class="c-game-tab"
        />
      </component>
      <S12DesktopIcons v-if="isThemeS12" />
      <link
        v-if="view.theme !== 'Normal'"
        type="text/css"
        rel="stylesheet"
        :href="themeCss"
      >
    </div>
    <GameUiComponentFixed />
    <S12UiFixed v-if="isThemeS12" />
  </div>
</template>

