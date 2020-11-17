<template>
  <div :id="demoNum ? `demo-${demoNum}` : 'demo'">
    <slot />
  </div>
</template>
<script>
export default {
  props: ["demoNum"],
};
</script>