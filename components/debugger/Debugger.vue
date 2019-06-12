<template>
    <div>
        <synchro></synchro>
        <stages></stages>
        <button @click="fullscreen">fullscreen</button>
    </div>
</template>

<script>
import Stages from '@/components/debugger/Stages'
import Synchro from '@/components/debugger/Synchro'
export default {
  components: {
    Stages,
    Synchro
  },
  methods: {
    fullscreen() {
      console.log('request fullscreen')
      const elem = document.documentElement;
      if (elem.requestFullscreen) {
        elem.requestFullscreen();
      } else if (elem.mozRequestFullScreen) { /* Firefox */
        elem.mozRequestFullScreen();
      } else if (elem.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
        elem.webkitRequestFullscreen();
      } else if (elem.msRequestFullscreen) { /* IE/Edge */
        elem.msRequestFullscreen();
      }
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
