<template>
  <div id="editor" ref="editor">
    <select name="stages" id="stages-select" ref="stages-select" v-model="currentStage"></select>
    <props-editor></props-editor>
  </div>
</template>

<script>
import PropsEditor from "@/components/PropsEditor";
import Editor from "@/assets/js/editor/Editor";
// import PropsEditor from "@/assets/js/editor/PropsEditor";
const levelsPressets = require("@/static/content/level/levels.json");

export default {
  data() {
    return {
      editor: null,
      propsEditor: null,
      currentStage: 0
    };
  },
  mounted() {
    this.editor = new Editor();
    this.editor.init();
    this.$refs.editor.appendChild(this.editor.renderer.domElement);
    Object.keys(levelsPressets).forEach(id => {
      let option = document.createElement("option");
      option.value = id;
      option.textContent = id;
      this.$refs["stages-select"].appendChild(option);
      console.log(id);
    });

    // this.propsEditor = new PropsEditor();
  },
  components: {
    PropsEditor
  }
};
</script>

<style lang="scss" scoped>
#editor {
  #stages-select {
    position: absolute;
    left: 0px;
    top: 0px;
    z-index: 3;
  }
}
</style>
