<template>
  <div :id="demoNum ? `demo-${demoNum}` : 'demo'">
    <slot />
  </div>
</template>
<script>
export default {
  name: "Preview",
  props: ["demoNum", "css"],
  data() {
    return { adoptedStyleSheetIndex: -1 };
  },
  mounted() {
    this.$nextTick(() => {
      // console.log(+new Date(), "preview el", this.$el, this.$el.getRootNode());
    });
  },
  methods: {
    renderCss(str) {
      const sheet = new CSSStyleSheet();
      sheet.replaceSync(str);
      sheet.rules.forEach((rule) => {
        rule.selectorText = `#demo-${this.demoNum} ${rule.selectorText}`;
      });
      const sheets = document.adoptedStyleSheets;
      if (this.adoptedStyleSheetIndex !== -1) {
        document.adoptedStyleSheets = [
          ...sheets.slice(0, this.adoptedStyleSheetIndex),
          sheet,
          ...sheets.slice(this.adoptedStyleSheetIndex + 1, sheets.length),
        ];
      } else {
        document.adoptedStyleSheets = [...sheets, sheet];
        this.adoptedStyleSheetIndex = document.adoptedStyleSheets.indexOf(
          sheet
        );
      }
    },
  },
  watch: {
    css(css) {
      this.renderCss(css);
    },
  },
};
</script>
