<template>
  <div id="motion">
    <h1>Motion wait 1 seconde</h1>
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
  mounted() {
    return setTimeout(() => {
      this.$emit("increment");
    }, 2000);
  },
  methods: {}
};
</script>

<style lang="scss" scoped>
#choose-quality {
  background: yellow;
  height: 100px;
  width: 100px;
}
</style>
