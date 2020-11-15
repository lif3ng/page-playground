<template>
  <div ref="editor">
    editor
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
import { html } from "@codemirror/next/lang-html";
import { format } from "../utils";

export default {
  mounted() {
    const htmlStr = format(this.$refs.originSlot.innerHTML);
    let startState = EditorState.create({
      doc: htmlStr,
      extensions: [basicSetup, html()],
    });
    this.view = new EditorView({
      state: startState,
      parent: this.$refs.editor,
      // config: {
      //   state: startState,
      //   // root: ShadowRoot,
      // },
    });
    console.log(this.view);
  },
  methods: {
    vNodeToHtml(vNode) {
      const { text, tag, children } = vNode;
      if (text) {
        return text;
      } else if (tag) {
        return `<${tag}>${children.map(this.vNodeToHtml).join("")}</${tag}>`;
      }
    },
  },
};
</script>