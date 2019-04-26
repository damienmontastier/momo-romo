<template>
  <div id="layer">
    <ul class="layer">
      <p>Platforms</p>
      <li
        :data-test="platform.id+index"
        @click="select(platform)"
        :ref="platform.id+index"
        @mouseover="hover(platform)"
        @mouseleave="out(platform)"
        v-for="(platform,index) in currentStageRef.platforms"
        v-if="platform.visible"
        :key="index"
      >
        <input @click="visible(platform, index)" type="checkbox" id="checkbox" checked>
        {{index}}
      </li>
    </ul>
    <ul class="layer">
      <p>Props</p>
      <li
        :data-test="prop._id+index"
        @click="select(prop)"
        :ref="prop.id+index"
        @mouseover="hover(prop)"
        @mouseleave="out(prop)"
        v-for="(prop,index) in currentStageRef.fixedProps"
        v-if="prop.visible"
        :key="index"
      >
        <input @click="visible(prop, index)" type="checkbox" id="checkbox" checked>
        {{prop._id + index}}
      </li>
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
      console.log("select");
      ArrowsHelper.setTarget(target);
      target.highlight(true);
    },
    hover(target) {
      target.highlight(true);
    },
    out(target) {
      target.highlight(false);

      if (!!ArrowsHelper.target && ArrowsHelper.target.uuid == target.uuid) {
        target.highlight(true);
      }
    },
    visible(target) {
      if (target.material.visible == false) {
        target.material.visible = true;
        this.select(target);
      } else {
        target.material.visible = false;
        setTimeout(() => {
          ArrowsHelper.setTarget(null);
        }, 10);
      }
    }
  },
  watch: {
    currentStageProps() {}
  },
  mounted() {
    console.log(this.currentStageRef);
  }
};
</script>
<style lang="scss" scoped>
#layer {
  position: absolute;
  left: 320px;
  top: 0;
}
.layer {
  margin-bottom: 20px;
  background: white;
  padding: 5px;
  li {
    padding-left: 10px;
    cursor: pointer;
    &:hover {
      background: #f7fcf7;
    }
    #checkbox:checked {
      background-color: red;
    }
  }
  &:last-child {
    margin-bottom: 0px;
  }
}
</style>
