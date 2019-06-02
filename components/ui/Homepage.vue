<template>
  <div class="frame" id="homepage">
    <div id="left">
      <div id="background-landscape"></div>
      <div id="title-text">
        <h5 class="fill-en skew">The legend of</h5>
        <Momo></Momo>
        <Romo></Romo>
      </div>
    </div>
    <div id="right">
      <div class="skew">
        <h5 clas="book">
          An Interactive Tale About
          <span class="semi">Wabi-Sabi</span>
        </h5>
      </div>
      <!-- put button here-->
      <div class="skew">
        <p class="book">
          This is a
          <span class="semi">two players game</span>
          where cooperation is key!
          Make sure to be a duo
          before launching the game.
        </p>
      </div>
    </div>
    <!-- <button @click="$emit('increment')">Next</button> -->
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import { TweenMax } from "gsap";
import Momo from "@/components/svg/momo";
import Romo from "@/components/svg/romo";

export default {
  components: {
    Momo,
    Romo
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
#home {
  background: $white;
}
.frame {
  border: none;
  background: none;
}
#homepage {
  position: relative;
  display: flex;

  #left,
  #right {
    width: 50%;
  }
  #left {
    position: relative;

    background: red;
    #background-landscape {
      position: relative;
      width: inherit;
      height: 80%;
      position: relative;
      margin: 0 auto;
      top: 50%;
      transform: translateY(-50%);
      background: blue;
      background: url("~static/ui/homepage/homepage_fond_contour.png");
      background-size: contain;
      background-position: center;
      background-repeat: no-repeat;

      &::before {
        content: "";
        position: absolute;
        left: -67px;
        bottom: 0;
        width: 134px;
        height: 255px;
        background: url("~static/ui/characters/momo.png");
        background-size: 100% auto;
        background-repeat: no-repeat;
        z-index: 99999;
      }
      &::after {
        content: "";
        position: absolute;
        right: -73px;
        top: 20%;
        width: 146px;
        height: 71px;
        background: url("~static/ui/characters/romo.png");
        background-size: 100% auto;
        background-repeat: no-repeat;
        z-index: 99999;
      }
    }
    #title-text {
      display: flex;
      flex-direction: column;
      top: 10%;
      position: absolute;
      width: 100%;
      z-index: 1;
      svg {
        width: 75%;
        &:first-of-type {
          text-align: left;
          align-self: flex-start;
          margin-bottom: -5%;
        }
        &:not(:first-of-type) {
          text-align: right;
          align-self: flex-end;
        }
      }
    }
  }
  #right {
    background: yellow;
  }
}
</style>
