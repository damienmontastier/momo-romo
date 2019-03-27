<template>
  <div id="editor" ref="editor">
    <select name="stages" id="stages-select" ref="stages-select" v-model="currentStageId"></select>
    <props-editor></props-editor>
  </div>
</template>

<script>
import { mapMutations, mapState } from 'vuex'

import PropsEditor from "@/components/PropsEditor";
import Editor from "@/assets/js/editor/Editor";

export default {
  data() {
    return {
      editor: null,
      propsEditor: null,
      currentStageId: 'kintsugi'
    };
  },
  mounted() {
    this.editor = new Editor();
    this.editor.init();
    this.$refs.editor.appendChild(this.editor.renderer.domElement);
    Object.keys(this.stages).forEach(id => {
      let option = document.createElement("option");
      option.value = id;
      option.textContent = id;
      this.$refs["stages-select"].appendChild(option);
    });
  },
  computed: {
    ...mapState({
      stages: state => state.editor.stages
    })
  },
  methods: {
    ...mapMutations({
      setCurrentStageId: 'editor/setCurrentStageId'
    })
  },
  watch: {
    currentStageId() {
      this.setCurrentStageId(this.currentStageId)
    }
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
