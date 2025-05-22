<script>
export default {
  name: "PrimaryButton",
  props: {
    enabled: {
      type: Boolean,
      required: false,
      default: true
    }
  },
  computed: {
    classObject() {
      return {
        "o-primary-btn--disabled": !this.enabled,
        "ios-button": true,
        "no-select": true
      };
    }
  }
};
</script>

<template>
  <button
    class="o-primary-btn"
    :class="classObject"
    @touchstart.passive="$listeners.click"
    @contextmenu.prevent
    v-on="$listeners"
  >
    <slot />
  </button>
</template>

