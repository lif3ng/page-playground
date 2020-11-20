<template>
  <div :id="demoNum ? `demo-${demoNum}` : 'demo'">
    <slot />
  </div>
</template>
<script>
export default {
  props: ["demoNum", "css"],
  mounted() {
    console.log(+new Date(), "preview el", this.$el, this.$el.getRootNode());

    this.$nextTick(() => {
      console.log(+new Date(), "preview el", this.$el, this.$el.getRootNode());
    });
  },
};
</script>
