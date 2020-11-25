import Vue from "vue";
import App from "./PluginApp";
import plugin from "../pluginEntry";
Vue.use(plugin);
new Vue({
  render: (h) => h(App),
}).$mount("#app");
