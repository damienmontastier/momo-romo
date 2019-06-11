<template>
  <div id="ready-kintsugi">
    <p>Are you ready?</p>
    <button @click="$emit('increment')">fds</button>
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
  methods: {}
};
</script>

<style lang="scss" scoped>
@import "~assets/scss/main.scss";

#ready-kintsugi {
  position: absolute;
  background: transparent;
  height: 500px;
  width: 500px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>
