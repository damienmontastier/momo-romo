<template>
  <div id="choose-quality">
    <div class="choose">
      <div>
        <span class="skew fill-en">Select the quality</span>
      </div>
      <ul>
        <li
          class="stroke skew selector"
          ref="selector"
          :key="index"
          :class="'selector'+index"
          :data-class="'selector'+index"
          @click="changeQuality(quality)"
          v-for="(quality,index) in qualities"
        >{{quality}}</li>
      </ul>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import { TweenMax } from "gsap";
import CSSRulePlugin from "gsap/CSSRulePlugin";

export default {
  data() {
    return {
      qualities: ["low", "medium", "high"]
    };
  },
  computed: {},
  mounted() {
    // this.$refs.selector.forEach(element => {
    //   element.addEventListener(
    //     "mouseover",
    //     this.handleMouseHover.bind(this, test, data_class)
    //   );
    //   element.addEventListener(
    //     "mouseleave",
    //     this.handleMouseLeave.bind(this, test, data_class)
    //   );
    // });
  },
  methods: {
    ...mapMutations({
      setQuality: "setQuality"
    }),
    changeQuality(quality) {
      this.setQuality(quality);
      this.$emit("increment");
    },
    handleMouseHover(element) {
      TweenMax.to(element, 1, {
        cssRule: { backgroundColor: "#600", x: "30px" }
      });
    },
    handleMouseLeave(element) {
      TweenMax.to(element, 1, {
        y: "0",
        ease: Power4.easeInOut
      });
    }
  }
};
</script>

<style lang="scss" scoped>
@import "~assets/scss/main.scss";

#choose-quality {
  background: white;
  height: 100%;
  width: 100%;
}
</style>
