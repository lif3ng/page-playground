<template>
  <div class="playground">
    <div>
      <Editor class="editor" @change="handleChange"><slot /></Editor>
    </div>
    <div>
      <Preview
        class="preview"
        v-if="isDev"
        ref="previewDom"
        :demoNum="demoNum"
        v-html="previewHtml"
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
import getRootMixin from "../getRootMixin";
export default {
  mixins: [getRootMixin],
  components: { Editor, Preview },
  data() {
    return {
      previewHtml: "",
      demoNum: parseInt(Math.random() * 1000000000),
    };
  },
  computed: {
    isDev() {
      return process.env.NODE_ENV === "development";
    },
  },
  watch: {
    previewHtml() {
      this.$nextTick(() => {
        if (this.isDev) {
          // dom
          const style = this.$refs.previewDom.$el.querySelectorAll("style");
          Array.from(style).forEach(({ sheet: { rules } }) => {
            // sheet.disabled = true;
            rules.forEach((rule) => {
              rule.selectorText = `#demo-${this.demoNum} ${rule.selectorText}`;
            });
          });
        } else {
          // web component
          const style = this.$refs.previewShadow.querySelectorAll("style");
          Array.from(style).forEach(({ sheet }) => {
            sheet.disabled = true;
          });
        }
      });
    },
  },
  methods: {
    handleChange(html) {
      this.previewHtml = html;
    },
  },
};
</script>
<style lang="stylus" scoped>
.playground {
  display: flex;

  div {
    flex: 1;
    width: 100%;

    + div {
      margin-left: 10px;
    }
  }
}
</style>
