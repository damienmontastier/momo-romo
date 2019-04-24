<template>
  <div id="layer">
    <ul class="layer">
      <p>Platforms</p>
      <li
        @click="select(platform)"
        v-for="(platform,index) in currentStageRef.platforms"
        v-if="platform.visible"
        :key="index"
      >{{index}}</li>
    </ul>
    <ul class="layer">
      <p>Props</p>
      <li
        @click="select(prop)"
        v-for="(prop,index) in currentStageRef.fixedProps"
        v-if="prop.visible"
        :key="index"
      >{{prop._id + index}}</li>
    </ul>
  </div>
</template>
<script>
import { mapMutations, mapState, mapGetters } from "vuex";
import ArrowsHelper from "../assets/js/objects/ArrowsHelper";

export default {
  computed: {
    ...mapState({
      currentStageId: state => state.editor.currentStageId,
      stages: state => state.editor.stages,
      currentStageRef: state => state.editor.currentStageRef
    }),
    currentStageProps() {
      return {
        fixedProps: this.currentStageRef.fixedProps.length,
        platforms: this.currentStageRef.platforms.length
      };
    },
    ...mapGetters({
      isDragging: "editor/isDragging"
    })
  },
  methods: {
    select(target) {
        console.log(target)
      ArrowsHelper.setTarget(target);
    }
  },
  watch: {
    currentStageProps(newValue) {
      console.log(newValue);
    }
  },
  mounted() {}
};
</script>
<style lang="scss" scoped>
#layer {
  position: absolute;
  left: 30%;
  top: 0;
}
.layer {
  margin-bottom: 20px;
}
</style>
