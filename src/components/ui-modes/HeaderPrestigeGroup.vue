<script>
import HeaderCenterContainer from "./prestige-header/HeaderCenterContainer";
import HeaderEternityContainer from "./prestige-header/HeaderEternityContainer";
import HeaderInfinityContainer from "./prestige-header/HeaderInfinityContainer";

export default {
  name: "HeaderPrestigeGroup",
  components: {
    HeaderCenterContainer,
    HeaderEternityContainer,
    HeaderInfinityContainer,
  },
};
</script>

<template>
  <div class="c-prestige-info-blocks">
    <HeaderEternityContainer class="l-game-header__eternity header-block" />
    <HeaderCenterContainer class="l-game-header__center header-block" />
    <HeaderInfinityContainer class="l-game-header__infinity header-block" />
  </div>
</template>

<style scoped>
.c-prestige-info-blocks {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap; /* Allow items to wrap */
  justify-content: space-around; /* Distribute space */
  min-height: 5rem; /* Adjust height as needed, or remove for auto height */
  width: 100%;
  color: var(--color-text);
  padding: 0.5rem 0; /* Add some vertical padding */
}

.header-block { /* Common class for all header blocks */
  flex-grow: 1;
  flex-basis: auto; /* Allow shrinking and growing */
  min-width: 150px; /* Minimum width before wrapping/shrinking */
  margin: 0.25rem; /* Add some margin between blocks */
  text-align: center; /* Center text within blocks */
}

/* Remove absolute positioning and fixed widths */
.l-game-header__eternity {
  /* width: 22rem; */ /* Replaced by flex properties */
}

.l-game-header__center {
  /* width: 50rem; */ /* Replaced by flex properties */
  /* Order this in the middle if visual order is important and differs from DOM order */
  /* order: 0; */ /* Example */
}

.l-game-header__infinity {
  /* width: 22rem; */ /* Replaced by flex properties */
}
</style>
