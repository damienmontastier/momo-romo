<template>
  <div id="loader">
    <div id="container">
      <div>
        <p class="skew stroke">Living Room</p>
        <Kintsugi></Kintsugi>
        <span id="id" class="skew fill-en">Chapter 1/4</span>
      </div>
      <p id="text" class="skew book">
        Time is always flowing by,
        Embracing all
        <span class="semi">repaired pieces</span>.
        Imperfection is a unique strength.
      </p>
    </div>
    <div ref="loadingBar" id="loadingBar"></div>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import { TweenMax } from "gsap";
import Kintsugi from "@/components/svg/kintsugi";

export default {
  components: {
    Kintsugi
  },
  data() {
    return {};
  },
  computed: {
    ...mapState({
      duration: state => state.game.duration
    })
  },
  mounted() {
    this.$emit("loadStart");
    TweenMax.to(this.$refs.loadingBar, (this.duration - 500) / 1000, {
      height: "100%",
      ease: Power4.easeInOut,
      onComplete: () => {
        setTimeout(() => {
          TweenMax.to(this.$refs.loadingBar, 0.5, {
            opacity: 0,
            display: "none",
            ease: Power4.easeOut
          });
        }, 100);
      }
    });
  },
  watch: {},
  methods: {}
};
</script>

<style lang="scss" scoped>
@import "~assets/scss/main.scss";

#loader {
  position: absolute;
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  #container {
    display: flex;
    flex-direction: column;
    min-width: 1050px;
    margin: 0 auto;

    div {
      display: flex;
      flex-direction: column;
      margin-bottom: 20px;
      align-self: flex-start;
      width: 620px;

      p {
        align-self: flex-start;
      }
      svg {
        width: auto;
        // height: 150px;
        margin-top: -30px;
        align-self: flex-start;
      }
    }

    #id {
      margin: -10px 0px 30px 0;
      align-self: flex-end;
    }
    #text {
      align-self: center;

      width: 480px;
    }
  }
  #loadingBar {
    height: 0;
    width: 10px;
    background: $a;
    position: absolute;
    right: 0;
    top: 0;
  }
}
</style>
