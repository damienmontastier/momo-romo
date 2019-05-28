<template>
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 134 136">
    <defs>
      <path ref="circlePath" id="circlePath" d="M7,69a60,60 0 1,0 120,0a60,60 0 1,0 -120,0"></path>
    </defs>
    <g>
      <text x="50%" y="50%" class="button-letter-center" id="letter">{{letter}}</text>

      <text ref="textCurved" id="textCurved" fill="#000">
        <textPath side="right" ref="pathTextCurved" id="pathTextCurved" xlink:href="#circlePath">
          <tspan class="button-curved-en">• {{en}}</tspan>
          <tspan class="button-curved-jpn">• {{jpn}}</tspan>
        </textPath>
      </text>

      <circle id="circle" ref="circle" cx="67" cy="69" r="60" fill="transparent"></circle>
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
  created() {
    console.log(this.around);
  },
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
  width: 150px;
  height: 150px;
}

#text,
#letter,
#textCurved {
  pointer-events: none;
}

#border {
  fill: #f3765a;
}

#letter {
  text-anchor: middle;
  alignment-baseline: central;
}
</style>
