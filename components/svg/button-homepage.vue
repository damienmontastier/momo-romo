<template>
  <svg width="300" height="300" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 134 140">
    <defs>
      <path ref="circlePath" id="circlePath" d="M9,70a58,58 0 1,0 116,0a58,58 0 1,0 -116,0"></path>
    </defs>
    <g>
      <circle id="circle" ref="circle" cx="67" cy="70" r="70" fill="transparent"></circle>

      <text ref="textCurved" id="textCurved">
        <textPath side="right" ref="pathTextCurved" id="pathTextCurved" xlink:href="#circlePath">
          <tspan class="button-curved-en">• Launch Game</tspan>
          <tspan class="button-curved-jpn">• ホームマ</tspan>
        </textPath>
      </text>
    </g>
  </svg>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import { TweenMax } from "gsap";

export default {
  props: ["en", "jpn", "letter"],
  data() {
    return {};
  },
  computed: {},
  mounted() {
    this.circlePath = this.$refs.circlePath;
    this.lengthCirclePath = this.circlePath.getTotalLength();
    this.circle = this.$refs.circle;
    this.textCurved = this.$refs.textCurved;
    this.pathTextCurved = this.$refs.pathTextCurved;
    this.pathTextCurved.setAttribute("textLength", this.lengthCirclePath - 20);
    this.hover = TweenMax.to(this.textCurved, 10, {
      transformOrigin: "50% 50%",
      rotation: "360",
      repeat: -1,
      ease: Linear.easeNone
    });
    this.circle.addEventListener("mouseover", this.turn);
    this.circle.addEventListener("mouseleave", this.stop);
  },
  created() {},
  methods: {
    turn() {
      this.hover.pause();
    },
    stop() {
      this.hover.play();
    }
  },
  beforeDestroy() {
    this.circle.removeEventListener("mouseover", this.turn);
    this.circle.removeEventListener("mouseleave", this.stop);
  }
};
</script>

<style lang="scss" scoped>
@import "~assets/scss/main.scss";

svg {
  width: 100%;
  height: 100%;
}

#circle {
  fill: $a;
}

#text,
#letter,
#textCurved {
  pointer-events: none;
}

.button-curved-jpn,
.button-curved-en {
  fill: $white;
}
</style>
