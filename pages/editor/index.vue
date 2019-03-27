<template>
  <div id="editor" ref="editor">
    <div id="props-editor" ref="props-editor" draggable="false">
      <select name="stages" id="stages-select"></select>
    </div>
  </div>
</template>

<script>
import Editor from "@/assets/js/editor/Editor";
import PropsEditor from "@/assets/js/editor/PropsEditor";
export default {
  data() {
    return {
      editor: null
    };
  },
  mounted() {
    this.editor = new Editor();
    this.editor.init();
    this.$refs.editor.appendChild(this.editor.renderer.domElement);
    console.log(this.$refs["props-editor"]);
    this.propsEditor = new PropsEditor();
  }
};
</script>

<style lang="scss" scoped>
#editor {
  #props-editor {
    position: absolute;
    left: 0px;
    top: 0px;
    width: 300px;
    height: 100vh;
    background: white;
    z-index: 2;
    #stages-select {
      position: absolute;
      left: 0px;
      top: 0px;
    }
  }
}
</style>
