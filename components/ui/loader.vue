<template>
  <div id="loader">
    <div id="container">
      <p class="skew stroke">Living Room</p>
      <Kintsugi></Kintsugi>
      <span id="id" class="skew fill-en">1/4</span>
      <p id="text" class="skew book">
        Time is always flowing by,
        Embracing all <span class="semi">repaired pieces</span>.
        Imperfection is a unique strength.
      </p>
    </div>
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
  computed: {},
  mounted() {
    this.$emit("loadStart");
  },
  methods: {}
};
</script>

<style lang="scss" scoped>
@import "~assets/scss/main.scss";

#loader {
  position: absolute;
  // background: blue;
  height: inherit;
  width: 70%;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  #container {
    display: flex;
    flex-direction: column;
    svg {
      width: 60%;
      height: 60%;
    }
    #id,
    #text {
      align-self: center;
    }
    #id{
            margin: -10px 0px 30px 0;

    }
    #text {
      width: 480px;
    }
  }
}
</style>
