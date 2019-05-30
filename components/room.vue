<template>
  <div class="mobile-layout" id="room">
    <div>
      <p class="skew stroke">You are</p>
      <synchedTitle></synchedTitle>
    </div>
    <div class="character-romo"></div>
    <div>
      <p class="book skew">
        <span class="semi">Swipe up</span> to join
        <br>Momo in his quest.
      </p>
    </div>
    <!-- SYNCHRO: {{isSynchro}} -->
  </div>
</template>

<script>
import { mapGetters, mapMutations, mapState, mapActions } from "vuex";
import synchedTitle from "@/components/mobile/svg/synched";

export default {
  components: {
    synchedTitle
  },
  computed: {
    ...mapState({
      isSynchro: state => state.synchro.isSynchro
    })
  },
  mounted() {
    if (this.$device.isMobileOrTablet) {
      this.connect({
        device: this.$device.isMobileOrTablet,
        roomID: this.$device.isMobileOrTablet ? this.$route.params.level : null
      });
    } else {
      alert("t'es pas sur mobile");
    }
  },
  methods: {
    ...mapActions({
      connect: "synchro/connect"
    })
  }
};
</script>

<style lang="scss" scoped>
// @import "~assets/scss/main.scss";

#room {
  svg {
    position: relative;
    width: 75%;
    margin-top: -30px;
  }
  .character-romo {
    // background-image: url('../../static/ui/romo.png')
    background-image: url("~static/ui/romo.png");
    width: 30%;
    height: 100px;
    background-repeat: no-repeat;
    background-size: contain;
    margin: -5% auto 0 auto;
    position: relative;
    z-index: 1;
  }
}
</style>
