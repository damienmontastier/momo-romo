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

import HowlerManager from "~/assets/js/utils/HowlerManager";
import background_enter_game from "@/static/sounds/background_enter_game.mp3";

export default {
  components: {
    Button
  },
  data() {
    return {};
  },
  computed: {},
  created() {
    HowlerManager.add([
      {
        id: "background_enter_game",
        src: background_enter_game
      }
    ]).then(sounds => {
      this.sounds = sounds;
      this.sounds.background_enter_game.loop(true);
      this.sounds.background_enter_game.play();
    });
  },
  mounted() {
    window.addEventListener("keypress", this.handleKeyPress.bind(this));
  },
  methods: {
    handleKeyPress(event) {
      if (event.key == "e") {
        this.$emit("increment");
      }
    }
  },
  beforeDestroy() {
    window.removeEventListener("keypress", this.handleKeyPress.bind(this));
    HowlerManager.stop(this.sounds);
  }
};
</script>

<style lang="scss" scoped>
@import "~assets/scss/main.scss";

#ready-kintsugi {
  position: absolute;
  height: 500px;
  width: 500px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  #container {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    svg {
      width: 40%;
      height: 40%;
    }
  }
}
</style>
