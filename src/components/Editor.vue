<template>
  <div ref="editor">
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
import { format } from "../utils";
import getRootMixin from "../getRootMixin";
export default {
  mixins: [getRootMixin],
  mounted() {
    const htmlStr = format(this.$refs.originSlot.innerHTML);
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
        html(),
      ],
    });
    this.view = new EditorView({
      state: startState,
      parent: this.$refs.editor,
      root: this.getRoot(),
    });
    const newState = this.view.state.update({
      changes: { from: 0, insert: htmlStr },
    });
    this.view.dispatch(newState);
  },
};
</script>