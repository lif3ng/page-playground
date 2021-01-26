<template>
  <div class="focus-within:ring focus-within:border-blue-300 m-1">
    <ControlBar v-if="bar" @format="format" />
    <div ref="editor"></div>
    <div ref="originSlot" style="display: none"><slot /></div>
  </div>
</template>
<script>
// import { EditorState } from "@codemirror/next/state";
// import { EditorView, keymap } from "@codemirror/next/view";
// import { defaultKeymap } from "@codemirror/next/commands";
import { EditorState, EditorView, basicSetup } from "@codemirror/basic-setup";
import { StateField } from "@codemirror/state";
import { html } from "@codemirror/lang-html";
import { css } from "@codemirror/lang-css";
import ControlBar from "./ControlBar";
import { format } from "../utils";
import getRootMixin from "../getRootMixin";
export default {
  name: "Editor",
  mixins: [getRootMixin],
  components: { ControlBar },
  props: {
    lang: {
      default: "html",
    },
    bar: {
      type: Boolean,
    },
    code: {
      default: "",
    },
    preventFormat: {
      type: Boolean,
    },
  },
  mounted() {
    this.$nextTick(() => {
      const style = this.$refs.originSlot.querySelectorAll("style");
      style.forEach(({ sheet }) => {
        sheet.disabled = true;
      });
    });
    let startState = EditorState.create({
      doc: "",
      extensions: [
        [
          EditorView.editorAttributes.of({ language: this.lang }),
          EditorView.baseTheme({
            "$:before": {
              position: "absolute",
              right: 0,
              content: `attr(language)`,
              opacity: 0.3,
              fontSize: 1.2,
              fontWight: "fold",
              background: "#def",
              zIndex: 1,
            },
            // "$ $selectionBackground": { background: "blue !important" },
            $$focused$wrap: { outline: "none" },
          }),
        ],
        StateField.define({
          create() {
            return 0;
          },
          update: (value, tr) => {
            if (tr.docChanged) {
              this.$emit("change", tr.newDoc.toString());
            }
          },
        }),
        basicSetup,
        ...(this.lang === "html" ? [html()] : []),
        ...(this.lang === "css" ? [css()] : []),
      ],
    });
    const div = document.createElement("div");
    div.setAttribute("a", "b");
    this.view = new EditorView({
      state: startState,
      parent: this.$refs.editor,
      root: this.getRoot(),
      dom: div,
    });
    const codeStr = this.$refs.originSlot.innerHTML || this.code;
    this.format(codeStr);
  },
  methods: {
    currentCode() {
      return this.view.state.doc.toString();
    },
    format(str) {
      const originCode = str || this.currentCode();
      const currentLen = this.view.state.doc.length;
      const targetCode = this.preventFormat
        ? originCode
        : format(originCode, this.lang);
      const newState = this.view.state.update({
        changes: { from: 0, to: currentLen, insert: targetCode },
      });
      this.view.dispatch(newState);
    },
  },
};
</script>
