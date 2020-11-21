<template>
  <div class="playground">
    <ContralBar
      class="control"
      @format="handleFormat"
      @fullscreen="handleFullScreen(true)"
      @exit_fullscreen="handleFullScreen(false)"
      @save="handleSave"
      :btns="['format', 'fullscreen', 'save']"
    />
    <div>
      <h2>html</h2>
      <Editor
        class="editor"
        @change="handleChange"
        ref="htmlEditor"
        v-if="$slots.default"
      >
        <slot />
      </Editor>

      <Editor
        v-else
        :code="html"
        class="editor"
        ref="htmlEditor"
        @change="handleChange"
      />
      <h2>css</h2>

      <Editor
        lang="css"
        :code="css"
        class="editor"
        ref="cssEditor"
        @change="handleCssChange"
      />
    </div>
    <div>
      <Preview
        class="preview"
        v-if="isDev"
        ref="previewDom"
        :demoNum="demoNum"
        v-html="previewHtml"
        :css="cssToRender"
      />
      <html-preview
        class="preview"
        ref="previewShadow"
        v-else
        v-html="previewHtml"
      />
    </div>
  </div>
</template>
<script>
import Editor from "./Editor";
import Preview from "./Preview";
import ContralBar from "./ControlBar";
import getRootMixin from "../getRootMixin";
export default {
  mixins: [getRootMixin],
  components: { Editor, Preview, ContralBar },
  props: {
    html: {
      default: "",
    },
    css: {
      default: "",
    },
  },
  data() {
    return {
      previewHtml: "",
      demoNum: parseInt(Math.random() * 1000000000),
      styleInHtml: "",
      cssToRender: "",
    };
  },
  computed: {
    isDev() {
      return process.env.NODE_ENV === "development";
    },
    allCssCode() {
      return this.styleInHtml + this.css;
    },
  },
  mounted() {},
  watch: {
    // cssCode: {
    //   immediate: true,
    //   handler(css) {
    //     console.log("csscode", css);
    //   },
    // },
    previewHtml() {
      this.$nextTick(() => {
        const cssRuleArr = [];
        if (this.isDev) {
          // vue dom
          const style = this.$refs.previewDom.$el.querySelectorAll("style");
          Array.from(style).forEach(({ sheet: { rules }, innerText }) => {
            // sheet.disabled = true;
            rules.forEach((rule) => {
              rule.selectorText = `#demo-${this.demoNum} ${rule.selectorText}`;
            });
            cssRuleArr.push(innerText);
          });
        } else {
          // web component
          const style = this.$refs.previewShadow.querySelectorAll("style");
          Array.from(style).forEach(({ sheet, innerText }) => {
            sheet.disabled = true;
            cssRuleArr.push(innerText);
          });
        }
        this.styleInHtml = cssRuleArr.join("");
      });
    },
  },
  methods: {
    handleChange(html) {
      this.previewHtml = html;
    },
    handleCssChange(css) {
      this.cssToRender = css;
    },
    handleFullScreen(status) {
      if (status) {
        this.$el.requestFullscreen();
      } else {
        document.exitFullscreen();
      }
    },
    handleFormat() {
      this.$refs.htmlEditor.format();
      this.$refs.cssEditor.format();
    },
    handleSave() {
      this.handleFormat();
      const data = {
        html: this.$refs.htmlEditor.currentCode(),
        css: this.$refs.cssEditor.currentCode(),
      };
      this.$emit("save", data);
    },
  },
};
</script>
<style lang="stylus" scoped>
.playground {
  display: flex;
  padding-top: 30px;
  position: relative;

  .control {
    position: absolute;
    top: 0;
  }

  >div {
    flex: 1;
    width: 100%;
    outline: 1px solid #ccc;

    &:last-child {
      margin-left: 10px;
    }
  }

  >>>.exit_fullscreen {
    display: none;
  }

  &:fullscreen {
    background: #fff;

    >>>.fullscreen {
      display: none;
    }

    >>>.exit_fullscreen {
      display: inline-block;
    }
  }
}
</style>
