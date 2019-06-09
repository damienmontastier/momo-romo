<template>
  <div id="choose-keyboard">
    <div class="choose">
      <div>
        <span class="skew fill-en">Select your keyboard</span>
      </div>
      <ul>
        <li class="stroke skew selector" ref="azerty" @click="changeKeyboard('azerty')">Azerty</li>
        <li class="stroke skew selector" ref="qwerty" @click="changeKeyboard('qwerty')">Qwerty</li>
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
@import "~assets/scss/main.scss";

#choose-keyboard {
  background: white;
  height: 100%;
  width: 100%;
}
</style>
