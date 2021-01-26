<template>
  <div>
    <!-- base html, base css -->
    <div v-if="edit" style="display:flex">
      <Editor
        lang="html"
        :code="html"
        @change="handleHtmlChange"
        style="flex:1"
      />
      <Editor lang="css" :code="css" style="flex:1" @change="handleCssChange" />
      <div style="flex:1">
        <p>tpl</p>
        <Editor
          lang="css"
          :code="cssTpl"
          @change="handleTplChange"
          prevent-format
        />
      </div>
    </div>
    <details open v-else>
      <summary>基础代码</summary>
      <div style="display:flex">
        <Editor
          lang="html"
          :code="html"
          @change="handleHtmlChange"
          style="flex:1"
        />
        <Editor
          lang="css"
          :code="css"
          style="flex:1"
          @change="handleCssChange"
        />
      </div>
    </details>
    <!-- css tpl and table -->
    <div style="display: flex;font-size:1em;">
      <div
        v-html="_cssTpl[0]"
        style="display: inline-block;white-space:pre-wrap"
      />
      <PreviewTable
        :html="htmlStr"
        :cssList="cssValueList.map(getValueCss)"
        :getCssFn="getValueCss"
        :edit="edit"
        style="margin-top: 1em"
      />
    </div>
    <pre v-html="_cssTpl[1]" />
  </div>
</template>
<script>
import PreviewTable from "./PreviewTable";
import Editor from "./Editor";
export default {
  components: { Editor, PreviewTable },
  props: ["html", "css", "cssTpl", "cssValueList"],
  data() {
    return { htmlStr: "", cssStr: "", cssTplStr: "", edit: true };
  },
  computed: {
    _cssTpl() {
      console.log((this.cssTplStr || this.cssTpl).split("{{}}"));
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
  },
};
</script>
