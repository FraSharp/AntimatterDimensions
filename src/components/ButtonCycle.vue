<script>
import { debounce } from "../utility/touch";

export default {
  name: "ButtonCycle",
  props: {
    text: {
      type: String,
      required: true
    },
    labels: {
      type: Array,
      required: true
    },
    value: {
      type: Number,
      required: true
    },
  },
  computed: {
    displayText() {
      return `${this.text} ${this.labels[this.value]}`.trim();
    }
  },
  methods: {
    handleClick() {
      this.emitInput((this.value + 1) % this.labels.length);
    }
  },
  created() {
    // Create debounced version of handleClick for touch events
    this.debouncedHandleClick = debounce(this.handleClick, 200);
  }
};
</script>

<template>
  <button
    v-bind="$attrs"
    class="ios-button no-select"
    @click.prevent="handleClick"
    @touchstart.passive="debouncedHandleClick"
    @contextmenu.prevent
  >
    {{ displayText }}
  </button>
</template>

