<template>
  <div>
    <div>synchro : {{isSynchro}}</div>
    <div ref="qrcode" id="qrcode"></div>
  </div>
</template>

<script>
import { mapMutations, mapActions, mapState } from "vuex";
import QRCode from "qrcode";
export default {
  mounted() {
    this.init({
      device: this.$device.isMobile,
      roomID: this.$device.isMobile ? this.$route.query.id : null
    });
  },
  methods: {
    ...mapActions({
      init: "synchro/init"
    }),
    ...mapMutations({}),
    generateQRCode() {
      QRCode.toString(this.url + this.roomID, (error, string) => {
        this.$refs.qrcode.innerHTML = string;
        // if (error) console.error(error);
        // console.log("success!");
      });
    }
  },
  computed: {
    ...mapState({
      isSynchro: state => state.synchro.isSynchro,
      roomID: state => state.synchro.roomID,
      url: state => state.synchro.url
    })
  },
  watch: {
    roomID() {
      this.generateQRCode();
    }
  }
};
</script>

<style lang="scss" scoped>
#qrcode {
  height: 150px;
  width: 150px;

  svg {
    height: 100%;
    width: 100%;
  }
}
</style>
