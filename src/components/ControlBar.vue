<template>
  <div>
    <button
      v-for="({ text, type }, i) in showBtnsData"
      :key="i"
      :class="type"
      @click="handleClick(type)"
    >
      {{ text }}
    </button>
  </div>
</template>
<script>
const btnConfig = {
  format: {
    text: "format",
  },
  save: {
    text: "save",
  },
  share: {
    text: "share",
  },
  fullscreen: {
    text: "full screen",
  },
};
export default {
  props: {
    btns: {
      default: () => ["format"],
      type: Array,
    },
  },
  data() {
    return {
      fullscreen: false,
    };
  },
  methods: {
    handleClick(type) {
      this.$emit(type);
      if (type === "fullscreen") {
        this.fullscreen = true;
      } else if (type === "exit_fullscreen") {
        this.fullscreen = false;
      }
    },
  },
  computed: {
    showBtnsData() {
      const btns = this.btns.map((btn) => {
        if (typeof btn === "string" && btnConfig[btn]) {
          return { ...btnConfig[btn], type: btn };
        }
        return btn;
      });
      const fullScreenBtnIndex = btns.findIndex(
        ({ type }) => type === "fullscreen"
      );
      console.log({ fullScreenBtnIndex });
      if (fullScreenBtnIndex !== -1) {
        btns.splice(fullScreenBtnIndex, 0, {
          type: "exit_fullscreen",
          text: "exit fullscreen",
        });
      }
      return btns;
    },
  },
};
</script>
