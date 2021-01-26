<template>
  <table style="display: inline-block">
    <tbody>
      <tr v-for="([v, css], index) in list" :key="index">
        <td>
          {{ v }}

          <button v-if="edit" style="float:right" @click="deleteItem(index)">
            x
          </button>
          <button
            v-if="edit && index !== 0"
            style="float:right"
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
            v-html="html"
          ></Preview>
        </td>
      </tr>
      <tr v-if="edit">
        <td>
          <input
            v-if="isEdit"
            v-model="inputValue"
            @keyup.enter="saveTplItem"
            @keyup.esc="isEdit = false"
          />
          <button v-else @click="isEdit = true">+</button>
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
      innerList: [],
      isEdit: false,
      inputValue: "",
    };
  },
  computed: {
    list() {
      return this.edit ? this.innerList.map(this.getCssFn) : this.cssList;
    },
  },
  methods: {
    saveTplItem() {
      if (this.inputValue) {
        this.innerList.push(this.inputValue);
        this.inputValue = "";
        this.isEdit = "false";
      }
    },
    deleteItem(i) {
      this.innerList.splice(i, 1);
    },
    moveItemUp(i) {
      const item = this.innerList.splice(i, 1);
      this.innerList.splice(i - 1, 0, ...item);
    },
  },
};
</script>
<style scoped lang="stylus">
tr {
  td{
    border-bottom: 1px solid #ccc
    &:first-child{
      padding-left 10px
      border: 1px solid #ccc;
      border-width: 0 0 1px 1px
      border-radius: 0 0 0 10px
    }
  }
}
</style>
