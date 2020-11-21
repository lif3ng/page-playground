<template>
  <div>
    <ControlBar v-if="bar" @format="format" />
    <div ref="editor"></div>
    <div ref="originSlot" style="display: none"><slot /></div>
  </div>
</template>
<script>
// import { EditorState } from "@codemirror/next/state";
// import { EditorView, keymap } from "@codemirror/next/view";
// import { defaultKeymap } from "@codemirror/next/commands";
import {
  EditorState,
  EditorView,
  basicSetup,
} from "@codemirror/next/basic-setup";
import { StateField } from "@codemirror/next/state";
import { html } from "@codemirror/next/lang-html";
import { css } from "@codemirror/next/lang-css";
import ControlBar from "./ControlBar";
import { format } from "../utils";
import getRootMixin from "../getRootMixin";
export default {
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
    this.view = new EditorView({
      state: startState,
      parent: this.$refs.editor,
      root: this.getRoot(),
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
      const targetCode = format(originCode, this.lang);
      const newState = this.view.state.update({
        changes: { from: 0, to: currentLen, insert: targetCode },
      });
      this.view.dispatch(newState);
    },
  },
};
</script>
