<template>
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" ref="button">
    <defs>
      <path
        ref="circlePath"
        id="circlePath"
        d="M35,100a65,65 0 1,0 130,0a65,65 0 1,0 -130,0"
        fill="#0511e5 !important"
      ></path>
    </defs>
    <g id="ellipse">
      <circle id="circle" ref="circle" cx="100" cy="100" r="80" fill="transparent"></circle>

      <text x="50%" y="50%" class="button-red-letter-center" id="letter">{{letter}}</text>

      <text ref="textCurved" id="textCurved" fill="#000">
        <textPath side="right" ref="pathTextCurved" id="pathTextCurved" xlink:href="#circlePath">
          <tspan class="button-red-curved-en">• {{en}}</tspan>
          <tspan class="button-red-curved-jpn">• {{jpn}}</tspan>
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
    this.$refs.button.addEventListener("click", this.onClick.bind(this));
    window.addEventListener("keyup", this.onKeyUp.bind(this));
  },
  created() {},
  methods: {
    turn() {
      this.hover.pause();
    },
    stop() {
      this.hover.play();
    },
    onKeyUp(e) {
      if (e.key === this.letter.toLowerCase()) {
        this.$emit("triggered");
      }
    },
    onClick(e) {
      this.$emit("triggered");
    }
  },
  beforeDestroy() {
    this.circle.removeEventListener("mouseover", this.turn);
    this.circle.removeEventListener("mouseleave", this.stop);
    this.$refs.button.removeEventListener("click", this.onClick.bind(this));
    window.removeEventListener("keyup", this.onKeyUp.bind(this));
  }
};
</script>

<style lang="scss" scoped>
@import "~assets/scss/main.scss";

svg {
  width: 100%;
  height: 100%;
}

#text,
#letter,
#textCurved {
  pointer-events: none;
}

#border {
  fill: #f3765a;
}

.button-red-curved-en,
.button-red-curved-jpn,
#letter {
  fill: black;
}

#letter {
  text-anchor: middle;
  alignment-baseline: central;
}
</style>
