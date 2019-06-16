<template>
  <div class="mobile-layout" id="wait">
    <div id="content">
      <p class="skew book">
        <span class="semi">Nothing to see here!</span>
        <br>Look at the main screen.
      </p>
    </div>
    <!-- <button @click="$emit('changeComponent')">Change</button> -->
  </div>
</template>

<script>
import { mapGetters, mapMutations, mapState, mapActions } from "vuex";
import SynchedTitle from "@/components/mobile/svg/SynchedTitle";
import Joystick from "@/components/mobile/Joystick";

export default {
  data() {
    return {};
  },
  components: {},
  computed: {
    ...mapState({
      socket: state => state.synchro.socket
    })
  },
  mounted() {
    if (this.socket) {
      this.socket.on("readyPlayMobile", value => {
        console.log(value.ready);
        if(value.ready){
          this.$emit('changeComponent')
        }
      });
    }
    if (this.$device.isMobileOrTablet) {
      // this.connect({
      //   device: this.$device.isMobileOrTablet,
      //   roomID: this.$device.isMobileOrTablet ? this.$route.params.level : null
      // });
    } else {
      alert("t'es pas sur mobile");
    }
  },
  methods: {},
  watch: {}
};
</script>

<style lang="scss" scoped>
@import "~assets/scss/main.scss";

#wait {
  #content {
    display: flex;
    height: 100%;
    align-items: center;
    justify-content: center;
  }
}
</style>
