<template>
    <div>
        <div>SYNCHRO: {{isSynchro}}</div>
        <a :href="url">{{url}}</a>
        <div id="qrcode" v-html="qrcode"></div>
    </div>
</template>

<script>
import { mapState } from 'vuex';
export default {
    computed: {
        ...mapState({
            isSynchro: state => state.synchro.isSynchro,
            url: state => state.synchro.url,
            qrcode: state => state.synchro.qrcode
        })
    },
    watch: {
        qrcode() {
            let htmlObject = document.createElement('div');
            htmlObject.innerHTML = this.qrcode;
            let svg = htmlObject.querySelector('svg');
        }
    },
}
</script>

<style lang="scss" scoped>
#qrcode {
  height: 100px;
  width: 100px;

  svg {
    height: 100%;
    width: 100%;
    >path{
        fill: red !important;
    }
  }
}
</style>
