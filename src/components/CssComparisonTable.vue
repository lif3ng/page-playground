<template>
  <div>
    <ControlBar v-if="edit" :btns="['save']" @save="handleSave" />
    <!-- base html, base css -->
    <div v-if="edit" style="display: flex">
      <Editor
        lang="html"
        :code="html"
        ref="htmlEditor"
        @change="handleHtmlChange"
        style="flex: 1"
      />
      <Editor
        lang="css"
        :code="css"
        style="flex: 1"
        @change="handleCssChange"
        ref="cssEditor"
      />
      <div style="flex: 1">
        <p>tpl</p>
        <Editor
          lang="css"
          :code="cssTpl"
          @change="handleTplChange"
          prevent-format
        />
      </div>
    </div>
    <details v-else>
      <summary>基础代码</summary>
      <div style="display: flex">
        <Editor
          lang="html"
          :code="html"
          @change="handleHtmlChange"
          style="flex: 1"
        />
        <Editor
          lang="css"
          :code="css"
          style="flex: 1"
          @change="handleCssChange"
        />
      </div>
    </details>
    <!-- css tpl and table -->
    <div style="display: flex; font-size: 1em">
      <div v-html="_cssTpl[0]" class="pre" />
      <PreviewTable
        :html="htmlStr"
        :cssList="cssValueList.map(getValueCss)"
        :getCssFn="getValueCss"
        :edit="edit"
        @list-update="(v) => (listLocal = v)"
        style="margin-top: 1em"
      />
    </div>
    <div v-html="_cssTpl[1]" class="pre" />
  </div>
</template>
<script>
import PreviewTable from "./PreviewTable";
import Editor from "./Editor";
import ControlBar from "./ControlBar";
export default {
  name: "CssComparisonTable",
  components: { Editor, PreviewTable, ControlBar },
  props: {
    html: { type: String, default: "" },
    css: { type: String, default: "" },
    cssTpl: { type: String, default: "" },
    cssValueList: {
      type: Array,
      default: () => [],
    },
    edit: Boolean,
  },
  data() {
    return {
      htmlStr: "",
      cssStr: "",
      cssTplStr: "",
      listLocal: [],
    };
  },
  computed: {
    _cssTpl() {
      return (this.cssTplStr || this.cssTpl).split("{{}}");
    },
  },
  methods: {
    getValueCss(value) {
      return [
        value,
        `${this.cssStr}\n${this._cssTpl[0]}${value}${this._cssTpl[1]}`,
      ];
    },
    handleHtmlChange(html) {
      this.htmlStr = html;
    },
    handleCssChange(css) {
      this.cssStr = css;
    },
    handleTplChange(tpl) {
      this.cssTplStr = tpl;
    },
    handleSave() {
      this.$refs.htmlEditor.format();
      this.$refs.cssEditor.format();
      this.$emit("save", {
        html: this.htmlStr,
        css: this.cssStr,
        cssTpl: this.cssTplStr,
        cssValueList: this.listLocal,
      });
    },
  },
};
</script>
<style scoped>
.pre {
  white-space: pre-wrap;
}
</style>
