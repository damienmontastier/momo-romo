<template>
  <div id="editor" ref="editor">
    <select name="stages" id="stages-select" ref="stages-select" v-on:change="onChange"></select>
    <props-editor></props-editor>
  </div>
</template>

<script>
import { mapMutations, mapState, mapGetters } from "vuex";

import PropsEditor from "@/components/PropsEditor";
import Editor from "@/assets/js/editor/Editor";

export default {
  data() {
    return {
      editor: null,
      mouse: {
        x: 0,
        y: 0
      }
    };
  },
  mounted() {
    this.editor = new Editor({
      stages: this.stages,
      atlases: this.atlases
    });
    this.editor.init();
    this.$refs.editor.appendChild(this.editor.renderer.domElement);
    Object.keys(this.stages).forEach(id => {
      let option = document.createElement("option");
      option.value = id;
      option.textContent = id;
      this.$refs["stages-select"].appendChild(option);
    });
    this.onChange();
    this.editor.renderer.domElement.addEventListener("mouseup", () => {
      if (this.isDragging) {
        console.log(this.draggingPropId);
        this.editor.stages[this.currentStageId].addFixedProp(
          this.draggingPropId
        );
        this.setDraggingPropId(null);
      }
    });
    this.editor.renderer.domElement.addEventListener("click", event => {
      console.log("click");
      this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
      this.editor.raycast(this.mouse);
    });
  },
  computed: {
    ...mapState({
      stages: state => state.editor.stages,
      atlases: state => state.editor.atlases,
      currentStageId: state => state.editor.currentStageId,
      draggingPropId: state => state.editor.draggingPropId
    }),
    ...mapGetters({
      isDragging: "editor/isDragging"
    })
  },
  methods: {
    onChange() {
      this.setCurrentStageId(this.$refs["stages-select"].value);
      this.editor.stages[this.currentStageId].loadTextureAtlas();
      this.editor.update(this.currentStageId);
    },
    ...mapMutations({
      setCurrentStageId: "editor/setCurrentStageId",
      setDraggingPropId: "editor/setDraggingPropId"
    })
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
