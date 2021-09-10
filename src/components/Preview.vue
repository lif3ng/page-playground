<template>
  <div
    class="m-1 ring border-blue-300"
    :id="demoNum ? `demo-${demoNum}` : 'demo'"
  >
    <!-- <slot v-if="renderType === 'dom'" /> -->

    <!-- <iframe
      v-else-if="renderType === 'iframe'"
      ref="iframe"
      class="border-none"
    /> -->
  </div>
</template>
<script>
export default {
  name: "Preview",
  props: {
    demoNum: {},
    css: {},
    html: {},
    renderType: {
      // dom, iframe
      default: "dom",
    },
  },
  data() {
    return { adoptedStyleSheetIndex: -1, iframeSrcDoc: "" };
  },
  mounted() {
    this.$nextTick(() => {
      // console.log(+new Date(), "preview el", this.$el, this.$el.getRootNode());
    });
  },
  methods: {
    renderCss(str) {
      if (this.renderType !== "dom") return;
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
    generateSrcDoc(html, css) {
      if (this.renderType !== "iframe") return;
      const srcdoc = `${html}
        <style>body{margin:0} ${css}</style>`;
      // this.iframeSrcDoc = srcdoc;
      console.log("set", srcdoc, this.iframe);
      this.$nextTick(() => {
        this.iframe.setAttribute("srcdoc", srcdoc);
      });
    },
  },
  watch: {
    css: {
      immediate: true,
      handler(css) {
        if (css) {
          this.renderCss(css);
          this.generateSrcDoc(this.html, css);
        }
      },
    },
    html: {
      immediate: true,
      handler(html) {
        if (this.renderType === "dom") {
          this.$el.innerHTML = html;
        } else {
          this.generateSrcDoc(html, this.css);
        }
      },
    },
    renderType: {
      immediate: true,
      handler(type) {
        console.log("render type change");
        if (type === "dom") {
          this.$el.innerHTML = this.html;
        } else if (type === "iframe") {
          const iframe = document.createElement("iframe");
          this.$el.innerHTML = "";
          debugger;
          this.iframe = iframe;
          iframe.classList.add("border-none");
          this.$el.appendChild(iframe);
        }
        this.renderCss(this.css);
        this.generateSrcDoc(this.html, this.css);
      },
    },
  },
};
</script>
