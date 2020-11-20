<template>
  <div class="playground">
    <ContralBar
      class="control"
      @format="handleFormat"
      @fullscreen="handleFullScreen(true)"
      @exit_fullscreen="handleFullScreen(false)"
      :btns="['format', 'fullscreen']"
    />
    <div>
      <Editor
        class="editor"
        @change="handleChange"
        ref="editor"
        v-if="$slots.default"
      >
        <slot />
      </Editor>
      <Editor
        v-else
        :code="html"
        class="editor"
        @change="handleChange"
        ref="editor"
      />
      <Editor lang="css" :code="cssCode" class="editor" />
    </div>
    <div>
      <Preview
        class="preview"
        v-if="isDev"
        ref="previewDom"
        :demoNum="demoNum"
        v-html="previewHtml"
        :css="cssCode"
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
    };
  },
  computed: {
    isDev() {
      return process.env.NODE_ENV === "development";
    },
    cssCode() {
      return this.styleInHtml + this.css;
    },
  },
  mounted() {
    console.log(this);
    console.log(this.$slots.default);
  },
  watch: {
    cssCode: {
      immediate: true,
      handler(css) {
        console.log("csscode", css);
      },
    },
    previewHtml() {
      this.$nextTick(() => {
        const cssRuleArr = [];
        if (this.isDev) {
          // dom
          const style = this.$refs.previewDom.$el.querySelectorAll("style");
          console.log({ style });
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
    handleFullScreen(status) {
      if (status) {
        this.$el.requestFullscreen();
      } else {
        document.exitFullscreen();
      }
    },
    handleFormat() {
      this.$refs.editor.format();
    },
  },
};
</script>
<style lang="stylus" scoped>
.playground {
  display: flex;
  padding-top:30px
  position:relative
  .control{
    position: absolute
    top 0
  }
  >div {
    flex: 1;
    width: 100%;
    outline 1px solid #ccc
    &:last-child {
      margin-left: 10px;
    }
  }
  >>>.exit_fullscreen{
    display:none
  }
  &:fullscreen{
    background:#fff
    >>>.fullscreen{
      display:none
    }
    >>>.exit_fullscreen{
    display:inline-block
  }
  }
}
</style>
