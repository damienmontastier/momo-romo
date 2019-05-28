<template>
  <div id="choose-keyboard">
    <h1 ref="azerty" @click="changeKeyboard('azerty')">Azerty</h1>
    <h1 ref="qwerty" @click="changeKeyboard('qwerty')">Qwerty</h1>
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
      setKeyboard: "setKeyboard"
    }),
    changeKeyboard(keyboard) {
      this.setKeyboard(keyboard);
      this.$emit("increment");
    }
  }
};
</script>

<style lang="scss" scoped>
#choose-quality {
  background: pink;
  height: 100%;
  width: 100%;
}
</style>
