<template>
  <div id="choose-quality">
    <div class="choose">
      <div>
        <span class="skew fill-en">Select the quality</span>
      </div>
      <ul>
        <li class="stroke skew" ref="low" @click="changeQuality('low')">Low</li>
        <li class="stroke skew" ref="medium" @click="changeQuality('medium')">Medium</li>
        <li class="stroke skew" ref="high" @click="changeQuality('high')">High</li>
      </ul>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import { TweenMax } from "gsap";

export default {
  data() {
    return {};
  },
  computed: {},
  mounted() {},
  methods: {
    ...mapMutations({
      setQuality: "setQuality"
    }),
    changeQuality(quality) {
      this.setQuality(quality);
      this.$emit("increment");
    }
  }
};
</script>

<style lang="scss" scoped>
#choose-quality {
  background: white;
  height: 100%;
  width: 100%;  
}
</style>
