<template>
  <div class="mobile-layout" id="navigate">
    <h1>Navigate</h1>
    <Joystick></Joystick>
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
// @import "~assets/scss/main.scss";
</style>
