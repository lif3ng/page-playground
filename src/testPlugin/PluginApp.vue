<template>
  <div>
    <html-playground v-on="handlers" />
  </div>
</template>
<script>
export default {
  data() {
    return {
      handlers: {
        save: console.log.bind(null, "save"),
      },
    };
  },
};
</script>
