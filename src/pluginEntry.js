import Playground from "./components/Playground.vue";
import Editor from "./components/Editor.vue";
import Preview from "./components/Preview.vue";
import ControlBar from "./components/ControlBar.vue";
const plugin = {};
const components = [Editor, Preview, Playground, ControlBar];
plugin.install = (Vue, { prefix = "html" } = {}) => {
  components.forEach((component) => {
    Vue.component(
      `${prefix.charAt(0).toUpperCase()}${prefix.slice(1)}${component.name}`,
      component
    );
  });
};
export default plugin;
