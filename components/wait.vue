<template>
  <div class="mobile-layout" id="wait">
    <h1>Wait screen</h1>
    <button @click="$emit('changeComponent')">Change</button>
  </div>
</template>

<script>
import { mapGetters, mapMutations, mapState, mapActions } from "vuex";
import synchedTitle from "@/components/mobile/svg/synched";
import Joystick from "@/components/mobile/Joystick";

export default {
  data() {
    return {};
  },
  components: {},
  computed: {},
  mounted() {
    if (this.$device.isMobileOrTablet) {
      // this.connect({
      //   device: this.$device.isMobileOrTablet,
      //   roomID: this.$device.isMobileOrTablet ? this.$route.params.level : null
      // });
    } else {
      alert("t'es pas sur mobile");
    }
  },
  methods: {}
};
</script>

<style lang="scss" scoped>
@import "~assets/scss/main.scss";
</style>
