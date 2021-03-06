<template>
  <div class="playground">
    <ContralBar
      class="control flex"
      @format="handleFormat"
      @fullscreen="handleFullScreen(true)"
      @exit_fullscreen="handleFullScreen(false)"
      @save="handleSave"
      :btns="wrapperControlBtns"
    />
    <div class="flex space-x-4">
      <div class="flex flex-col flex-1 overflow-x-auto">
        <template v-if="wrapperAreas.includes('html')">
          <!-- <h2 v-if="showAreaType">html</h2> -->
          <Editor
            class="editor"
            @change="handleChange"
            ref="htmlEditor"
            v-if="$slots.default"
          >
            <slot />
          </Editor>
          <Editor
            v-else
            :code="html"
            class="editor"
            ref="htmlEditor"
            @change="handleChange"
          />
        </template>
        <template v-if="wrapperAreas.includes('css')">
          <!-- <h2 v-if="showAreaType">css</h2> -->
          <Editor
            lang="css"
            :code="css"
            class="editor"
            ref="cssEditor"
            @change="handleCssChange"
          />
        </template>
      </div>
      <div class="flex-1 overflow-x-auto">
        <html-preview
          class="preview"
          ref="previewShadow"
          v-if="isWc"
          v-html="previewHtml"
        />
        <Preview
          class="preview"
          v-else
          ref="previewDom"
          :demoNum="demoNum"
          v-html="previewHtml"
          :css="cssToRender"
        />
      </div>
    </div>
  </div>
</template>
<script>
import Editor from "./Editor";
import Preview from "./Preview";
import ContralBar from "./ControlBar";
import getRootMixin from "../getRootMixin";
export default {
  name: "Playground",
  mixins: [getRootMixin],
  components: { Editor, Preview, ContralBar },
  props: {
    html: {
      default: "",
    },
    css: {
      default: "",
    },
    areas: {
      default: () => ["html", "css"],
    },
    controlBtns: {
      default: () => ["format", "fullscreen", "save"],
    },
  },
  data() {
    return {
      previewHtml: "",
      demoNum: parseInt(Math.random() * 1000000000),
      styleInHtml: "",
      cssToRender: "",
    };
  },
  computed: {
    isWc() {
      return process.env.NODE_ENV === "wc";
    },
    allCssCode() {
      return this.styleInHtml + this.css;
    },
    wrapperAreas() {
      return typeof this.areas === "string" // && this.isWc
        ? // ? JSON.stringify(this.areas)
          this.areas.split(",").map((x) => x.trim())
        : this.areas;
    },
    wrapperControlBtns() {
      return typeof this.controlBtns === "string" // && this.isWc
        ? // ? JSON.stringify(this.controlBtns)
          this.controlBtns.split(",").map((x) => x.trim())
        : this.controlBtns;
    },
    showAreaType() {
      return this.wrapperAreas.length > 1;
    },
  },
  mounted() {},
  watch: {
    // cssCode: {
    //   immediate: true,
    //   handler(css) {
    //     console.log("csscode", css);
    //   },
    // },
    previewHtml() {
      this.$nextTick(() => {
        const cssRuleArr = [];
        if (!this.isWc) {
          // vue dom
          const style = this.$refs.previewDom.$el.querySelectorAll("style");
          Array.from(style).forEach(({ sheet: { rules }, innerText }) => {
            // sheet.disabled = true;
            rules.forEach((rule) => {
              rule.selectorText = `#demo-${this.demoNum} ${rule.selectorText}`;
            });
            cssRuleArr.push(innerText);
          });
        } else {
          // web component
          const style = this.$refs.previewShadow.querySelectorAll("style");
          Array.from(style).forEach(({ sheet, innerText }) => {
            sheet.disabled = true;
            cssRuleArr.push(innerText);
          });
        }
        this.styleInHtml = cssRuleArr.join("");
      });
    },
  },
  methods: {
    handleChange(html) {
      this.previewHtml = html;
    },
    handleCssChange(css) {
      this.cssToRender = css;
    },
    handleFullScreen(status) {
      if (status) {
        this.$el.requestFullscreen();
      } else {
        document.exitFullscreen();
      }
    },
    handleFormat() {
      this.$refs.htmlEditor?.format();
      this.$refs.cssEditor?.format();
    },
    handleSave() {
      this.handleFormat();
      const data = {
        html: this.$refs.htmlEditor.currentCode(),
        css: this.$refs.cssEditor.currentCode(),
      };
      this.$emit("save", data);
    },
  },
};
</script>
<style lang="css">
/* @tailwind base; */
@tailwind components;
@tailwind utilities;
</style>
<style lang="stylus" scoped>
.playground {
  >>>.exit_fullscreen {
    display: none;
  }

  &:fullscreen {
    background: #fff;

    >>>.fullscreen {
      display: none;
    }

    >>>.exit_fullscreen {
      display: inline-block;
    }
  }
}
</style>
