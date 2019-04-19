<template>
  <div id="editor" ref="editor">
    <select name="stages" id="stages-select" ref="stages-select" v-on:change="onChange"></select>
    <props-editor></props-editor>
    <export-btn v-on:exprt="exprt"></export-btn>
  </div>
</template>

<script>
import { mapMutations, mapState, mapGetters } from "vuex";

import PropsEditor from "@/components/PropsEditor";
import Editor from "@/assets/js/editor/Editor";
import Raycaster from "@/assets/js/editor/Raycaster";
import ExportBtn from "@/components/ExportBtn";
import Socket from "@/assets/js/utils/Socket.js";

export default {
  data() {
    return {
      editor: null,
      mouse: {
        x: 0,
        y: 0
      },
      socket: null
    };
  },
  mounted() {
    this.socket = new Socket();
    this.$store.dispatch("editor/get");
  },
  computed: {
    ...mapState({
      stages: state => state.editor.stages,
      atlases: state => state.editor.atlases,
      currentStageId: state => state.editor.currentStageId,
      draggingPropId: state => state.editor.draggingPropId,
      loaded: state => state.editor.loaded
    }),
    ...mapGetters({
      isDragging: "editor/isDragging"
    })
  },
  watch: {
    loaded() {
      console.log("LOADED");
      this.init();
    }
  },
  methods: {
    init() {
      this.editor = new Editor({
        stages: this.stages,
        atlases: this.atlases
      });
      this.$refs.editor.appendChild(this.editor.renderer.domElement);
      let stages = [];
      Object.values(this.stages).forEach(stage => {
        stages.push(stage);
      });
      stages.sort((a, b) => {
        return a.index - b.index;
      });
      stages.forEach(stage => {
        let option = document.createElement("option");
        option.value = stage.id;
        option.textContent = stage.index + 1 + "-" + stage.id;
        this.$refs["stages-select"].appendChild(option);
      });
      // Object.keys(this.stages).forEach(id => {
      //   let option = document.createElement("option");
      //   option.value = id;
      //   option.textContent = id;
      //   this.$refs["stages-select"].appendChild(option);
      // });
      this.onChange();
      this.editor.renderer.domElement.addEventListener("mouseup", () => {
        //fixedprops
        this.editor.renderer.domElement.addEventListener("mousemove", event => {
          this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
          this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        });
        if (this.isDragging) {
          let intersects = Raycaster.use(
            this.mouse,
            this.editor.gridsHelper.children
          );

          let pos = intersects[0].point;
          let prop = this.editor.stages[this.currentStageId].addFixedProp({
            _id: this.draggingPropId
          });
          prop.position.set(pos.x, pos.y, 0);
          this.setDraggingPropId(null);
        }
      });
      this.editor.renderer.domElement.addEventListener("click", event => {
        this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        this.editor.raycast(this.mouse);

        if (event.shiftKey) {
          let intersects = Raycaster.use(
            this.mouse,
            this.editor.gridsHelper.children
          );
          this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
          this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
          let platform = this.editor.stages[this.currentStageId].addPlatform();
          let p = intersects[0].point;
          platform.position.set(p.x, p.y, 3);
        }
      });
    },
    onChange() {
      this.setCurrentStageId(this.$refs["stages-select"].value);
      // this.editor.stages[this.currentStageId].loadTextureAtlas();

      this.editor.update(this.currentStageId);
    },
    ...mapMutations({
      setCurrentStageId: "editor/setCurrentStageId",
      setDraggingPropId: "editor/setDraggingPropId",
      export: "editor/export"
    }),
    exprt() {
      this.export(this.editor.export());
      // let json = JSON.stringify(this.editor.export());
      // let file = new File(exportJson, "write");
      // file.open();
      // file.writeline(json);
      // file.close();
    }
  },
  components: {
    PropsEditor,
    ExportBtn
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
