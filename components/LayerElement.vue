<template>
  <div id="layer">
    <ul class="layer">
      <p>Platforms</p>
      <li
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
      <p>{{picked}}</p>
    </ul>
    <ul class="layer">
      <p>Checkpoint Minigame</p>
      <li
        v-for="(prop,index) in currentStageProps.fixedProps"
        :key="index"
        v-if="prop.visible"
        @mouseover="hover(prop)"
        @mouseleave="out(prop)"
      >
        <input
          :id="prop._id+index"
          @click="minigame(prop, index)"
          :ref="prop._id+index"
          name="radio"
          type="radio"
          :value="prop._id+index || false"
          :checked="prop.checkpointMinigame"
        >
        {{prop._id+index}}
      </li>
    </ul>
  </div>
</template>
<script>
import { mapMutations, mapState, mapGetters } from "vuex";
import ArrowsHelper from "../assets/js/objects/ArrowsHelper";

export default {
  data() {
    return {
      picked: null,
      animateProps: []
    };
  },
  mounted() {},
  computed: {
    ...mapState({
      currentStageId: state => state.editor.currentStageId,
      stages: state => state.editor.stages,
      currentStageRef: state => state.editor.currentStageRef
    }),
    currentStageProps() {
      return {
        fixedProps: this.currentStageRef.fixedProps,
        platforms: this.currentStageRef.platforms
      };
    }
  },
  methods: {
    select(target) {
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
    },
    minigame(target) {
      //put minigame var to true
      this.currentStageRef.fixedProps.forEach(fixed => {
        fixed.checkpointMinigame = false;
      });
      target.checkpointMinigame = true;
    }
  },
  watch: {
    currentStageProps() {},
    animateProps() {}
  },
  mounted() {}
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
    cursor: pointer;
    padding-left: 10px;
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
