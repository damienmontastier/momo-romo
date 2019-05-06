<template>
  <div id="room">
      <h1>Room</h1>
      SYNCHRO: {{isSynchro}}
  </div>
</template>

<script>
import { mapGetters, mapMutations, mapState,mapActions} from "vuex";

export default {
  computed: {
    ...mapState({
      isSynchro: state => state.synchro.isSynchro
    })
  },
  mounted() {
    if(this.$device.isMobileOrTablet) {
      this.connect({
        device: this.$device.isMobileOrTablet,
        roomID: this.$device.isMobileOrTablet ? this.$route.params.level : null
      });
    } else {
      alert("t'es pas sur mobile")
    }
  },
  methods: {
    ...mapActions({
      connect: "synchro/connect"
    }),
  }
};
</script>

<style lang="scss" scoped>
</style>
