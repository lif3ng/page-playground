<template>
  <div class="playground">
    <div>
      <Editor class="editor" @change="handleChange"><slot /></Editor>
    </div>
    <div>
      <Preview class="preview" v-html="previewHtml" />
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
    };
  },
  methods: {
    handleChange(html) {
      this.previewHtml = html;
    },
  },
};
</script>
<style lang="stylus" scoped>
.playground
  display flex
  div
    flex 1
    width 100%
    + div
      margin-left:10px
</style>
