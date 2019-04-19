<template>
  <div>
    <section class="container">
      <h1>{{currentStageId}} level</h1>
    </section>
    <div id="canvas"></div>
  </div>
</template>

<script>
import { mapState, mapGetters, mapMutations } from "vuex";
import TextureAtlas from "@/assets/js/utils/TextureAtlas";
import Game from "@/assets/js/game/Game";

export default {
  middleware: "loadStage",

  // TODO fix le problème de la validation de la route, elle n'existe pas avant le dispatch
  validate({ params, store }) {
    return store.state.game.stage ? true : false; // Si l'url n'est pas un level, Error 404
  },
  components: {},
  data: () => {
    return {};
  },
  computed: {
    ...mapState({
      atlases: state => state.game.atlases,
      currentStageId: state => state.game.currentStageId,
      stage: state => state.game.stage,
      stages: state => state.stages
    }),
    ...mapGetters({
      currentAtlas: "game/currentAtlas"
    })
  },
  created() {
    this.setCurrentStageId(this.$route.params.level);
  },
  methods: {
    ...mapMutations({
      setCurrentStageId: "game/setCurrentStageId"
    })
  },
  mounted() {
    this.game = new Game({
      currentLevelParams: this.stage,
      currentAltlas: this.currentAtlas
    }).start();
  }
};
</script>

<style lang="scss" scoped>
</style>
