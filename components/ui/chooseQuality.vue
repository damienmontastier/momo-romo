<template>
  <div id="choose-quality">
    <div id="choose-quality-container">
      <h5 class="skew fill-en">Select the quality</h5>
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

  &-container {
    // display: inline-block;
    top: 50%;
    left: 50%;
    position: relative;
    text-align: center;
    transform: translate(-50%, -50%);

    ul {
      display: inline-flex;
      align-items: center;
      align-content: center;
      justify-content: center;
      margin-top: 120px;
      li{
        margin-right: 100px;
        &:last-child{
          margin-right: 0;
        }
      }
    }
  }
}
</style>
