<template>
  <div id="mini-game">
    <kintsugi v-if="uid==='kintsugi'" v-on:minigameended="$emit('minigameended')"></kintsugi>
  </div>
</template>

<script>
import Kintsugi from "@/components/mini-game/Kintsugi";
export default {
  props: {
    uid: String
  },
  components: {
    Kintsugi
  },
  mounted() {
    console.log("mini game mounted");
  },
  methods: {}
};
</script>

<style lang="scss" scoped>
#mini-game {
  position: absolute;
  top: 0;
  left: 0;
  height: 100vh;
  width: 100vw;
  z-index: 10;
  display: flex;
}
</style>
