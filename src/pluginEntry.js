const plugin = {};
const components = ["Editor", "Preview", "Playground"];
plugin.install = (Vue, { prefix = "Html" }) => {
  components.forEach((name) => {
    Vue.components(`${prefix}${name}`, () => import(`./components/${name}`));
  });
};
