<template>
  <div id="homepage">
    <h1>Homepage blanc</h1>
    <button @click="$emit('increment')">Next</button>
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

#homepage {
  background: yellow;
  height: 100%;
  width: 100%;
}
</style>
