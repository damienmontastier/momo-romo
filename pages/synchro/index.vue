<template>
  <div>
    <div>synchro : {{isSynchro}}</div>
    <div ref="qrcode" id="qrcode" v-html="qrcode"></div>
    <a :href="url">{{url}}</a>
    <button @click="disconnect">disconnect</button>
  </div>
</template>

<script>
import { mapMutations, mapActions, mapState } from "vuex";
import QRCode from "qrcode";
export default {
  data() {
    return {
      qrcode:null
    }
  },
  mounted() {
    this.connect({
      device: this.$device.isMobileOrTablet,
      // roomID: this.$device.isMobileOrTablet ? this.$route.query.id : null
      roomID: null
    });
  },
  methods: {
    ...mapActions({
      connect: "synchro/connect",
      disconnect: "synchro/disconnect"
    }),
    ...mapMutations({}),
    generateQRCode() {
      QRCode.toString(this.url, (error, string) => {
        this.qrcode = string
        // this.$refs.qrcode.innerHTML = string;
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
