<template>
  <div class="mobile-layout" id="navigate">
    <div id="navigate-container">
      <div id="left">
        <Joystick></Joystick>
      </div>
      <div id="right">
        <div id="right-container">
          <p class="fill-en skew">move around</p>
          <p class="semi skew">
            Discover your
            surroundings
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations, mapState, mapActions } from "vuex";
import Joystick from "@/components/mobile/Joystick";

export default {
  data() {
    return {};
  },
  components: {
    Joystick
  },
  computed: {
    ...mapState({
      socket: state => state.synchro.socket
    })
  },
  mounted() {
    if (this.$device.isMobileOrTablet) {
    } else {
      alert("t'es pas sur mobile");
    }
  },
  methods: {}
};
</script>

<style lang="scss" scoped>
@import "~assets/scss/main.scss";
#navigate {
  &-container {
    display: flex;
    flex-direction: row;
    #left {
      #border {
        width: 300px;
        height: 300px;
      }
    }
    #right {
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      
      &-container {
        max-width: 300px;
      }
    }
  }
}
</style>
