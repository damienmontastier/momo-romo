<template>
  <div id="desktopStage">
    <h1>desktopStage</h1>
  </div>
</template>

<script>
import { mapGetters, mapMutations, mapState } from "vuex";
import Game from "@/assets/js/game/Game";
import TextureAtlas from "@/assets/js/utils/TextureAtlas";

export default {
  computed: {
    ...mapState({
      stage: state => state.game.stage,
      currentStageId: state => state.game.currentStageId,
      loaded: state => state.game.loaded
    }),
    ...mapGetters({
      currentAtlas: "game/currentAtlas"
    })
  },
  created() {
    this.$store.dispatch("game/loadStage", this.$route.params.level);
  },
  watch: {
    loaded() {
      this.game = new Game({
        currentLevelParams: this.stage,
        currentAltlas: this.currentAtlas
      }).start();
    }
  },
  mounted() {},
  methods: {}
};
</script>

<style lang="scss" scoped>
</style>
