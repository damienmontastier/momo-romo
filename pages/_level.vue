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
    middleware: "firebaseStages",

  // TODO fix le problème de la validation de la route, elle n'existe pas avant le dispatch
  // validate({ params, store }) {
  //   return stages.hasOwnProperty(params.level); // Si l'url n'est pas un level, Error 404
  // },
  components: {},
  data: () => {
    return {};
  },
  computed: {
    ...mapState({
      atlases: state => state.game.atlases,
      currentStageId: state => state.game.currentStageId,
      stages: state => state.stages,
      // stages: state => state.game.stages,
      loaded: state => state.game.loaded
    }),
    ...mapGetters({
      currentAtlas: "game/currentAtlas"
    })
  },
  // watch: {
  //   loaded() {
  //     this.init();
  //   }
  // },
  created() {
    // this.$store.dispatch("game/get");
    this.setCurrentStageId(this.$route.params.level);
    console.log(this.currentStageId)
  },
  methods: {
    ...mapMutations({
      setCurrentStageId: "game/setCurrentStageId"
    }),
    // init() {
    //   this.game = new Game({
    //     currentLevelParams: this.stages[this.currentStageId],
    //     currentAltlas: this.currentAtlas
    //   }).start();
    // }
  },
  mounted() {
    console.log(this.stages)
    this.game = new Game({
        currentLevelParams: this.stages[this.currentStageId],
        currentAltlas: this.currentAtlas
      }).start();
  }
};
</script>

<style lang="scss" scoped>
</style>
