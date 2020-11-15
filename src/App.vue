<template>
  <div id="app">
    <h1>Editor</h1>
    <Editor>
      some text
      <div>
        a div
        <h1 style="color: blue">h1</h1>
      </div>
    </Editor>
    <hr />
    <h1>Preview</h1>
    <Preview />
    <hr />
    <h1>Playground (Editor + Preview)</h1>
    <Playground />
  </div>
</template>
<script>
import Editor from "./components/Editor.vue";
import Preview from "./components/Preview.vue";
import Playground from "./components/Playground.vue";

export default {
  name: "App",
  components: {
    Editor,
    Preview,
    Playground,
  },
};
</script>
