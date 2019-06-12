<template>
  <div id="ready-kintsugi">
    <div id="container">
      <p class="book skew">
        Are you ready?
        <br>
        <span class="semi">Press E</span> and enter the legend!
      </p>
      <Button @click.native="$emit('increment')" letter="E" en="Enter the game" jpn="スタート"></Button>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import { TweenMax } from "gsap";
import Button from "@/components/svg/button-circle-red.vue";

export default {
  components: {
    Button
  },
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
  background: yellow;
  height: 500px;
  width: 500px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  svg {
    width: 40%;
    height: 40%;
  }
}
</style>
