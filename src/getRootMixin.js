export default {
  methods: {
    getRoot() {
      return (
        this.$parent.$options.shadowRoot ||
        (this.$parent.getRoot && this.$parent.getRoot()) ||
        document
      );
    },
  },
};
