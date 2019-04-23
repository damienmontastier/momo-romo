<template>
  <div>
    <section class="container">
      <p> slug : {{$route.query}}</p>
      <!-- <h1>{{currentStageId}} level</h1> -->
      <div v-if="$route.query.room">
        JE CHERCHE UNE ROOM
      </div>
      <div v-else>
        JE VEUX UN LEVEL
      </div>
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

  // async validate({ params, store, redirect }) {
  //   let list = await store.dispatch("loadStagesList");
  //   return Object.values(list).includes(params.level);
  // },

  components: {},
  data: () => {
    return {};
  },
  computed: {
    ...mapState({
      stage: state => state.stage,
      stagesList: state => state.stagesList
    })
    //   ...mapGetters({
    //     currentAtlas: "game/currentAtlas"
    //   })
  },
  created() {
    console.log(this.$route)
    // console.log(this.stagesList);
    // this.setCurrentStageId(this.$route.params.level);
  },
  methods: {
    // ...mapMutations({
    //   // setCurrentStageId: "game/setCurrentStageId",
    //   setStage: "game/setStage"
    // })
  }
  // mounted() {
  //   this.game = new Game({
  //     currentLevelParams: this.stage,
  //     currentAltlas: this.currentAtlas
  //   }).start();
  // }
};
</script>

<style lang="scss" scoped>
</style>
