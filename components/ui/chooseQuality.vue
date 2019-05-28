<template>
  <div id="choose-quality">
    <h1 ref="low" @click="changeQuality('low')">Low</h1>
    <h1 ref="medium" @click="changeQuality('medium')">Medium</h1>
    <h1 ref="high" @click="changeQuality('high')">High</h1>
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
  background: blue;
  height: 100%;
  width: 100%;
}
</style>
