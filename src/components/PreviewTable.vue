<template>
  <table class="border-separate overflow-visible">
    <tbody>
      <tr>
        <td>
          render type:
          <select v-model="selectedRenderType">
            <option v-for="(type, i) in renderTypeList" :key="i">{{
              type
            }}</option>
          </select>
          {{ selectedRenderType }}
        </td>
      </tr>
      <tr v-for="([v, css], index) in list" :key="index">
        <td>
          {{ v }}

          <button v-if="edit" style="float: right" @click="deleteItem(index)">
            x
          </button>
          <button
            v-if="edit && index !== 0"
            style="float: right"
            @click="moveItemUp(index)"
          >
            ^
          </button>
        </td>
        <td>
          <!-- {{ css }} -->
          <Preview
            :demoNum="`${demoNum}-${index}`"
            :css="css"
            :html="html"
            :renderType="selectedRenderType"
          ></Preview>
        </td>
      </tr>
      <tr v-if="edit">
        <td>
          <input
            v-if="isEdit"
            v-model="inputValue"
            ref="input"
            @keydown.tab="saveTplItem"
            @keyup.enter="saveTplItem($event, true)"
            @keyup.esc="isEdit = false"
          />
          <button v-else @click="handleAddItem">+</button>
        </td>
      </tr>
    </tbody>
  </table>
</template>
<script>
import Preview from "./Preview.vue";
export default {
  components: { Preview },
  props: ["html", "cssList", "getCssFn", "edit"],
  data() {
    return {
      demoNum: parseInt(Math.random() * 10000000),
      innerList: this.$props.cssList ? this.$props.cssList.map(([x]) => x) : [],
      isEdit: false,
      inputValue: "",
      renderTypeList: ["dom", "iframe"],
      selectedRenderType: "dom",
    };
  },
  computed: {
    list() {
      return this.edit ? this.innerList.map(this.getCssFn) : this.cssList;
    },
  },
  watch: {
    innerList(v) {
      this.$emit("list-update", v);
    },
  },
  methods: {
    saveTplItem(e, exit) {
      e.preventDefault();
      if (this.inputValue) {
        this.innerList.push(this.inputValue);
        this.inputValue = "";
      }
      if (exit) {
        this.isEdit = false;
      }
    },
    deleteItem(i) {
      this.innerList.splice(i, 1);
    },
    moveItemUp(i) {
      const item = this.innerList.splice(i, 1);
      this.innerList.splice(i - 1, 0, ...item);
    },
    handleAddItem() {
      this.isEdit = true;
      this.$nextTick(() => {
        this.$refs.input.focus();
      });
    },
  },
};
</script>
<style scoped lang="stylus">
tr {
  background: transparent;

  td {
    padding: 0;
    border: none;

    &:first-child {
      vertical-align: top;
      padding: 0.2em 0 0 10px;
      border: 1px solid #ccc;
      border-width: 0 0 1px 1px;
      border-radius: 0 0 0 10px;
    }
  }
}
</style>
