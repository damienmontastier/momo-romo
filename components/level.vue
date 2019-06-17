<template>
  <div id="level">
    <desktopStage v-if="$device.isDesktop"></desktopStage>
    <mobileStage v-else-if="$device.isMobileOrTablet"></mobileStage>
  </div>
</template>

<script>
import { mapGetters, mapMutations, mapState } from "vuex";
import desktopStage from "@/components/stage/desktopStage";
import mobileStage from "@/components/stage/mobileStage";

export default {
  components: {
    desktopStage,
    mobileStage
  },
  computed: {},
  mounted() {},
  methods: {}
};
</script>

<style lang="scss" scoped>
</style>
